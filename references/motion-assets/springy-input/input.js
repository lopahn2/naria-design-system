// Springy Input
// The real <input> stays in place (typing, selection, paste, a11y) but its text is
// transparent. A mirror layer draws one span per character: new characters land with
// a bounce, deleted ones float away, and a custom caret springs between positions,
// stretching with its speed. Submit: wrong email shakes the letters in a wave,
// a right one sends them up and the field morphs into a green pill.
(() => {
  const { S, tune, step, clamp, spring, after } = Motion;
  const $ = id => document.getElementById(id);
  const field = $('field'), input = $('email'), layer = $('layer'), caret = $('caret');
  const label = $('flabel'), go = $('go'), help = $('help');
  const HELP = ''; // no line under the field until there is something to say (Noah, 9 Nov 2026)

  const T = { caret: spring('--input-caret', '700 32'), morph: spring('--input-morph', '300 20') };
  const C = S(0, ...T.caret);          // caret x
  const LB = S(0, 420, 26);            // label float 0..1
  const W = S(0, ...T.morph);          // field width (0 = natural)
  const shake = S(0, 700, 10);
  let spans = [], prev = '', scroll = 0, lastMove = 0, focused = false, busy = false;

  const glyph = ch => ch === ' ' ? ' ' : ch;

  function sync() {
    const next = input.value;
    if (next === prev) return;
    let a = 0; while (a < prev.length && a < next.length && prev[a] === next[a]) a++;
    let b = 0; while (b < prev.length - a && b < next.length - a && prev[prev.length - 1 - b] === next[next.length - 1 - b]) b++;
    // removed characters float away from where they were
    const gone = spans.splice(a, prev.length - a - b);
    gone.forEach(s => {
      const left = s.offsetLeft;
      s.classList.remove('in', 'nope');
      s.style.left = left + 'px';
      s.classList.add('out');
      setTimeout(() => s.remove(), 360);
    });
    // inserted characters land one after another (a paste becomes a wave)
    const ins = next.slice(a, next.length - b);
    const ref = spans[a] || null;
    const fresh = [...ins].map((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch in'; s.textContent = glyph(ch);
      s.style.setProperty('--d', Math.min(i, 30) * 18 + 'ms');
      layer.insertBefore(s, ref);
      return s;
    });
    spans.splice(a, 0, ...fresh);
    prev = next;
    lastMove = performance.now();
    field.classList.remove('err'); help.classList.remove('err');
    if (help.textContent !== HELP) help.textContent = HELP;
    go.classList.toggle('idle', !next);
  }

  function caretTarget() {
    const i = input.selectionEnd ?? spans.length;
    if (!spans.length) return 0;
    if (i < spans.length) return spans[i].offsetLeft;
    const l = spans[spans.length - 1];
    return l.offsetLeft + l.offsetWidth;
  }

  input.addEventListener('input', sync);
  input.addEventListener('focus', () => { focused = true; field.classList.add('focus'); });
  input.addEventListener('blur', () => { focused = false; field.classList.remove('focus'); });
  ['keydown', 'keyup', 'click', 'select'].forEach(ev => input.addEventListener(ev, () => { lastMove = performance.now(); }));

  field.addEventListener('submit', e => {
    e.preventDefault();
    if (busy) return;
    const v = input.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (!ok) {
      spans.forEach((s, i) => { s.classList.remove('in', 'nope'); void s.offsetWidth; s.style.setProperty('--d', i * 14 + 'ms'); s.classList.add('nope'); });
      field.classList.add('err'); help.classList.add('err');
      help.textContent = v ? 'That email looks off, check it again' : 'Type your email first';
      shake.v += 420;
      input.focus();
      return;
    }
    busy = true;
    spans.forEach((s, i) => { s.classList.remove('in', 'nope'); void s.offsetWidth; s.style.setProperty('--d', i * 16 + 'ms'); s.classList.add('fly'); });
    after(.25 + spans.length * .016, () => {
      const full = field.parentElement.clientWidth;
      W.x = full; W.v = 0;
      tune(W, ...T.morph); W.t = 232;
      field.classList.add('ok');
      field.setAttribute('aria-label', "You're on the list");
      help.textContent = '';   // no line under the success pill (Noah, 9 Nov 2026)
      input.blur();
    });
    after(2.8 + spans.length * .016, reset);
  });

  function reset() {
    field.classList.remove('ok');
    field.removeAttribute('aria-label');
    tune(W, T.morph[0] * .8, T.morph[1]);
    W.t = field.parentElement.clientWidth;
    after(.6, () => { W.x = W.t = 0; W.v = 0; });   // v too, or it drifts off zero and the field stays a hair wide
    input.value = ''; prev = '';
    spans.forEach(s => s.remove()); spans = [];
    help.textContent = HELP;
    go.classList.add('idle');
    busy = false;
  }

  Motion.register({
    frame(dt) {
      C.t = caretTarget();
      LB.t = focused || input.value ? 1 : 0;
      step(C, dt); step(LB, dt); step(W, dt); step(shake, dt);
    },
    render() {
      // keep the caret in view when the text is wider than the box
      const box = layer.parentElement.clientWidth;
      const want = Math.max(0, C.t - box + 6);
      scroll += (want - scroll) * .25;
      if (Math.abs(want - scroll) < .3) scroll = want;
      layer.style.transform = `translateX(${-scroll}px)`;
      input.scrollLeft = scroll;

      const speed = Math.abs(C.v);
      const stretch = Math.min(speed / 80, 7);
      caret.style.width = 2 + stretch + 'px';
      // stretch trails behind the direction of travel
      caret.style.transform = `translateX(${C.x - scroll - (C.v > 0 ? stretch : 0)}px)`;
      const idle = performance.now() - lastMove > 550 && speed < 5;
      caret.style.opacity = focused && !busy ? 1 : 0;
      caret.classList.toggle('blink', focused && idle);

      const f = LB.x;
      label.style.transform = `translateY(${-13 * f}px) scale(${1 - .3 * f})`;
      field.style.width = W.x > 1 ? W.x + 'px' : '';
      field.style.transform = `translateX(${shake.x}px)`;
    },
  });
})();
