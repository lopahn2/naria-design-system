// Tag Input
// A chip is born at the width of its word and pops in from a smaller scale.
// Removing one shrinks its width and fades it so the chips after it slide
// over on their own. Enter adds, Backspace on an empty field removes the
// last one. On its own it types a skill, adds it, and retires the oldest.
(() => {
  const { S, step, clamp, after } = Motion;
  const $ = id => document.getElementById(id);
  const field = $('field'), inp = $('inp');
  let chips = [], clock = 0, userUntil = 0, timers = [];
  const later = (s, f) => { const t = after(s, () => { timers = timers.filter(x => x !== t); f(); }); timers.push(t); };

  function add(word, instant) {
    word = word.trim(); if (!word) return;
    const el = document.createElement('span'); el.className = 'chip';
    const inn = document.createElement('span'); inn.className = 'in';
    const t = document.createElement('span'); t.textContent = word;
    const x = document.createElement('button'); x.setAttribute('aria-label', 'Remove ' + word);
    x.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7 7 17"/></svg>';
    inn.appendChild(t); inn.appendChild(x); el.appendChild(inn);
    field.insertBefore(el, inp);
    const full = inn.offsetWidth;
    const c = { el, full, w: S(instant ? full : 0, 340, 26), s: S(instant ? 1 : .5, 420, 16), o: S(instant ? 1 : 0, 300, 26), dead: false };
    c.w.t = full; c.s.t = 1; c.o.t = 1;
    x.addEventListener('click', e => { e.stopPropagation(); userUntil = clock + 8; remove(c); });
    chips.push(c);
  }
  function remove(c) {
    if (!c || c.dead) return;
    c.dead = true; c.w.t = 0; c.o.t = 0; c.s.t = .6;
    after(.45, () => { c.el.remove(); chips = chips.filter(k => k !== c); });
  }
  field.addEventListener('click', () => inp.focus());
  inp.addEventListener('focus', () => { userUntil = clock + 10; timers.forEach(Motion.cancel); timers = []; });
  inp.addEventListener('keydown', e => {
    userUntil = clock + 10;
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(inp.value); inp.value = ''; }
    if (e.key === 'Backspace' && !inp.value) remove([...chips].reverse().find(c => !c.dead));
  });
  ['Figma', 'Motion'].forEach(w => add(w, true));

  const WORDS = ['Springs', 'Prototyping', 'Framer', 'Type', 'Color'];
  let n = 0;
  function play() {
    if (clock < userUntil) { later(1.5, play); return; }
    const w = WORDS[n++ % WORDS.length];
    w.split('').forEach((ch, i) => later(.1 + i * .09, () => { inp.value += ch; }));
    later(.1 + w.length * .09 + .35, () => { add(inp.value); inp.value = ''; });
    later(.1 + w.length * .09 + 1.4, () => { if (chips.filter(c => !c.dead).length > 3) remove(chips.find(c => !c.dead)); });
    later(.1 + w.length * .09 + 2.4, play);
  }
  later(.8, play);

  Motion.register({
    frame(dt) { clock += dt; chips.forEach(c => { step(c.w, dt); step(c.s, dt); step(c.o, dt); }); },
    render() {
      chips.forEach(c => {
        c.el.style.width = Math.max(0, c.w.x).toFixed(2) + 'px';
        c.el.style.marginRight = c.dead ? (-6 * (1 - clamp(c.w.x / c.full, 0, 1))).toFixed(2) + 'px' : '';
        c.el.style.opacity = clamp(c.o.x, 0, 1).toFixed(3);
        c.el.style.transform = `scale(${c.s.x.toFixed(4)})`;
      });
    },
  });
})();
