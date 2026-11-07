# Usage: python3 scripts/build-model-hero-art.py [--cars-only] [bg] [model-slug ...]   (needs Pillow + numpy)
# Model hero art, in two layers so the cars are never cropped, masked or blurred by the panel:
#   bg-<theme>[-m].webp        shared Highland backdrop with a paved apron (cover-fitted in CSS)
#   <slug>-cars-<theme>[-m].webp  the model's four-car line-up on transparency, laid out like the
#                                 approved Velar reference, with cast + contact shadows
#   <slug>-car-<theme>[-m].webp   the line-up's front car on its own (sections 2 and 14)
#   <slug>-car-<variant>-<theme>[-m].webp  three more cars of the model (sections 7, 11, 12)
import json, glob, os, sys
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # repo root
OUT = f"{ROOT}/public/model/hero"
os.makedirs(OUT, exist_ok=True)
meta = json.load(open(f"{ROOT}/src/data/variant-design/carMeta.json"))

# back -> front, by file name in public/variant/cars (names, not list positions, so adding a photo to
# that folder never swaps a car); ("<name>", "grey") recolours that car to a neutral grey (the
# reference's front car)
PICKS = {
  "velar": ["range-rover-velar-l560-se-suv-20172019-new-corris-grey-velar-204d", "range-rover-velar-l560-r-dynamic-black-suv-20202022-special-9667", "range-rover-velar-l560-hse-suv-20172019-new-silicon-silver-v-a6a5", ("range-rover-velar-l560-r-dynamic-s-suv-20172019-new-byron-bl-1b57", "grey")],
  "range-rover-evoque": ["range-rover-evoque-l538-pure-5-door-suv-20112015-new-fuji-wh-d9c9", "range-rover-evoque-l551-autobiography-5-door-suv-20202023-sp-8ee1", "range-rover-evoque-l551-s-5-door-suv-20192023-new-indus-silv-4781", "range-rover-evoque-l551-hse-5-door-suv-20192023-new-corris-g-385e"],
  "range-rover-sport": ["range-rover-sport-l461-autobiography-suv-2022-new-ostuni-whi-f46c", "range-rover-sport-l461-dynamic-se-suv-2022-new-santorini-bla-bfe9", "range-rover-sport-l494-se-suv-20132017-new-indus-silver-l494-c7c8", "range-rover-sport-l461-dynamic-hse-suv-2022-new-eiger-grey-l-78f7"],
  "range-rover": ["land-rover-range-rover-p38a-vogue-suv-19982002-new-epsom-gre-b23e", "land-rover-range-rover-l322-hse-suv-20022009-new-zambezi-sil-bcf0", "land-rover-range-rover-l405-vogue-suv-20122017-new-causeway-b791", "land-rover-range-rover-l460-hse-suv-2022-new-eiger-grey-l460-263f"],
  "discovery": ["land-rover-discovery-series-ii-discovery-5-door-suv-19982004-d782", "land-rover-discovery-l319-hse-5-door-suv-20042009-group-buck-6375", "land-rover-discovery-l319-hse-5-door-suv-20092016-new-causew-0ea8", "land-rover-discovery-l462-s-5-door-suv-20172020-new-indus-si-eaa4"],
  "discovery-sport": ["land-rover-discovery-sport-l550-lci-s-compact-suv-20192021-n-41a7", "land-rover-discovery-sport-l550-lci-r-dynamic-black-compact-e352", "land-rover-discovery-sport-l550-hse-luxury-compact-suv-2019-1e02", "land-rover-discovery-sport-l550-lci-se-compact-suv-20192021-3487"],
  "freelander": ["land-rover-freelander-l314-5-door-station-wagon-compact-suv-6ab4", "land-rover-freelander-l359-sport-compact-suv-20102012-specia-1b69", "land-rover-freelander-l359-gs-compact-suv-20062010-group-ala-3258", "land-rover-freelander-l359-hse-luxury-compact-suv-20102012-n-5069"],
  "defender": ["land-rover-defender-defender-90-hard-top-3-door-4x4-19902016-7891", "land-rover-defender-defender-110-station-wagon-5-door-4x4-19-5cd1", "land-rover-defender-l663-x-dynamic-s-suv-2020-new-hakuba-sil-86d9", "land-rover-defender-l663-x-dynamic-hse-suv-2020-new-carpathi-7977"],
}

# ---------------------------------------------------------------- cars layer
# 2040 wide (was 1950): the widest front cars (Range Rover L460, Discovery L462, Defender L663) ran
# past a 1950 canvas and were cut off at the rear - now every car and its shadow fits whole
CW, CH = 2040, 670
# (left, bottom, height) measured off the reference at 2x: back -> front
SLOTS = [(26, 452, 270), (262, 476, 328), (544, 512, 410), (912, 630, 610)]

