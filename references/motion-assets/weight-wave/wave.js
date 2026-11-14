// Weight Wave
// Each letter's weight is a spring pulled toward a bell curve around the
// pointer, so a swell of bold rolls through the line as you move. With nobody
// pointing, the swell sweeps back and forth by itself.
(() => {
  const { S, step, clamp } = Motion;
  const wave = document.getElementById('wave');
  const TEXT = 'Feel the weight';
  const LIGHT = 300, BOLD = 820, SPREAD = .13;   // SPREAD: width of the swell, as a share of the line

  const letters = [...TEXT].map(ch => {
    const el = document.createElement('span');
    el.className = 'ch';
    el.textContent = ch;
    el.setAttribute('aria-hidden', 'true');
    wave.appendChild(el);
    return { el, w: S(LIGHT, 260, 22), g: 0 };
  });

  const focus = S(-.2, 150, 22);   // where the swell is, 0 = left end of the line, 1 = right end
  let hover = false, t = 0;
  document.body.addEventListener('pointermove', e => {
    const r = wave.getBoundingClientRect();
    hover = true;
    focus.t = (e.clientX - r.left) / r.width;
  });
  document.body.addEventListener('pointerleave', () => { hover = false; t = 0; });

  Motion.register({
    frame(dt) {
      if (!hover) {
        t += dt;
        focus.t = -.06 + 1.12 * (.5 - .5 * Math.cos(t * Math.PI * 2 / 4.6));
      }
      step(focus, dt);
      letters.forEach(l => step(l.w, dt));
    },
    render() {
      // Read every centre first, then write, so the line lays out once a frame.
      const total = wave.offsetWidth || 1;
      const centres = letters.map(l => (l.el.offsetLeft + l.el.offsetWidth / 2) / total);
      letters.forEach((l, k) => {
        const d = (centres[k] - focus.x) / SPREAD;
        l.g = Math.exp(-d * d);
        l.w.t = LIGHT + (BOLD - LIGHT) * l.g;
        l.el.style.fontWeight = clamp(l.w.x, 100, 900).toFixed(1);
        l.el.style.opacity = (.42 + .58 * clamp((l.w.x - LIGHT) / (BOLD - LIGHT), 0, 1)).toFixed(3);
      });
    },
  });
})();
