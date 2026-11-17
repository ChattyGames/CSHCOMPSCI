/* Shared behavior: nav, parallax, ticker, reveal, canvases. No dependencies. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  /* ----- mobile nav ----- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); toggle.focus(); }
    });
  }

  /* ----- footer year ----- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ----- ticker: duplicate items so the loop is seamless ----- */
  document.querySelectorAll(".ticker__track").forEach(function (track) {
    Array.prototype.slice.call(track.children).forEach(function (item) {
      var clone = item.cloneNode(true); clone.setAttribute("aria-hidden", "true"); track.appendChild(clone);
    });
  });

  /* ----- reveal: only items below the fold get a gentle lift ----- */
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove("is-pre"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("is-pre"); io.observe(el); }
    });
  }

  /* ----- parallax ----- */
  var scenes = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var drifts = Array.prototype.slice.call(document.querySelectorAll("[data-drift]"));
  var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  var ticking = false;

  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
    scenes.forEach(function (scene) {
      var r = scene.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var scrolled = -r.top;
      scene.querySelectorAll("[data-depth]").forEach(function (layer) {
        var d = parseFloat(layer.getAttribute("data-depth")) || 0;
        var tilt = parseFloat(layer.getAttribute("data-tilt") || "0");
        var y = scrolled * d + pointer.y * tilt;
        var x = pointer.x * tilt;
        var s = layer.getAttribute("data-scale") || "1";
        layer.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) scale(" + s + ")";
      });
      scene.querySelectorAll("[data-fade]").forEach(function (el) {
        var p = Math.min(Math.max(scrolled / (r.height * 0.75), 0), 1);
        el.style.opacity = String(1 - p * 0.9);
      });
    });
    drifts.forEach(function (row) {
      var r = row.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var dir = parseFloat(row.getAttribute("data-drift")) || 1;
      var p = (vh - r.top) / (vh + r.height); // 0..1 through viewport
      row.style.transform = "translate3d(" + ((p - 0.5) * dir * 34).toFixed(2) + "%,0,0)";
    });
    if (Math.abs(pointer.tx - pointer.x) > 0.1 || Math.abs(pointer.ty - pointer.y) > 0.1) request();
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  if (!reduce && (scenes.length || drifts.length)) {
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    if (finePointer) {
      window.addEventListener("pointermove", function (e) {
        pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
        request();
      }, { passive: true });
    }
    request();
  }

  /* ----- hero canvas: data packets racing along circuit traces ----- */
  function packets(canvas) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, lanes = [], dots = [], running = true, colors = ["#00e5cc", "#ffd60a", "#ff2d78", "#f4f2f8"];
    function size() {
      var r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lanes = [];
      var n = Math.max(6, Math.round(h / 70));
      for (var i = 0; i < n; i++) {
        var y = h * (0.18 + 0.7 * (i / (n - 1)));
        var bend = (Math.random() * 0.25 + 0.35) * w;
        lanes.push({ y: y, y2: y + (Math.random() - 0.5) * 80, bend: bend });
      }
      dots = [];
      for (var j = 0; j < n * 2; j++) spawn(true);
    }
    function spawn(randomX) {
      var lane = lanes[Math.floor(Math.random() * lanes.length)];
      dots.push({ lane: lane, x: randomX ? Math.random() * w : -20, v: 0.6 + Math.random() * 1.8, c: colors[Math.floor(Math.random() * colors.length)], r: 1.4 + Math.random() * 1.6 });
    }
    function yAt(l, x) {
      if (x < l.bend) return l.y;
      if (x > l.bend + 60) return l.y2;
      var t = (x - l.bend) / 60; return l.y + (l.y2 - l.y) * t;
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      lanes.forEach(function (l) {
        ctx.strokeStyle = "rgba(255,45,120,0.10)";
        ctx.beginPath(); ctx.moveTo(0, l.y); ctx.lineTo(l.bend, l.y); ctx.lineTo(l.bend + 60, l.y2); ctx.lineTo(w, l.y2); ctx.stroke();
      });
      dots.forEach(function (d) {
        if (!reduce) d.x += d.v;
        var y = yAt(d.lane, d.x);
        ctx.fillStyle = d.c; ctx.shadowColor = d.c; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(d.x, y, d.r, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = d.c; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(d.x - 26 * d.v, yAt(d.lane, d.x - 26 * d.v)); ctx.lineTo(d.x, y); ctx.stroke(); ctx.globalAlpha = 1;
      });
      dots = dots.filter(function (d) { return d.x < w + 30; });
      while (dots.length < lanes.length * 2) spawn(false);
    }
    function loop() { if (!running) return; draw(); requestAnimationFrame(loop); }
    size(); window.addEventListener("resize", size);
    if (reduce) { draw(); return; }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { var vis = es[0].isIntersecting; if (vis && !running) { running = true; loop(); } else if (!vis) running = false; }).observe(canvas);
    }
    document.addEventListener("visibilitychange", function () { if (document.hidden) running = false; else if (!running) { running = true; loop(); } });
    loop();
  }
  document.querySelectorAll("canvas.hero__packets").forEach(packets);

  /* ----- lab canvas: Blue Land vs Red Land with a firewall in the middle ----- */
  function netviz(canvas) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, nodes = [], edges = [], pkts = [], flashes = [], running = true;
    function size() {
      var r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = []; edges = [];
      var fw = { x: w * 0.5, y: h * 0.5, kind: "fw" };
      var swB = { x: w * 0.26, y: h * 0.5, kind: "sw", side: "b" };
      var swR = { x: w * 0.74, y: h * 0.5, kind: "sw", side: "r" };
      nodes.push(fw, swB, swR);
      edges.push([swB, fw], [fw, swR]);
      for (var i = 0; i < 6; i++) {
        var a = (-Math.PI / 2) + (i / 5) * Math.PI;
        var b = { x: swB.x - Math.cos(a) * w * 0.17, y: swB.y + Math.sin(a) * h * 0.33, kind: "host", side: "b" };
        var r2 = { x: swR.x + Math.cos(a) * w * 0.17, y: swR.y + Math.sin(a) * h * 0.33, kind: "host", side: "r" };
        nodes.push(b, r2); edges.push([b, swB], [r2, swR]);
      }
    }
    function spawn() {
      var e = edges[Math.floor(Math.random() * edges.length)];
      var fwd = Math.random() > 0.5;
      var from = fwd ? e[0] : e[1], to = fwd ? e[1] : e[0];
      var hostile = from.side === "r" && to.kind === "fw";
      pkts.push({ from: from, to: to, t: 0, v: 0.008 + Math.random() * 0.012, hostile: hostile });
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      edges.forEach(function (e) {
        ctx.strokeStyle = "rgba(244,242,248,0.14)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(e[0].x, e[0].y); ctx.lineTo(e[1].x, e[1].y); ctx.stroke();
      });
      nodes.forEach(function (n) {
        var c = n.kind === "fw" ? "#ffd60a" : (n.side === "b" ? "#00e5cc" : "#ff2d78");
        var s = n.kind === "fw" ? 14 : (n.kind === "sw" ? 10 : 5);
        ctx.fillStyle = "#0e0e15"; ctx.strokeStyle = c; ctx.lineWidth = 2;
        if (n.kind === "host") { ctx.beginPath(); ctx.arc(n.x, n.y, s, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
        else { ctx.fillRect(n.x - s, n.y - s, s * 2, s * 2); ctx.strokeRect(n.x - s, n.y - s, s * 2, s * 2); }
      });
      pkts.forEach(function (p) {
        if (!reduce) p.t += p.v;
        var x = p.from.x + (p.to.x - p.from.x) * p.t, y = p.from.y + (p.to.y - p.from.y) * p.t;
        var c = p.hostile ? "#ff2d78" : (p.from.side === "r" || p.to.side === "r" ? "#ff8fb5" : "#00e5cc");
        ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        if (p.hostile && p.t > 0.86) { flashes.push({ x: p.to.x, y: p.to.y, a: 1 }); p.t = 2; }
      });
      flashes.forEach(function (f) { ctx.strokeStyle = "rgba(255,214,10," + f.a + ")"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x, f.y, 18 + (1 - f.a) * 26, 0, Math.PI * 2); ctx.stroke(); f.a -= 0.03; });
      flashes = flashes.filter(function (f) { return f.a > 0; });
      pkts = pkts.filter(function (p) { return p.t < 1; });
      while (pkts.length < 14) spawn();
    }
    function loop() { if (!running) return; draw(); requestAnimationFrame(loop); }
    size(); window.addEventListener("resize", size);
    for (var k = 0; k < 14; k++) { spawn(); pkts[k].t = Math.random() * 0.8; }
    if (reduce) { draw(); return; }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { var vis = es[0].isIntersecting; if (vis && !running) { running = true; loop(); } else if (!vis) running = false; }).observe(canvas);
    }
    loop();
  }
  document.querySelectorAll("canvas.netviz__canvas").forEach(netviz);

  /* ----- typed terminal line in the hero ----- */
  var typed = document.querySelector("[data-typed]");
  if (typed) {
    var lines = JSON.parse(typed.getAttribute("data-typed"));
    if (reduce) { typed.textContent = lines[0]; }
    else {
      var li = 0, ci = 0, del = false;
      (function type() {
        var line = lines[li];
        typed.textContent = line.slice(0, ci);
        if (!del && ci < line.length) { ci++; setTimeout(type, 55); }
        else if (!del) { del = true; setTimeout(type, 1800); }
        else if (ci > 0) { ci--; setTimeout(type, 22); }
        else { del = false; li = (li + 1) % lines.length; setTimeout(type, 300); }
      })();
    }
  }
})();
