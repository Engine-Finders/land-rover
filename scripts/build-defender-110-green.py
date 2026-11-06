# Usage: python3 scripts/build-defender-110-green.py   (needs Pillow + numpy)
# The generation page's engine database (Defender L316) shows a dark Coniston-green Defender 110
# with a white roof, as in the approved reference. The repo's 110 with a white roof is red (One Ten
# 110 County), so this recolours its red paint to that green, keeping the shading (value and
# saturation scaled, not replaced), the white roof, black arches, chrome, glass and the alpha edge.
# Writes public/variant/cars/land-rover-defender-110-county-coniston-green.webp and its carMeta.json
# entry (same geometry as the source cut-out).
import json, os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = "/variant/cars/land-rover-defender-one-ten-110-county-5-door-4x4-19871990-g-3eac.webp"
DST = "/variant/cars/land-rover-defender-110-county-coniston-green.webp"

# the reference body: hue ~105, saturation ~0.3, value ~0.16-0.29 (shadow to highlight)
HUE = 105 / 360
SAT_SCALE = 0.42
VAL_SCALE = 0.34

img = Image.open(f"{ROOT}/public{SRC}").convert("RGBA")
rgba = np.asarray(img).astype(np.float32) / 255
rgb, alpha = rgba[..., :3], rgba[..., 3:]

hsv = np.asarray(Image.fromarray((rgb * 255).astype(np.uint8)).convert("HSV")).astype(np.float32) / 255
h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]

# red paint: hue within ~22 degrees of red (amber indicators sit near 30-40 degrees and stay as
# they are), from the pale pink reflections up to the full paint; a soft ramp on saturation keeps
# the paint's edges smooth and leaves the white roof and the greys alone
dist = np.minimum(h, 1 - h) * 360
paint = np.clip((22 - dist) / 6, 0, 1) * np.clip((s - 0.06) / 0.06, 0, 1)

# the fully saturated paint takes the reference's dark value; paler reflections darken less, so
# they read as highlights on green paint
depth = np.clip((s - 0.06) / 0.45, 0, 1)
new_h = np.full_like(h, HUE)
new_s = np.clip(s * SAT_SCALE, 0, 1)
new_v = np.clip(v * (1 - depth * (1 - VAL_SCALE)) + 0.02 * depth, 0, 1)
green = np.stack([new_h, new_s, new_v], -1)
green_rgb = np.asarray(Image.frombytes("HSV", img.size, (green * 255).astype(np.uint8).tobytes()).convert("RGB")).astype(np.float32) / 255

out = rgb * (1 - paint[..., None]) + green_rgb * paint[..., None]
result = np.concatenate([out, alpha], -1)
Image.fromarray((result * 255).round().astype(np.uint8)).save(f"{ROOT}/public{DST}", "WEBP", quality=90, method=6)

meta_path = f"{ROOT}/src/data/variant-design/carMeta.json"
meta = json.load(open(meta_path))
meta[DST] = dict(meta[SRC])
with open(meta_path, "w") as f:
    json.dump(meta, f, indent=1)
    f.write("\n")
print("wrote", DST, img.size)
