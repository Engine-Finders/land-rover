# Usage: python3 scripts/build-buyer-thumbs.py [model-slug ...]   (needs Pillow + numpy)
#
# Section 10 ("Who Should Buy a …?") row photos: the model's own car (a front three-quarter cut-out
# from public/variant/cars, picked to match the generation the verdict talks about, never the same
# car twice in one table) standing in one of the site's Highland landscapes, chosen by buyer type
# (family -> golden-hour loch, commuter/budget -> the misty paved apron, towing/first 4x4 -> open
# hills, design/premium -> loch at golden hour, performance -> storm). Cast + contact shadows from
# the tyre contact points measured in carMeta.json.
#   public/model/buyers/<slug>-<n>.webp            680 x 280, one per profile
#   src/components/models/whoShouldBuyThumbs.json  { slug: { "Buyer Profile": "/model/buyers/…" } }
import glob, json, os, re, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = f"{ROOT}/public/model/buyers"
MANIFEST = f"{ROOT}/src/components/models/whoShouldBuyThumbs.json"
os.makedirs(OUT, exist_ok=True)
meta = json.load(open(f"{ROOT}/src/data/variant-design/carMeta.json"))
CARS = sorted(os.path.basename(f) for f in glob.glob(f"{ROOT}/public/variant/cars/*.webp"))

W, H = 680, 280
S = 2  # composite at 2x, then downsample for clean edges

# ------------------------------------------------------------------ scenes
# source, crop as (x0, y0, width) in source px (height follows the W:H ratio), background grade,
# car grade, shadow strength
SCENES = {
    "loch-golden": ("public/home/hero-loch-day.webp", (0, 330, 1536), dict(b=1.0, sat=0.95), dict(mul=(1.02, 0.98, 0.9), b=0.95), 0.55),
    "loch-golden-zoom": ("public/home/hero-loch-day.webp", (300, 250, 1236), dict(b=1.02, sat=0.92), dict(mul=(1.02, 0.98, 0.9), b=0.95), 0.55),
    "misty-paving": ("public/model/hero/bg-day.webp", (0, 360, 1600), dict(b=0.98, sat=1.0), dict(mul=(1, 1, 1), b=0.96), 0.5),
    "misty-paving-zoom": ("public/model/hero/bg-day.webp", (300, 430, 1300), dict(b=0.97, sat=1.0), dict(mul=(1, 1, 1), b=0.96), 0.5),
    "open-hills": ("public/variant/hero-landscape-v3.webp", (0, 300, 2400), dict(b=1.45, sat=1.05, lift=0.03), dict(mul=(0.97, 1, 1), b=0.86), 0.65),
    "open-hills-path": ("public/variant/hero-landscape-v3.webp", (1000, 620, 1400), dict(b=1.5, sat=1.05, lift=0.03), dict(mul=(0.97, 1, 1), b=0.86), 0.65),
    "storm": ("public/home/hero-loch-night.webp", (0, 330, 1536), dict(b=1.12, sat=0.95), dict(mul=(0.95, 0.98, 1), b=0.74), 0.75),
}

def scene_for(profile, used):
    p = profile.lower()
    if "perform" in p:
        order = ["storm", "loch-golden-zoom"]
    elif "premium" in p or "design" in p:
        order = ["loch-golden-zoom", "loch-golden"]
    elif "famil" in p:
        order = ["loch-golden", "loch-golden-zoom"]
    elif "commut" in p or "daily" in p:
        order = ["misty-paving", "misty-paving-zoom"]
    elif "budget" in p:
        order = ["misty-paving-zoom", "misty-paving"]
    elif "tow" in p or "work" in p:
        order = ["open-hills", "open-hills-path"]
    elif "4x4" in p or "first" in p:
        order = ["open-hills-path", "open-hills"]
    elif "collect" in p or "keeper" in p or "long-term" in p:
        order = ["open-hills-path", "storm", "open-hills"]
    else:
        order = list(SCENES)
    for s in order:
        if s not in used:
            return s
    return order[0]

def grade(arr, b=1.0, sat=1.0, lift=0.0, mul=(1, 1, 1)):
    g = arr.mean(axis=2, keepdims=True)
    arr = g + (arr - g) * sat
    arr = arr * np.array(mul) * b + lift
    return arr.clip(0, 1)

