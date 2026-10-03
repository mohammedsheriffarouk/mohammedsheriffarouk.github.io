/* =========================================================
   CONFIGURATION — the ONLY place URLs live.
   Change a URL here once; every button using it updates.
   Leave "[ADD …]" values as-is until you have the real link:
   those buttons are shown dimmed and won't navigate.
   ========================================================= */
const LINKS = {
  // Nzmly — commerce, booking, course delivery
  brandSet:    "[ADD NZMLY BRAND-SET URL]",
  mentoring:   "[ADD NZMLY MENTORING URL]",

  // Free intro session (Nzmly free product, Luma, or Calendly)
  freeSession: "[ADD FREE SESSION BOOKING URL]",

  // Upcoming webinar — Luma event page (lu.ma/…)
  webinar:     "[ADD LUMA WEBINAR URL]",

  // "Work With Me" — a Nzmly service page, a Tally inquiry form, or WhatsApp
  workWithMe:  "[ADD WORK WITH ME URL]",

  // Studio & community
  idntik:      "https://www.idntik.com",
  branders:    "[ADD BRANDERS URL]",

  // Portfolio & social
  portfolio:   "https://indd.adobe.com/view/7b41fda5-06d5-430d-9df3-cd05b6c73fb2",
  behance:     "https://www.behance.net/MohamedSherifco",
  instagram:   "https://www.instagram.com/mohamedsherif.co/",
  linkedin:    "https://www.linkedin.com/in/mohamed-sherif-611483202/",
  facebook:    "https://www.facebook.com/mrMohamedSherif",

  // Selected work — one link per project card (Behance project pages)
  project1:    "[ADD PROJECT 1 URL]",
  project2:    "[ADD PROJECT 2 URL]",
  project3:    "[ADD PROJECT 3 URL]",
  project4:    "[ADD PROJECT 4 URL]"
};

const FORM_CONFIG = {
  // Tally share link, e.g. "https://tally.so/r/abc123"
  brandSetInterest: "[ADD TALLY FORM URL]"
};

/* Default language when a visitor arrives for the first time: "ar" or "en" */
const DEFAULT_LANG = "ar";

/* =========================================================
   Below this line: behavior. No need to edit.
   ========================================================= */
