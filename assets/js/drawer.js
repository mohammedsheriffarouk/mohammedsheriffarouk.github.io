/* Side drawer — one file, every page. Adds a menu button to the nav and a slide-in panel.
   Edit PAGES / HOME / SOCIAL below to change the menu everywhere at once. */
(function () {
  var me = document.currentScript;
  var ROOT = me ? new URL("../../", me.src).href : "/";
  var u = function (p) { return new URL(p, ROOT).href; };

  var PAGES = [
    { p: "",               ar: "الرئيسية",          en: "Home" },
    { p: "brand-identity/", ar: "الهوية للشركات",    en: "Brand Identity for Companies" },
    { p: "brand-set/",      ar: "BRAND-SET",         en: "BRAND-SET", latin: true },
    { p: "mentoring/",      ar: "One : One Session", en: "One : One Session", latin: true },
    { p: "workshops/",      ar: "الورش المجانية",    en: "Free Workshops" },
    { p: "mockup-builder/", ar: "Mockup Builder",    en: "Mockup Builder", latin: true }
  ];
  var HOME = [
    { h: "#work",     ar: "الأعمال",      en: "Selected Work" },
    { h: "#about",    ar: "عنّي",         en: "About" },
    { h: "#services", ar: "الخدمات",      en: "Services" },
    { h: "#feedback", ar: "آراء الطلاب",  en: "Student Feedback" },
    { h: "#contact",  ar: "تواصل",        en: "Contact" }
  ];
  var SOCIAL = [["instagram", "Instagram", "https://www.instagram.com/mohamedsherif.co/"], ["behance", "Behance", "https://www.behance.net/MohamedSherifco"], ["linkedin", "LinkedIn", "https://www.linkedin.com/in/mohamed-sherif-611483202/"], ["facebook", "Facebook", "https://www.facebook.com/mrMohamedSherif"]];
  var T = { menu: ["القائمة", "Menu"], close: ["إغلاق", "Close"], pages: ["الصفحات", "Pages"], home: ["في الصفحة الرئيسية", "On the home page"], nav: ["قائمة الموقع", "Site menu"] };

  var langRoot = function () { return document.getElementById("app") || document.documentElement; };
  var isEn = function () { return langRoot().lang === "en" || document.documentElement.lang === "en"; };
  var t = function (k) { return T[k][isEn() ? 1 : 0]; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var css = ".dr-btn{display:inline-flex;align-items:center;justify-content:center;flex:none;width:40px;height:40px;padding:0;border:0;background:none;color:inherit;cursor:pointer}" +
    ".dr-btn i{display:block;width:18px;height:8px;border-block:1.5px solid currentColor}" +
    ".dr-btn:focus-visible,.dr-x:focus-visible,.dr a:focus-visible{outline:2px solid #FB2203;outline-offset:2px}" +
    ".dr-ov{position:fixed;inset:0;z-index:69;background:rgba(0,0,0,.5);opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s}" +
    ".dr{position:fixed;inset-block:0;inset-inline-start:0;z-index:70;width:min(380px,88vw);display:flex;flex-direction:column;background:#000;color:#fff;padding:12px 28px 28px;overflow-y:auto;visibility:hidden;transition:transform .35s cubic-bezier(.28,.11,.32,1),visibility .35s;font-family:'Noto Sans Arabic','Noto Sans',system-ui,sans-serif;line-height:1.4}" +
    ".dr[dir=rtl]{transform:translateX(100%)}.dr[dir=ltr]{transform:translateX(-100%)}" +
    "body.dr-open .dr{transform:none;visibility:visible}body.dr-open .dr-ov{opacity:1;visibility:visible}body.dr-open{overflow:hidden}" +
    ".dr-top{display:flex;align-items:center;justify-content:space-between;min-height:52px}" +
    ".dr-x{width:44px;height:44px;border:0;background:none;color:#fff;font-size:30px;line-height:1;cursor:pointer}" +
    ".dr h2{margin:28px 0 6px;font-size:12px;font-weight:600;letter-spacing:.08em;color:rgba(255,255,255,.55);text-transform:none}" +
    ".dr ul{list-style:none;margin:0;padding:0}" +
    ".dr li a{display:block;padding:9px 0;color:#fff;text-decoration:none;font-size:22px;font-weight:600;transition:color .2s}" +
    ".dr li.sm a{font-size:17px;font-weight:400;color:rgba(255,255,255,.85)}" +
    ".dr li a:hover,.dr li a[aria-current]{color:#FB2203}" +
    ".dr-soc{display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:auto;padding-top:36px;direction:ltr}" +
    ".dr-soc a{font-size:14px;color:rgba(255,255,255,.7);text-decoration:none}.dr-soc a:hover{color:#FB2203}" +
    "@media (prefers-reduced-motion:reduce){.dr,.dr-ov{transition:none}}@media print{.dr,.dr-ov,.dr-btn{display:none}}";

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
      var pages = PAGES.map(function (x) {
        var href = u(x.p), cur = new URL(href).pathname === here ? " aria-current=\"page\"" : "";
        return "<li><a href=\"" + href + "\"" + cur + (x.latin ? " dir=\"ltr\"" : "") + " data-cta=\"drawer_" + (x.p.replace(/\//g, "") || "home") + "\">" + esc(en ? x.en : x.ar) + "</a></li>";
      }).join("");
      var home = HOME.map(function (x) { return "<li class=\"sm\"><a href=\"" + u("") + x.h + "\">" + esc(en ? x.en : x.ar) + "</a></li>"; }).join("");
      var soc = SOCIAL.map(function (s) { return "<a href=\"" + esc(L[s[0]] || s[2]) + "\" target=\"_blank\" rel=\"noopener\">" + s[1] + "</a>"; }).join("");
      dr.innerHTML = "<div class=\"dr-top\"><img src=\"" + u("assets/icons/logo-red-white.svg") + "\" alt=\"\" width=\"36\" height=\"25\"><button type=\"button\" class=\"dr-x\" aria-label=\"" + t("close") + "\">×</button></div>" +
        "<h2>" + t("pages") + "</h2><ul>" + pages + "</ul><h2>" + t("home") + "</h2><ul>" + home + "</ul><div class=\"dr-soc\">" + soc + "</div>";
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
