// Star Rating
// Hover lights stars up to the pointer with a short stagger; each star has a
// fill spring and a pop spring. Clicking sets the rating; leaving goes back
// to it. The word below rolls on its own spring.
(() => {
  const { S, step, clamp, after } = Motion;
  const $ = id => document.getElementById(id);
  const stars = [...document.querySelectorAll('.st')].map((el, i) => ({ el, svg: el.firstElementChild, path: el.querySelector('path'), f: S(0, 300, 24), p: S(1, 520, 13), lit: false }));
  const col = $('col'), stEl = $('stars');
  const Wd = S(0, 260, 22);
  let rating = 0, show = 0, clock = 0, userUntil = 0;

  function light(n) {
    show = n; Wd.t = n;
    stars.forEach((s, i) => {
      const on = i < n;
      if (on !== s.lit) {
        s.lit = on;
        after(on ? i * .05 : 0, () => { s.f.t = s.lit ? 1 : 0; if (s.lit) { s.p.x = .7; s.p.v = 7; } });
      }
    });
  }
  stars.forEach((s, i) => {
    s.el.addEventListener('pointerenter', () => { userUntil = clock + 6; light(i + 1); });
    s.el.addEventListener('click', () => { userUntil = clock + 8; rating = i + 1; stars.forEach((t, k) => t.el.setAttribute('aria-checked', k === i)); light(rating); });
  });
  stEl.addEventListener('pointerleave', () => light(rating));
  const PLAN = [2, 4, 3, 5, 5, 0];
  let n = 0;
  (function auto() { if (clock >= userUntil) light(PLAN[n++ % PLAN.length]); after(1.3, auto); })();

  Motion.register({
    frame(dt) { clock += dt; step(Wd, dt); stars.forEach(s => { step(s.f, dt); step(s.p, dt); }); },
    render() {
      stars.forEach(s => {
        const f = clamp(s.f.x, 0, 1);
        s.path.style.fill = f > .01 ? `color-mix(in srgb, var(--yellow) ${(f * 100).toFixed(1)}%, var(--fill-3))` : '';
        s.svg.style.transform = `scale(${s.p.x.toFixed(4)})`;
      });
      col.style.transform = `translateY(${(-20 * Wd.x).toFixed(2)}px)`;
    },
  });
})();
