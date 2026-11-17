/* Renders course cards, the pathway map, the course detail sheet and the credential map
   from data/courses.js (window.PROGRAM). */
(function () {
  "use strict";
  var P = window.PROGRAM;
  if (!P) return;
  var byId = {};
  P.courses.forEach(function (c) { byId[c.id] = c; });

  function esc(s) { return String(s).replace(/[&<>"']/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; }); }
  function trackName(t) { return P.tracks[t] ? P.tracks[t].name : t; }

  /* ---------- home: pathway cards ---------- */
  document.querySelectorAll("[data-path-list]").forEach(function (ul) {
    var t = ul.getAttribute("data-path-list");
    ul.innerHTML = P.courses.filter(function (c) { return c.track === t; }).map(function (c) {
      return "<li><span>" + esc(c.name) + "</span>" + (c.entry ? '<span class="lvl">START HERE</span>' : "") + "</li>";
    }).join("");
  });

  /* ---------- courses page: grid + filters ---------- */
  var grid = document.getElementById("course-grid");
  var sheet = document.getElementById("course-sheet");

  function card(c) {
    var accTag = c.acc ? '<span class="tag tag--acc">ACC ' + esc(c.acc.code) + "</span>" : "";
    var tags = c.tags.filter(function (t) { return t !== "Level 1"; }).slice(0, 3).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("");
    return '<button class="course reveal" type="button" data-track="' + c.track + '" data-id="' + c.id + '" aria-haspopup="dialog">' +
      '<div class="course__top"><span class="course__track">' + esc(trackName(c.track)) + "</span>" + (c.entry ? '<span class="badge-entry">LEVEL 1 · ENTRY</span>' : "") + "</div>" +
      "<h3>" + esc(c.name) + "</h3><p>" + esc(c.tagline) + "</p>" +
      '<div class="tags">' + accTag + tags + "</div>" +
      '<span class="course__more">Details →</span></button>';
  }

  function applyFilter(f) {
    if (!grid) return;
    var list = P.courses.filter(function (c) {
      if (f === "all") return true;
      if (f === "entry") return c.entry;
      return c.track === f;
    });
    grid.innerHTML = list.length ? list.map(card).join("") : '<p class="empty">No courses match that filter.</p>';
    document.querySelectorAll("[data-filter]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === f)); });
  }

  function openCourse(id, opener) {
    var c = byId[id]; if (!c || !sheet) return;
    var color = { cs: "var(--teal)", cyber: "var(--pink)", ai: "var(--yellow)", is: "var(--fg)" }[c.track];
    var rows = "";
    rows += "<dt>Pathway</dt><dd>" + esc(trackName(c.track)) + (c.entry ? " · Level 1 entry course" : "") + "</dd>";
    rows += "<dt>Course tags</dt><dd>" + c.tags.map(esc).join(" · ") + "</dd>";
    if (c.prereq) rows += "<dt>Prerequisite</dt><dd>" + esc(c.prereq) + "</dd>";
    rows += "<dt>ACC college credit</dt><dd>" + (c.acc ? '<span class="mono c-teal">' + esc(c.acc.code) + "</span> · " + esc(c.acc.title) + (c.acc.shared ? " (shared)" : "") : '<span class="dash">—</span>') + "</dd>";
    rows += "<dt>Certification prep</dt><dd>" + (c.certs.length ? c.certs.map(esc).join(" · ") : '<span class="dash">—</span>') + "</dd>";
    var inside = c.inside && c.inside.length ? '<div class="stack"><span class="eyebrow">Inside the course</span><ul class="checks">' + c.inside.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul></div>" : "";
    var note = c.note ? '<div class="note-box"><b>Good to know</b>' + esc(c.note) + "</div>" : "";
    sheet.querySelector(".sheet__head").innerHTML =
      '<div class="stack" style="gap:8px"><span class="eyebrow" style="color:' + color + '">' + esc(trackName(c.track)) + "</span><h2 id=\"sheet-title\" style=\"font-size:var(--step-2)\">" + esc(c.name) + '</h2><p class="lede" style="font-size:1.05rem">' + esc(c.tagline) + "</p></div>" +
      '<button class="sheet__close" type="button" aria-label="Close">×</button>';
    sheet.querySelector(".sheet__body").innerHTML = inside + '<dl class="kv">' + rows + "</dl>" + note +
      '<div class="btn-row"><a class="btn btn--pink" href="' + P.links.registration + '" target="_blank" rel="noopener">Course registration <span class="arrow">→</span></a><a class="btn btn--ghost" href="credentials.html#' + c.id + '">See the credential map</a></div>';
    sheet.querySelector(".sheet__close").addEventListener("click", function () { sheet.close(); });
    sheet._opener = opener || null;
    if (typeof sheet.showModal === "function") sheet.showModal(); else sheet.setAttribute("open", "");
  }

  if (grid) {
    var start = (location.hash || "").replace("#", "");
    var filters = ["all", "cs", "cyber", "ai", "entry", "is"];
    applyFilter(filters.indexOf(start) > -1 ? start : "all");
    document.querySelectorAll("[data-filter]").forEach(function (b) {
      b.addEventListener("click", function () { applyFilter(b.getAttribute("data-filter")); });
    });
    grid.addEventListener("click", function (e) {
      var b = e.target.closest(".course"); if (b) openCourse(b.getAttribute("data-id"), b);
    });
    if (byId[start]) openCourse(start);
    window.addEventListener("hashchange", function () {
      var h = location.hash.replace("#", "");
      if (filters.indexOf(h) > -1) applyFilter(h); else if (byId[h]) openCourse(h);
    });
  }
  if (sheet) {
    sheet.addEventListener("click", function (e) { if (e.target === sheet) sheet.close(); });
    sheet.addEventListener("close", function () { if (sheet._opener) sheet._opener.focus(); });
  }

  /* ---------- pathway map ---------- */
  var map = document.getElementById("pathway-map");
  if (map) {
    var colorVar = { cs: "var(--teal)", cyber: "var(--pink)", ai: "var(--yellow)" };
    var html = '<div class="map__h"></div><div class="map__h">Start here · Level 1 entry</div><div class="map__h">Go further</div>';
    ["cs", "cyber", "ai"].forEach(function (t) {
      var tr = P.courses.filter(function (c) { return c.track === t; });
      var first = tr.filter(function (c) { return c.entry; });
      var next = tr.filter(function (c) { return !c.entry; });
      function links(list) { return list.map(function (c) { return '<a href="#' + c.id + '" style="--c:' + colorVar[t] + '">' + esc(c.name) + "</a>"; }).join(""); }
      html += '<div class="map__track" data-c="' + P.tracks[t].color + '">' + esc(P.tracks[t].name) + "</div>";
      html += first.length ? '<div class="map__cell">' + links(first) + "</div>"
        : '<div class="map__cell map__cell--empty"><span>No entry course required. Helpful prep: <a href="#systems" style="--c:var(--teal);display:inline;padding:0;background:none;border:0">Computer Systems</a> (not a prerequisite)</span></div>';
      html += '<div class="map__cell">' + links(next) + "</div>";
    });
    map.innerHTML = html;
    map.addEventListener("click", function (e) {
      var a = e.target.closest("a[href^='#']"); if (!a) return;
      var id = a.getAttribute("href").slice(1); if (byId[id]) { e.preventDefault(); openCourse(id, a); }
    });
  }

  /* ---------- credential map ---------- */
  var tbody = document.getElementById("cred-body");
  var chipsEl = document.getElementById("cred-chips");
  if (tbody) {
    var dotColor = { cs: "var(--teal)", cyber: "var(--pink)", ai: "var(--yellow)", is: "var(--fg)" };
    tbody.innerHTML = P.courses.map(function (c) {
      return '<tr id="row-' + c.id + '" data-certs="' + esc(c.certs.join("|")) + '" data-acc="' + (c.acc ? "1" : "") + '">' +
        '<td><span class="dot" style="background:' + dotColor[c.track] + '"></span><a href="courses.html#' + c.id + '">' + esc(c.name) + "</a></td>" +
        "<td>" + (c.acc ? '<span class="acc-code">' + esc(c.acc.code) + "</span> · " + esc(c.acc.title) + (c.acc.shared ? " (shared)" : "") : '<span class="dash">—</span>') + "</td>" +
        "<td>" + (c.certs.length ? c.certs.map(function (x) { return '<span class="cert-pill" data-cert="' + esc(x) + '">' + esc(x) + "</span>"; }).join("") : '<span class="dash">—</span>') + "</td></tr>";
    }).join("");

    var all = [];
    P.courses.forEach(function (c) { c.certs.forEach(function (x) { if (all.indexOf(x) < 0) all.push(x); }); });
    all.sort();
    chipsEl.innerHTML = '<button class="chip" type="button" data-cert="" aria-pressed="true">Show all</button>' +
      '<button class="chip" type="button" data-cert="__acc" data-c="teal" aria-pressed="false">ACC college credit</button>' +
      all.map(function (x) { return '<button class="chip" type="button" data-cert="' + esc(x) + '" data-c="yellow" aria-pressed="false">' + esc(x) + "</button>"; }).join("");
    var status = document.getElementById("cred-status");
    function highlight(cert) {
      var hits = 0;
      tbody.querySelectorAll("tr").forEach(function (tr) {
        var hit = cert === "" ? false : cert === "__acc" ? tr.getAttribute("data-acc") === "1" : tr.getAttribute("data-certs").split("|").indexOf(cert) > -1;
        if (hit) hits++;
        tr.classList.toggle("is-hit", hit);
        tr.classList.toggle("is-dim", cert !== "" && !hit);
        tr.querySelectorAll(".cert-pill").forEach(function (p) { p.classList.toggle("is-hit", p.getAttribute("data-cert") === cert); });
      });
      chipsEl.querySelectorAll(".chip").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cert") === cert)); });
      if (status) status.textContent = cert === "" ? "Showing every course." : (cert === "__acc" ? hits + " courses earn ACC college credit." : hits + (hits === 1 ? " course prepares" : " courses prepare") + " you for " + cert + ".");
    }
    chipsEl.addEventListener("click", function (e) { var b = e.target.closest(".chip"); if (b) highlight(b.getAttribute("data-cert")); });
    var h = (location.hash || "").replace("#", "");
    if (byId[h]) {
      var row = document.getElementById("row-" + h);
      if (row) { row.classList.add("is-hit"); setTimeout(function () { row.scrollIntoView({ block: "center" }); }, 200); }
    }
  }
})();