def background(name):
    src, (x0, y0, cw), bgrade, _, _ = SCENES[name]
    im = Image.open(f"{ROOT}/{src}").convert("RGB")
    ch = round(cw * H / W)
    im = im.crop((x0, y0, x0 + cw, y0 + ch)).resize((W * S, H * S), Image.LANCZOS)
    a = grade(np.asarray(im).astype(np.float32) / 255, **bgrade)
    # soft vignette so the car reads as the subject
    yy, xx = np.mgrid[0:H * S, 0:W * S]
    d = ((xx / (W * S) - 0.5) ** 2 * 1.2 + (yy / (H * S) - 0.55) ** 2 * 1.6)
    a = a * (1 - np.clip(d - 0.12, 0, 1)[..., None] * 0.35)
    return Image.fromarray((a.clip(0, 1) * 255).astype(np.uint8)).convert("RGBA")

# ------------------------------------------------------------------ cars
# the model's cut-outs (indices into the sorted public/variant/cars list), by generation
MODEL_CARS = {
    "velar": {"pre": [56, 62, 60, 61], "face": [58, 57, 59]},
    "defender": {"l663": [4, 6, 7, 8, 5], "classic": [1, 9, 2, 3, 0]},
    "discovery-sport": {"pre": [25, 18, 19, 20], "face": [24, 21, 22, 23]},
    "discovery": {"d1": [16], "d2": [17], "d3": [11], "d4": [12, 13], "d5": [14, 15]},
    "freelander": {"fl1": [27, 26, 28], "fl2": [30, 29, 31, 32]},
    "range-rover-evoque": {"l538": [41, 39, 40], "l551": [43, 42, 44, 45, 46]},
    "range-rover-sport": {"l320": [48, 47], "l494": [54, 53, 52], "svr": [55], "l461": [50, 51, 49]},
    "range-rover": {"classic": [33], "p38": [38], "l322": [34], "l405": [35], "l460": [36, 37]},
}
# the generation a verdict is talking about (first match wins)
GEN_HINTS = {
    "velar": [("face", r"2021|facelift|P400e|Pivi"), ("pre", r"D180|early|2017|V6|pre-2021")],
    "defender": [("classic", r"\bTdi\b|TD5|classic|Puma"), ("l663", r"L663|2020|D250|D300|P400")],
    "discovery-sport": [("face", r"MHEV|2019\.5|facelift|P300e|2020"), ("pre", r"2\.2|2015|early|pre-facelift")],
    "discovery": [("d5", r"Discovery 5|\bD5\b|L462|2021|D300|P300"), ("d4", r"Discovery 4|\bD4\b|SDV6"), ("d3", r"Discovery 3|\bD3\b|2\.7"), ("d2", r"TD5|Discovery 2"), ("d1", r"\bTdi\b|Discovery 1")],
    "freelander": [("fl2", r"Freelander 2|FL2|L359|SD4|2\.2"), ("fl1", r"Freelander 1|FL1|Td4|K-series|KV6")],
    "range-rover-evoque": [("l551", r"L551|P300e|2019|MHEV"), ("l538", r"L538|2\.2|2015|2011")],
    "range-rover-sport": [("svr", r"\bSVR\b"), ("l461", r"L461|2022"), ("l494", r"L494|SDV8|D350"), ("l320", r"L320")],
    "range-rover": [("classic", r"Classic"), ("p38", r"P38"), ("l322", r"L322"), ("l405", r"L405|SDV8"), ("l460", r"L460|2022")],
}

def pick_car(slug, text, used):
    groups = MODEL_CARS[slug]
    for gen, pat in GEN_HINTS.get(slug, []):
        if re.search(pat, text, re.I):
            for i in groups[gen]:
                if i not in used:
                    return i
    pool = [i for g in groups.values() for i in g]
    # interleave generations so a table without hints still shows the model's range
    order = []
    lists = [list(g) for g in groups.values()]
    while any(lists):
        for lst in lists:
            if lst:
                order.append(lst.pop(0))
    for i in reversed(order) if slug in ("discovery", "range-rover", "range-rover-sport") else order:
        if i not in used:
            return i
    return pool[0]

