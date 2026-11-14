/*
 * Diwali banner — "ऊर्जावान शिक्षक परिवार शहडोल संभाग"
 * Self-contained: no images, no libraries, no external audio.
 * Usage: <script src="../diwali/banner.js" defer></script>  (inserts itself at the top of <body>)
 * Flow: dark night → tap → diyas light up one by one → sky lanterns rise,
 *       house lights glow, fireworks burst. Tap anywhere for more fireworks.
 */
(function () {
  "use strict";
  // Festival over: stop showing on tool pages after this date (dedicated /diwali/ page still works).
  if (!window.DIWALI_INTRO_ALWAYS && Date.now() > new Date("2026-11-12T00:00:00+05:30").getTime()) return;
  if (window.__diwaliBanner) return;
  window.__diwaliBanner = true;

  var TITLE = "ऊर्जावान शिक्षक परिवार शहडोल संभाग";
  var WISH = "आप सभी को दीपावली की हार्दिक शुभकामनाएँ 🪔";

  var css =
    ".dw-wrap{position:relative;width:100%;height:clamp(300px,52vw,440px);overflow:hidden;background:#070b14;" +
    "font-family:'Noto Sans Devanagari','Mangal','Nirmala UI',sans-serif;user-select:none;-webkit-tap-highlight-color:transparent;cursor:pointer;z-index:1}" +
    ".dw-wrap canvas{position:absolute;inset:0;width:100%;height:100%;display:block}" +
    ".dw-text{position:absolute;left:0;right:0;top:7%;text-align:center;padding:0 12px;pointer-events:none;opacity:0;transform:translateY(-10px);transition:opacity 1.4s ease,transform 1.4s ease}" +
    ".dw-on .dw-text{opacity:1;transform:none}" +
    ".dw-title{margin:0;font-weight:700;font-size:clamp(20px,4.6vw,40px);line-height:1.3;" +
    "background:linear-gradient(90deg,#ffd27a,#fff3c4,#ff9d3c,#fff3c4,#ffd27a);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;" +
    "filter:drop-shadow(0 0 10px rgba(255,170,60,.55));animation:dwShine 4s linear infinite}" +
    ".dw-wish{margin:6px 0 0;color:#ffe8b8;font-size:clamp(13px,2.4vw,19px);text-shadow:0 0 8px rgba(255,150,40,.7)}" +
    "@keyframes dwShine{to{background-position:200% center}}" +
    ".dw-hint{position:absolute;left:50%;bottom:9%;transform:translateX(-50%);padding:9px 20px;border-radius:999px;background:rgba(255,190,90,.95);" +
    "color:#3a1d00;font-weight:600;font-size:15px;box-shadow:0 0 22px rgba(255,170,60,.8);pointer-events:none;animation:dwPulse 1.6s ease-in-out infinite;transition:opacity .6s}" +
    ".dw-on .dw-hint{opacity:0}" +
    "@keyframes dwPulse{50%{transform:translateX(-50%) scale(1.07)}}" +
    ".dw-snd{position:absolute;top:8px;right:8px;width:34px;height:34px;border:0;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:16px;cursor:pointer;z-index:2}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var wrap = document.createElement("section");
  wrap.className = "dw-wrap";
  wrap.setAttribute("aria-label", TITLE + " — दीपावली शुभकामना");
  wrap.innerHTML =
    '<canvas></canvas>' +
    '<div class="dw-text"><h1 class="dw-title"></h1><p class="dw-wish"></p></div>' +
    '<div class="dw-hint">🪔 दीया जलाने के लिए छुएँ</div>' +
    '<button class="dw-snd" type="button" aria-label="आवाज़ चालू/बंद">🔊</button>';
  wrap.querySelector(".dw-title").textContent = TITLE;
  wrap.querySelector(".dw-wish").textContent = WISH;

  function mount() {
    var body = document.body;
    body.insertBefore(wrap, body.firstChild);
    // Pages whose <body> is a flex/grid container would put the banner beside the content.
    // In that case pin it to the very top of the document and push the page down.
    var disp = getComputedStyle(body).display;
    if (/flex|grid/.test(disp)) {
      var basePad = parseFloat(getComputedStyle(body).paddingTop) || 0;
      wrap.style.position = "absolute";
      wrap.style.top = "0"; wrap.style.left = "0"; wrap.style.right = "0";
      var fit = function () { body.style.paddingTop = basePad + wrap.offsetHeight + "px"; };
      fit(); window.addEventListener("resize", fit);
    }
    start();
  }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);

  function start() {
    var cv = wrap.querySelector("canvas");
    var ctx = cv.getContext("2d");
    var W = 0, H = 0, DPR = 1;
    var lit = false, litAt = 0, t0 = performance.now();
    var stars = [], diyas = [], lanterns = [], rockets = [], sparks = [];
    var soundOn = true, audio = null;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = wrap.clientWidth; H = wrap.clientHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      stars = [];
      for (var i = 0; i < Math.round(W / 6); i++)
        stars.push({ x: Math.random() * W, y: Math.random() * H * 0.55, r: Math.random() * 1.3 + 0.2, p: Math.random() * 6 });
      diyas = [];
      var n = Math.max(7, Math.round(W / 70));
      for (var j = 0; j < n; j++)
        diyas.push({ x: (j + 0.5) * (W / n), y: H * 0.9, s: Math.min(W / n, 70) * 0.42, d: j * 0.18, f: Math.random() * 10 });
    }
    resize();
    window.addEventListener("resize", resize);

    /* ---------- sound (synthesized, plays only after a tap) ---------- */
    function ac() {
      if (!audio) { try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audio = null; } }
      if (audio && audio.state === "suspended") audio.resume();
      return audio;
    }
    function chime() {
      var a = soundOn && ac(); if (!a) return;
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        var o = a.createOscillator(), g = a.createGain(), t = a.currentTime + i * 0.12;
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
        o.connect(g).connect(a.destination); o.start(t); o.stop(t + 1.7);
      });
    }
    function boom() {
      var a = soundOn && ac(); if (!a) return;
      var len = a.sampleRate * 0.6, buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      var s = a.createBufferSource(), g = a.createGain(), lp = a.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 900 + Math.random() * 700; g.gain.value = 0.35;
      s.buffer = buf; s.connect(lp).connect(g).connect(a.destination); s.start();
    }
    wrap.querySelector(".dw-snd").addEventListener("click", function (e) {
      e.stopPropagation(); soundOn = !soundOn; this.textContent = soundOn ? "🔊" : "🔇";
    });

    /* ---------- interaction ---------- */
    var COLORS = ["#ffcf5a", "#ff6b3d", "#ff3d7f", "#7cf2ff", "#a77bff", "#7dff8a", "#ffffff"];
    function launch(x, y) {
      rockets.push({ x: x == null ? W * (0.15 + Math.random() * 0.7) : x, y: H * 0.86, tx: x, ty: y == null ? H * (0.12 + Math.random() * 0.28) : Math.min(y, H * 0.6), v: 6 + Math.random() * 2, c: COLORS[(Math.random() * COLORS.length) | 0] });
    }
    function burst(x, y, c) {
      var n = reduce ? 30 : 70, ring = Math.random() < 0.4;
      for (var i = 0; i < n; i++) {
        var ang = (i / n) * Math.PI * 2, sp = ring ? 3.2 : Math.random() * 3.6 + 0.6;
        sparks.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 1, c: Math.random() < 0.25 ? "#fff6d0" : c });
      }
      boom();
    }
    function light(withSound) { if (lit) return; lit = true; litAt = performance.now(); wrap.classList.add("dw-on"); if (withSound) chime(); }
    window.addEventListener("diwali-intro-done", function () { light(false); });
    wrap.addEventListener("click", function (e) {
      var r = wrap.getBoundingClientRect();
      if (!lit) { light(true); return; }
      launch(e.clientX - r.left, e.clientY - r.top);
    });

    /* ---------- drawing helpers ---------- */
    function flame(x, y, s, tt, k) {
      var fl = 1 + Math.sin(tt * 9 + k) * 0.08 + Math.sin(tt * 23 + k) * 0.05;
      var g = ctx.createRadialGradient(x, y - s * 0.5, 0, x, y - s * 0.5, s * 2.6);
      g.addColorStop(0, "rgba(255,190,80,.45)"); g.addColorStop(1, "rgba(255,120,20,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - s * 0.5, s * 2.6, 0, 7); ctx.fill();
      ctx.save(); ctx.translate(x, y); ctx.scale(1, fl);
      ctx.beginPath(); ctx.moveTo(0, -s * 1.15);
      ctx.quadraticCurveTo(s * 0.42, -s * 0.35, 0, 0); ctx.quadraticCurveTo(-s * 0.42, -s * 0.35, 0, -s * 1.15);
      var fg = ctx.createLinearGradient(0, -s * 1.15, 0, 0);
      fg.addColorStop(0, "#fff8d8"); fg.addColorStop(0.5, "#ffc24a"); fg.addColorStop(1, "#ff6a00");
      ctx.fillStyle = fg; ctx.fill(); ctx.restore();
    }
    function diya(d, tt, on) {
      var x = d.x, y = d.y, s = d.s;
      ctx.beginPath(); ctx.moveTo(x - s, y - s * 0.25);
      ctx.quadraticCurveTo(x, y + s * 0.75, x + s, y - s * 0.25);
      ctx.quadraticCurveTo(x + s * 1.25, y - s * 0.45, x + s * 0.7, y - s * 0.35);
      ctx.lineTo(x - s * 0.7, y - s * 0.35); ctx.closePath();
      var g = ctx.createLinearGradient(0, y - s * 0.4, 0, y + s * 0.5);
      g.addColorStop(0, on ? "#d9772f" : "#5a2f17"); g.addColorStop(1, on ? "#6b2a0c" : "#26130a");
      ctx.fillStyle = g; ctx.fill();
      ctx.fillStyle = on ? "#ffd27a" : "#3a2414";
      for (var i = -2; i <= 2; i++) { ctx.beginPath(); ctx.arc(x + i * s * 0.32, y + s * 0.08, s * 0.06, 0, 7); ctx.fill(); }
      if (on) flame(x + s * 0.85, y - s * 0.42, s * 0.55, tt, d.f);
    }
    function house(glow) {
      var bw = Math.min(W * 0.62, 560), bh = H * 0.36, bx = (W - bw) / 2, by = H * 0.84 - bh;
      ctx.fillStyle = "#140f1c"; ctx.fillRect(bx, by, bw, bh);
      ctx.beginPath(); ctx.moveTo(bx - 14, by); ctx.lineTo(W / 2, by - bh * 0.42); ctx.lineTo(bx + bw + 14, by); ctx.closePath();
      ctx.fillStyle = "#1c1424"; ctx.fill();
      var cols = 5, ww = bw / (cols * 2 + 1);
      for (var i = 0; i < cols; i++) {
        var wx = bx + ww * (i * 2 + 1), isDoor = i === 2;
        var wy = isDoor ? by + bh * 0.35 : by + bh * 0.22, wh = isDoor ? bh * 0.65 : bh * 0.36;
        ctx.fillStyle = "rgba(255," + (170 + glow * 40) + ",80," + (0.12 + glow * 0.75) + ")";
        ctx.fillRect(wx, wy, ww, wh);
        ctx.strokeStyle = "#3b2a1a"; ctx.lineWidth = 2; ctx.strokeRect(wx, wy, ww, wh);
        if (!isDoor) { ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke(); }
      }
      return { bx: bx, by: by, bw: bw, bh: bh };
    }
    function stringLights(x1, y1, x2, y2, sag, tt, glow) {
      var n = Math.round((x2 - x1) / 16);
      for (var i = 0; i <= n; i++) {
        var p = i / n, x = x1 + (x2 - x1) * p, y = y1 + (y2 - y1) * p + Math.sin(p * Math.PI) * sag;
        var on = glow * (0.55 + 0.45 * Math.sin(tt * 3 + i * 1.3));
        var hue = ["255,210,90", "255,120,60", "255,80,150", "120,230,255"][i % 4];
        ctx.fillStyle = "rgba(" + hue + "," + (0.15 + on * 0.85) + ")";
        ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fill();
        if (on > 0.6) { ctx.fillStyle = "rgba(" + hue + ",.18)"; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill(); }
      }
    }
    function rangoli(cx, cy, r, tt, a) {
      ctx.save(); ctx.translate(cx, cy); ctx.scale(1, 0.35); ctx.globalAlpha = a; ctx.rotate(tt * 0.15);
      var cs = ["#ff3d7f", "#ffb03a", "#2fd3c4", "#a77bff"];
      for (var ring = 3; ring >= 1; ring--) {
        var petals = ring * 6;
        for (var i = 0; i < petals; i++) {
          ctx.save(); ctx.rotate((i / petals) * Math.PI * 2);
          ctx.beginPath(); ctx.ellipse(r * ring * 0.28, 0, r * 0.16, r * 0.07, 0, 0, 7);
          ctx.fillStyle = cs[(i + ring) % cs.length]; ctx.fill(); ctx.restore();
        }
      }
      ctx.beginPath(); ctx.arc(0, 0, r * 0.14, 0, 7); ctx.fillStyle = "#fff0b8"; ctx.fill();
      ctx.restore();
    }
    function lantern(l, tt) {
      var x = l.x + Math.sin(tt * 0.8 + l.p) * 10, y = l.y, s = l.s;
      var g = ctx.createRadialGradient(x, y, 0, x, y, s * 3);
      g.addColorStop(0, "rgba(255,170,70,.35)"); g.addColorStop(1, "rgba(255,120,30,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s * 3, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - s * 0.55, y - s); ctx.lineTo(x + s * 0.55, y - s);
      ctx.lineTo(x + s * 0.4, y + s); ctx.lineTo(x - s * 0.4, y + s); ctx.closePath();
      var lg = ctx.createLinearGradient(0, y - s, 0, y + s);
      lg.addColorStop(0, "#ffe7a8"); lg.addColorStop(1, "#ff8a2a");
      ctx.fillStyle = lg; ctx.fill();
    }

    /* ---------- main loop ---------- */
    var lastAuto = 0, lastLantern = 0;
    function frame(now) {
      var tt = (now - t0) / 1000, since = lit ? (now - litAt) / 1000 : 0;
      var glow = lit ? Math.min(1, since / 2.5) : 0;

      var sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#05070f"); sky.addColorStop(0.6, lit ? "#1a1030" : "#0a0d18"); sky.addColorStop(1, lit ? "#3a1a10" : "#0d0c12");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

      for (var i = 0; i < stars.length; i++) {
        var st = stars[i]; ctx.fillStyle = "rgba(255,255,240," + (0.35 + 0.35 * Math.sin(tt * 2 + st.p)) + ")";
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7); ctx.fill();
      }
      // moon-less glow on horizon
      var hz = ctx.createRadialGradient(W / 2, H, 0, W / 2, H, H * 0.9);
      hz.addColorStop(0, "rgba(255,140,40," + 0.35 * glow + ")"); hz.addColorStop(1, "rgba(255,140,40,0)");
      ctx.fillStyle = hz; ctx.fillRect(0, 0, W, H);

      var hs = house(glow);
      if (glow > 0) {
        stringLights(hs.bx - 14, hs.by, W / 2, hs.by - hs.bh * 0.42, 6, tt, glow);
        stringLights(W / 2, hs.by - hs.bh * 0.42, hs.bx + hs.bw + 14, hs.by, 6, tt, glow);
        stringLights(hs.bx, hs.by + 6, hs.bx + hs.bw, hs.by + 6, 14, tt + 1, glow);
        // toran over door
        var dx = hs.bx + (hs.bw / 11) * 5, dw = hs.bw / 11;
        for (var k = 0; k < 6; k++) {
          ctx.fillStyle = k % 2 ? "#ff8a00" : "#3fbf4a";
          ctx.beginPath(); ctx.moveTo(dx + (dw / 6) * k, hs.by + hs.bh * 0.35);
          ctx.lineTo(dx + (dw / 6) * (k + 0.5), hs.by + hs.bh * 0.35 + 9 * glow); ctx.lineTo(dx + (dw / 6) * (k + 1), hs.by + hs.bh * 0.35); ctx.fill();
        }
      }
      // ground
      ctx.fillStyle = lit ? "#2a160c" : "#120c0a"; ctx.fillRect(0, H * 0.84, W, H * 0.16);
      if (glow > 0) rangoli(W / 2, H * 0.92, Math.min(W, 520) * 0.22, tt, glow);

      for (var j = 0; j < diyas.length; j++) {
        var d = diyas[j];
        if (Math.abs(d.x - W / 2) < Math.min(W, 520) * 0.2) continue; // leave space for rangoli
        diya(d, tt, lit && since > d.d);
      }
      // centre diya always shown (it's the one you "light")
      diya({ x: W / 2, y: H * 0.9, s: Math.min(W, 520) * 0.05, f: 0 }, tt, lit);

      if (lit && !reduce) {
        if (since > 1.2 && now - lastLantern > 1400 && lanterns.length < 8) {
          lastLantern = now; lanterns.push({ x: W * (0.1 + Math.random() * 0.8), y: H * 0.85, s: 6 + Math.random() * 6, v: 0.25 + Math.random() * 0.35, p: Math.random() * 6 });
        }
        if (since > 2 && now - lastAuto > 1800) { lastAuto = now; launch(); }
      }
      for (var q = lanterns.length - 1; q >= 0; q--) { var L = lanterns[q]; L.y -= L.v; lantern(L, tt); if (L.y < -40) lanterns.splice(q, 1); }

      for (var r = rockets.length - 1; r >= 0; r--) {
        var R = rockets[r];
        if (R.tx != null) R.x += (R.tx - R.x) * 0.06;
        R.y -= R.v; ctx.fillStyle = "#fff2c0"; ctx.beginPath(); ctx.arc(R.x, R.y, 2, 0, 7); ctx.fill();
        ctx.fillStyle = "rgba(255,200,120,.4)"; ctx.fillRect(R.x - 0.7, R.y, 1.4, 12);
        if (R.y <= R.ty) { burst(R.x, R.y, R.c); rockets.splice(r, 1); }
      }
      ctx.globalCompositeOperation = "lighter";
      for (var p = sparks.length - 1; p >= 0; p--) {
        var S = sparks[p]; S.x += S.vx; S.y += S.vy; S.vy += 0.035; S.vx *= 0.985; S.vy *= 0.985; S.life -= 0.012;
        if (S.life <= 0) { sparks.splice(p, 1); continue; }
        ctx.globalAlpha = S.life; ctx.fillStyle = S.c; ctx.beginPath(); ctx.arc(S.x, S.y, 1.8, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