def grade(car, theme, grey=False, lift=1.0):
    rgb = np.asarray(car.convert("RGB")).astype(np.float32) / 255
    alpha = car.getchannel("A")
    g = rgb.mean(axis=2, keepdims=True)
    if grey:
        rgb = g + (rgb - g) * 0.08
        rgb = rgb * 0.86
    h = rgb.shape[0]
    y = np.linspace(0, 1, h)[:, None, None]
    if theme == "day":
        rgb = g + (rgb - g) * 0.9 if not grey else rgb
        rgb = rgb * 0.97 + 0.015
        ao = 1 - np.clip((y - 0.62) / 0.38, 0, 1) * 0.22
    else:
        base = g + (rgb - g) * 0.82 if not grey else rgb
        # moody night grade that keeps the LED lights and chrome bright
        rgb = base * np.array([0.5, 0.54, 0.54]) * lift + np.clip(base - 0.72, 0, 1) ** 1.2 * 1.6
        ao = 1 - np.clip((y - 0.6) / 0.4, 0, 1) * 0.35
    rgb = (rgb * ao).clip(0, 1)
    out = Image.fromarray((rgb * 255).astype(np.uint8))
    return Image.merge("RGBA", (*out.split(), alpha))

def place(layer, x0, bottom, h, pick, theme, lift=1.0):
    """Stand one car on the layer: cast shadow over its footprint, a contact shadow per tyre."""
    base, mode = pick if isinstance(pick, tuple) else (pick, "")
    name = f"{base}.webp"
    car = Image.open(f"{ROOT}/public/variant/cars/{name}").convert("RGBA")
    w = round(car.width * h / car.height)
    car = car.resize((w, h), Image.LANCZOS)
    y0 = bottom - h
    W, H = layer.size
    m = meta.get(f"/variant/cars/{name}")
    wheels = m["wheels"] if m else [[12, 94, 7], [60, 100, 6], [92, 84, 6]]
    sh = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(sh)
    fl, nf, rr = [(x0 + wx / 100 * w, y0 + wy / 100 * h) for wx, wy, _ in wheels]
    far = (fl[0] + rr[0] - nf[0], fl[1] + rr[1] - nf[1])
    poly = [fl, nf, rr, far]
    cx = sum(p[0] for p in poly) / 4; cy = sum(p[1] for p in poly) / 4
    poly = [(cx + (px - cx) * 1.14, cy + (py - cy) * 1.6) for px, py in poly]
    d.polygon(poly, fill=255)
    sh = sh.filter(ImageFilter.GaussianBlur(h * 0.035))
    c = Image.new("L", (W, H), 0)
    dc = ImageDraw.Draw(c)
    for wx, wy, ww in wheels:
        px, py = x0 + wx / 100 * w, y0 + wy / 100 * h
        rw = ww / 100 * w * 1.1
        dc.ellipse((px - rw, py - rw * 0.14, px + rw, py + rw * 0.2), fill=255)
    c = c.filter(ImageFilter.GaussianBlur(h * 0.012))
    a = np.maximum(np.asarray(sh) * (0.5 if theme == "day" else 0.75), np.asarray(c) * (0.85 if theme == "day" else 0.95))
    shadow = Image.new("RGBA", (W, H), (12, 16, 14, 0))
    shadow.putalpha(Image.fromarray(a.astype(np.uint8)))
    layer = Image.alpha_composite(layer, shadow)
    layer.alpha_composite(grade(car, theme, mode == "grey", lift), (x0, y0))
    return layer

def cars_layer(slug, theme):
    layer = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    for (x0, bottom, h), pick in zip(SLOTS, PICKS[slug]):
        layer = place(layer, x0, bottom, h, pick, theme)
    return layer

# the front car alone, 1000px tall-ish canvas with room for its shadow
SW, SH = 1200, 760

