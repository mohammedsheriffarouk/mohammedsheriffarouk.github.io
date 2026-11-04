#!/usr/bin/env python3
"""Build the blog + sitemap + robots + RSS.

Posts live in blog/_posts/<slug>.md :

    ---
    slug: logo-vs-identity
    date: 2026-11-04
    category_ar: الهوية البصرية
    category_en: Visual Identity
    title_ar: ...
    title_en: ...
    desc_ar: ...            (one sentence, for Google + cards)
    desc_en: ...
    cover: assets/blog/logo-vs-identity.jpg   (optional, path from site root)
    cta: brandSet | workshop | mentoring | none   (optional, default brandSet)
    draft: true             (optional — skipped unless --drafts)
    ---
    <!-- ar -->
    Arabic markdown…
    <!-- en -->
    English markdown…

Run:  python3 tools/build_blog.py            (production)
      python3 tools/build_blog.py --drafts   (local preview incl. drafts)
"""
import html, json, math, os, re, sys, datetime
import markdown

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://mohamed-sherif.com"
POSTS_DIR = os.path.join(ROOT, "blog", "_posts")
V = "20261104c"
DRAFTS = "--drafts" in sys.argv

AR_MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"]
EN_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
CTAS = {
  "brandSet":  {"ar": ("عايز تطبّق ده على هوية كاملة؟", "كورس BRAND-SET بياخدك خطوة بخطوة من ملخص العميل لحد تسليم الهوية."), "en": ("Want to apply this to a full identity?", "BRAND-SET takes you step by step from the client brief to the final identity delivery."), "href": "brand-set/", "btn": ("اعرف أكتر عن BRAND-SET", "Explore BRAND-SET")},
  "workshop":  {"ar": ("ابدأ بالورشة المجانية", "ساعتان تغيّر طريقتك في النظر إلى العلامة التجارية."), "en": ("Start with the free workshop", "Two hours that change how you look at a brand."), "href": "workshops/", "btn": ("شاهد الورشة مجانًا", "Watch free")},
  "mentoring": {"ar": ("محتاج حد يراجع شغلك؟", "جلسة منتورينج فردية تعرف فيها مستواك وتخرج بخطة عملية."), "en": ("Need someone to review your work?", "A one-to-one mentoring session to see where you stand and leave with a plan."), "href": "mentoring/", "btn": ("احجز جلستك", "Book your session")},
}
STATIC_PAGES = ["", "brand-set/", "mentoring/", "workshops/", "brand-identity/", "mockup-builder/", "blog/"]

def esc(s): return html.escape(str(s or ""), quote=True)

def parse(path):
    raw = open(path, encoding="utf-8").read()
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", raw, re.S)
    if not m: raise SystemExit(f"{path}: missing front matter")
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line and not line.strip().startswith("#"):
            k, v = line.split(":", 1); meta[k.strip()] = v.strip()
    body = m.group(2)
    parts = re.split(r"<!--\s*(ar|en)\s*-->", body)
    langs = {}
    for i in range(1, len(parts), 2): langs[parts[i]] = parts[i + 1].strip()
    if "ar" not in langs: raise SystemExit(f"{path}: needs an <!-- ar --> section")
    for k in ("slug", "date", "title_ar"):
        if not meta.get(k): raise SystemExit(f"{path}: missing {k}")
    meta["draft"] = meta.get("draft", "").lower() in ("true", "yes", "1")
    meta["d"] = datetime.date.fromisoformat(meta["date"])
    meta["ar_md"], meta["en_md"] = langs["ar"], langs.get("en", "")
    for k in ("title", "desc", "category"):
        meta.setdefault(k + "_en", meta.get(k + "_ar", ""))
        if not meta.get(k + "_en"): meta[k + "_en"] = meta.get(k + "_ar", "")
    meta.setdefault("desc_ar", "")
    meta.setdefault("category_ar", "")
    meta["cta"] = meta.get("cta") or "brandSet"
    return meta

