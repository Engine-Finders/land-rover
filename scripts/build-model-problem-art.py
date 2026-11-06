# Usage: python3 scripts/build-model-problem-art.py   (needs Pillow + numpy)
# Section 6 (Common Engine Problems) photos: each part / engine cut-out from public/ trimmed to its
# own outline, scaled to fill a square transparent canvas the same way, grounded with a soft contact
# shadow and saved as a small alpha WebP in public/model/problems/. The card paints the dark studio
# backdrop behind it in CSS, so one file works on every card shape and in both themes.
import os
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = f"{ROOT}/public/model/problems"
os.makedirs(OUT, exist_ok=True)

SOURCES = {
    "crankshaft": "home/rank/crank.webp",
    "timing-chain": "home/market/chain.webp",
    "battery": "parts/12v-car-battery.webp",
    "air-compressor": "parts/air-suspension-compressor.webp",
    "valve-block": "parts/air-suspension-valve-block.webp",
    "differential": "parts/differential.webp",
    "propshaft": "parts/propshaft-u-joint.webp",
    "transfer-box": "parts/transfer-box.webp",
    "engine-black": "engine-glance/engine.webp",
    "engine-diesel": "engine-hero/engine-cut.webp",
    "engine-tdi": "engine-hero/engine-tdi-cut.webp",
    "engine-200tdi": "variant/sec2_engine.webp",
    "engine-sdv": "variant/sec10_engine.webp",
    "engine-ingenium": "engines/jaguar-aj200d-engine.webp",
    "engine-v6": "engines/jaguar-276dt-tdv6-engine.webp",
    "engine-silver": "home/rank/engine.webp",
}

SIZE = 720          # output canvas (px)
FILL = 0.9          # the part's longer side fills this much of the canvas

for key, rel in SOURCES.items():
    im = Image.open(f"{ROOT}/public/{rel}").convert("RGBA")
    a = np.asarray(im)[:, :, 3]
    ys, xs = np.where(a > 10)
    im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    scale = SIZE * FILL / max(im.size)
    w, h = round(im.width * scale), round(im.height * scale)
    part = im.resize((w, h), Image.LANCZOS)
    if scale > 1.2:  # small sources (the chain, the crank) get a light sharpen after upscaling
        rgb = part.convert("RGB").filter(ImageFilter.UnsharpMask(radius=1.4, percent=70, threshold=2))
        part = Image.merge("RGBA", (*rgb.split(), part.getchannel("A")))
    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    x0, y0 = (SIZE - w) // 2, (SIZE - h) // 2 + round(SIZE * 0.02)
    # soft contact shadow under the part, so it sits on the studio floor rather than floating
    sh = Image.new("L", (SIZE, SIZE), 0)
    sw, shh = round(w * 0.82), round(SIZE * 0.06)
    ellipse = Image.new("L", (sw, shh), 0)
    from PIL import ImageDraw
    ImageDraw.Draw(ellipse).ellipse((0, 0, sw - 1, shh - 1), fill=150)
    sh.paste(ellipse, ((SIZE - sw) // 2, min(SIZE - shh, y0 + h - shh // 2)))
    sh = sh.filter(ImageFilter.GaussianBlur(SIZE * 0.025))
    shadow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    shadow.putalpha(sh)
    canvas = Image.alpha_composite(canvas, shadow)
    canvas.alpha_composite(part, (x0, y0))
    canvas.save(f"{OUT}/{key}.webp", quality=84, method=6)
    print(key, (w, h), os.path.getsize(f"{OUT}/{key}.webp") // 1024, "KB")
