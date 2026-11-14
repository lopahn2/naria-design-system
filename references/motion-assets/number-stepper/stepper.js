// Number Stepper
// A change sets a roll spring back to 1 and lets it settle to 0: the new
// number comes in from below (or above, going down) while the old one leaves
// the other way. Past the limit, the button gets a sideways kick and the
// number a small push the same way.
(() => {
  const { S, step, clamp, after } = Motion;
  const $ = id => document.getElementById(id);
  const minus = $('minus'), plus = $('plus'), num = $('num'), na = $('na'), nb = $('nb');
  const MIN = 1, MAX = 8;
  const R = S(0, 260, 24), KM = S(0, 600, 14), KP = S(0, 600, 14), NN = S(0, 500, 16);
  let v = 2, dir = 1, clock = 0, userUntil = 0;

  function change(d) {
    const nv = v + d;
    if (nv < MIN || nv > MAX) { (d < 0 ? KM : KP).v = 300 * (d < 0 ? -1 : 1); NN.v = 160 * d; return; }
    nb.textContent = v; v = nv; na.textContent = v; dir = d; R.x = 1; R.v = 0;
    minus.classList.toggle('off', v === MIN); plus.classList.toggle('off', v === MAX);
  }
  minus.addEventListener('click', () => { userUntil = clock + 6; change(-1); });
  plus.addEventListener('click', () => { userUntil = clock + 6; change(1); });
  const PLAN = [1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1];
  let n = 0;
  (function auto() { if (clock >= userUntil) change(PLAN[n++ % PLAN.length]); after(.55, auto); })();

  Motion.register({
    frame(dt) { clock += dt; [R, KM, KP, NN].forEach(s => step(s, dt)); },
    render() {
      const r = R.x;
      na.style.transform = `translateY(${(dir * r * 100).toFixed(2)}%)`;
      na.style.opacity = clamp(1 - Math.abs(r), 0, 1).toFixed(3);
      nb.style.transform = `translateY(${((r - 1) * dir * 100).toFixed(2)}%)`;
      nb.style.opacity = clamp(r, 0, 1).toFixed(3);
      minus.style.transform = `translateX(${(KM.x * .06).toFixed(2)}px)`;
      plus.style.transform = `translateX(${(KP.x * .06).toFixed(2)}px)`;
      num.style.transform = `translateX(${(NN.x * .04).toFixed(2)}px)`;
    },
  });
})();
