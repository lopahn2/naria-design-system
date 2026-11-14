// Like Burst
// Like: the heart squashes down and bounces up, fills red, and a ring of dots
// flies out and fades. The count rolls up by one. Unlike rolls it back and the
// heart empties with a small dip.
(() => {
  const { S, step, clamp, after } = Motion;
  const $ = id => document.getElementById(id);
  const like = $('like'), heart = $('heart'), hp = $('hp'), burst = $('burst'), col = $('col');
  const COLORS = ['var(--heart)', 'var(--orange)', 'var(--yellow)', 'var(--green)', 'var(--blue)', 'var(--purple)', 'var(--pink)', 'var(--heart)'];
  const dots = COLORS.map((c, i) => {
    const el = document.createElement('i'); el.style.background = c; burst.appendChild(el);
    return { el, a: i / COLORS.length * Math.PI * 2 + .2, r: 0, o: 0 };
  });
  const H = S(1, 520, 13), F = S(0, 300, 26), N = S(0, 260, 20);
  let on = false, clock = 0, userUntil = 0, bt = 9;

  function toggle() {
    on = !on;
    like.setAttribute('aria-pressed', on);
    if (on) { H.x = .6; H.v = 9; F.t = 1; N.t = 1; bt = 0; }
    else { H.x = .85; H.v = 3; F.t = 0; N.t = 0; }
  }
  like.addEventListener('click', () => { userUntil = clock + 6; toggle(); });
  (function auto() { if (clock >= userUntil) toggle(); after(on ? 2.2 : 1.6, auto); })();

  Motion.register({
    frame(dt) { clock += dt; bt += dt; [H, F, N].forEach(s => step(s, dt)); },
    render() {
      const sq = H.x;
      heart.style.transform = `scale(${(sq * (2 - Math.min(sq, 1.15)) ).toFixed(4)},${sq.toFixed(4)})`;
      const f = clamp(F.x, 0, 1);
      hp.style.fill = `color-mix(in srgb, var(--heart) ${(f * 100).toFixed(1)}%, transparent)`;
      hp.style.stroke = f > .5 ? 'var(--heart)' : '';
      // dots fly out fast, slow down, shrink and fade within half a second
      const k = clamp(bt / .55, 0, 1), e = 1 - Math.pow(1 - k, 3);
      dots.forEach((d, i) => {
        const r = 10 + e * (22 + (i % 2) * 6);
        d.el.style.opacity = k >= 1 ? 0 : (1 - k * k).toFixed(3);
        d.el.style.transform = `translate(${(Math.cos(d.a) * r).toFixed(2)}px,${(Math.sin(d.a) * r).toFixed(2)}px) scale(${(1 - .7 * k).toFixed(3)})`;
      });
      col.style.transform = `translateY(${(-22 * N.x).toFixed(2)}px)`;
    },
  });
})();