def md(text):
    conv = markdown.Markdown(extensions=["extra", "sane_lists", "toc"], extension_configs={"toc": {"slugify": lambda v, s: re.sub(r"[^\w؀-ۿ-]+", "-", v.strip().lower()).strip("-")}})
    out = conv.convert(text)
    out = re.sub(r"<img ", '<img loading="lazy" ', out)
    out = re.sub(r'<a href="(https?://(?!mohamed-sherif\.com)[^"]+)"', r'<a href="\1" target="_blank" rel="noopener"', out)
    return out, conv.toc_tokens

def words(text): return len(re.findall(r"\w+", re.sub(r"<[^>]+>", " ", text)))
def minutes(text): return max(1, math.ceil(words(text) / 200))
def date_ar(d): return f"{d.day} {AR_MONTHS[d.month-1]} {d.year}"
def date_en(d): return f"{d.day} {EN_MONTHS[d.month-1]} {d.year}"

def toc_html(tokens, lang):
    h2 = [t for t in tokens if t["level"] == 2]
    if len(h2) < 3: return ""
    lab = "في هذا المقال" if lang == "ar" else "In this article"
    items = "".join(f'<li><a href="#{esc(t["id"])}">{esc(t["name"])}</a></li>' for t in h2)
    return f'<nav class="bl-toc" aria-label="{lab}"><p class="bl-toc__t">{lab}</p><ol>{items}</ol></nav>'

def head(title, desc, canonical, pre, og_type="website", image=None, extra=""):
    image = image or f"{SITE}/assets/images/og-image.jpg"
    return f'''<!doctype html>
<html lang="ar" dir="rtl" data-content="Blog">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="{pre}assets/js/pixel.js?v=20261009px"></script>
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(desc)}">
  <meta name="author" content="Mohamed Sherif">
  <meta name="theme-color" content="#FFFFFF">
  <link rel="canonical" href="{canonical}">
  <link rel="alternate" type="application/rss+xml" title="Mohamed Sherif — Blog" href="{SITE}/feed.xml">
  <meta property="og:type" content="{og_type}">
  <meta property="og:locale" content="ar_EG">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:site_name" content="Mohamed Sherif">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(desc)}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{image}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="{pre}favicon.ico" sizes="48x48">
  <link rel="icon" href="{pre}assets/icons/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="{pre}assets/icons/apple-touch-icon.png">
  <link rel="preload" href="{pre}assets/fonts/NotoSansArabic-var.woff2" as="font" type="font/woff2" crossorigin>
  <script>
  (function(){{var q=new URLSearchParams(location.search).get("lang"),l=q;
  if(l!=="en"&&l!=="ar"){{try{{l=localStorage.getItem("ms-lang")}}catch(e){{}}}}
  if(l==="en"){{document.documentElement.lang="en";document.documentElement.dir="ltr"}}}})();
  </script>
  <link rel="stylesheet" href="{pre}style.css?v=20261025i">
  <link rel="stylesheet" href="{pre}assets/service.css?v=20261025h">
  <link rel="stylesheet" href="{pre}assets/blog.css?v={V}">{extra}
</head>
<body class="bs bl">
<a class="skip" href="#main" data-i18n="skip">تخطَّ إلى المحتوى</a>
<nav class="nav" data-i18n-attr="aria-label:nav.label" aria-label="التنقل">
  <a class="nav__mark" href="{pre}" data-i18n-attr="aria-label:nav.home" aria-label="الصفحة الرئيسية"><img class="nav__logo nav__logo--light" src="{pre}assets/icons/logo-red-white.svg" alt="" width="36" height="25"><img class="nav__logo nav__logo--dark" src="{pre}assets/icons/logo-red-black.svg" alt="" width="36" height="25"><span class="nav__name caps" lang="en" dir="ltr">Mohamed Sherif</span></a>
  <p class="nav__course caps" lang="en" dir="ltr"><a href="{pre}blog/" style="color:inherit;text-decoration:none">Blog</a></p>
  <div class="nav__end">
    <button type="button" class="lang" data-lang-toggle data-cta="lang_toggle_nav"><span class="lang__en">EN</span><span class="lang__ar">عربي</span></button>
    <a class="nav__cta" href="{pre}brand-set/" data-cta="nav_brandset" data-i18n="nav.cta">الكورس</a>
  </div>
</nav>
'''

