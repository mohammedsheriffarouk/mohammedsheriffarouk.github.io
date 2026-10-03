# Mohamed Sherif — Personal Landing Page

One-page personal brand site. Plain HTML / CSS / JS — no framework, no build step.
**The page markets and routes. Nzmly sells, books and delivers.**

```
index.html          ← Arabic copy (default language)
content-en.js       ← English copy (same keys as data-i18n in index.html)
style.css           ← design tokens from the Style Guide (top of file)
script.js           ← LINKS + FORM_CONFIG (top of file) — the only place URLs live
assets/
  icons/            ← logo-red-white.svg, logo-red-black.svg, logo-white.svg, favicon.svg
  images/           ← m-glow.svg (hero glow), og-image.jpg (add), hero.jpg (optional)
  projects/         ← project-1.jpg … project-4.jpg (add)
  testimonials/     ← t-1.jpg … t-6.jpg — student feedback screenshots (add)
```

---

## 1. Replace these before launch

| Where | Placeholder | What to put |
|---|---|---|
| `script.js` → `LINKS.brandSet` | `[ADD NZMLY BRAND-SET URL]` | Nzmly product page for BRAND-SET |
| `script.js` → `LINKS.mentoring` | `[ADD NZMLY MENTORING URL]` | Nzmly session/booking page |
| `script.js` → `LINKS.branders` | `[ADD BRANDERS URL]` | Branders community website or Instagram |
| `script.js` → `LINKS.freeSession` | `[ADD FREE SESSION BOOKING URL]` | Free intro session booking (Nzmly free product, Luma or Calendly) |
| `script.js` → `LINKS.webinar` | `[ADD LUMA WEBINAR URL]` | Luma event page of the next webinar (`https://lu.ma/…`) |
| `index.html` → webinar | `[ADD WEBINAR DATE & TIME]` + title | Date/time; change the title for each new webinar |
| `index.html` → mentoring step 01 | `[15 / 30]` | Session length — replace with one number |
| `assets/testimonials/` | `t-1.jpg … t-6.jpg` | Feedback screenshots (see section 7) |
| `script.js` → `LINKS.workWithMe` | `[ADD WORK WITH ME URL]` | Nzmly service page, Tally inquiry form, or `https://wa.me/20XXXXXXXXXX` |
| `script.js` → `LINKS.project1…4` | `[ADD PROJECT n URL]` | Behance project links |
| `script.js` → `FORM_CONFIG.brandSetInterest` | `[ADD TALLY FORM URL]` | Tally share link (`https://tally.so/r/xxxx`) |
| `index.html` → project cards | `[ADD PROJECT NAME]` + image | Name, category, and `assets/projects/project-n.jpg` (1200×900, ≤250 KB, WebP/JPG) |
| `index.html` → program meta | `[ADD NEXT COHORT DATE]` | Date, or delete that line |
| `index.html` → `<head>` | `[ADD SITE URL]` (canonical, og:url, og:image, twitter:image) | Final URL with trailing slash |
| `assets/images/og-image.jpg` | missing | 1200×630 share image |

Already filled: Behance, Instagram, LinkedIn, Facebook, Portfolio (InDesign link).

Until a link is real, its button is dimmed and shows a short "coming soon" toast instead of navigating — so you can publish safely before every link exists.

---

## 2. How links work (Nzmly + everything else)

Every external button looks like this:

```html
<a class="btn btn--primary" data-link="brandSet" data-cta="brandset">…</a>
```

- `data-link="brandSet"` → `script.js` reads `LINKS.brandSet` and sets the `href`, opens in a new tab.
- Change the URL **once** in `LINKS` → every button with that key updates (hero, nav, footer, etc.).
- No URL is written in the HTML.

Flows:
- **Course:** "انضم إلى BRAND-SET" → `LINKS.brandSet` → Nzmly handles details, payment, access.
- **Mentoring:** "احجز جلسة منتورينج" → `LINKS.mentoring` → Nzmly handles session, time, payment, confirmation.
- **Work With Me:** hero + nav → `LINKS.workWithMe` (point it anywhere).
- **Learn With Me:** scrolls to the BRAND-SET section (internal).

To add a platform: add a key to `LINKS`, then copy one `<li>` in the Connect section and change `data-link`.

---

## 3. Connect the Tally interest form (→ Google Sheets)

