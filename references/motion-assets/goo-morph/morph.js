// Goo Morph
// Ideas, Sketches, Designs, Products: each word melts into the next. The
// outgoing word blurs up while the incoming one sharpens, and the threshold
// filter on the box fuses the two blurs into one liquid shape.
// Plays by itself; click to melt to the next word now.
(() => {
  const { clamp } = Motion;
  const $ = id => document.getElementById(id);
  const box = $('morph'), A = $('a'), B = $('b');
  const WORDS = ['Ideas', 'Sketches', 'Designs', 'Products'];
  const MELT = 1.05, HOLD = 1.6;   // seconds
  let cur = 0, nxt = 0, t = 0, melting = false, hold = HOLD;

  A.textContent = WORDS[0];
  function go(i) {
    if (melting || i === cur) return;
    nxt = i; t = 0; melting = true;
    A.textContent = WORDS[cur];
    B.textContent = WORDS[nxt];
    box.classList.add('melting');
    box.setAttribute('aria-label', WORDS[nxt]);
  }
  box.addEventListener('click', () => go((cur + 1) % WORDS.length));

  // Blur that runs to nothing as a word arrives, and an opacity that comes up early.
  const look = (el, f) => {
    el.style.filter = f >= 1 ? 'none' : `blur(${Math.min(8 / f - 8, 100).toFixed(2)}px)`;
    el.style.opacity = Math.pow(f, .4).toFixed(3);
  };
  const ease = x => x * x * (3 - 2 * x);

  Motion.register({
    frame(dt) {
      if (melting) {
        t += dt / MELT;
        if (t >= 1) {
          cur = nxt; melting = false; hold = HOLD;
          A.textContent = WORDS[cur]; B.textContent = '';
          box.classList.remove('melting');
        }
      } else if ((hold -= dt) <= 0) go((cur + 1) % WORDS.length);
    },
    render() {
      if (melting) {
        const f = ease(clamp(t, 0, 1));
        look(A, 1 - f);
        look(B, f);
      } else {
        look(A, 1);
        B.style.opacity = 0;
      }
    },
  });
})();