# other cars of the same model for the later sections (7, 11, 12), so one page never shows the
# same photo over and over: <slug>-car-<variant>-<theme>[-m].webp
ALTS = {
  "velar": {"silver": "range-rover-velar-l560-hse-suv-20172019-new-silicon-silver-v-a6a5", "light": "range-rover-velar-l560-lci-s-suv-20212024-new-ostuni-white-v-c0f3", "dark": "range-rover-velar-l560-r-dynamic-black-suv-20202022-special-9667"},
  "range-rover-evoque": {"silver": "range-rover-evoque-l551-s-5-door-suv-20192023-new-indus-silv-4781", "light": "range-rover-evoque-l551-lci-s-5-door-suv-2023-new-fuji-white-f53b", "dark": "range-rover-evoque-l551-autobiography-5-door-suv-20202023-sp-8ee1"},
  "range-rover-sport": {"silver": "range-rover-sport-l494-se-suv-20132017-new-indus-silver-l494-c7c8", "light": "range-rover-sport-l461-autobiography-suv-2022-new-ostuni-whi-f46c", "dark": "range-rover-sport-l461-dynamic-se-suv-2022-new-santorini-bla-bfe9"},
  "range-rover": {"silver": "land-rover-range-rover-l322-hse-suv-20022009-new-zambezi-sil-bcf0", "light": "land-rover-range-rover-l460-se-suv-2022-new-belgravia-green-52f1", "dark": "land-rover-range-rover-l405-vogue-suv-20122017-new-causeway-b791"},
  "discovery": {"silver": "land-rover-discovery-l319-hse-5-door-suv-20092016-new-causew-0ea8", "light": "land-rover-discovery-l462-s-5-door-suv-2026-new-tasman-blue-867b", "dark": "land-rover-discovery-l319-se-5-door-suv-20092016-new-nara-br-bd73"},
  "discovery-sport": {"silver": "land-rover-discovery-sport-l550-hse-luxury-compact-suv-2019-1e02", "light": "land-rover-discovery-sport-l550-lci-s-compact-suv-20192021-n-41a7", "dark": "land-rover-discovery-sport-l550-lci-r-dynamic-black-compact-e352"},
  "freelander": {"silver": "land-rover-freelander-l359-gs-compact-suv-20062010-group-ala-3258", "light": "land-rover-freelander-l359-lci-se-dynamic-compact-suv-201420-a831", "dark": "land-rover-freelander-l359-sport-compact-suv-20102012-specia-1b69"},
  "defender": {"silver": "land-rover-defender-l663-x-dynamic-s-suv-2020-new-hakuba-sil-86d9", "light": "land-rover-defender-l663-110-5-door-suv-2020-new-gondwana-st-28b7", "dark": "land-rover-defender-l663-90-3-door-suv-2020-new-pangea-green-caf9"},
}

