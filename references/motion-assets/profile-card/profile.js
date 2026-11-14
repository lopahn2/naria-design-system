// Profile Card
// One follow spring drives the button: white fill fades, the label swaps with
// a small slide and the button shrinks to half so Message can slide in. The
// follower count is a row of digit drums on springs, so 12,489 to 12,490
// rolls two digits with a short carry delay. Toggles by itself until clicked.
(() => {
  const { S, step, clamp, after } = Motion;
  const $ = id => document.getElementById(id);
  const acts = $('acts'), follow = $('follow'), msg = $('msg'), fbg = $('fbg'), la = $('la'), lb = $('lb'), av = $('av'), out = $('followers');
  const BASE = 12489;
  const f = S(0, 300, 22), pop = S(1, 520, 14);
  let on = false, clock = 0, userUntil = 0;

  // digit drums
  const drums = [];
  [...BASE.toLocaleString('en-US')].forEach(ch => {
    if (!/\d/.test(ch)) { const s = document.createElement('span'); s.textContent = ch; out.appendChild(s); return; }
    const dg = document.createElement('span'); dg.className = 'dg';
    const col = document.createElement('span');
    for (let k = 0; k < 11; k++) { const i = document.createElement('i'); i.textContent = k % 10; col.appendChild(i); }
    dg.appendChild(col); out.appendChild(dg);
    const s = S(+ch, 260, 22); drums.push({ col, s });
  });

  function setCount(n) {
    const ds = [...n.toLocaleString('en-US')].filter(c => /\d/.test(c)).map(Number);
    ds.forEach((d, k) => after((ds.length - 1 - k) * .06, () => {
      // take the short way round, so 9 rolls on to 0 and back again
      const s = drums[k].s, cur = Math.round(s.t);
      let diff = ((d - cur) % 10 + 10) % 10;
      if (diff > 5) diff -= 10;
      s.t = cur + diff;
    }));
  }
  function toggle() {
    on = !on; f.t = on ? 1 : 0;
    setCount(BASE + (on ? 1 : 0));
    if (on) pop.v = 4;
  }
  follow.addEventListener('click', () => { userUntil = clock + 7; toggle(); });
  msg.addEventListener('click', () => { userUntil = clock + 7; });
  (function auto() {
    if (clock >= userUntil) toggle();
    after(on ? 2.6 : 1.6, auto);
  })();

  Motion.register({
    frame(dt) {
      clock += dt;
      step(f, dt); step(pop, dt);
      drums.forEach(d => step(d.s, dt));
    },
    render() {
      const T = acts.offsetWidth, half = (T - 8) / 2, q = clamp(f.x, 0, 1);
      follow.style.width = (T + (half - T) * f.x).toFixed(2) + 'px';
      fbg.style.opacity = (1 - q).toFixed(3);
      la.style.opacity = (1 - q).toFixed(3);
      la.style.transform = `translateY(${(-q * 12).toFixed(2)}px)`;
      lb.style.opacity = q.toFixed(3);
      lb.style.transform = `translateY(${((1 - q) * 12).toFixed(2)}px)`;
      msg.style.width = half.toFixed(2) + 'px';
      msg.style.opacity = q.toFixed(3);
      msg.style.transform = `translateX(${((1 - f.x) * 24).toFixed(2)}px) scale(${(.9 + .1 * q).toFixed(4)})`;
      msg.style.pointerEvents = on ? 'auto' : 'none';
      av.style.transform = `scale(${pop.x.toFixed(4)})`;
      drums.forEach(d => { const m = ((d.s.x % 10) + 10) % 10; d.col.style.transform = `translateY(${(-m * 100 / 11).toFixed(3)}%)`; });
    },
  });
})();
