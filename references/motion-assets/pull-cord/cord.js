// Pull Cord
// The cord is a chain of points with weight, kept at length by soft links, so
// it hangs, swings and whips like a rope. Held, the bead follows the pointer
// until the cord is tight; past that it stretches like rubber and tugs the
// lamp, which leans toward the pull on its wire. A pull past the click flips
// the switch: the light room opens as a circle from the bulb (and closes back
// into it), the bulb pops and the lamp bounces. Let go and the cord whips back
// while the lamp swings to rest. It pulls itself when idle, a tap or Enter
// pulls it too. It follows the card's own light and dark setting, and sends
// a 'motion:theme' event when it flips so the page around it can follow.
(() => {
  const { S, tune, step, clamp, after } = Motion;
  const $ = id => document.getElementById(id);
  const scene = $('scene'), lit = $('lit'), grab = $('grab');

  const WIRE = 122, SHADE = 66, AX = 34, AY = SHADE - 3;   // wire length; where the cord leaves the shade
  const N = 12, SEG = 9, L = N * SEG;                      // links in the cord, and its length
  const CLICK = 22, MAXS = 54;                             // stretch that flips the switch; the most it gives

  const ROOM = `<svg class="rope"><path/></svg><div class="lamp"><div class="head"><i class="bulb"></i><i class="shade"></i><i class="cap"></i></div></div><svg class="rope"><path/></svg><i class="bead"></i>`;
  const rooms = [...document.querySelectorAll('.room')].map(r => {
    r.innerHTML = ROOM;
    const q = s => r.querySelector(s);
    return { lamp: q('.lamp'), wire: q('.rope path'), head: q('.head'), bulb: q('.bulb'), path: q('.rope + .lamp ~ .rope path'), bead: q('.bead') };
  });

  const TH = S(0, 46, 3), TUG = S(0, 300, 13), R = S(0, 120, 21), BP = S(1, 420, 13);   // lamp angle, drop, light radius, bulb pop
  tune(TH, 46, 3); tune(TUG, 300, 13); tune(R, 120, 21); tune(BP, 420, 13);
  const HX = S(0, 210, 22), HY = S(0, 210, 22);            // the hand that pulls when nobody does
  const K = S(1, 300, 17); tune(K, 300, 17);              // how far the cord is stretched: it eases back, so letting go is a bounce and not a whip
  let on = false, armed = true, held = null, ghost = false, stretch = 0, lean = 0, clock = 0, userUntil = 0, side = 1, W = 0, H = 0, scheme = '';

  const pts = [];
  const anchor = () => {
    const c = Math.cos(TH.x), s = Math.sin(TH.x), y = WIRE + TUG.x + AY;
    return [W / 2 + AX * c - y * s, AX * s + y * c];
  };
  const bulbAt = () => {
    const c = Math.cos(TH.x), s = Math.sin(TH.x), y = WIRE + TUG.x + 63;
    return [W / 2 - y * s, y * c];
  };
  function measure() {
    W = document.body.clientWidth; H = document.body.clientHeight;
    if (!pts.length) { const [ax, ay] = anchor(); for (let i = 0; i <= N; i++) pts.push({ x: ax, y: ay + i * SEG, vx: 0, vy: 0 }); }
  }
  measure();

  function flip(to = !on) {
    if (to === on) return;
    on = to;
    grab.setAttribute('aria-checked', on);
    BP.x = on ? 1.35 : .8; TUG.v += 150;
    // tell the page around it, so anything drawn over the lamp can change with the light
    const now = on;
    after(.14, () => { if (now === on) scene.dispatchEvent(new CustomEvent('motion:theme', { bubbles: true, composed: true, detail: { light: on } })); });
  }

  // what holds the bead: a real pointer, or the idle hand
  const pin = () => held ? [held.x, held.y] : ghost ? [HX.x, HY.x] : null;
  function pull() {                                  // one pull by the idle hand (also a tap, Enter or Space)
    if (ghost || held) return;
    const b = pts[N];
    ghost = true; armed = true; side = -side;
    HX.x = b.x; HY.x = b.y; HX.v = b.vx; HY.v = b.vy;
    const [ax, ay] = anchor();
    HX.t = ax + side * 26; HY.t = ay + L + 64;
    after(1.1, () => { ghost = false; });             // let go even if it never clicked
  }

  const local = e => { const r = document.body.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  grab.addEventListener('pointerdown', e => {
    const [x, y] = local(e), b = pts[N];
    held = { id: e.pointerId, x: b.x, y: b.y, ox: b.x - x, oy: b.y - y, moved: 0, sx: x, sy: y, flipped: false };
    ghost = false; armed = true; userUntil = clock + 7;
    try { grab.setPointerCapture(e.pointerId); } catch {}
    grab.classList.add('is-held');
  });
  grab.addEventListener('pointermove', e => {
    if (!held || e.pointerId !== held.id) return;
    const [x, y] = local(e);
    held.x = x + held.ox; held.y = y + held.oy;
    held.moved = Math.max(held.moved, Math.hypot(x - held.sx, y - held.sy));
    userUntil = clock + 7;
  });
  function drop(e) {
    if (!held || e.pointerId !== held.id) return;
    const tap = held.moved < 5 && !held.flipped && e.type === 'pointerup';
    held = null;
    grab.classList.remove('is-held');
    if (tap) pull();
  }
  grab.addEventListener('pointerup', drop);
  grab.addEventListener('pointercancel', drop);
  grab.addEventListener('click', e => { if (!e.detail) { userUntil = clock + 7; pull(); } });   // keyboard

  (function auto() {
    if (clock >= userUntil && !held && !ghost) pull();
    after(4.2, auto);
  })();
  // the card's own sun and moon button: the lamp follows it
  (function watch() {
    const now = getComputedStyle(document.documentElement).colorScheme === 'light' ? 'light' : 'dark';
    if (now !== scheme) { if (scheme) flip(now === 'light'); else if (now === 'light') { on = true; grab.setAttribute('aria-checked', 'true'); R.x = R.t = 1; } scheme = now; }
    after(.4, watch);
  })();

  Motion.register({
    frame(dt) {
      clock += dt;
      [TH, TUG, R, BP, HX, HY, K].forEach(s => step(s, dt));
      if (dt <= 0) return;
      const [ax, ay] = anchor(), p = pin(), b = pts[N];

      // the held end: free inside the cord's reach, rubber past it
      let px = 0, py = 0;
      stretch = 0; lean = 0;
      if (p) {
        const dx = p[0] - ax, dy = p[1] - ay, d = Math.hypot(dx, dy) || 1;
        const over = Math.max(0, d - L), give = MAXS * (1 - Math.exp(-over / 70)), r = Math.min(d, L) + give;
        px = ax + dx / d * r; py = ay + dy / d * r;
        stretch = give; lean = over > 0 ? dx / d : 0;
        if (over > 0) { K.x = K.t = r / L; K.v = 0; }
        if (armed && give > CLICK) {
          armed = false; flip();
          if (held) held.flipped = true; else after(.12, () => { ghost = false; });
        }
      }
      if (!p || !stretch) K.t = 1;
      const seg = SEG * Math.max(1, K.x);
      TUG.t = stretch * .22;
      TH.t = clamp(-lean * stretch / MAXS * .5, -.3, .3);

      // the rope: gravity, then links pulled back to length a few times
      const prev = pts.map(q => [q.x, q.y]);
      for (let i = 1; i <= N; i++) {
        const q = pts[i], k = Math.exp(-(i === N ? 1.1 : 2.4) * dt);
        q.vy += 2600 * dt; q.vx *= k; q.vy *= k;
        const sp = Math.hypot(q.vx, q.vy);
        if (sp > 2600) { q.vx *= 2600 / sp; q.vy *= 2600 / sp; }
        q.x += q.vx * dt; q.y += q.vy * dt;
      }
      for (let it = 0; it < 8; it++) {
        pts[0].x = ax; pts[0].y = ay;
        if (p) { b.x = px; b.y = py; }
        for (let i = 0; i < N; i++) {
          const a = pts[i], c = pts[i + 1], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || 1e-6, f = (d - seg) / d * .5;
          const wa = i === 0 ? 0 : 1, wc = i + 1 === N ? (p ? 0 : .3) : 1, sum = wa + wc || 1;   // the bead is heavy
          a.x += dx * f * wa / sum * 2; a.y += dy * f * wa / sum * 2;
          c.x -= dx * f * wc / sum * 2; c.y -= dy * f * wc / sum * 2;
        }
      }
      pts[0].x = ax; pts[0].y = ay;
      if (p) { b.x = px; b.y = py; }
      for (let i = 1; i <= N; i++) { pts[i].vx = (pts[i].x - prev[i][0]) / dt; pts[i].vy = (pts[i].y - prev[i][1]) / dt; }
      R.t = on ? 1 : 0;
      if (on) tune(R, 120, 21); else tune(R, 170, 27);   // it opens wide and closes a little faster
    },
    render() {
      if (document.body.clientWidth !== W || document.body.clientHeight !== H) measure();
      const th = TH.x, tug = TUG.x, b = pts[N], e = pts[N - 1];
      let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 1; i < N; i++) d += `Q${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${((pts[i].x + pts[i + 1].x) / 2).toFixed(1)} ${((pts[i].y + pts[i + 1].y) / 2).toFixed(1)}`;
      d += `L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      const ang = Math.atan2(e.x - b.x, b.y - e.y);
      const wl = WIRE + tug - 4, wd = `M${(W / 2).toFixed(1)} -4L${(W / 2 - Math.sin(th) * wl).toFixed(2)} ${(Math.cos(th) * wl).toFixed(2)}`;
      rooms.forEach(o => {
        o.lamp.style.transform = `rotate(${th.toFixed(4)}rad)`;
        o.wire.setAttribute('d', wd);
        o.head.style.transform = `translateY(${(WIRE + tug).toFixed(2)}px)`;
        o.bulb.style.transform = `scale(${BP.x.toFixed(4)})`;
        o.path.setAttribute('d', d);
        o.bead.style.transform = `translate(${b.x.toFixed(2)}px,${b.y.toFixed(2)}px) rotate(${ang.toFixed(4)}rad)`;
      });
      grab.style.transform = `translate(${b.x.toFixed(2)}px,${b.y.toFixed(2)}px)`;
      // light: a circle from the bulb, big enough to pass the far corner
      const [bx, by] = bulbAt(), far = Math.hypot(Math.max(bx, W - bx), Math.max(by, H - by)) + 24, r = Math.max(0, R.x) * far;
      lit.style.visibility = r < 4 ? 'hidden' : 'visible';
      lit.style.clipPath = `circle(${r.toFixed(1)}px at ${bx.toFixed(1)}px ${by.toFixed(1)}px)`;
    },
  });
})();
