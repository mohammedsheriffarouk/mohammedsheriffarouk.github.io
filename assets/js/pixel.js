/* =========================================================
   META PIXEL — one ID for the whole site (all pages).
   Paste your Pixel ID between the quotes. Empty = no pixel loads.

   Events:
   - PageView on every page
   - ViewContent on pages that set <html data-content="…">
   - Any element with data-pixel="EventName" sends that event on click,
     e.g. data-pixel="InitiateCheckout" (course / session payment),
          data-pixel="Lead" (start-a-project form),
          data-pixel="Schedule" (free intro session booking).
     Value: data-value="1500" on the element, or window.PIXEL_VALUE for the page.
   ========================================================= */
window.META_PIXEL_ID = "";

(function () {
  var id = window.META_PIXEL_ID;
  var root = document.documentElement;
  if (id) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq("init", id);
    window.fbq("track", "PageView");
    if (root.dataset.content) window.fbq("track", "ViewContent", { content_name: root.dataset.content });
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest("[data-pixel]");
    if (!el || typeof window.fbq !== "function") return;
    var params = { content_name: el.dataset.pixelName || root.dataset.content || "Website" };
    var v = el.dataset.value || window.PIXEL_VALUE;
    if (v) { params.value = Number(v); params.currency = "EGP"; }
    window.fbq("track", el.dataset.pixel, params);
  }, true);
})();
