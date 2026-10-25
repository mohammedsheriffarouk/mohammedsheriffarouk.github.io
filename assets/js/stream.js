/* Mockup Builder: the generated prompt resolves word by word (big changes only). */
(function () {
  var o = document.getElementById("s-out");
  if (!o || !window.MutationObserver || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var st = document.createElement("style");
  st.textContent = ".t-w{animation:t-w .4s ease-in-out both}@keyframes t-w{from{opacity:0;filter:blur(2px)}to{opacity:1;filter:none}}";
  document.head.appendChild(st);
  var last = o.textContent;
  new MutationObserver(function () {
    var t = o.textContent;
    if (t === last) return;
    var big = Math.abs(t.length - last.length) > 12 || t.slice(0, 40) !== last.slice(0, 40);
    last = t;
    if (!big) return;
    var f = document.createDocumentFragment(), n = 0;
    t.split(/(\s+)/).forEach(function (p) {
      if (!p) return;
      if (/^\s+$/.test(p)) { f.appendChild(document.createTextNode(p)); return; }
      var s = document.createElement("span"); s.className = "t-w"; s.textContent = p;
      s.style.animationDelay = Math.min(n++ * 12, 700) + "ms"; f.appendChild(s);
    });
    o.textContent = ""; o.appendChild(f);
  }).observe(o, { childList: true, characterData: true, subtree: true });
})();
