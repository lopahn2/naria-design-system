// Goo Menu
// A + button that pours out liquid bubbles. Bubbles are springs; the SVG goo filter
// fuses them while they are close, so they peel off like drops. Clicking a bubble
// pulls everything back in and the + morphs into a toast pill.
(() => {
  const { S, tune, step, clamp, spring, num, svg, after, cancel } = Motion;
  const $ = id => document.getElementById(id);
  const layer = $('gooLayer'), ui = $('gooUI'), root = $('goo');

  const T = {
    out: spring('--goo-out', '230 15'), in: spring('--goo-in', '520 34'),
    release: spring('--goo-release', '300 12'), toast: spring('--goo-toast', '260 17'),
    radius: num('--goo-radius', 112), stagger: num('--goo-stagger', 45) / 1000,
    toastSec: num('--goo-toast-ms', 2600) / 1000, blur: num('--goo-blur', 10),
  };
  $('gooBlur').setAttribute('stdDeviation', T.blur);

  const OX = 210, OY = 250, BS = 48, MS = 64;
  const ACT = [
    ['Camera', '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="12.5" r="3.5"/>', 'Camera ready'],
    ['Photo', '<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m20 15-4.5-4.5L6 19"/>', 'Photo added'],
    ['Voice', '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"/>', 'Recording'],
    ['Location', '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.5"/>', 'Location shared'],
  ];
  const home = [-160, -117, -63, -20].map(d => {
    const a = d * Math.PI / 180;
    return { x: Math.cos(a) * T.radius, y: Math.sin(a) * T.radius };
  });

  const mainBlob = document.createElement('div'); mainBlob.className = 'blob';
  mainBlob.style.height = MS + 'px';
  const mainBtn = document.createElement('button');
  mainBtn.className = 'gbtn main'; mainBtn.setAttribute('aria-label', 'Open actions'); mainBtn.setAttribute('aria-expanded', 'false');
  mainBtn.innerHTML = `<span class="plus">${svg('<path d="M12 5v14M5 12h14"/>', 2.2)}</span><span class="toast"></span>`;
  const plus = mainBtn.querySelector('.plus'), toastEl = mainBtn.querySelector('.toast');
  const main = { sc: S(1, 520, 16), w: S(MS, 300, 20), rot: S(0, 320, 20) };

  const bubs = ACT.map(([name, p]) => {
    const blob = document.createElement('div'); blob.className = 'blob';
    blob.style.width = blob.style.height = BS + 'px';
    layer.appendChild(blob);
    const btn = document.createElement('button');
    btn.className = 'gbtn bub'; btn.setAttribute('aria-label', name); btn.tabIndex = -1;
    btn.innerHTML = svg(p) + `<span class="tip">${name}</span>`;
    ui.appendChild(btn);
    return { blob, btn, x: S(0), y: S(0), s: S(.5, 420, 22), pending: null, drag: null };
  });
  layer.appendChild(mainBlob); ui.appendChild(mainBtn);

  let open = false, toastTimer = null, clock = 0;
  const sendTo = (b, delay, pos, k, c) => { b.pending = { t: delay, pos, k, c }; };

  function setOpen(v) {
    if (v === open) return;
    open = v;
    mainBtn.setAttribute('aria-expanded', v);
    main.rot.t = v ? 135 : 0;
    main.sc.v -= v ? 3 : 1.6;
    bubs.forEach((b, i) => {
      b.btn.tabIndex = v ? 0 : -1;
      if (v) { sendTo(b, i * T.stagger, home[i], ...T.out); b.s.t = 1; tune(b.s, 300, 14); }
      else { sendTo(b, (bubs.length - 1 - i) * T.stagger * .66, { x: 0, y: 0 }, ...T.in); b.s.t = .5; tune(b.s, 420, 30); b.btn.classList.remove('hover'); }
    });
  }

  function toast(i) {
    const [, p, label] = ACT[i];
    toastEl.innerHTML = svg(p) + `<span>${label}</span>`;
    toastEl.style.position = 'absolute'; const tw = toastEl.scrollWidth; toastEl.style.position = '';
    mainBtn.classList.add('toasting');
    tune(main.w, ...T.toast); main.w.t = tw + 44;
    main.sc.v -= 2;
    if (toastTimer) cancel(toastTimer);
    toastTimer = after(T.toastSec, endToast);
  }
  function endToast() {
    toastTimer = null;
    mainBtn.classList.remove('toasting');
    tune(main.w, 320, 22); main.w.t = MS;
    main.sc.v -= 1.5;
  }

  mainBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (toastTimer) { cancel(toastTimer); endToast(); }
    setOpen(!open);
  });

  // bubbles: hover, drag with rubber band, click to run
  const band = (r, d = 70) => d * (1 - 1 / (r * .55 / d + 1));
  bubs.forEach((b, i) => {
    const btn = b.btn;
    btn.addEventListener('pointerenter', () => { if (!open) return; btn.classList.add('hover'); b.s.t = 1.14; tune(b.s, 500, 18); });
    btn.addEventListener('pointerleave', () => { btn.classList.remove('hover'); if (open && !b.drag) b.s.t = 1; });
    btn.addEventListener('pointerdown', e => {
      if (!open) return;
      b.drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, live: false };
      try { btn.setPointerCapture(e.pointerId); } catch {}
      b.s.t = .92;
    });
    btn.addEventListener('pointermove', e => {
      const d = b.drag; if (!d || d.id !== e.pointerId) return;
      const dx = e.clientX - d.x0, dy = e.clientY - d.y0, r = Math.hypot(dx, dy);
      if (!d.live && r > 4) { d.live = true; b.s.t = 1.08; btn.classList.remove('hover'); }
      if (!d.live) return;
      const k = band(r) / (r || 1);
      b.pending = null; tune(b.x, 900, 50); tune(b.y, 900, 50);
      b.x.t = home[i].x + dx * k; b.y.t = home[i].y + dy * k;
    });
    const up = e => {
      const d = b.drag; if (!d || d.id !== e.pointerId) return;
      b.drag = null;
      if (d.live) {
        // let go: it snaps home with a wobble
        tune(b.x, ...T.release); tune(b.y, ...T.release);
        b.x.t = home[i].x; b.y.t = home[i].y; b.s.t = 1;
      } else if (e.type === 'pointerup') {
        b.s.t = 1; b.s.v += 4;
        after(.08, () => setOpen(false));
        after(.32, () => toast(i));
      }
    };
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointercancel', up);
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(false); after(.3, () => toast(i)); }
    });
    btn.addEventListener('click', e => e.stopPropagation());
  });

  document.addEventListener('click', e => { if (open && !root.contains(e.target)) setOpen(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  Motion.register({
    frame(dt) {
      clock += dt;
      bubs.forEach(b => {
        if (b.pending && (b.pending.t -= dt) <= 0) {
          const p = b.pending; b.pending = null;
          tune(b.x, p.k, p.c); tune(b.y, p.k, p.c);
          b.x.t = p.pos.x; b.y.t = p.pos.y;
        }
        step(b.x, dt); step(b.y, dt); step(b.s, dt);
      });
      step(main.sc, dt); step(main.w, dt); step(main.rot, dt);
    },
    render() {
      const breathe = !open && !toastTimer ? Math.sin(clock * 2.2) * .015 : 0;
      const w = main.w.x, s = main.sc.x + breathe;
      const mt = `translate(${OX - w / 2}px,${OY - MS / 2}px) scale(${s})`;
      mainBlob.style.width = w + 'px'; mainBlob.style.transform = mt;
      mainBtn.style.width = w + 'px'; mainBtn.style.transform = mt;
      plus.style.transform = `rotate(${main.rot.x}deg)`;

      bubs.forEach(b => {
        const x = OX + b.x.x - BS / 2, y = OY + b.y.x - BS / 2, sc = b.s.x;
        // squash and stretch along the direction of travel
        const sp = Math.hypot(b.x.v, b.y.v);
        const st = 1 + Math.min(sp / 2600, .32);
        const a = Math.atan2(b.y.v, b.x.v);
        b.blob.style.transform = `translate(${x}px,${y}px) rotate(${a}rad) scale(${sc * st},${sc / st})`;
        b.btn.style.transform = `translate(${x}px,${y}px) scale(${sc})`;
        b.btn.style.opacity = clamp((Math.hypot(b.x.x, b.y.x) - 18) / 40, 0, 1);
        b.btn.style.pointerEvents = open ? 'auto' : 'none';
      });
    },
  });
})();