1. In Tally, create a form with: Name · Email · WhatsApp · Experience level (Beginner / Intermediate / Professional) · Interested program (BRAND-SET / Mentoring / Other).
2. Integrations → **Google Sheets** → connect. Every submission becomes a row.
3. Publish → copy the share link (`https://tally.so/r/abc123`).
4. Paste it into `FORM_CONFIG.brandSetInterest` in `script.js`.

The drawer then loads the Tally embed automatically (only when opened — no cost to page speed). The visitor never leaves the page. Purchase buttons never pass through this form.

---

## 4. Deploy on GitHub Pages

1. github.com → **New repository** → e.g. `mohamedsherif` (public).
2. **Add file → Upload files** → drag everything inside this folder (`index.html` must be at the root) → Commit.
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch `main`, folder `/ (root)` → Save.
4. Live in ~1 minute at `https://<username>.github.io/<repo>/`.
5. Custom domain (optional): Settings → Pages → Custom domain → add `mohamedsherif.co`; at your DNS provider add 4 `A` records to `185.199.108.153`, `.109.153`, `.110.153`, `.111.153` (or a `CNAME` for `www` → `<username>.github.io`). Tick **Enforce HTTPS**.
6. Update every `[ADD SITE URL]` in `index.html` to the final URL.

Editing later: open a file on GitHub → pencil icon → edit → Commit. The site updates in a minute.

---

## 5. Analytics (ready, not installed)

Every CTA has a `data-cta` name (`hero_work_with_me`, `brandset`, `brandset_interest`, `mentoring`, `portfolio`, `social_instagram`, …).
On click, `script.js` pushes `{event:"cta_click", cta:"…"}` to `window.dataLayer` (GA4 / Tag Manager) and fires `fbq('trackCustom','CTAClick')` if the Meta Pixel exists. Just paste the GA4 or Pixel snippet into `<head>` — nothing else to rebuild.

---

## 6. Design notes

- Tokens follow the Mohamed Sherif Style Guide: Signal Red `#FB2203` (accent only), Fog Grey, Black, White; Burgundy only in blends/footer. EB Garamond caps for Latin, Tajawal for Arabic (never letter-spaced), Roboto for numbers. Square corners, no shadows.
- Hero atmosphere (blurred red M over grainy fog, fading to black) is pure CSS + one tiny SVG. To use a real export instead: save it as `assets/images/hero.jpg` and in `style.css` set `--hero-image:url(assets/images/hero.jpg);`.
- Red is used for the three money CTAs only (Work With Me, Join BRAND-SET, Book a session) — one per section.
- Respects `prefers-reduced-motion`; drawer uses native `<dialog>` (Esc closes, focus returns).

---

## 7. Student feedback (screenshots)

- Save screenshots as `assets/testimonials/t-1.jpg` … `t-6.jpg` (JPG/WebP, ~1080px wide, ≤300 KB each).
- Any missing number is hidden automatically — upload 3 and only 3 show. Need more than 6? Copy one `<li>` in the feedback section and change the number.
- Visitors can tap a screenshot to enlarge it.
- **Before uploading:** get each student's OK, and blur phone numbers, profile photos of other people, and anything private in the chat.

## 8. Webinar (Luma)

Each time you open a new webinar: paste the Luma event link into `LINKS.webinar`, and update the title, description and date in the webinar section of `index.html` (and the English description in `content-en.js` → `web.desc`).
No webinar coming up? Hide the whole section by writing `hidden` in its tag: `<section hidden class="s webinar" id="webinar" …>` and remove the "الويبينار" item from the nav.

## 9. Language switch (Arabic / English)

- Arabic is the default and lives in `index.html`. English lives in `content-en.js`.
- Every translatable element has `data-i18n="key"`; the same key in `content-en.js` holds its English text. Edit text, never keys.
- The visitor's choice is remembered on their device. You can also share a direct English link: `https://your-site/?lang=en` (useful for Gulf / English-speaking clients).
- Want English as the default? In `script.js` set `const DEFAULT_LANG = "en";`.
- Names, section titles and labels in serif capitals stay English in both versions — that's the style guide.

## 10. Motion

- Hero: name rises line by line, then role, line and buttons fade in; the red glow drifts very slowly.
- Every number counts up when it scrolls into view (+860 students, 2016, 2020, 6 lectures). To change one, edit `data-count="…"` in `index.html` and the visible number next to it. Years start counting from `data-from="2000"`.
- Sections fade in gently on scroll.
- Everything turns off automatically for visitors who set "reduce motion" on their device.
