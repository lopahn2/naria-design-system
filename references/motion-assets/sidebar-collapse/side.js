// Sidebar Collapse
// One spring for the width; each label has its own opacity spring that is
// started a little later down the list when it opens (and all together when
// it closes), so the names read in like a cascade. The highlight follows the
// picked item on its own spring.
(() => {
  const { S, step, clamp, after } = Motion;
  const $ = id => document.getElementById(id);
  const side = $('side'), col = $('col'), hl = $('hl');
  const its = [...document.querySelectorAll('.it')];
  const labels = [...document.querySelectorAll('.lb')].map(el => ({ el, s: S(1, 300, 26) }));
  const W = S(212, 260, 24), R = S(0, 300, 22), Y = S(0, 380, 28);
  let open = true, cur = 0, clock = 0, userUntil = 0;

  function setOpen(o) {
    open = o;
    col.setAttribute('aria-expanded', o);
    col.setAttribute('aria-label', o ? 'Collapse sidebar' : 'Expand sidebar');
    W.t = o ? 212 : 64; R.t = o ? 0 : 1;
    labels.forEach((l, i) => o ? after(.06 + i * .04, () => { if (open) l.s.t = 1; }) : (l.s.t = 0));
  }
  function pick(i) { cur = i; its.forEach((b, k) => b.classList.toggle('on', k === i)); Y.t = its[i].offsetTop; }
  col.addEventListener('click', () => { userUntil = clock + 8; setOpen(!open); });
  its.forEach((b, i) => b.addEventListener('click', () => { userUntil = clock + 8; pick(i); }));
  pick(0); Y.x = Y.t;
  const PLAN = [() => pick(2), () => setOpen(false), () => pick(3), () => setOpen(true), () => pick(1), () => pick(0)];
  let n = 0;
  (function auto() { if (clock >= userUntil) PLAN[n++ % PLAN.length](); after(1.5, auto); })();

  Motion.register({
    frame(dt) { clock += dt; [W, R, Y].forEach(s => step(s, dt)); labels.forEach(l => step(l.s, dt)); },
    render() {
      side.style.width = W.x.toFixed(2) + 'px';
      col.style.transform = `translateX(${(-(1 - clamp(R.x, 0, 1)) * 0).toFixed(1)}px)`;
      col.firstElementChild.style.transform = `rotate(${(180 * R.x).toFixed(2)}deg)`;
      col.style.right = (clamp(R.x, 0, 1) * 4).toFixed(2) + 'px';
      // closed, the toggle takes the logo's place
      side.querySelector('.logo').style.opacity = clamp(1 - R.x * 2, 0, 1).toFixed(3);
      labels.forEach(l => {
        const o = clamp(l.s.x, 0, 1);
        l.el.style.opacity = o.toFixed(3);
        l.el.style.transform = `translateX(${((1 - o) * -10).toFixed(2)}px)`;
      });
      hl.style.transform = `translateY(${Y.x.toFixed(2)}px)`;
    },
  });
})();
