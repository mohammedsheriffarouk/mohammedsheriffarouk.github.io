/* Side drawer — one file, every page. Adds a menu button to the nav and a slide-in panel.
   Edit PAGES / HOME / SOCIAL below to change the menu everywhere at once. */
(function () {
  var me = document.currentScript;
  var ROOT = me ? new URL("../../", me.src).href : "/";
  var u = function (p) { return new URL(p, ROOT).href; };

  var PAGES = [
    { p: "",               ar: "الرئيسية",          en: "Home" },
    { p: "",  h: "#work",  ar: "أعمالي",            en: "Portfolio" },
    { p: "brand-set/",      ar: "كورسات",            en: "Courses" },
    { p: "mentoring/",      ar: "جلسة منتورينج",     en: "Mentoring Session" },
    { p: "workshops/",      ar: "الورش المجانية",    en: "Free Workshops" },
    { p: "mockup-builder/", ar: "منتجات رقمية",      en: "Digital Products" }
  ];
  var HOME = [
    { h: "#work",     ar: "الأعمال",      en: "Selected Work" },
    { h: "#about",    ar: "عنّي",         en: "About" },
    { h: "#services", ar: "الخدمات",      en: "Services" },
    { h: "#feedback", ar: "آراء الطلاب",  en: "Student Feedback" },
    { h: "#contact",  ar: "تواصل",        en: "Contact" }
  ];
  var SOCIAL = [["instagram", "Instagram", "https://www.instagram.com/mohamedsherif.co/"], ["behance", "Behance", "https://www.behance.net/MohamedSherifco"], ["linkedin", "LinkedIn", "https://www.linkedin.com/in/mohamed-sherif-611483202/"], ["facebook", "Facebook", "https://www.facebook.com/mrMohamedSherif"]];
  var T = { menu: ["القائمة", "Menu"], close: ["إغلاق", "Close"], pages: ["الصفحات", "Pages"], home: ["في الصفحة الرئيسية", "On the home page"], nav: ["قائمة الموقع", "Site menu"], soc: ["السوشيال", "Socials"] };

  var langRoot = function () { return document.getElementById("app") || document.documentElement; };
  var isEn = function () { return langRoot().lang === "en" || document.documentElement.lang === "en"; };
  var t = function (k) { return T[k][isEn() ? 1 : 0]; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var css = ".dr-btn{display:inline-flex;align-items:center;justify-content:center;flex:none;width:40px;height:40px;padding:0;border:0;background:none;color:inherit;cursor:pointer}" +
    ".dr-btn i{display:block;width:18px;height:8px;border-block:1.5px solid currentColor}" +
    ".dr-btn:focus-visible,.dr-x:focus-visible,.dr a:focus-visible{outline:2px solid #FB2203;outline-offset:2px}" +
    ".dr-ov{position:fixed;inset:0;z-index:69;background:rgba(0,0,0,.3);opacity:0;visibility:hidden;transition:opacity .35s ease-in-out,visibility .35s}" +
    ".dr{position:fixed;inset-block:0;inset-inline-end:0;z-index:70;width:min(640px,100vw);display:flex;flex-direction:column;background:#EAEAE7;color:#111;padding:88px clamp(24px,5vw,44px) 32px;overflow-y:auto;visibility:hidden;transition:transform .35s cubic-bezier(.22,1,.36,1),visibility .35s;font-family:'Noto Sans Arabic','Noto Sans',system-ui,sans-serif;line-height:1.1}" +
    ".dr{--dt:48px;--dbody:17px;--dsmall:14px}@media (max-width:1068px){.dr{--dt:40px}}@media (max-width:734px){.dr{--dt:32px}}" +
    ".dr[dir=rtl]{transform:translateX(-100%)}.dr[dir=ltr]{transform:translateX(100%)}" +
    "body.dr-open .dr{transform:none;visibility:visible;transition-duration:.4s}body.dr-open .dr-ov{opacity:1;visibility:visible;transition-duration:.4s}body.dr-open{overflow:hidden}" +
    ".dr ol li,.dr-sub,.dr-lab,.dr-soc{opacity:0;transform:translateY(12px);filter:blur(3px);transition:opacity .15s ease-in-out,transform .15s cubic-bezier(.22,1,.36,1),filter .15s ease-in-out}" +
    "body.dr-open .dr ol li,body.dr-open .dr-sub,body.dr-open .dr-lab,body.dr-open .dr-soc{opacity:1;transform:none;filter:none;transition-duration:.5s;transition-delay:calc(120ms + var(--i,0) * 40ms)}" +
    ".dr-x{position:absolute;top:0;inset-inline-end:0;display:inline-flex;align-items:center;gap:14px;height:64px;padding:0 28px;border:0;border-inline-start:1px solid #d6d6d2;border-bottom:1px solid #d6d6d2;background:#EAEAE7;color:#111;font:inherit;font-size:var(--dbody);line-height:1;cursor:pointer}" +
    ".dr-x b{font-weight:300;font-size:26px;color:#b9b9b4;line-height:1}.dr-x:hover b{color:#FB2203}" +
    ".dr ol{list-style:none;margin:0;padding:0}" +
    ".dr ol a{display:inline-block;color:#111;text-decoration:none;font-size:var(--dt);font-weight:300;line-height:1.1;padding-block:.14em;text-transform:uppercase;letter-spacing:-.003em;transition:color .2s}" +
    ".dr ol a:hover,.dr ol a[aria-current]{color:#FB2203}" +
    ".dr-sub{margin-top:36px;display:flex;flex-wrap:wrap;gap:6px 22px}.dr-sub a{font-size:var(--dbody);color:#424245;text-decoration:none}.dr-sub a:hover{color:#FB2203}" +
    ".dr-lab{margin:auto 0 14px;padding-top:40px;font-size:var(--dsmall);font-weight:600;color:#FB2203}" +
    ".dr-soc{display:flex;flex-wrap:wrap;gap:10px 28px;direction:ltr}" +
    ".dr-soc a{font-size:var(--dbody);color:#111;text-decoration:none}.dr-soc a:hover{color:#FB2203}" +
    "@media (prefers-reduced-motion:reduce){.dr,.dr-ov{transition:none}.dr ol li,.dr-sub,.dr-lab,.dr-soc{transition:none;transform:none;filter:none}}@media print{.dr,.dr-ov,.dr-btn{display:none}}";

  function init() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

    // retire the old full-screen phone menu on the home page
    var oldM = document.getElementById("menu"); if (oldM) oldM.remove();
    var oldB = document.querySelector(".nav__menu"); if (oldB) oldB.remove();

    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "dr-btn"; btn.setAttribute("aria-controls", "site-drawer"); btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("data-cta", "nav_drawer"); btn.innerHTML = "<i aria-hidden=\"true\"></i>";
    var host = document.querySelector(".nav__end") || document.querySelector(".nav .col") || document.querySelector(".nav");
    if (!host) return;
    host.appendChild(btn);

    var ov = document.createElement("div"); ov.className = "dr-ov";
    var dr = document.createElement("aside"); dr.className = "dr"; dr.id = "site-drawer"; dr.setAttribute("role", "dialog"); dr.setAttribute("aria-modal", "true");
    document.body.appendChild(ov); document.body.appendChild(dr);

    var here = location.pathname.replace(/index\.html$/, "");
    var getLinks = function () { return (typeof LINKS === "object" && LINKS) || {}; };
    function build() {
      var en = isEn(), L = getLinks();
      dr.dir = en ? "ltr" : "rtl"; dr.lang = en ? "en" : "ar";
      dr.setAttribute("aria-label", t("nav"));
      btn.setAttribute("aria-label", t("menu"));
      var pages = PAGES.map(function (x, i) {
        var href = u(x.p) + (x.h || ""), cur = !x.h && new URL(href).pathname === here ? " aria-current=\"page\"" : "";
        return "<li style=\"--i:" + i + "\"><a href=\"" + href + "\"" + cur + "" + " data-cta=\"drawer_" + (x.p.replace(/\//g, "") || (x.h ? "portfolio" : "home")) + "\">" + esc(en ? x.en : x.ar) + "</a></li>";
      }).join("");
      var home = HOME.map(function (x) { return "<a href=\"" + u("") + x.h + "\">" + esc(en ? x.en : x.ar) + "</a>"; }).join("");
      var soc = SOCIAL.map(function (s) { return "<a href=\"" + esc(L[s[0]] || s[2]) + "\" target=\"_blank\" rel=\"noopener\">" + s[1] + "</a>"; }).join("");
      dr.innerHTML = "<button type=\"button\" class=\"dr-x\">" + t("close") + " <b aria-hidden=\"true\">×</b></button>" +
        "<ol>" + pages + "</ol><nav class=\"dr-sub\" style=\"--i:" + PAGES.length + "\" aria-label=\"" + t("home") + "\">" + home + "</nav><p class=\"dr-lab\" style=\"--i:" + (PAGES.length + 1) + "\">" + t("soc") + "</p><div class=\"dr-soc\" style=\"--i:" + (PAGES.length + 2) + "\">" + soc + "</div>";
      dr.querySelector(".dr-x").addEventListener("click", function () { set(false); });
      dr.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { if (a.target !== "_blank") set(false); }); });
    }
    function set(open) {
      document.body.classList.toggle("dr-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) { var x = dr.querySelector(".dr-x"); if (x) x.focus(); } else { btn.focus({ preventScroll: true }); }
    }
    btn.addEventListener("click", function () { set(!document.body.classList.contains("dr-open")); });
    ov.addEventListener("click", function () { set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("dr-open")) set(false); });
    build();
    var mo = new MutationObserver(build);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    var app = document.getElementById("app"); if (app) mo.observe(app, { attributes: true, attributeFilter: ["lang"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
