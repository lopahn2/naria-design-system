// Checkbox List
// Each row has a fill spring (box goes green), a pop spring, a check that
// draws by its dash offset a moment later, and a strike spring that runs a
// line under the text from the left. The count above rolls on digit spans.
(() => {
  const { S, step, clamp, after } = Motion;
  const $ = id => document.getElementById(id);
  const col = $('col');
  for (let i = 0; i <= 4; i++) { const s = document.createElement('span'); s.textContent = i; col.appendChild(s); }
  const rows = [...document.querySelectorAll('#list li')].map(li => {
    const cb = li.querySelector('.cb'), path = li.querySelector('path'), strike = li.querySelector('.strike');
    path.style.strokeDasharray = 18;
    return { li, cb, path, strike, on: false, f: S(0, 300, 24), p: S(1, 520, 13), c: S(0, 160, 20), k: S(0, 140, 22) };
  });
  const CNT = S(0, 260, 22);
  let clock = 0, userUntil = 0;

  function toggle(r) {
    r.on = !r.on;
    r.cb.setAttribute('aria-checked', r.on); r.li.classList.toggle('done', r.on);
    r.f.t = r.on ? 1 : 0; r.p.x = r.on ? .7 : .85; r.p.v = 5;
    if (r.on) { after(.08, () => { if (r.on) r.c.t = 1; }); after(.16, () => { if (r.on) r.k.t = 1; }); }
    else { r.c.t = 0; r.k.t = 0; }
    CNT.t = rows.filter(x => x.on).length;
  }
  rows.forEach(r => r.li.addEventListener('click', () => { userUntil = clock + 8; toggle(r); }));
  const PLAN = [0, 2, 1, 3, 2, 0, 1, 3];
  let n = 0;
  (function auto() { if (clock >= userUntil) toggle(rows[PLAN[n++ % PLAN.length]]); after(1.1, auto); })();

  Motion.register({
    frame(dt) { clock += dt; step(CNT, dt); rows.forEach(r => { step(r.f, dt); step(r.p, dt); step(r.c, dt); step(r.k, dt); }); },
    render() {
      [...col.children].forEach(s => { s.style.transform = `translateY(${(-16 * CNT.x).toFixed(2)}px)`; });
      rows.forEach(r => {
        const f = clamp(r.f.x, 0, 1);
        r.cb.style.background = f > .01 ? `color-mix(in srgb, var(--green) ${(f * 100).toFixed(1)}%, var(--fill-3))` : '';
        r.cb.style.transform = `scale(${r.p.x.toFixed(4)})`;
        r.path.style.strokeDashoffset = (18 * (1 - clamp(r.c.x, 0, 1))).toFixed(2);
        r.strike.style.width = (clamp(r.k.x, 0, 1) * 100).toFixed(2) + '%';
      });
    },
  });
})();
