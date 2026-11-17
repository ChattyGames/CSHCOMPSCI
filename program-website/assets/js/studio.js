/* Chatty GPT Studio: renders data/projects.js on the showcase page (#studio)
   and fills [data-studio-count] numbers anywhere else. No dependencies. */
(function () {
  var S = window.STUDIO;
  if (!S || !S.projects) return;
  var all = S.projects;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* counts used on home and AI pages */
  document.querySelectorAll("[data-studio-count]").forEach(function (el) {
    var lane = el.getAttribute("data-studio-count");
    el.textContent = lane ? all.filter(function (p) { return p.lane === lane; }).length : all.length;
  });

  var grid = document.getElementById("studio-grid");
  if (!grid) return;

  /* lane tally */
  var tally = document.getElementById("studio-tally");
  if (tally) {
    tally.innerHTML = Object.keys(S.lanes).map(function (k) {
      var n = all.filter(function (p) { return p.lane === k; }).length;
      var l = S.lanes[k];
      return '<div class="tally" style="--c:var(--' + l.color + ')"><span class="tally__n">' + n + '</span><span class="tally__name">' + esc(l.name) + '</span><span class="tally__blurb">' + esc(l.blurb) + "</span></div>";
    }).join("");
  }

  /* spotlight */
  var spot = document.getElementById("studio-spotlight");
  var feat = all.filter(function (p) { return p.featured; })[0];
  if (spot && feat) {
    spot.innerHTML =
      '<div class="spot__copy">' +
        '<span class="spot__label">Spotlight · ' + esc(S.lanes[feat.lane].name) + " · " + esc(feat.format) + "</span>" +
        "<h3>" + esc(feat.title) + "</h3>" +
        '<p class="spot__hook">' + esc(feat.hook) + "</p>" +
        "<p>" + esc(feat.what) + "</p>" +
        '<p class="spot__test"><b>The test</b>' + esc(feat.test) + "</p>" +
        '<div class="spot__tags">' + (feat.tags || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>" +
      "</div>" +
      '<div class="spot__term" aria-hidden="true">' +
        '<div class="spot__bar"><i></i><i></i><i></i><span>lab@jetson: ~</span></div>' +
        '<pre><span class="p">$</span> ollama create cyber-sentinel -f Modelfile\n' +
        '<span class="d">  base model ......... local</span>\n' +
        '<span class="d">  knowledge ......... student research database</span>\n' +
        '<span class="d">  internet .......... not needed</span>\n' +
        '<span class="p">$</span> ollama run cyber-sentinel\n' +
        '<span class="q">&gt;&gt;&gt; How is AI changing cyber defense jobs?</span>\n' +
        '<span class="cur"></span></pre>' +
      "</div>";
  }

  var state = { lane: "all", q: "" };
  var count = document.getElementById("studio-count");

  function card(p) {
    var l = S.lanes[p.lane] || { name: p.lane, color: "teal" };
    return '<article class="proj" style="--c:var(--' + l.color + ')" data-lane="' + esc(p.lane) + '">' +
      '<div class="proj__top"><span class="proj__lane">' + esc(l.name) + '</span><span class="proj__fmt">' + esc(p.format) + "</span></div>" +
      "<h3>" + esc(p.title) + "</h3>" +
      '<p class="proj__hook">' + esc(p.hook) + "</p>" +
      '<p class="proj__what">' + esc(p.what) + "</p>" +
      '<p class="proj__test"><b>The test</b>' + esc(p.test) + "</p>" +
      '<div class="proj__foot">' + (p.tags || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") +
      '<span class="proj__status">' + esc(p.status || "In progress") + "</span></div>" +
      "</article>";
  }

  function render() {
    var q = state.q.toLowerCase();
    var list = all.filter(function (p) {
      if (p.featured) return false;
      if (state.lane !== "all" && p.lane !== state.lane) return false;
      if (!q) return true;
      return [p.title, p.hook, p.what, p.format].concat(p.tags || []).join(" ").toLowerCase().indexOf(q) !== -1;
    });
    grid.innerHTML = list.length ? list.map(card).join("") : '<p class="empty">No projects match that yet.</p>';
    if (count) count.textContent = list.length + (list.length === 1 ? " project" : " projects") + (state.lane === "all" ? "" : " in " + S.lanes[state.lane].name);
  }

  document.querySelectorAll("[data-lane-filter]").forEach(function (b) {
    b.addEventListener("click", function () {
      state.lane = b.getAttribute("data-lane-filter");
      document.querySelectorAll("[data-lane-filter]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      render();
    });
  });
  var search = document.getElementById("studio-search");
  if (search) search.addEventListener("input", function () { state.q = search.value.trim(); render(); });

  render();
})();
