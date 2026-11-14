// Expand Card
// One progress spring per row drives everything: card height, photo size and
// corner, title and price position. The chosen row also rides up to the top
// while the others sink and fade. Plays by itself until you click.
(() => {
  const { S, step, clamp, after } = Motion;
  const list = document.getElementById('list');
  const els = [...document.querySelectorAll('.ex')];
  const LIST_H = 280, ROW = 72, GAP = 8, PAD = (LIST_H - (3 * ROW + 2 * GAP)) / 2;
  const rows = els.map((el, i) => ({
    el, i,
    thumb: el.querySelector('.thumb'), head: el.querySelector('.head'),
    price: el.querySelector('.price'), more: el.querySelector('.more'),
    p: S(0, 240, 21), a: S(0, 260, 28), y: S(PAD + i * (ROW + GAP), 300, 26), o: S(1, 300, 30), s: S(1, 300, 26),
  }));
  let open = -1, clock = 0, userUntil = 0, k = 0;

  function show(i) {
    open = i;
    rows.forEach(r => {
      const home = PAD + r.i * (ROW + GAP);
      if (i < 0) { r.p.t = 0; r.a.t = 0; r.y.t = home; r.o.t = 1; r.s.t = 1; return; }
      if (r.i === i) { r.p.t = 1; r.y.t = 0; r.o.t = 1; r.s.t = 1; after(.16, () => { if (open === i) r.a.t = 1; }); r.el.style.zIndex = 2; }
      else { r.a.t = 0; r.p.t = 0; r.o.t = 0; r.s.t = .94; r.y.t = home + (r.i < i ? -24 : 24); r.el.style.zIndex = 1; }
    });
  }

  rows.forEach(r => r.el.addEventListener('click', () => {
    userUntil = clock + 7;
    show(open === r.i ? -1 : r.i);
  }));

  (function auto() {
    if (clock >= userUntil) {
      if (open < 0) { show(k++ % 3); after(2.8, auto); return; }
      show(-1);
    }
    after(1.3, auto);
  })();

  Motion.register({
    frame(dt) {
      clock += dt;
      rows.forEach(r => [r.p, r.a, r.y, r.o, r.s].forEach(s => step(s, dt)));
    },
    render() {
      const W = list.offsetWidth;
      rows.forEach(r => {
        const p = r.p.x, q = clamp(p, 0, 1);
        const full = 176 + r.more.offsetHeight + 16;
        r.el.style.height = (ROW + p * (full - ROW)).toFixed(2) + 'px';
        r.el.style.transform = `translateY(${r.y.x.toFixed(2)}px) scale(${r.s.x.toFixed(4)})`;
        r.el.style.opacity = clamp(r.o.x, 0, 1).toFixed(3);
        r.el.style.pointerEvents = r.o.t > .5 ? 'auto' : 'none';
        r.thumb.style.width = (48 + q * (W - 24 - 48)).toFixed(2) + 'px';
        r.thumb.style.height = Math.max(48, 48 + p * 56).toFixed(2) + 'px';
        r.thumb.style.borderRadius = (12 + q * 4).toFixed(2) + 'px';
        r.head.style.transform = `translate(${(72 - 56 * q).toFixed(2)}px,${(16 + 112 * p).toFixed(2)}px)`;
        r.price.style.transform = `translateY(${(26 + 106 * p).toFixed(2)}px)`;
        const a = clamp(r.a.x, 0, 1);
        r.more.style.opacity = a.toFixed(3);
        r.more.style.transform = `translateY(${((1 - r.a.x) * 10).toFixed(2)}px)`;
      });
    },
  });
})();