(function () {
  "use strict";
  const root = document.documentElement;
  root.classList.add("js");

  /* ---------- Language (AR in HTML, EN in content-en.js) ---------- */
  const DICT_EN = (typeof EN === "object" && EN) || {};
  const UI_AR = { newtab: "(يفتح في نافذة جديدة)", soon: "الرابط سيُضاف قريبًا", toggleTo: "Switch to English" };
  const UI_EN = { toggleTo: "التبديل إلى العربية" };
  const metaDesc = document.querySelector('meta[name="description"]');
  const AR = { "meta.title": document.title, "meta.desc": metaDesc ? metaDesc.content : "" };
  const AR_ATTR = new Map();

  document.querySelectorAll("[data-i18n]").forEach((el) => { AR[el.dataset.i18n] = el.innerHTML; });
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    const pairs = el.dataset.i18nAttr.split(";").map((p) => p.split(":"));
    AR_ATTR.set(el, pairs.map(([attr, key]) => [attr.trim(), key.trim(), el.getAttribute(attr.trim())]));
  });

  let lang = "ar";
  const t = (key) => (lang === "en" ? DICT_EN[key] : (AR[key] !== undefined ? AR[key] : UI_AR[key])) || "";

  const store = {
    get() { try { return localStorage.getItem("ms-lang"); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem("ms-lang", v); } catch (e) {} }
  };

  function setLang(next, save) {
    lang = next === "en" ? "en" : "ar";
    root.lang = lang;
    root.dir = lang === "en" ? "ltr" : "rtl";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const val = lang === "en" ? DICT_EN[key] : AR[key];
      if (val !== undefined) el.innerHTML = val;
    });
    AR_ATTR.forEach((pairs, el) => {
      pairs.forEach(([attr, key, arVal]) => {
        const val = lang === "en" ? DICT_EN[key] : arVal;
        if (val !== undefined && val !== null) el.setAttribute(attr, val);
      });
    });
    document.title = t("meta.title");
    if (metaDesc) metaDesc.content = t("meta.desc");

    const toggleLabel = lang === "en" ? UI_EN.toggleTo : UI_AR.toggleTo;
    document.querySelectorAll("[data-lang-toggle]").forEach((b) => {
      b.setAttribute("aria-label", toggleLabel);
      b.setAttribute("lang", lang === "en" ? "ar" : "en");
    });
    const nt = document.getElementById("newtab-note");
    if (nt) nt.textContent = t("newtab");
    if (save) store.set(lang);
  }

  const urlLang = new URLSearchParams(location.search).get("lang");
  const startLang = urlLang === "en" || urlLang === "ar" ? urlLang : (store.get() || DEFAULT_LANG);

  /* ---------- Toast ---------- */
  const toast = document.querySelector(".toast");
  let toastTimer;
  const say = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  };

  /* ---------- Analytics hook (GA4/GTM dataLayer, Meta Pixel) ---------- */
  const track = (name, extra) => {
    const payload = Object.assign({ event: "cta_click", cta: name, lang }, extra || {});
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
    if (typeof window.fbq === "function") window.fbq("trackCustom", "CTAClick", { cta: name, lang });
  };

  /* ---------- 1. Wire every [data-link] to LINKS ---------- */
  const isReal = (url) => typeof url === "string" && /^(https?:|mailto:|tel:)/i.test(url.trim());
  const note = document.createElement("span");
  note.id = "newtab-note";
  note.hidden = true;
  document.body.appendChild(note);

  document.querySelectorAll("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    const url = LINKS[key];
    if (isReal(url)) {
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener";
      el.setAttribute("aria-describedby", "newtab-note");
    } else {
      el.href = "#";
      el.classList.add("is-placeholder");
      el.setAttribute("aria-disabled", "true");
      el.addEventListener("click", (e) => {
        e.preventDefault();
        say(lang === "en" ? DICT_EN.soon || "Link coming soon" : UI_AR.soon);
        console.warn(`[LINKS] "${key}" is not set yet →`, url);
      });
    }
  });

  /* ---------- 2. Language toggle + CTA tracking ---------- */
  document.querySelectorAll("[data-lang-toggle]").forEach((b) =>
    b.addEventListener("click", () => setLang(lang === "en" ? "ar" : "en", true))
  );
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-cta]");
    if (el) track(el.dataset.cta, { href: el.getAttribute("href") || null });
  });

  /* ---------- 3. Missing images ---------- */
  const onMissing = (img, fn) => {
    if (img.complete && img.naturalWidth === 0) fn();
    else img.addEventListener("error", fn, { once: true });
  };
  // Project cards: show a marked placeholder frame
  document.querySelectorAll(".card__img img").forEach((img) =>
    onMissing(img, () => img.parentElement.classList.add("is-empty"))
  );
  // Feedback: hide missing slots; if ALL are missing, show placeholders instead
  const proof = document.querySelector("[data-proof]");
  if (proof) {
    const items = [...proof.querySelectorAll("li")];
    let missing = 0, settled = 0;
    const done = () => {
      if (++settled < items.length) return;
      if (missing === items.length) proof.classList.add("is-empty");
      else items.forEach((li) => { if (li.dataset.missing) li.remove(); });
    };
    items.forEach((li) => {
      const img = li.querySelector("img");
      img.loading = "eager"; // so we know quickly which files exist
      if (img.complete) { if (img.naturalWidth === 0) { li.dataset.missing = "1"; missing++; } done(); }
      else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", () => { li.dataset.missing = "1"; missing++; done(); }, { once: true });
      }
    });
  }

  /* ---------- 4. Dialogs: interest drawer + feedback zoom ---------- */
  const dialogs = {};
  document.querySelectorAll("dialog").forEach((d) => (dialogs[d.id] = d));
  let lastTrigger = null;

  const loadForm = (dialog) => {
    const slot = dialog.querySelector("[data-form]");
    if (!slot || slot.dataset.loaded) return;
    const url = FORM_CONFIG[slot.dataset.form];
    if (!isReal(url)) return; // keep the marked placeholder
    const embed = url.replace("tally.so/r/", "tally.so/embed/");
    const sep = embed.includes("?") ? "&" : "?";
    const iframe = document.createElement("iframe");
    iframe.src = `${embed}${sep}alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;
    iframe.title = "BRAND-SET interest form";
    iframe.loading = "lazy";
    slot.innerHTML = "";
    slot.appendChild(iframe);
    slot.dataset.loaded = "1";
  };

  const open = (id, trigger) => {
    const d = dialogs[id];
    if (!d) return;
    lastTrigger = trigger || null;
    loadForm(d);
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  };
  const close = (d) => { if (d.close) d.close(); else d.removeAttribute("open"); };

  document.querySelectorAll("[data-open]").forEach((btn) =>
    btn.addEventListener("click", () => open(btn.dataset.open, btn))
  );
  document.querySelectorAll("[data-zoom]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const img = btn.querySelector("img");
      if (!img || img.naturalWidth === 0) return;
      const z = dialogs.zoom.querySelector(".zoom__img");
      z.src = img.currentSrc || img.src;
      z.alt = img.alt;
      track("feedback_zoom");
      open("zoom", btn);
    })
  );
  Object.values(dialogs).forEach((d) => {
    d.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => close(d)));
    d.addEventListener("click", (e) => { if (e.target === d) close(d); }); // backdrop
    d.addEventListener("close", () => {
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus();
    });
  });

  /* ---------- 5. Reveal on scroll + active nav state ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }

  const navLinks = [...document.querySelectorAll(".nav__links a")];
  if ("IntersectionObserver" in window && navLinks.length) {
    const map = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const a = map.get(en.target.id);
        if (a && en.isIntersecting) {
          navLinks.forEach((l) => l.removeAttribute("aria-current"));
          a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- 6. Count-up numbers (data-count) ---------- */
  const fmt = (n) => n.toLocaleString("en-US");
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !reduce) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        co.unobserve(en.target);
        const el = en.target, end = +el.dataset.count, from = +(el.dataset.from || 0);
        const show = (n) => (el.hasAttribute("data-plain") ? String(n) : fmt(n));
        const dur = 1400, t0 = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = show(Math.round(from + (end - from) * eased));
          if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = show(from);
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => co.observe(c));
  }

  /* ---------- Start ---------- */
  setLang(startLang, false);
})();
