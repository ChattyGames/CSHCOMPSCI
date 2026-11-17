/* Student showcase: reads data/showcase.json and renders cards, filters, search and a player.
   To add work, edit data/showcase.json only (see README). */
(function () {
  "use strict";
  var grid = document.getElementById("show-grid");
  var featured = document.getElementById("show-featured");
  if (!grid && !featured) return;

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; }); }
  function safeUrl(u) {
    u = String(u || "").trim();
    if (!u) return "";
    if (/^https:\/\//i.test(u)) return u;
    if (/^[a-z0-9_\-./]+$/i.test(u) && u.indexOf("..") < 0) return u; // local path inside the site
    return "";
  }
  var typeLabel = { game: "Game", project: "Project", material: "Material" };

  function card(it) {
    var thumb = safeUrl(it.thumbnail);
    var play = safeUrl(it.play), link = safeUrl(it.link);
    var actions = "";
    var playLabel = (it.type === "game" ? "Play" : "Open") + ' <span class="arrow">▶</span>';
    if (play && player) actions += '<button class="btn btn--pink" type="button" data-play="' + esc(it.id) + '">' + playLabel + "</button>";
    else if (play) actions += '<a class="btn btn--pink" href="showcase.html#play-' + esc(it.id) + '">' + playLabel + "</a>"; // no player on this page
    if (link) actions += '<a class="btn btn--ghost" href="' + esc(link) + '" target="_blank" rel="noopener">' + (it.type === "material" ? "Open material" : "View") + " ↗</a>";
    if (!play && !link) actions += '<span class="btn btn--ghost" aria-disabled="true">Coming soon</span>';
    return '<article class="show reveal" data-type="' + esc(it.type) + '">' +
      '<div class="show__thumb">' + (thumb ? '<img src="' + esc(thumb) + '" alt="" loading="lazy" width="640" height="400">' : "") +
      '<span class="show__type" data-type="' + esc(it.type) + '">' + esc(typeLabel[it.type] || it.type) + "</span>" +
      (it.sample ? '<span class="show__sample">Sample</span>' : "") + "</div>" +
      '<div class="show__body"><span class="show__meta">' + esc(it.course) + (it.date ? " · " + esc(it.date) : "") + (it.credit ? " · " + esc(it.credit) : "") + "</span>" +
      "<h3>" + esc(it.title) + "</h3><p>" + esc(it.description) + "</p>" +
      (it.tags && it.tags.length ? '<div class="tags">' + it.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" : "") +
      '<div class="show__actions">' + actions + "</div></div></article>";
  }

  var items = [];
  var state = { type: "all", course: "all", q: "" };

  function render() {
    if (!grid) return;
    var q = state.q.toLowerCase();
    var list = items.filter(function (it) {
      if (state.type !== "all" && it.type !== state.type) return false;
      if (state.course !== "all" && it.course !== state.course) return false;
      if (q && (it.title + " " + it.description + " " + it.course + " " + (it.tags || []).join(" ")).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    grid.innerHTML = list.length ? list.map(card).join("") : '<p class="empty">Nothing matches yet. Try another filter.</p>';
    var count = document.getElementById("show-count");
    if (count) count.textContent = list.length + (list.length === 1 ? " item" : " items");
  }

  var player = document.getElementById("player");
  function openPlayer(id) {
    var it = items.filter(function (x) { return x.id === id; })[0];
    if (!it || !player) return;
    var src = safeUrl(it.play); if (!src) return;
    player.querySelector(".player__title").textContent = it.title;
    var frame = player.querySelector("iframe");
    frame.src = src;
    var newtab = player.querySelector("[data-newtab]");
    if (newtab) newtab.href = src;
    if (typeof player.showModal === "function") player.showModal(); else player.setAttribute("open", "");
    frame.focus();
  }
  if (player) {
    player.addEventListener("close", function () { player.querySelector("iframe").src = "about:blank"; });
    player.querySelector("[data-close]").addEventListener("click", function () { player.close(); });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-play]"); if (b) openPlayer(b.getAttribute("data-play"));
  });

  fetch("data/showcase.json", { cache: "no-cache" }).then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).then(function (data) {
    items = (data.items || []).filter(function (it) { return it && it.title && it.type; }).map(function (it, i) { if (!it.id) it.id = "item-" + i; return it; });
    if (featured) {
      // the home page already has Chatty Arcade in its own section, so skip it here
      var onHomeArcade = !!document.querySelector("[data-arcade]");
      var f = items.filter(function (it) { return it.featured && !(onHomeArcade && it.id === "chatty-arcade"); }).slice(0, 3);
      featured.innerHTML = (f.length ? f : items.slice(0, 3)).map(card).join("");
    }
    if (grid) {
      var courses = [];
      items.forEach(function (it) { if (courses.indexOf(it.course) < 0) courses.push(it.course); });
      var sel = document.getElementById("show-course");
      if (sel) {
        sel.innerHTML = '<option value="all">All courses</option>' + courses.sort().map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + "</option>"; }).join("");
        sel.addEventListener("change", function () { state.course = sel.value; render(); });
      }
      document.querySelectorAll("[data-type-filter]").forEach(function (b) {
        b.addEventListener("click", function () {
          state.type = b.getAttribute("data-type-filter");
          document.querySelectorAll("[data-type-filter]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          render();
        });
      });
      var input = document.getElementById("show-search");
      if (input) input.addEventListener("input", function () { state.q = input.value; render(); });
      render();
      var deep = (location.hash || "").match(/^#play-(.+)$/);
      if (deep) openPlayer(decodeURIComponent(deep[1]));
    }
  }).catch(function () {
    var msg = '<p class="empty">The showcase list could not load. If you opened this file straight from your computer, run a local server (see README) or view the deployed site.</p>';
    if (grid) grid.innerHTML = msg;
    if (featured) featured.innerHTML = msg;
  });
})();
