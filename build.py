"""Build index.html from src/template.html and src/data.js.

Usage:  python3 build.py
Edit exercises, quiz questions and the cheat sheet in src/data.js,
the page layout and behaviour in src/template.html, then rebuild.
"""
from pathlib import Path

root = Path(__file__).resolve().parent
template = (root / "src" / "template.html").read_text(encoding="utf-8")
data = (root / "src" / "data.js").read_text(encoding="utf-8")

# "<!--" inside an inline <script> can confuse the HTML parser; "\!" is the same character in JS.
data = data.replace("<!--", "<\\!--")

marker = "/*DATA*/"
if marker not in template:
    raise SystemExit("marker /*DATA*/ not found in src/template.html")

(root / "index.html").write_text(template.replace(marker, data), encoding="utf-8")
print("index.html written")