def single_car(slug, theme, pick=None):
    layer = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
    pick = PICKS[slug][-1] if pick is None else pick
    base = pick[0] if isinstance(pick, tuple) else pick
    src = Image.open(f"{ROOT}/public/variant/cars/{base}.webp")
    h = min(700, round(1100 * src.height / src.width))
    w = round(src.width * h / src.height)
    # a touch lighter at night than the line-up: it is the section's only picture
    return place(layer, (SW - w) // 2, 720, h, pick, theme, lift=1.32)

# ---------------------------------------------------------------- backdrop
BW, BH = 1600, 1200
HORIZON = 650

def paving(theme, rng):
    """Perspective stone paving below the horizon (supersampled 2x for clean seams)."""
    S = 2
    W, H = BW * S, (BH - HORIZON) * S
    ys = (np.arange(H)[:, None] + 0.5) / S + 0.5          # px below horizon
    xs = (np.arange(W)[None, :] + 0.5) / S - BW * 0.62     # vanishing point right of centre
    depth = 260.0 / ys                                     # world distance
    u = xs * depth / 260.0 * 4.6                           # across, in tiles
    v = depth * 3.4                                        # along, in tiles
    row = np.floor(v)
    u = u + (row % 2) * 0.5                                # running bond
    col = np.floor(u)
    fu, fv = u - col, v - row
    # seams thin with distance
    seam_w_u = np.clip(0.03 / np.maximum(depth, 0.3), 0.003, 0.035)
    seam_w_v = np.clip(0.035 * (ys / 300.0), 0.003, 0.04)
    seam = np.maximum(
        np.clip(1 - np.minimum(fu, 1 - fu) / seam_w_u, 0, 1),
        np.clip(1 - np.minimum(fv, 1 - fv) / seam_w_v, 0, 1),
    )
    hsh = np.sin(col * 12.9898 + row * 78.233) * 43758.5453
    tone = (hsh - np.floor(hsh)) - 0.5                     # per-slab variation
    grain = rng.normal(0, 1, (H, W)).astype(np.float32)
    grain = np.asarray(Image.fromarray(((grain * 30) + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.4))).astype(np.float32) / 255 - 0.5
    # low-frequency mottling: weathered stone by day, wet patches at night
    mot = rng.normal(0, 1, (H // 24 + 2, W // 24 + 2)).astype(np.float32)
    mot = np.asarray(Image.fromarray(((mot * 40) + 128).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(10))).astype(np.float32) / 255 - 0.5
    t = (ys / (BH - HORIZON))                               # 0 at horizon -> 1 at the foot
    if theme == "day":
        base = 0.80 + 0.10 * t
        lum = base + tone * 0.022 + grain * 0.05 + mot * 0.06 - seam * 0.045
        col_rgb = np.stack([lum * 1.0, lum * 0.992, lum * 0.968], -1)
        fog = np.array([0.90, 0.895, 0.875])
    else:
        base = 0.13 - 0.05 * t
        # wet sheen picking up the sky, strongest in the distance
        sheen = np.exp(-t * 5) * 0.08
        lum = base + tone * 0.018 + grain * 0.045 + mot * 0.05 - seam * 0.03 + sheen + np.clip(mot, 0, 1) ** 2 * 0.18 * (1 - t)
        col_rgb = np.stack([lum * 0.93, lum * 1.0, lum * 0.97], -1)
        fog = np.array([0.16, 0.18, 0.175])
    haze = np.exp(-t * 9)[..., None] * 0.85
    col_rgb = col_rgb * (1 - haze) + fog * haze
    img = Image.fromarray((col_rgb.clip(0, 1) * 255).astype(np.uint8)).resize((BW, BH - HORIZON), Image.LANCZOS)
    return np.asarray(img).astype(np.float32) / 255

def backdrop(theme):
    rng = np.random.default_rng(11)
    src = Image.open(f"{ROOT}/public/home/hero-loch-{theme}.webp").convert("RGB")
    s = 1.32
    src = src.resize((int(src.width * s), int(src.height * s)), Image.LANCZOS)
    ox = src.width - BW
    land = np.asarray(src.crop((ox, 0, ox + BW, HORIZON + 120))).astype(np.float32) / 255
    g = land.mean(axis=2, keepdims=True)
    y = np.linspace(0, 1, land.shape[0])[:, None, None]
    if theme == "day":
        # soft overcast: keep the hills olive-green, cool the golden light, mist in the valley
        land = g + (land - g) * 0.62
        land = land * np.array([0.97, 1.0, 0.99]) * 0.9 + 0.09
        fog = np.array([0.90, 0.895, 0.875])
        k = (0.08 + 0.6 * y ** 2.2)
    else:
        land = g + (land - g) * 0.75
        land = land * np.array([0.9, 0.98, 0.94]) * 0.95
        fog = np.array([0.16, 0.18, 0.175])
        k = 0.5 * y ** 3
    land = land * (1 - k) + fog * k
    pave = paving(theme, rng)
    canvas = np.zeros((BH, BW, 3), np.float32)
    canvas[HORIZON:] = pave
    # landscape fades into the paving across a misty band just above the horizon
    for yy in range(0, HORIZON + 120):
        t = np.clip((yy - (HORIZON - 70)) / 110, 0, 1)
        t = t * t * (3 - 2 * t)
        ground = pave[yy - HORIZON] if yy >= HORIZON else fog
        canvas[yy] = land[yy] * (1 - t) + ground * t
    return Image.fromarray((canvas.clip(0, 1) * 255).astype(np.uint8))

if __name__ == "__main__":
    # --cars-only: rebuild just the four-car line-ups (<slug>-cars-*), leaving every other image alone
    cars_only = "--cars-only" in sys.argv
    what = [a for a in sys.argv[1:] if a != "--cars-only"] or ["bg", *PICKS]
    for t in ("day", "night"):
        if "bg" in what:
            b = backdrop(t)
            b.save(f"{OUT}/bg-{t}.webp", quality=80, method=6)
            b.resize((900, 675), Image.LANCZOS).save(f"{OUT}/bg-{t}-m.webp", quality=78, method=6)
        for slug in [w for w in what if w in PICKS]:
            l = cars_layer(slug, t)
            l.save(f"{OUT}/{slug}-cars-{t}.webp", quality=86, method=6)
            l.resize((1150, round(1150 * CH / CW)), Image.LANCZOS).save(f"{OUT}/{slug}-cars-{t}-m.webp", quality=84, method=6)
            if cars_only:
                continue
            one = single_car(slug, t)
            one.save(f"{OUT}/{slug}-car-{t}.webp", quality=86, method=6)
            one.resize((760, round(760 * SH / SW)), Image.LANCZOS).save(f"{OUT}/{slug}-car-{t}-m.webp", quality=84, method=6)
            for variant, idx in ALTS.get(slug, {}).items():
                alt = single_car(slug, t, idx)
                alt.save(f"{OUT}/{slug}-car-{variant}-{t}.webp", quality=86, method=6)
                alt.resize((760, round(760 * SH / SW)), Image.LANCZOS).save(f"{OUT}/{slug}-car-{variant}-{t}-m.webp", quality=84, method=6)
    print("done", what)