def foot(pre, en_dict, extra_js=""):
    return f'''
<footer class="foot" dir="ltr">
  <a class="foot__id" href="{pre}" style="text-decoration:none">
    <img src="{pre}assets/icons/logo-white.svg" alt="" width="44" height="30">
    <span class="caps foot__name">Mohamed Sherif</span>
  </a>
  <p class="foot__role">Blog · Brand Identity Designer · Branding Educator</p>
  <p class="caps foot__copy">© {datetime.date.today().year}</p>
</footer>
<div class="toast" role="status" aria-live="polite"></div>
<script>const EN = {json.dumps(en_dict, ensure_ascii=False)};</script>
<script src="{pre}script.js?v=20261025i" defer></script>{extra_js}
<script src="{pre}assets/js/drawer.js?v=20261104b" charset="utf-8" defer></script>
</body>
</html>
'''

BASE_EN = {"skip": "Skip to content", "close": "Close", "newtab": "(opens in a new tab)", "soon": "Link coming soon",
           "nav.label": "Navigation", "nav.home": "Home", "nav.cta": "The Course"}

def bi(ar, en, tag="span", cls=""):
    """Bilingual inline text: both in the HTML, CSS shows the active one."""
    c = f' class="{cls}"' if cls else ""
    return f'<{tag}{c}><span class="l-ar">{ar}</span><span class="l-en" lang="en" dir="ltr">{en}</span></{tag}>'

def card(p, pre, big=False):
    url = f'{pre}blog/{p["slug"]}/'
    cover = f'<span class="bl-card__img"><img src="{pre}{esc(p["cover"])}" alt="" loading="lazy"></span>' if p.get("cover") else ""
    draft = '<span class="bl-draft">مسودة · معاينة فقط</span>' if p["draft"] else ""
    return f'''<article class="bl-card{' bl-card--big' if big else ''}{' has-img' if p.get('cover') else ''}" data-cat="{esc(p['category_ar'])}">
  <a class="bl-card__link" href="{url}">{cover}<span class="bl-card__body">{draft}
    <span class="bl-meta">{bi(esc(p['category_ar']), esc(p['category_en']), cls='bl-meta__cat')}<span aria-hidden="true">·</span>{bi(date_ar(p['d']), date_en(p['d']), 'time')}<span aria-hidden="true">·</span>{bi(f"{p['min_ar']} دقائق قراءة" if p['min_ar'] > 2 else f"{p['min_ar']} دقيقة قراءة", f"{p['min_en']} min read")}</span>
    {bi(esc(p['title_ar']), esc(p['title_en']), 'h3' if not big else 'h2', 'bl-card__t')}
    {bi(esc(p['desc_ar']), esc(p['desc_en']), 'p', 'bl-card__d')}
    <span class="go">{bi('اقرأ المقال', 'Read article')}<span class="go__ic" aria-hidden="true"></span></span>
  </span></a>
</article>'''

