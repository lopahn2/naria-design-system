// Morph Tooltip
// One tooltip serves every tool. The first hover pops it in place. After that
// it travels: the edge facing the new tool is on a stiff spring and the other
// edge on a soft one, so it stretches across and settles at the new label's
// width. The old label slides out the way it came, the new one slides in from
// the far side, and the little tail follows on its own spring. Leaving the bar
// waits a moment before hiding, so crossing a gap never flickers.
(() => {
  const { S, tune, step, clamp, after, cancel } = Motion;
  const $ = id => document.getElementById(id);
  const tip = $('tip'), tail = $('tail'), hl = $('hl'), bar = $('bar'), group = $('tools');
  const tools = [...document.querySelectorAll('.tool')].map(el => ({ el, ic: el.firstElementChild, p: S(1, 520, 16) }));
  const labs = [...document.querySelectorAll('.lab')].map(el => ({ el, o: S(0, 420, 32), dir: 0, w: 96 }));
  const BW = 52, GAP = 4, PAD = 6, LEAD = [620, 36], TRAIL = [190, 19];
  const cx = i => PAD + i * (BW + GAP) + BW / 2;

  const TL = S(0, ...LEAD), TR = S(0, ...LEAD), TX = S(0, 300, 22);   // tooltip edges, tail centre
  const HL = S(0, ...LEAD), HR = S(0, ...LEAD);                        // hover highlight edges
  const A = S(0, 420, 24);                                             // shown
  let cur = -1, hideT = null, clock = 0, userUntil = 0;

  function place(i, snap) {
    const c = cx(i), half = labs[i].w / 2;
    const to = [[TL, c - half], [TR, c + half], [TX, c], [HL, c - BW / 2], [HR, c + BW / 2]];
    to.forEach(([s, v]) => { s.t = v; if (snap) { s.x = v; s.v = 0; } });
  }
  const measure = () => { labs.forEach(l => { l.w = l.el.offsetWidth || l.w; }); if (cur > -1) place(cur, false); };
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  function point(i) {
    if (hideT) { cancel(hideT); hideT = null; }
    if (i === cur) { A.t = 1; return; }
    const dir = cur < 0 ? 0 : Math.sign(i - cur);
    if (A.x < .3) {
      // nothing on screen yet: appear where it is needed
      place(i, true);
      labs.forEach((l, k) => { l.o.x = l.o.t = k === i ? 1 : 0; l.o.v = 0; l.dir = 0; });
    } else {
      const right = dir >= 0;
      [TR, HR].forEach(s => tune(s, ...(right ? LEAD : TRAIL)));
      [TL, HL].forEach(s => tune(s, ...(right ? TRAIL : LEAD)));
      place(i, false);
      labs.forEach((l, k) => {
        if (k === i) { l.dir = dir; l.o.t = 1; }
        else if (l.o.t === 1) { l.dir = -dir; l.o.t = 0; }
      });
    }
    cur = i; A.t = 1;
  }
  function leave() {
    if (hideT) cancel(hideT);
    hideT = after(.14, () => { hideT = null; A.t = 0; cur = -1; });
  }
  function select(i) {
    tools.forEach((t, k) => t.el.setAttribute('aria-pressed', k === i));
    tools[i].p.x = .78; A.x = Math.min(A.x, .9);
  }

  tools.forEach((t, i) => {
    t.el.addEventListener('pointerenter', () => { userUntil = clock + 5; point(i); });
    t.el.addEventListener('focus', () => { userUntil = clock + 5; point(i); });
    t.el.addEventListener('blur', leave);
    t.el.addEventListener('click', () => { userUntil = clock + 5; point(i); select(i); });
  });
  bar.addEventListener('pointermove', () => { userUntil = clock + 5; });
  bar.addEventListener('pointerleave', leave);

  // idle: walk the toolbar by itself, pick a tool now and then, leave, repeat
  const SEQ = [0, 1, 2, 3, 4, 2, 0, 3];
  let si = 0;
  (function auto() {
    if (clock >= userUntil) {
      if (si === SEQ.length) { si = 0; leave(); after(1.3, auto); return; }
      const i = SEQ[si++];
      point(i);
      if (si % 3 === 0) after(.5, () => { if (clock >= userUntil && cur === i) select(i); });
    }
    after(1.05, auto);
  })();

  Motion.register({
    frame(dt) {
      clock += dt;
      [TL, TR, TX, HL, HR, A].forEach(s => step(s, dt));
      labs.forEach(l => step(l.o, dt));
      tools.forEach(t => step(t.p, dt));
    },
    render() {
      const a = clamp(A.x, 0, 1.15), op = clamp(A.x, 0, 1);
      // narrow stage: the bar scales down to keep 16px each side, and the tooltip
      // stays inside the stage while its tail keeps pointing at the tool
      const sw = group.parentElement.clientWidth || 400, sc = Math.min(1, (sw - 32) / 288), lim = (sw / 2 - 8) / sc;
      group.style.transform = sc < 1 ? `scale(${sc.toFixed(4)})` : '';
      const l0 = Math.min(TL.x, TR.x - 30), w = TR.x - l0;
      const l = clamp(l0, 144 - lim, Math.max(144 - lim, 144 + lim - w));
      tip.style.width = w.toFixed(2) + 'px';
      tip.style.opacity = op.toFixed(3);
      tip.style.transform = `translate(${l.toFixed(2)}px,${((1 - a) * 6).toFixed(2)}px) scale(${(.72 + .28 * a).toFixed(4)})`;
      const tx = clamp(TX.x, l + 12, l + w - 12);
      tail.style.opacity = op.toFixed(3);
      tail.style.transform = `translate(${(tx - 6).toFixed(2)}px,${((1 - a) * 8).toFixed(2)}px) rotate(45deg) scale(${a.toFixed(3)})`;
      hl.style.opacity = op.toFixed(3);
      const hx = clamp(Math.min(HL.x, HR.x - 20), PAD, 288 - PAD - 20), hr = clamp(HR.x, hx + 20, 288 - PAD);
      hl.style.width = (hr - hx).toFixed(2) + 'px';
      hl.style.transform = `translateX(${hx.toFixed(2)}px)`;
      labs.forEach(lb => {
        const o = clamp(lb.o.x, 0, 1);
        lb.el.style.opacity = o.toFixed(3);
        lb.el.style.transform = `translateX(calc(-50% + ${(lb.dir * (1 - o) * 14).toFixed(2)}px))`;
        lb.el.style.filter = o > .02 && o < .98 ? `blur(${((1 - o) * 3).toFixed(2)}px)` : 'none';
      });
      tools.forEach(t => { t.ic.style.transform = `scale(${t.p.x.toFixed(4)})`; });
    },
  });
})();
