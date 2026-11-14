// Password Strength
// The score (length, mixed case, a number, a symbol) sets how many bars are
// full; each bar has its own width spring, started a beat after the one
// before, and all of them share a colour that walks red, orange, yellow,
// green. The word swaps with a small rise. The eye's slash draws in or out
// and the pupil shrinks when hidden. It types a password by itself until
// you click in.
(() => {
  const { S, step, clamp, after } = Motion;
  const $ = id => document.getElementById(id);
  const inp = $('inp'), eye = $('eye'), slash = $('slash'), pupil = $('pupil'), word = $('word');
  const bars = [...document.querySelectorAll('.bars i')].map(i => { const b = document.createElement('b'); i.appendChild(b); return { b, s: S(0, 260, 24) }; });
  const COLORS = ['var(--red)', 'var(--orange)', 'var(--yellow)', 'var(--green)'];
  const WORDS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  const E = S(0, 300, 24), WD = S(1, 300, 24);
  const slashLen = 22; slash.style.strokeDasharray = slashLen;
  let shown = false, score = -1, clock = 0, userUntil = 0, timers = [];
  const later = (s, f) => { const t = after(s, () => { timers = timers.filter(x => x !== t); f(); }); timers.push(t); };

  function rate(p) {
    if (p.length < 6) return 0;
    let s = 1;
    if (p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p) && p.length >= 10) s++;
    return s;
  }
  function update() {
    const s = rate(inp.value);
    if (s === score) return;
    score = s;
    bars.forEach((b, i) => after(i * .06, () => { b.s.t = i < score ? 1 : 0; }));
    WD.x = 0; WD.t = 1;
    word.textContent = inp.value ? WORDS[score] : WORDS[0];
  }
  function setShown(v) { shown = v; inp.type = v ? 'text' : 'password'; eye.setAttribute('aria-pressed', v); eye.setAttribute('aria-label', v ? 'Hide password' : 'Show password'); E.t = v ? 1 : 0; }
  eye.addEventListener('click', () => { userUntil = clock + 8; setShown(!shown); });
  inp.addEventListener('focus', () => { userUntil = clock + 10; timers.forEach(Motion.cancel); timers = []; });
  inp.addEventListener('input', () => { userUntil = clock + 10; update(); });
  update();

  function play() {
    if (clock < userUntil) { later(1.5, play); return; }
    inp.value = ''; update();
    const P = 'Sunset2026!x';
    P.split('').forEach((c, i) => later(.3 + i * .14, () => { inp.value += c; update(); }));
    const end = .3 + P.length * .14;
    later(end + .5, () => setShown(true));
    later(end + 2, () => setShown(false));
    later(end + 3, play);
  }
  later(.6, play);

  Motion.register({
    frame(dt) { clock += dt; step(E, dt); step(WD, dt); bars.forEach(b => step(b.s, dt)); },
    render() {
      const col = COLORS[clamp(score - 1, 0, 3)];
      bars.forEach(b => { b.b.style.width = (clamp(b.s.x, 0, 1.05) * 100).toFixed(2) + '%'; b.b.style.background = col; });
      word.style.color = score > 0 && inp.value ? col : 'var(--muted)';
      word.style.opacity = clamp(WD.x, 0, 1).toFixed(3);
      word.style.transform = `translateY(${((1 - clamp(WD.x, 0, 1)) * 6).toFixed(2)}px)`;
      const e = clamp(E.x, 0, 1);
      slash.style.strokeDashoffset = (slashLen * e).toFixed(2);
      pupil.style.transform = `scale(${(.5 + .5 * e).toFixed(3)})`;
      pupil.style.transformOrigin = '12px 12px';
    },
  });
})();