def build():
    posts = []
    if os.path.isdir(POSTS_DIR):
        for f in sorted(os.listdir(POSTS_DIR)):
            if f.endswith(".md"):
                p = parse(os.path.join(POSTS_DIR, f))
                if p["draft"] and not DRAFTS: continue
                p["ar_html"], p["ar_toc"] = md(p["ar_md"])
                p["en_html"], p["en_toc"] = md(p["en_md"]) if p["en_md"] else (p["ar_html"], p["ar_toc"])
                p["has_en"] = bool(p["en_md"])
                p["min_ar"], p["min_en"] = minutes(p["ar_html"]), minutes(p["en_html"])
                posts.append(p)
    posts.sort(key=lambda p: p["d"], reverse=True)
    blog_dir = os.path.join(ROOT, "blog")
    # remove stale generated post folders
    keep = {p["slug"] for p in posts} | {"_posts"}
    for d in os.listdir(blog_dir):
        full = os.path.join(blog_dir, d)
        if os.path.isdir(full) and d not in keep and os.path.exists(os.path.join(full, "index.html")):
            os.remove(os.path.join(full, "index.html")); os.rmdir(full)

    # ---------- posts ----------
    for i, p in enumerate(posts):
        pre = "../../"
        url = f'{SITE}/blog/{p["slug"]}/'
        cta = CTAS.get(p["cta"])
        related = [q for q in posts if q is not p and q["category_ar"] == p["category_ar"]][:2]
        related += [q for q in posts if q is not p and q not in related][: 2 - len(related)]
        img = f'{SITE}/{p["cover"]}' if p.get("cover") else None
        ld = {"@context": "https://schema.org", "@type": "BlogPosting", "headline": p["title_ar"], "description": p["desc_ar"],
              "datePublished": p["date"], "dateModified": p.get("updated", p["date"]), "inLanguage": "ar",
              "author": {"@type": "Person", "name": "Mohamed Sherif", "url": SITE + "/"},
              "publisher": {"@type": "Person", "name": "Mohamed Sherif"}, "mainEntityOfPage": url}
        if img: ld["image"] = img
        crumbs = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "الرئيسية", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "المدونة", "item": SITE + "/blog/"},
            {"@type": "ListItem", "position": 3, "name": p["title_ar"], "item": url}]}
        extra = f'\n  <meta property="article:published_time" content="{p["date"]}">\n  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>\n  <script type="application/ld+json">{json.dumps(crumbs, ensure_ascii=False)}</script>'
        if p["draft"]: extra += '\n  <meta name="robots" content="noindex">'
        h = head(f'{p["title_ar"]} — محمد شريف', p["desc_ar"], url, pre, "article", img, extra)
        cover = f'<figure class="bl-cover"><img src="{pre}{esc(p["cover"])}" alt="{esc(p["title_ar"])}"></figure>' if p.get("cover") else ""
        only_ar = "" if p["has_en"] else '<p class="bl-note l-en" lang="en" dir="ltr">This article is available in Arabic only for now.</p>'
        share_txt = esc(p["title_ar"])
        cta_html = ""
        if cta:
            cta_html = f'''<aside class="bl-cta">
      <div>{bi(cta['ar'][0], cta['en'][0], 'p', 'bl-cta__t')}{bi(cta['ar'][1], cta['en'][1], 'p', 'bl-cta__p')}</div>
      <a class="btn btn--primary" href="{pre}{cta['href']}" data-cta="blog_cta_{p['cta']}">{bi(cta['btn'][0], cta['btn'][1])}</a>
    </aside>'''
        rel_html = ""
        if related:
            rel_html = f'''<section class="bl-related" aria-labelledby="rel-t"><div class="bs-wrap">
    <h2 id="rel-t" class="bl-related__t">{bi('مقالات أخرى', 'More articles')}</h2>
    <div class="bl-grid">{''.join(card(q, pre) for q in related)}</div>
  </div></section>'''
        body = f'''{'<p class="bl-draftbar">مسودة للمعاينة فقط — مش منشورة ومش هتظهر في جوجل</p>' if p['draft'] else ''}
<main id="main">
  <article class="bl-post">
    <header class="bl-post__head bs-wrap">
      <a class="bl-back" href="{pre}blog/">{bi('→ المدونة', '← Blog')}</a>
      <p class="bl-meta">{bi(esc(p['category_ar']), esc(p['category_en']), cls='bl-meta__cat')}<span aria-hidden="true">·</span><time datetime="{p['date']}">{bi(date_ar(p['d']), date_en(p['d']))}</time><span aria-hidden="true">·</span>{bi(f"{p['min_ar']} دقائق قراءة" if p['min_ar'] > 2 else f"{p['min_ar']} دقيقة قراءة", f"{p['min_en']} min read")}</p>
      <h1 class="bl-post__t"><span class="l-ar">{esc(p['title_ar'])}</span><span class="l-en" lang="en" dir="ltr">{esc(p['title_en'])}</span></h1>
      {bi(esc(p['desc_ar']), esc(p['desc_en']), 'p', 'bl-post__lead')}
    </header>
    {cover}
    <div class="bl-post__wrap">
      {only_ar}
      <div class="bl-prose l-ar">{toc_html(p['ar_toc'], 'ar')}{p['ar_html']}</div>
      <div class="bl-prose l-en{'' if p['has_en'] else ' bl-prose--ar'}" {'lang="en" dir="ltr"' if p['has_en'] else 'lang="ar" dir="rtl"'}>{toc_html(p['en_toc'], 'en' if p['has_en'] else 'ar')}{p['en_html']}</div>
      <div class="bl-share">
        {bi('شارك المقال', 'Share', 'span', 'bl-share__l')}
        <a href="https://wa.me/?text={share_txt}%20{url}" target="_blank" rel="noopener" data-cta="blog_share_wa">WhatsApp</a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url={url}" target="_blank" rel="noopener" data-cta="blog_share_li">LinkedIn</a>
        <a href="https://x.com/intent/post?url={url}&text={share_txt}" target="_blank" rel="noopener" data-cta="blog_share_x">X</a>
        <button type="button" class="bl-copy" data-url="{url}" data-cta="blog_share_copy">{bi('انسخ الرابط', 'Copy link')}</button>
      </div>
      <div class="bl-author">
        <img src="{pre}assets/images/mohamed-sherif-sm.jpg" alt="" width="64" height="64" loading="lazy">
        <div>{bi('محمد شريف', 'Mohamed Sherif', 'p', 'bl-author__n')}{bi('مصمم هويات بصرية ومحاضر في البراندنج من القاهرة.', 'Brand identity designer and branding educator, Cairo.', 'p', 'bl-author__r')}</div>
      </div>
      {cta_html}
    </div>
  </article>
  {rel_html}
</main>'''
        en = dict(BASE_EN, **{"meta.title": f'{p["title_en"]} — Mohamed Sherif', "meta.desc": p["desc_en"]})
        js = '''
<script>document.addEventListener("click",function(e){var b=e.target.closest(".bl-copy");if(!b)return;try{navigator.clipboard.writeText(b.dataset.url).then(function(){var t=document.querySelector(".toast");if(t){t.textContent=document.documentElement.lang==="en"?"Link copied":"تم نسخ الرابط";t.classList.add("show");setTimeout(function(){t.classList.remove("show")},2000)}})}catch(_){}});</script>'''
        os.makedirs(os.path.join(blog_dir, p["slug"]), exist_ok=True)
        open(os.path.join(blog_dir, p["slug"], "index.html"), "w", encoding="utf-8").write(h + body + foot(pre, en, js))

    # ---------- index ----------
    pre = "../"
    cats = []
    for p in posts:
        if p["category_ar"] and p["category_ar"] not in [c[0] for c in cats]: cats.append((p["category_ar"], p["category_en"]))
    chips = ""
    if len(cats) > 1:
        chips = '<div class="bl-chips" role="group" aria-label="التصنيفات">' + bi('الكل', 'All', 'button', 'bl-chip is-on').replace('<button class="bl-chip is-on">', '<button type="button" class="bl-chip is-on" data-f="">') + "".join(
            bi(esc(a), esc(e), 'button', 'bl-chip').replace('<button class="bl-chip">', f'<button type="button" class="bl-chip" data-f="{esc(a)}">') for a, e in cats) + "</div>"
    if posts:
        listing = card(posts[0], pre, big=True) + (f'<div class="bl-grid">{"".join(card(p, pre) for p in posts[1:])}</div>' if len(posts) > 1 else "")
    else:
        listing = f'<p class="bl-empty">{bi("أول مقال قريب.", "First article coming soon.")}</p>'
    h = head("المدونة — محمد شريف", "مقالات تعليمية عن تصميم الهوية البصرية والبراندنج من محمد شريف: أفكار، أدوات، وأخطاء شائعة وطريقة تجنبها.", f"{SITE}/blog/", pre)
    body = f'''<header class="bs-hero bl-hero" id="top">
  <div class="bs-wrap">
    <p class="bs-kicker caps" lang="en" dir="ltr">Blog</p>
    <h1 class="bs-hero__name" lang="en" dir="ltr">Notes on Branding.</h1>
    <p class="bs-hero__lead" data-i18n="hero.lead">مقالات تعليمية عن تصميم الهوية البصرية والبراندنج: أفكار، أدوات، وأخطاء شائعة وطريقة تجنبها.</p>
  </div>
</header>
<main id="main">
  <section class="bs-sec bl-list" aria-label="المقالات" data-i18n-attr="aria-label:list.label">
    <div class="bs-wrap">{chips}{listing}</div>
  </section>
</main>'''
    en = dict(BASE_EN, **{"meta.title": "Blog — Mohamed Sherif", "meta.desc": "Articles on visual identity design and branding by Mohamed Sherif: ideas, tools, and common mistakes and how to avoid them.",
                          "hero.lead": "Articles on visual identity design and branding: ideas, tools, and common mistakes and how to avoid them.", "list.label": "Articles"})
    js = '''
<script>document.addEventListener("click",function(e){var c=e.target.closest(".bl-chip");if(!c)return;document.querySelectorAll(".bl-chip").forEach(function(x){x.classList.toggle("is-on",x===c)});var f=c.dataset.f;document.querySelectorAll(".bl-list .bl-card").forEach(function(a){a.hidden=!!f&&a.dataset.cat!==f})});</script>'''
    open(os.path.join(blog_dir, "index.html"), "w", encoding="utf-8").write(h + body + foot(pre, en, js))

    # ---------- sitemap / robots / feed ----------
    live = [p for p in posts if not p["draft"]]
    today = datetime.date.today().isoformat()
    urls = [(f"{SITE}/{u}", today) for u in STATIC_PAGES] + [(f'{SITE}/blog/{p["slug"]}/', p.get("updated", p["date"])) for p in live]
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"  <url><loc>{u}</loc><lastmod>{d}</lastmod></url>\n" for u, d in urls) + "</urlset>\n"
    open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write(sm)
    open(os.path.join(ROOT, "robots.txt"), "w", encoding="utf-8").write(f"User-agent: *\nAllow: /\nDisallow: /blog/_posts/\nDisallow: /tools/\n\nSitemap: {SITE}/sitemap.xml\n")
    items = "".join(f'''  <item><title>{esc(p["title_ar"])}</title><link>{SITE}/blog/{p["slug"]}/</link><guid>{SITE}/blog/{p["slug"]}/</guid><pubDate>{datetime.datetime.combine(p["d"], datetime.time(9)).strftime("%a, %d %b %Y %H:%M:%S +0200")}</pubDate><description>{esc(p["desc_ar"])}</description></item>\n''' for p in live)
    feed = f'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n  <title>محمد شريف — المدونة</title><link>{SITE}/blog/</link><description>مقالات عن تصميم الهوية البصرية والبراندنج</description><language>ar</language>\n{items}</channel></rss>\n'
    open(os.path.join(ROOT, "feed.xml"), "w", encoding="utf-8").write(feed)
    print(f"built {len(posts)} post(s){' incl. drafts' if DRAFTS else ''}")

if __name__ == "__main__":
    build()
