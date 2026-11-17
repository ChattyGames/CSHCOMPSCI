/* Home-page Chatty Arcade: the ~40 MB Godot build only loads after "Press start". */
(function () {
  "use strict";
  var stage = document.querySelector("[data-arcade]");
  if (!stage) return;
  var section = stage.closest("section");
  var overlay = stage.querySelector(".arcade__overlay");
  var startBtn = stage.querySelector(".arcade__start");
  var hint = stage.querySelector(".arcade__hint");
  var controls = section.querySelector(".arcade__controls");
  var fullBtn = section.querySelector("[data-arcade-full]");
  var stopBtn = section.querySelector("[data-arcade-stop]");
  var src = stage.getAttribute("data-src") || "";
  var frame = null;

  if (!src) {
    startBtn.disabled = true;
    hint.textContent = "This preview can’t hold the 40 MB game. It plays here on the live site.";
  }

  function start() {
    if (!src || frame) return;
    frame = document.createElement("iframe");
    frame.className = "arcade__frame";
    frame.title = "Chatty Arcade game";
    frame.src = src;
    frame.setAttribute("allow", "fullscreen; autoplay; gamepad");
    frame.setAttribute("allowfullscreen", "");
    frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-pointer-lock allow-fullscreen");
    stage.appendChild(frame);
    stage.classList.add("is-playing");
    overlay.hidden = true;
    if (controls) controls.hidden = false;
    frame.addEventListener("load", function () { try { frame.focus(); } catch (e) {} });
    frame.focus();
  }
  function stop() {
    if (!frame) return;
    if (document.fullscreenElement) document.exitFullscreen();
    frame.remove(); frame = null;
    stage.classList.remove("is-playing");
    overlay.hidden = false;
    if (controls) controls.hidden = true;
    startBtn.focus();
  }
  startBtn.addEventListener("click", start);
  if (stopBtn) stopBtn.addEventListener("click", stop);
  if (fullBtn) fullBtn.addEventListener("click", function () {
    var el = stage;
    if (el.requestFullscreen) el.requestFullscreen().then(function () { if (frame) frame.focus(); }).catch(function () {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  });
  if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled && fullBtn) fullBtn.hidden = true;
})();
