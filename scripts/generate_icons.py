#!/usr/bin/env python3
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANDROID_RES = os.path.join(ROOT, "android", "app", "src", "main", "res")
LOGO_PNG = os.path.join(ROOT, "logo.png")

SIZES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

logo = Image.open(LOGO_PNG).convert("RGBA")

for folder, px in SIZES.items():
    d = os.path.join(ANDROID_RES, folder)
    os.makedirs(d, exist_ok=True)
    resized = logo.resize((px, px), Image.LANCZOS)
    for name in ("ic_launcher.png", "ic_launcher_round.png"):
        resized.save(os.path.join(d, name), "PNG")
    print(f"wrote {folder} ({px}px)")

splash_dir = os.path.join(ANDROID_RES, "drawable")
os.makedirs(splash_dir, exist_ok=True)
logo.resize((240, 240), Image.LANCZOS).save(
    os.path.join(splash_dir, "splash_logo.png"),
    "PNG",
)
print("wrote drawable/splash_logo.png")
print("done")
