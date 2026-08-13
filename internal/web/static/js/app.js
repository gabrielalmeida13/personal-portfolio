// Two jobs only. Everything else on this page is HTML, CSS, or HTMX.
//
// 1. Keep the record's rotation continuous across polls. The readout fragment
//    is replaced every 15 seconds; if the spinning element were inside it, the
//    swap would restart the animation and the record would visibly jump. So
//    the platter lives outside the swapped region and reads its state from
//    data attributes on the fragment that just arrived.
// 2. Close the expanded panel on Escape.

(function () {
  "use strict";

  function syncTurntable() {
    var readout = document.getElementById("readout");
    var platter = document.getElementById("platter");
    var art = document.getElementById("record-art");
    if (!readout || !platter) return;

    platter.dataset.playing = readout.dataset.playing === "true" ? "true" : "false";

    if (!art) return;
    var next = readout.dataset.art || "";
    if (next && art.getAttribute("src") !== next) {
      art.setAttribute("src", next);
      art.removeAttribute("hidden");
    } else if (!next) {
      art.removeAttribute("src");
      art.setAttribute("hidden", "");
    }
  }

  function overlay() {
    return document.getElementById("overlay");
  }

  function closePanel() {
    var el = overlay();
    if (el && el.innerHTML.trim() !== "") el.innerHTML = "";
    document.body.style.removeProperty("overflow");
  }

  document.body.addEventListener("htmx:afterSwap", function (event) {
    if (event.target && event.target.id === "readout") {
      syncTurntable();
      return;
    }

    if (event.target && event.target.id === "overlay") {
      var open = event.target.innerHTML.trim() !== "";
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        var close = event.target.querySelector(".panel__close");
        if (close) close.focus();
      }
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closePanel();
  });

  syncTurntable();
})();
