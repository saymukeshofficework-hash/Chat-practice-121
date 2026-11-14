/*
 * Full-screen Diwali intro — "ऊर्जावान शिक्षक परिवार शहडोल संभाग"
 * Original canvas animation, no images/libraries/audio files.
 * Scenes: (1) dark, unlit diya → tap → flame ignites in close-up
 *         (2) camera pulls back: courtyard diyas light in a wave, decorated house
 *         (3) rangoli, rising sky lantern, fireworks, title + "आगे बढ़ें".
 * Usage: <script src="../diwali/intro.js" defer></script>
 * Shows once per browser session on normal pages; always on pages that set
 * window.DIWALI_INTRO_ALWAYS = true before loading it.
 */
(function () {
  "use strict";
  // Festival over: stop showing on tool pages after this date (dedicated /diwali/ page still works).
  if (!window.DIWALI_INTRO_ALWAYS && Date.now() > new Date("2026-11-12T00:00:00+05:30").getTime()) return;
  if (window.__diwaliIntro) return;
  window.__diwaliIntro = true;

  var TITLE = "ऊर्जावान शिक्षक परिवार शहडोल संभाग";
  var WISH = "आप सभी को दीपावली की हार्दिक शुभकामनाएँ";
  var KEY = "dw-intro-seen";

  function seen() { try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function markSeen() { try { sessionStorage.setItem(KEY, "1"); } catch (e) {} }

  function boot() {
    if (!window.DIWALI_INTRO_ALWAYS && seen()) return;
    run();
  }
  if (document.body) boot(); else document.addEventListener("DOMContentLoaded", boot);

  function run() {
    var css =
      ".dwi{position:fixed;inset:0;z-index:2147483000;background:#000;overflow:hidden;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;" +
      "font-family:'Noto Sans Devanagari','Mangal','Nirmala UI',sans-serif;transition:opacity .9s ease}" +
      ".dwi canvas{position:absolute;inset:0;width:100%;height:100%;display:block}" +
      ".dwi-txt{position:absolute;left:0;right:0;top:9%;text-align:center;padding:0 14px;pointer-events:none;opacity:0;transform:translateY(-14px) scale(.96);transition:opacity 1.6s ease,transform 1.6s ease}" +
      ".dwi.s3 .dwi-txt{opacity:1;transform:none}" +
      ".dwi-t{margin:0;font-weight:700;font-size:clamp(24px,6vw,54px);line-height:1.3;" +
      "background:linear-gradient(90deg,#ffd27a,#fff6d2,#ff9d3c,#fff6d2,#ffd27a);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;" +
      "filter:drop-shadow(0 0 14px rgba(255,170,60,.6));animation:dwiShine 4s linear infinite}" +
      ".dwi-w{margin:10px 0 0;color:#ffe8b8;font-size:clamp(15px,3vw,24px);text-shadow:0 0 10px rgba(255,150,40,.8)}" +
      "@keyframes dwiShine{to{background-position:200% center}}" +
      ".dwi-hint,.dwi-go{position:absolute;left:50%;bottom:9%;transform:translateX(-50%);padding:11px 24px;border-radius:999px;border:0;" +
      "background:rgba(255,190,90,.96);color:#3a1d00;font:600 16px/1.2 inherit;font-family:inherit;box-shadow:0 0 26px rgba(255,170,60,.85);white-space:nowrap}" +
      ".dwi-hint{pointer-events:none;animation:dwiPulse 1.6s ease-in-out infinite;transition:opacity .5s}" +
      ".dwi.s1 .dwi-hint{opacity:0}" +
      ".dwi-go{cursor:pointer;opacity:0;pointer-events:none;transition:opacity .8s}" +
      ".dwi.s4 .dwi-go{opacity:1;pointer-events:auto}" +
      "@keyframes dwiPulse{50%{transform:translateX(-50%) scale(1.07)}}" +
      ".dwi-top{position:absolute;top:10px;right:10px;display:flex;gap:8px;z-index:2}" +
      ".dwi-top button{height:36px;min-width:36px;padding:0 12px;border:0;border-radius:999px;background:rgba(255,255,255,.14);color:#fff;font:14px inherit;font-family:inherit;cursor:pointer}";
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

    var ov = document.createElement("div");
    ov.className = "dwi";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-label", TITLE + " — दीपावली शुभकामना");
    ov.innerHTML =
      '<canvas></canvas>' +
      '<div class="dwi-txt"><h1 class="dwi-t"></h1><p class="dwi-w"></p></div>' +
      '<div class="dwi-hint">🪔 दीया जलाने के लिए छुएँ</div>' +
      '<button class="dwi-go" type="button">आगे बढ़ें →</button>' +
      '<div class="dwi-top"><button class="dwi-snd" type="button" aria-label="आवाज़">🔊</button><button class="dwi-skip" type="button">छोड़ें ✕</button></div>';
    ov.querySelector(".dwi-t").textContent = TITLE;
    ov.querySelector(".dwi-w").textContent = WISH + " 🪔";
    document.body.appendChild(ov);
    var oldOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    var cv = ov.querySelector("canvas"), ctx = cv.getContext("2d");
    var W, H, M, DPR, stars = [], bokeh = [];
    var lit = false, litAt = 0, closed = false, stage = 0;
    var lanterns = [], rockets = [], sparks = [], soundOn = true, audio = null;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = ov.clientWidth; H = ov.clientHeight; M = Math.min(W, H);
      cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      stars = []; bokeh = [];
      for (var i = 0; i < Math.round((W * H) / 5000); i++) stars.push({ x: Math.random() * W, y: Math.random() * H * 0.5, r: Math.random() * 1.4 + 0.2, p: Math.random() * 6 });
      for (var j = 0; j < 26; j++) bokeh.push({ x: Math.random() * W, y: H * (0.35 + Math.random() * 0.4), r: M * (0.015 + Math.random() * 0.04), p: Math.random() * 6 });
    }
    resize(); window.addEventListener("resize", resize);

    /* ---------------- sound ---------------- */
    function ac() {
      if (!audio) { try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audio = null; } }
      if (audio && audio.state === "suspended") audio.resume();
      return audio;
    }
    function noise(a, dur, f0, f1, vol) {
      var len = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      var s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
      f.type = "bandpass"; f.frequency.setValueAtTime(f0, a.currentTime); f.frequency.exponentialRampToValueAtTime(f1, a.currentTime + dur);
      g.gain.value = vol; s.buffer = buf; s.connect(f).connect(g).connect(a.destination); s.start();
    }
    function igniteSound() {
      var a = soundOn && ac(); if (!a) return;
      noise(a, 0.5, 400, 2500, 0.5);
      [392, 523.25, 659.25, 783.99, 1046.5].forEach(function (fq, i) {
        var o = a.createOscillator(), g = a.createGain(), t = a.currentTime + 0.35 + i * 0.16;
        o.type = "sine"; o.frequency.value = fq;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + 2.2);
        o.connect(g).connect(a.destination); o.start(t); o.stop(t + 2.3);
      });
    }
    function boomSound() { var a = soundOn && ac(); if (a) noise(a, 0.7, 1400, 120, 0.6); }
    ov.querySelector(".dwi-snd").addEventListener("click", function (e) { e.stopPropagation(); soundOn = !soundOn; this.textContent = soundOn ? "🔊" : "🔇"; });

    /* ---------------- helpers ---------------- */
    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function ease(v) { return v * v * (3 - 2 * v); }
    function lerp(a, b, k) { return a + (b - a) * k; }

    function flame(x, y, s, t, k, amt) {
      if (amt <= 0) return;
      var fl = 1 + Math.sin(t * 9 + k) * 0.07 + Math.sin(t * 21 + k * 2) * 0.05;
      var sway = Math.sin(t * 3 + k) * s * 0.06;
      var halo = ctx.createRadialGradient(x, y - s * 0.6, 0, x, y - s * 0.6, s * 4 * amt);
      halo.addColorStop(0, "rgba(255,200,100," + 0.5 * amt + ")"); halo.addColorStop(0.4, "rgba(255,140,40," + 0.18 * amt + ")"); halo.addColorStop(1, "rgba(255,110,20,0)");
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x, y - s * 0.6, s * 4 * amt, 0, 7); ctx.fill();
      ctx.save(); ctx.translate(x, y); ctx.scale(amt, fl * amt);
      ctx.beginPath(); ctx.moveTo(sway, -s * 1.5);
      ctx.bezierCurveTo(s * 0.55, -s * 0.7, s * 0.42, 0, 0, 0);
      ctx.bezierCurveTo(-s * 0.42, 0, -s * 0.55, -s * 0.7, sway, -s * 1.5);
      var g = ctx.createLinearGradient(0, -s * 1.5, 0, 0);
      g.addColorStop(0, "rgba(255,250,225,.95)"); g.addColorStop(0.45, "#ffcf55"); g.addColorStop(0.85, "#ff7a10"); g.addColorStop(1, "rgba(120,60,255,.7)");
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, -s * 0.35, s * 0.13, s * 0.3, 0, 0, 7); ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fill();
      ctx.restore();
    }

    // A detailed clay diya. (x,y) = centre of rim, s = half-width of bowl.
    function diya(x, y, s, amt, t, k, detail) {
      ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(x + s * 0.1, y + s * 0.62, s * 1.1, s * 0.16, 0, 0, 7); ctx.fill();
      // bowl + spout
      ctx.beginPath();
      ctx.moveTo(x - s, y);
      ctx.bezierCurveTo(x - s * 0.95, y + s * 0.55, x - s * 0.4, y + s * 0.62, x, y + s * 0.62);
      ctx.bezierCurveTo(x + s * 0.5, y + s * 0.62, x + s * 0.9, y + s * 0.4, x + s, y + s * 0.02);
      ctx.quadraticCurveTo(x + s * 1.25, y - s * 0.05, x + s * 1.42, y - s * 0.2);
      ctx.quadraticCurveTo(x + s * 1.2, y + s * 0.12, x + s * 0.9, y + s * 0.14);
      ctx.closePath();
      var lightL = 0.25 + 0.75 * amt;
      var g = ctx.createLinearGradient(x - s, 0, x + s * 1.4, 0);
      g.addColorStop(0, "rgb(" + Math.round(70 * lightL + 20) + "," + Math.round(30 * lightL + 10) + ",14)");
      g.addColorStop(0.65, "rgb(" + Math.round(200 * lightL + 25) + "," + Math.round(100 * lightL + 15) + "," + Math.round(40 * lightL + 8) + ")");
      g.addColorStop(1, "rgb(" + Math.round(160 * lightL + 20) + "," + Math.round(70 * lightL + 12) + ",20)");
      ctx.fillStyle = g; ctx.fill();
      // rim
      ctx.beginPath(); ctx.ellipse(x, y, s, s * 0.2, 0, 0, 7);
      ctx.fillStyle = "rgb(" + Math.round(190 * lightL + 30) + "," + Math.round(105 * lightL + 20) + "," + Math.round(50 * lightL + 10) + ")"; ctx.fill();
      ctx.beginPath(); ctx.ellipse(x, y + s * 0.01, s * 0.86, s * 0.14, 0, 0, 7);
      var oil = ctx.createLinearGradient(x - s, 0, x + s, 0);
      oil.addColorStop(0, "#2a1704"); oil.addColorStop(0.7, "rgb(" + Math.round(120 * amt + 50) + "," + Math.round(70 * amt + 30) + ",8)"); oil.addColorStop(1, "#3b2306");
      ctx.fillStyle = oil; ctx.fill();
      if (detail) {
        ctx.strokeStyle = "rgba(255,220,150," + (0.25 + 0.5 * amt) + ")"; ctx.lineWidth = Math.max(1, s * 0.03);
        ctx.beginPath(); ctx.moveTo(x - s * 0.93, y + s * 0.2); ctx.bezierCurveTo(x - s * 0.5, y + s * 0.42, x + s * 0.5, y + s * 0.42, x + s * 0.95, y + s * 0.2); ctx.stroke();
        ctx.fillStyle = "rgba(255,235,190," + (0.3 + 0.6 * amt) + ")";
        for (var i = -4; i <= 4; i++) { ctx.beginPath(); ctx.arc(x + i * s * 0.18, y + s * 0.36 + Math.abs(i) * -s * 0.025, s * 0.035, 0, 7); ctx.fill(); }
      }
      // wick
      var wx = x + s * 1.22, wy = y - s * 0.14;
      ctx.strokeStyle = "#e8dcc0"; ctx.lineWidth = Math.max(1, s * 0.05);
      ctx.beginPath(); ctx.moveTo(x + s * 0.8, y + s * 0.03); ctx.quadraticCurveTo(x + s * 1.1, y - s * 0.05, wx, wy); ctx.stroke();
      ctx.fillStyle = "#2a1a10"; ctx.beginPath(); ctx.arc(wx, wy, Math.max(1, s * 0.035), 0, 7); ctx.fill();
      if (amt <= 0 && detail) { // ember waiting to be lit
        ctx.fillStyle = "rgba(255,120,40," + (0.35 + 0.3 * Math.sin(t * 3)) + ")"; ctx.beginPath(); ctx.arc(wx, wy, s * 0.05, 0, 7); ctx.fill();
      }
      flame(wx, wy - s * 0.02, s * 0.42, t, k, amt);
    }

    function house(a, glow, t) {
      if (a <= 0) return null;
      ctx.save(); ctx.globalAlpha = a;
      var bw = Math.min(W * 0.78, 760), bx = (W - bw) / 2, gy = H * 0.68, fh = H * 0.17, uh = H * 0.15;
      // ground floor, upper floor, parapet
      ctx.fillStyle = "#1a1220"; ctx.fillRect(bx, gy - fh, bw, fh);
      ctx.fillStyle = "#1e1526"; ctx.fillRect(bx + bw * 0.08, gy - fh - uh, bw * 0.84, uh);
      ctx.fillStyle = "#2a1c22"; ctx.fillRect(bx - 10, gy - fh - 6, bw + 20, 8); ctx.fillRect(bx + bw * 0.08 - 8, gy - fh - uh - 8, bw * 0.84 + 16, 9);
      function win(wx, wy, ww, wh, door) {
        ctx.fillStyle = "rgba(255," + Math.round(170 + glow * 45) + ",90," + (0.08 + glow * 0.8) + ")"; ctx.fillRect(wx, wy, ww, wh);
        ctx.strokeStyle = "#4a3320"; ctx.lineWidth = 2; ctx.strokeRect(wx, wy, ww, wh);
        if (!door) { for (var b = 1; b < 4; b++) { ctx.beginPath(); ctx.moveTo(wx + (ww / 4) * b, wy); ctx.lineTo(wx + (ww / 4) * b, wy + wh); ctx.stroke(); } }
        else { ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke(); }
      }
      var n = 6, cw = bw / n;
      for (var i = 0; i < n; i++) {
        var cx = bx + cw * i + cw * 0.28;
        if (i === 2 || i === 3) { if (i === 2) win(bx + cw * 2.3, gy - fh * 0.82, cw * 1.4, fh * 0.82, true); }
        else win(cx, gy - fh * 0.75, cw * 0.44, fh * 0.42);
      }
      for (var j = 1; j < 5; j++) win(bx + cw * j + cw * 0.28, gy - fh - uh * 0.78, cw * 0.44, uh * 0.5);
      // balcony rail
      ctx.strokeStyle = "rgba(180,120,70," + (0.4 + glow * 0.4) + ")"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx + cw * 2.1, gy - fh - uh * 0.15); ctx.lineTo(bx + cw * 3.9, gy - fh - uh * 0.15); ctx.stroke();
      for (var r = 0; r <= 12; r++) { var rx = bx + cw * 2.1 + (cw * 1.8 / 12) * r; ctx.beginPath(); ctx.moveTo(rx, gy - fh - uh * 0.15); ctx.lineTo(rx, gy - fh); ctx.stroke(); }
      // toran
      for (var k = 0; k < 10; k++) {
        var tx = bx + cw * 2.3 + (cw * 1.4 / 10) * k, ty = gy - fh * 0.82;
        ctx.fillStyle = k % 2 ? "#ff8a00" : "#3fbf4a";
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx + cw * 0.07, ty + 12 * glow); ctx.lineTo(tx + cw * 0.14, ty); ctx.fill();
      }
      ctx.restore();
      return { bx: bx, bw: bw, gy: gy, fh: fh, uh: uh };
    }
    function lights(x1, y1, x2, y2, sag, t, glow, a) {
      var n = Math.max(6, Math.round(Math.abs(x2 - x1) / 15));
      for (var i = 0; i <= n; i++) {
        var p = i / n, x = lerp(x1, x2, p), y = lerp(y1, y2, p) + Math.sin(p * Math.PI) * sag;
        var on = glow * (0.5 + 0.5 * Math.sin(t * 3.2 + i * 1.1));
        var hue = ["255,214,100", "255,130,60", "255,90,160", "130,230,255"][i % 4];
        ctx.fillStyle = "rgba(" + hue + "," + a * (0.15 + on * 0.85) + ")"; ctx.beginPath(); ctx.arc(x, y, 2.3, 0, 7); ctx.fill();
        if (on > 0.55) { ctx.fillStyle = "rgba(" + hue + "," + 0.2 * a + ")"; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill(); }
      }
    }
    function rangoli(cx, cy, r, t, a) {
      if (a <= 0) return;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(1, 0.34); ctx.globalAlpha = a;
      var cs = ["#ff3d7f", "#ffb03a", "#2fd3c4", "#a77bff", "#ffe066"];
      ctx.beginPath(); ctx.arc(0, 0, r * 1.08, 0, 7); ctx.strokeStyle = "rgba(255,240,200,.6)"; ctx.setLineDash([3, 7]); ctx.lineWidth = 3; ctx.stroke(); ctx.setLineDash([]);
      for (var ring = 4; ring >= 1; ring--) {
        var petals = 4 + ring * 4, grow = clamp(a * 4 - (4 - ring) * 0.6);
        ctx.save(); ctx.rotate((ring % 2 ? 1 : -1) * t * 0.08);
        for (var i = 0; i < petals; i++) {
          ctx.save(); ctx.rotate((i / petals) * Math.PI * 2);
          ctx.beginPath(); ctx.ellipse(r * ring * 0.23 * grow, 0, r * 0.13 * grow, r * 0.06 * grow, 0, 0, 7);
          ctx.fillStyle = cs[(i + ring) % cs.length]; ctx.fill(); ctx.restore();
        }
        ctx.restore();
      }
      ctx.beginPath(); ctx.arc(0, 0, r * 0.12, 0, 7); ctx.fillStyle = "#fff0b8"; ctx.fill();
      ctx.restore();
    }
    function lantern(l, t) {
      var x = l.x + Math.sin(t * 0.7 + l.p) * l.s * 0.8, y = l.y, s = l.s;
      var g = ctx.createRadialGradient(x, y, 0, x, y, s * 3.2);
      g.addColorStop(0, "rgba(255,180,80,.4)"); g.addColorStop(1, "rgba(255,120,30,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s * 3.2, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - s * 0.6, y - s * 1.1);
      ctx.quadraticCurveTo(x, y - s * 1.35, x + s * 0.6, y - s * 1.1);
      ctx.lineTo(x + s * 0.45, y + s); ctx.lineTo(x - s * 0.45, y + s); ctx.closePath();
      var lg = ctx.createLinearGradient(0, y - s, 0, y + s);
      lg.addColorStop(0, "#fff0c0"); lg.addColorStop(0.6, "#ffb04a"); lg.addColorStop(1, "#ff6a1a");
      ctx.fillStyle = lg; ctx.fill();
      ctx.strokeStyle = "rgba(160,70,10,.45)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y - s * 1.2); ctx.lineTo(x, y + s); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,230,.9)"; ctx.beginPath(); ctx.arc(x, y + s * 0.8, s * 0.15, 0, 7); ctx.fill();
    }

    var COLORS = ["#ffcf5a", "#ff6b3d", "#ff3d7f", "#7cf2ff", "#a77bff", "#7dff8a", "#ffffff"];
    function launch(x, y) {
      rockets.push({ x: x == null ? W * (0.12 + Math.random() * 0.76) : x, y: H, tx: x, ty: y == null ? H * (0.1 + Math.random() * 0.25) : Math.min(y, H * 0.55), v: H / 75 + Math.random() * 3, c: COLORS[(Math.random() * COLORS.length) | 0] });
    }
    function burst(x, y, c) {
      var n = reduce ? 40 : 90, type = Math.random();
      for (var i = 0; i < n; i++) {
        var ang = (i / n) * Math.PI * 2 + Math.random() * 0.05, sp = type < 0.35 ? M / 160 : Math.random() * M / 130 + 0.6;
        sparks.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 1, c: Math.random() < 0.25 ? "#fff6d0" : c, tw: type > 0.75 });
      }
      boomSound();
    }

    /* ---------------- input ---------------- */
    ov.addEventListener("click", function (e) {
      if (closed) return;
      if (!lit) { lit = true; litAt = performance.now(); ov.classList.add("s1"); igniteSound(); return; }
      if (stage >= 3) launch(e.clientX, e.clientY);
    });
    function close(e) {
      if (e) e.stopPropagation();
      if (closed) return; closed = true; markSeen();
      try { window.dispatchEvent(new Event("diwali-intro-done")); } catch (er) {}
      ov.style.opacity = "0";
      setTimeout(function () { ov.remove(); document.documentElement.style.overflow = oldOverflow; }, 950);
    }
    ov.querySelector(".dwi-go").addEventListener("click", close);
    ov.querySelector(".dwi-skip").addEventListener("click", close);

    /* ---------------- main loop ---------------- */
    var row = [], lastRocket = 0, lastLan = 0, bigLan = null;
    function buildRow() {
      row = [];
      var rows = [{ y: 0.95, n: Math.max(5, Math.round(W / 90)), s: M * 0.05 }, { y: 0.83, n: Math.max(6, Math.round(W / 70)), s: M * 0.034 }, { y: 0.74, n: Math.max(7, Math.round(W / 55)), s: M * 0.024 }];
      rows.forEach(function (r, ri) {
        for (var i = 0; i < r.n; i++) {
          var x = (i + 0.5 + (ri % 2) * 0.5) * (W / r.n) - (ri % 2) * (W / r.n) * 0.5;
          var dist = Math.abs(x - W / 2) / W + ri * 0.12;
          if (ri === 0 && Math.abs(x - W / 2) < M * 0.32) continue;
          row.push({ x: x, y: H * r.y, s: r.s, d: dist * 2.2, k: Math.random() * 10 });
        }
      });
    }
    buildRow(); window.addEventListener("resize", buildRow);

    function frame(now) {
      if (!ov.isConnected) return;
      var t = now / 1000, T = lit ? (now - litAt) / 1000 : 0;
      var ign = lit ? ease(clamp((T - 0.35) / 1.1)) : 0;   // flame grows
      var pull = ease(clamp((T - 3.4) / 3.2));              // 0 close-up → 1 wide
      var wideT = T - 4.2;                                  // time since courtyard starts lighting
      var nst = !lit ? 0 : T < 3.4 ? 1 : T < 7.2 ? 2 : T < 9.5 ? 3 : 4;
      if (nst !== stage) { stage = nst; if (stage >= 3) ov.classList.add("s3"); if (stage >= 4) ov.classList.add("s4"); }

      // sky
      var sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#03040a"); sky.addColorStop(0.55, "rgb(" + Math.round(10 + 16 * pull) + "," + Math.round(10 + 6 * pull) + "," + Math.round(20 + 22 * pull) + ")");
      sky.addColorStop(1, "rgb(" + Math.round(14 + 50 * ign) + "," + Math.round(10 + 20 * ign) + ",12)");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

      // stars appear as camera pulls back
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i]; ctx.fillStyle = "rgba(255,255,240," + pull * (0.3 + 0.4 * Math.sin(t * 2 + s.p)) + ")";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
      }

      // close-up bokeh of far-away diyas (fade out as we zoom)
      var bk = ign * (1 - pull);
      if (bk > 0) for (var b = 0; b < bokeh.length; b++) {
        var o = bokeh[b], bg = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        var al = bk * (0.25 + 0.15 * Math.sin(t * 2 + o.p));
        bg.addColorStop(0, "rgba(255,190,90," + al + ")"); bg.addColorStop(0.7, "rgba(255,150,50," + al * 0.5 + ")"); bg.addColorStop(1, "rgba(255,150,50,0)");
        ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, 7); ctx.fill();
      }

      // courtyard scene
      var hglow = clamp((wideT - 0.8) / 1.5);
      var hs = house(pull, hglow, t);
      if (hs) {
        var roofY = hs.gy - hs.fh - hs.uh - 8;
        lights(hs.bx + hs.bw * 0.08 - 8, roofY, hs.bx + hs.bw * 0.92 + 8, roofY, 10, t, hglow, pull);
        lights(hs.bx - 10, hs.gy - hs.fh - 4, hs.bx + hs.bw + 10, hs.gy - hs.fh - 4, 14, t + 1, hglow, pull);
        for (var v = 0; v <= 1; v++) { var vx = v ? hs.bx + hs.bw + 6 : hs.bx - 6; lights(vx, hs.gy - hs.fh, vx + 0.01, hs.gy, 0, t + 2, hglow, pull); }
      }
      // floor
      if (pull > 0) {
        var fl = ctx.createLinearGradient(0, H * 0.68, 0, H);
        fl.addColorStop(0, "rgba(60,34,20," + pull + ")"); fl.addColorStop(1, "rgba(30,16,10," + pull + ")");
        ctx.fillStyle = fl; ctx.fillRect(0, H * 0.68, W, H * 0.32);
        ctx.strokeStyle = "rgba(255,200,140," + 0.06 * pull + ")"; ctx.lineWidth = 1;
        for (var gx = -6; gx <= 6; gx++) { ctx.beginPath(); ctx.moveTo(W / 2 + gx * W * 0.06, H * 0.68); ctx.lineTo(W / 2 + gx * W * 0.22, H); ctx.stroke(); }
        var warm = ctx.createRadialGradient(W / 2, H * 0.9, 0, W / 2, H * 0.9, M * 0.9);
        warm.addColorStop(0, "rgba(255,150,60," + 0.25 * hglow + ")"); warm.addColorStop(1, "rgba(255,150,60,0)");
        ctx.fillStyle = warm; ctx.fillRect(0, 0, W, H);
      }
      rangoli(W / 2, H * 0.9, M * 0.3, t, clamp((T - 6.3) / 1.6) * pull);

      // courtyard diyas light in a wave from the centre
      if (pull > 0.05) {
        ctx.save(); ctx.globalAlpha = pull;
        row.sort(function (a, b) { return a.y - b.y; });
        for (var r = 0; r < row.length; r++) { var d = row[r]; diya(d.x, d.y, d.s, ease(clamp((wideT - d.d) / 0.5)), t, d.k, false); }
        ctx.restore();
      }

      // hero diya: close-up → sits at the centre of the rangoli
      var hs2 = lerp(M * 0.27, M * 0.075, pull), hx = lerp(W / 2 - M * 0.08, W / 2 - M * 0.02, pull), hy = lerp(H * 0.58, H * 0.88, pull);
      if (!lit) { var pre = ctx.createRadialGradient(hx, hy, 0, hx, hy, M * 0.5); pre.addColorStop(0, "rgba(255,140,60,.10)"); pre.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = pre; ctx.fillRect(0, 0, W, H); }
      diya(hx, hy, hs2, ign, t, 0, true);

      // spark that lights the wick
      if (lit && T < 0.6) {
        var wx = hx + hs2 * 1.22, wy = hy - hs2 * 0.14;
        for (var sp = 0; sp < 6; sp++) { ctx.fillStyle = "rgba(255,230,150," + (1 - T / 0.6) + ")"; ctx.beginPath(); ctx.arc(wx + (Math.random() - 0.5) * hs2 * 0.5, wy - Math.random() * hs2 * 0.5, 1.5 + Math.random() * 2, 0, 7); ctx.fill(); }
      }

      // lanterns
      if (stage >= 3 && !reduce) {
        if (!bigLan) bigLan = { x: W / 2 + M * 0.02, y: H * 0.82, s: M * 0.045, v: H / 900, p: 0 };
        if (now - lastLan > 1300 && lanterns.length < 10) { lastLan = now; lanterns.push({ x: W * (0.08 + Math.random() * 0.84), y: H * (0.7 + Math.random() * 0.1), s: M * (0.012 + Math.random() * 0.016), v: H / (1400 + Math.random() * 1200), p: Math.random() * 6 }); }
      }
      for (var q = lanterns.length - 1; q >= 0; q--) { var L = lanterns[q]; L.y -= L.v * 2; lantern(L, t); if (L.y < -50) lanterns.splice(q, 1); }
      if (bigLan) { bigLan.y -= bigLan.v * 2; bigLan.s *= 0.9993; lantern(bigLan, t); if (bigLan.y < -80) bigLan = null; }

      // fireworks
      if (stage >= 3 && now - lastRocket > (reduce ? 3000 : 1300)) { lastRocket = now; launch(); }
      for (var rk = rockets.length - 1; rk >= 0; rk--) {
        var R = rockets[rk]; if (R.tx != null) R.x += (R.tx - R.x) * 0.06; R.y -= R.v;
        ctx.fillStyle = "#fff2c0"; ctx.beginPath(); ctx.arc(R.x, R.y, 2.2, 0, 7); ctx.fill();
        ctx.fillStyle = "rgba(255,200,120,.35)"; ctx.fillRect(R.x - 0.8, R.y, 1.6, 16);
        if (R.y <= R.ty) { burst(R.x, R.y, R.c); rockets.splice(rk, 1); }
      }
      ctx.globalCompositeOperation = "lighter";
      for (var p = sparks.length - 1; p >= 0; p--) {
        var S = sparks[p]; S.x += S.vx; S.y += S.vy; S.vy += 0.04; S.vx *= 0.984; S.vy *= 0.984; S.life -= 0.011;
        if (S.life <= 0) { sparks.splice(p, 1); continue; }
        ctx.globalAlpha = S.tw ? S.life * (0.4 + 0.6 * Math.random()) : S.life;
        ctx.fillStyle = S.c; ctx.beginPath(); ctx.arc(S.x, S.y, 2, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";

      // vignette
      var vg = ctx.createRadialGradient(W / 2, H / 2, M * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.55)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