def car_layer(idx, cgrade, shadow_k):
    name = CARS[idx]
    car = Image.open(f"{ROOT}/public/variant/cars/{name}").convert("RGBA")
    h = round(H * S * 0.72)
    w = round(car.width * h / car.height)
    if w > W * S * 0.64:
        w = round(W * S * 0.64)
        h = round(car.height * w / car.width)
    car = car.resize((w, h), Image.LANCZOS)
    x0 = round(W * S * 0.52 - w / 2)
    bottom = round(H * S * 0.9)
    y0 = bottom - h
    wheels = meta[f"/variant/cars/{name}"]["wheels"]
    layer = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    # cast shadow across the footprint (the three visible contacts + the hidden rear one)
    sh = Image.new("L", layer.size, 0)
    d = ImageDraw.Draw(sh)
    fl, nf, rr = [(x0 + wx / 100 * w, y0 + wy / 100 * h) for wx, wy, _ in wheels]
    far = (fl[0] + rr[0] - nf[0], fl[1] + rr[1] - nf[1])
    poly = [fl, nf, rr, far]
    cx = sum(p[0] for p in poly) / 4
    cy = sum(p[1] for p in poly) / 4
    poly = [(cx + (px - cx) * 1.14, cy + (py - cy) * 1.6) for px, py in poly]
    d.polygon(poly, fill=255)
    sh = sh.filter(ImageFilter.GaussianBlur(h * 0.035))
    c = Image.new("L", layer.size, 0)
    dc = ImageDraw.Draw(c)
    for wx, wy, ww in wheels:
        px, py = x0 + wx / 100 * w, y0 + wy / 100 * h
        rw = ww / 100 * w * 1.1
        dc.ellipse((px - rw, py - rw * 0.14, px + rw, py + rw * 0.2), fill=255)
    c = c.filter(ImageFilter.GaussianBlur(h * 0.012))
    a = np.maximum(np.asarray(sh) * shadow_k, np.asarray(c) * 0.9)
    shadow = Image.new("RGBA", layer.size, (10, 12, 10, 0))
    shadow.putalpha(Image.fromarray(a.astype(np.uint8)))
    layer = Image.alpha_composite(layer, shadow)
    # car grade + ambient occlusion toward the ground
    rgb = np.asarray(car.convert("RGB")).astype(np.float32) / 255
    rgb = grade(rgb, **cgrade)
    yy = np.linspace(0, 1, h)[:, None, None]
    rgb = rgb * (1 - np.clip((yy - 0.62) / 0.38, 0, 1) * 0.25)
    out = Image.fromarray((rgb.clip(0, 1) * 255).astype(np.uint8))
    layer.alpha_composite(Image.merge("RGBA", (*out.split(), car.getchannel("A"))), (x0, y0))
    return layer

def build(slug, manifest):
    data = json.load(open(f"{ROOT}/src/data/models/{slug}.json"))
    profiles = data.get("whoShouldBuy", {}).get("profiles", [])
    used_scenes, used_cars, entry = set(), set(), {}
    for n, p in enumerate(profiles, 1):
        name = p.get("buyerProfile", f"Profile {n}")
        scene = scene_for(name, used_scenes)
        used_scenes.add(scene)
        idx = pick_car(slug, f"{name} {p.get('verdict', '')}", used_cars)
        used_cars.add(idx)
        _, _, _, cgrade, shadow_k = SCENES[scene]
        img = background(scene)
        img.alpha_composite(car_layer(idx, cgrade, shadow_k))
        img = img.convert("RGB").resize((W, H), Image.LANCZOS)
        path = f"/model/buyers/{slug}-{n}.webp"
        img.save(f"{ROOT}/public{path}", quality=76, method=6)
        entry[name] = path
        print(f"  {slug} #{n} {name!r}: {scene} + {CARS[idx][:48]}")
    manifest[slug] = entry

if __name__ == "__main__":
    slugs = sys.argv[1:] or list(MODEL_CARS)
    manifest = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else {}
    for s in slugs:
        build(s, manifest)
    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print("manifest:", MANIFEST)
