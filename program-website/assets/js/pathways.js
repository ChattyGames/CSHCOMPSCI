/* Pathways page: one track at a time, each course a stop with its prerequisite,
   ACC college credit and certification prep. Reads data/courses.js (window.PROGRAM). */
(function () {
  "use strict";
  var P = window.PROGRAM;
  var route = document.getElementById("route");
  var head = document.getElementById("route-head");
  if (!P || !route) return;
  var byId = {};
  P.courses.forEach(function (c) { byId[c.id] = c; });
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; }); }
  var color = { cs: "var(--teal)", cyber: "var(--pink)", ai: "var(--yellow)", is: "var(--fg)" };
  var tracks = ["cs", "cyber", "ai", "is"];

  function sharedWith(c) {
    if (!c.acc || !c.acc.shared) return "";
    var other = P.courses.filter(function (x) { return x !== c && x.acc && x.acc.code === c.acc.code; })[0];
    return other ? " Shared with " + other.name + "." : "";
  }
  function prereq(c) {
    if (c.prereq) return esc(c.prereq);
    if (c.track === "is") return "Grades 11–12";
    return '<span class="dim">None listed</span>';
  }
  function stop(c) {
    var isAP = /^AP /.test(c.name);
    var acc = c.acc
      ? '<span class="ok">Approved</span> <span class="mono">' + esc(c.acc.code) + "</span> " + esc(c.acc.title) + "." + esc(sharedWith(c))
      : '<span class="dash">—</span>';
    var certs = c.certs.length ? c.certs.map(function (x) { return '<span class="cert-pill">' + esc(x) + "</span>"; }).join("") : '<span class="dash">—</span>';
    var helpful = (c.track === "cyber" && byId.systems)
      ? '<div><dt>Helpful prep</dt><dd><a href="courses.html#systems">Computer Systems</a> <span class="dim">(not a prerequisite)</span></dd></div>' : "";
    var badges = (c.entry ? '<span class="badge-entry">LEVEL 1 · START HERE</span>' : "") + (isAP ? '<span class="badge-ap">AP</span>' : "") +
      (c.tags.indexOf("Math Department") > -1 ? '<span class="badge-ap">Math Dept.</span>' : "") +
      (c.tags.indexOf("One semester") > -1 ? '<span class="badge-sem">One semester</span>' : "");
    return '<li class="stop" style="--c:' + color[c.track] + '"><span class="stop__dot" aria-hidden="true"></span><article class="stop__card">' +
      '<div class="stop__top"><h3>' + esc(c.name) + '</h3><div class="stop__badges">' + badges + "</div></div>" +
      '<p class="stop__tag">' + esc(c.tagline) + "</p>" +
      '<dl class="stop__facts"><div><dt>Prerequisite</dt><dd>' + prereq(c) + "</dd></div>" + helpful +
      "<div><dt>ACC college credit</dt><dd>" + acc + "</dd></div>" +
      "<div><dt>Certification prep</dt><dd>" + certs + "</dd></div></dl>" +
      (c.note && c.track !== "cyber" ? '<p class="stop__note">' + esc(c.note) + "</p>" : "") +
      '<a class="stop__more" href="courses.html#' + c.id + '">What you do in class →</a></article></li>';
  }
  function stage(n, label, sub) {
    return '<li class="stage"><span class="stage__n">' + n + '</span><div><b>' + label + "</b>" + (sub ? "<span>" + sub + "</span>" : "") + "</div></li>";
  }
  function render(t) {
    var list = P.courses.filter(function (c) { return c.track === t; });
    var tr = P.tracks[t];
    var accN = list.filter(function (c) { return c.acc; }).length;
    var certSet = {};
    list.forEach(function (c) { c.certs.forEach(function (x) { certSet[x] = 1; }); });
    head.innerHTML = '<h2 style="color:' + color[t] + '">' + esc(tr.name) + '</h2><p class="lede">' + esc(tr.blurb) + '</p>' +
      '<div class="route-sum"><span><b>' + list.length + "</b> courses</span><span><b>" + accN + "</b> with ACC credit</span><span><b>" + Object.keys(certSet).length + "</b> certifications to prep for</span></div>";
    var html = "";
    if (t === "is") {
      html += stage("11–12", "Independent study", "For juniors and seniors ready to go deeper on their own.");
      html += list.map(stop).join("");
    } else {
      var first = list.filter(function (c) { return c.entry; });
      var next = list.filter(function (c) { return !c.entry; });
      html += stage("1", "Start here", "Level 1 entry courses.");
      if (first.length) html += first.map(stop).join("");
      else html += '<li class="stop stop--empty" style="--c:' + color[t] + '"><span class="stop__dot" aria-hidden="true"></span><article class="stop__card"><p>This pathway has no Level 1 course. <b>Helpful prep:</b> <a href="courses.html#systems">Computer Systems</a> in the Computer Science pathway builds skills for both AP courses. It is not a prerequisite.</p></article></li>';
      html += stage("2", "Go further", "The next courses in this pathway.");
      html += next.map(stop).join("");
    }
    route.innerHTML = html;
    route.style.setProperty("--c", color[t]);
    document.querySelectorAll("[data-track]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-track") === t)); });
  }
  document.querySelectorAll("[data-track]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = b.getAttribute("data-track");
      render(t);
      if (history.replaceState) history.replaceState(null, "", "#" + t);
    });
  });
  var h = (location.hash || "").replace("#", "");
  render(tracks.indexOf(h) > -1 ? h : "cs");
  window.addEventListener("hashchange", function () { var x = location.hash.replace("#", ""); if (tracks.indexOf(x) > -1) render(x); });
})();
