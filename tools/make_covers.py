#!/usr/bin/env python3
"""Generate 1200x630 blog covers (cards + social share) from post front matter.
Run: python3 tools/make_covers.py   (needs playwright + chromium). Skips posts that already have a cover file."""
import os, re, sys, html
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(ROOT, "blog", "_posts"); OUT = os.path.join(ROOT, "assets", "blog")
TONE = {"مهنة التصميم": ("#FB2203", "logo-white.svg")}
def meta(path):
    m = re.match(r"^---\s*\n(.*?)\n---", open(path, encoding="utf-8").read(), re.S)
    d = {}
    for l in m.group(1).splitlines():
        if ":" in l: k, v = l.split(":", 1); d[k.strip()] = v.strip()
    return d
font = "file://" + os.path.join(ROOT, "assets/fonts/NotoSansArabic-var.woff2")
force = "--force" in sys.argv
os.makedirs(OUT, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1200, "height": 630})
    for f in sorted(os.listdir(POSTS)):
        if not f.endswith(".md"): continue
        d = meta(os.path.join(POSTS, f)); out = os.path.join(OUT, d["slug"] + ".jpg")
        if os.path.exists(out) and not force: continue
        bg, logo = TONE.get(d.get("category_ar", ""), ("#000000", "logo-red-white.svg"))
        title = html.escape(re.sub(r"^\(.*?\)\s*", "", d["title_ar"]))
        doc = f"""<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{{font-family:N;src:url('{font}') format('woff2');font-weight:100 900}}
*{{margin:0;box-sizing:border-box}}html,body{{width:1200px;height:630px}}
body{{background:{bg};color:#fff;font-family:N,'Noto Sans',sans-serif;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between}}
.top{{display:flex;justify-content:space-between;align-items:center}}
.cat{{font-size:26px;font-weight:600;opacity:.85}}
h1{{font-size:{62 if len(title) < 46 else 54}px;line-height:1.3;font-weight:600;max-width:1000px;text-wrap:balance}}
.foot{{display:flex;justify-content:space-between;align-items:center;font-size:22px;opacity:.75;direction:ltr}}
.foot b{{font-weight:600;letter-spacing:.14em;font-size:20px}}
</style></head><body>
<div class="top"><span class="cat">{html.escape(d.get('category_ar',''))}</span><img src="file://{ROOT}/assets/icons/{logo}" width="88"></div>
<h1>{title}</h1>
<div class="foot"><b>MOHAMED SHERIF</b><span>mohamed-sherif.com/blog</span></div>
</body></html>"""
        tmp = os.path.join(OUT, "_tmp.html"); open(tmp, "w", encoding="utf-8").write(doc)
        pg.goto("file://" + tmp); pg.wait_for_timeout(400); os.remove(tmp)
        pg.screenshot(path=out, type="jpeg", quality=86)
        print("cover:", d["slug"])
    b.close()
