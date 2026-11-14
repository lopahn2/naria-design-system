// Scramble Text
// Each letter flickers through random glyphs and settles on the right one,
// left to right with a little randomness, then the next phrase decodes over it.
// A longer old phrase scrambles away at its end. Hover to decode again.
(() => {
  const line = document.getElementById('line');
  const PHRASES = ['Decoding the brief', 'Compiling the idea', 'Shipping tonight'];
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=/<>';
  const glyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
  const HOLD = 2.6, FLICKER = .055;

  const caret = document.createElement('span');
  caret.className = 'caret';
  caret.setAttribute('aria-hidden', 'true');
  line.appendChild(caret);

  let cells = [], clock = 0, idx = 0, running = false, hold = HOLD;

  function decode(text) {
    const n = Math.max(text.length, cells.length);
    while (cells.length < n) {
      const el = document.createElement('span');
      el.className = 'c';
      el.setAttribute('aria-hidden', 'true');
      line.insertBefore(el, caret);
      cells.push({ el });
    }
    cells.forEach((c, i) => {
      c.to = text[i] ?? '';
      c.at = clock + .18 + i * .035 + Math.random() * .28;   // when it settles
      c.tick = 0;
      c.done = false;
      c.el.classList.remove('ok');
    });
    running = true;
    line.setAttribute('aria-label', text);
  }

  line.addEventListener('pointerenter', () => { if (!running) decode(PHRASES[idx]); });
  decode(PHRASES[0]);

  Motion.register({
    frame(dt) {
      clock += dt;
      if (!running && (hold -= dt) <= 0) { idx = (idx + 1) % PHRASES.length; decode(PHRASES[idx]); }
    },
    render() {
      if (running) {
        let left = 0;
        cells.forEach(c => {
          if (c.done) return;
          if (clock >= c.at) {
            c.done = true;
            if (c.to === '') c.el.remove();
            else { c.el.textContent = c.to; c.el.classList.add('ok'); }
          } else {
            left++;
            if (c.to === ' ') { c.el.textContent = ' '; c.el.classList.add('ok'); }
            else if (clock >= c.tick) { c.el.textContent = glyph(); c.tick = clock + FLICKER; }
          }
        });
        if (!left) { cells = cells.filter(c => c.to !== ''); running = false; hold = HOLD; }
      }
      caret.style.opacity = running || (clock * 1.8) % 2 < 1 ? 1 : 0;
    },
  });
})();
