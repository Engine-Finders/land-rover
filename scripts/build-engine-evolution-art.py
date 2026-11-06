# Engine shots for the model pages' Engine Evolution (section 9) key-engine tiles: each existing
# engine cut-out in public/ is trimmed to its alpha bounds and fitted, centred, on one transparent
# 340x300 canvas, so every tile shows the engine at the same visual size. Run from the repo root:
#   python3 scripts/build-engine-evolution-art.py      (needs Pillow)
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "model", "engines")
os.makedirs(OUT, exist_ok=True)

# output name -> source cut-out (see EngineEvolution.js for which engine codes use which shot)
SOURCES = {
    "inline4-diesel": "engines/jaguar-aj200d-engine.webp",  # Ingenium / Duratorq-style 4-cyl diesel
    "v6-diesel": "engines/jaguar-276dt-tdv6-engine.webp",   # silver Lion V6 diesel, belt drive
    "lr-black": "engine-hero/engine-cut.webp",              # black Land Rover-badged diesel
    "lr-black-alt": "engine-glance/engine.webp",            # same family, different angle/crop
    "tdi-classic": "variant/sec2_engine.webp",              # 200Tdi with fan
    "modern-six": "variant/sec10_engine.webp",              # dark modern six with cover
    "compact-black": "home/market/engine.webp",             # compact black petrol
}
W, H, PAD = 340, 300, 0.03

for name, src in SOURCES.items():
    im = Image.open(os.path.join(ROOT, "public", src)).convert("RGBA")
    im = im.crop(im.getbbox())
    box_w, box_h = W * (1 - 2 * PAD), H * (1 - 2 * PAD)
    s = min(box_w / im.width, box_h / im.height, 1.6)
    im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    canvas.alpha_composite(im, ((W - im.width) // 2, (H - im.height) // 2))
    canvas.save(os.path.join(OUT, f"{name}.webp"), quality=86, method=6)
    print(name, im.size)
