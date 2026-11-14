// Magnetic Button
// Inside a pull radius the button moves a share of the way toward the cursor
// and the label a little more, so it feels like it has depth. Outside the
// radius both spring back. Idle, a small dot plays the cursor: it drifts in,
// circles the button and wanders off again.
(() => {
  const { S, step, clamp } = Motion;
  const $ = id => document.getElementById(id);
  const field = $('field'), mag = $('mag'), lbl = $('lbl'), cur = $('cur');
  const R = 130;
  const bx = S(0, 170, 13), by = S(0, 170, 13), lx = S(0, 220, 15), ly = S(0, 220, 15), sc = S(1, 400, 18), co = S(0, 200, 26);
  let px = null, py = null, last = -1e9, clock = 0, gx = 0, gy = 0;

  field.addEventListener('pointermove', e => { const r = field.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; last = clock; });
  field.addEventListener('pointerleave', () => { px = null; });
  mag.addEventListener('pointerdown', () => { sc.t = .94; });
  mag.addEventListener('pointerup', () => { sc.t = 1; sc.v = 3; });

  Motion.register({
    frame(dt) {
      clock += dt;
      const w = field.clientWidth, h = field.clientHeight, cx = w / 2, cy = h / 2;
      const ghost = px === null || clock - last > 2.5;
      if (ghost) {
        // 7 s loop: come in from the left, circle the button, leave to the right
        const t = clock % 7;
        if (t < 1.4) { gx = cx - 150 + t / 1.4 * 110; gy = cy + 50 - t / 1.4 * 40; }
        else if (t < 5) { const a = (t - 1.4) / 3.6 * Math.PI * 2 + Math.PI; gx = cx + Math.cos(a) * 46; gy = cy + Math.sin(a) * 18 + 4; }
        else { const k = (t - 5) / 2; gx = cx - 46 + k * 230; gy = cy + 4 + k * 60; }
        co.t = .55;
      } else { gx = px; gy = py; co.t = 0; }
      const dx = gx - cx, dy = gy - cy, d = Math.hypot(dx, dy);
      const pull = d < R ? 1 - d / R * .35 : 0;
      bx.t = dx * .32 * pull; by.t = dy * .38 * pull;
      lx.t = dx * .14 * pull; ly.t = dy * .18 * pull;
      sc.t = sc.t < 1 ? sc.t : 1 + .06 * pull;
      [bx, by, lx, ly, sc, co].forEach(s => step(s, dt));
    },
    render() {
      mag.style.transform = `translate(${bx.x.toFixed(2)}px,${by.x.toFixed(2)}px) scale(${sc.x.toFixed(4)})`;
      lbl.style.transform = `translate(${lx.x.toFixed(2)}px,${ly.x.toFixed(2)}px)`;
      cur.style.opacity = clamp(co.x, 0, 1).toFixed(3);
      cur.style.transform = `translate(${gx.toFixed(2)}px,${gy.toFixed(2)}px)`;
    },
  });
})();
