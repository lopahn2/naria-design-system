// Toggle Switch
// Each switch has a position spring and a stretch spring. Flipping kicks the
// stretch, so the knob grows long toward where it is going, then the
// position lands with a small bounce and the knob rounds back up.
(() => {
  const { S, step, clamp, after } = Motion;
  const sws = [...document.querySelectorAll('.sw')].map((el, i) => ({ el, k: el.firstElementChild, p: S(0, 320, 18), w: S(0, 300, 20), on: false }));
  let clock = 0, userUntil = 0;

  function flip(s) {
    s.on = !s.on; s.el.setAttribute('aria-checked', s.on);
    s.p.t = s.on ? 1 : 0; s.w.t = 0; s.w.v = 60;
  }
  sws.forEach(s => s.el.addEventListener('click', () => { userUntil = clock + 8; flip(s); }));
  flip(sws[0]); sws[0].p.x = 1; sws[0].w.v = 0;
  const ORDER = [1, 2, 0, 3, 2, 1, 0, 3];
  let n = 0;
  (function auto() { if (clock >= userUntil) flip(sws[ORDER[n++ % ORDER.length]]); after(1.1, auto); })();

  Motion.register({
    frame(dt) { clock += dt; sws.forEach(s => { step(s.p, dt); step(s.w, dt); }); },
    render() {
      sws.forEach(s => {
        // the knob grows long while it travels; the edge in front leads
        const grow = clamp(s.w.x, 0, 1) * 10, x = s.p.x * 20;
        s.k.style.width = (26 + grow).toFixed(2) + 'px';
        s.k.style.transform = `translateX(${(s.on ? x - grow * clamp(s.p.x, 0, 1) : x).toFixed(2)}px)`;
        const p = clamp(s.p.x, 0, 1);
        s.el.style.background = `color-mix(in srgb, var(--green) ${(p * 100).toFixed(1)}%, var(--fill-3))`;
      });
    },
  });
})();
