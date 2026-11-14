// Spring Dropdown
// The menu's height is a spring, so it drops with a little overshoot while the
// whole control lifts by half that height and stays centred. Rows fall in one
// after another. The hover highlight has a stiff leading edge and a soft
// trailing edge, so it stretches between rows. Picking a row draws its check,
// rolls the new value up into the trigger and folds the menu away.
// Keys: Enter or Space opens, arrows move, Enter picks, Escape closes.
(() => {
  const { S, tune, step, clamp, after } = Motion;
  const $ = id => document.getElementById(id);
  const dd = $('dd'), trig = $('trig'), menu = $('menu'), hl = $('hl'), chev = $('chev');
  const slots = [$('va'), $('vb')];
  const opts = [...document.querySelectorAll('.opt')].map((el, i) => {
    el.style.setProperty('--c', el.dataset.c);
    return { el, i, name: el.querySelector('b').textContent, c: el.dataset.c, tick: el.querySelector('.tick path'), s: S(0, 300, 24), k: S(0, 260, 26) };
  });
  const ROW = 44, PAD = 6, GAP = 8, MH = PAD * 2 + ROW * opts.length;
  const H = S(0, 300, 23), Y = S(0, 260, 24), C = S(0, 300, 18), O = S(0, 400, 34);
  const TS = S(1, 500, 18), R = S(1, 340, 26);
  const HT = S(PAD, 620, 36), HB = S(PAD + ROW, 620, 36), HO = S(0, 400, 32);
  let open = false, sel = 1, hov = -1, front = 0, clock = 0, userUntil = 0;

  slots[0].style.setProperty('--c', opts[sel].c);
  opts[sel].k.x = opts[sel].k.t = 1;

  function hover(i, snap) {
    if (i === hov || i < 0 || i >= opts.length) return;
    const top = PAD + i * ROW;
    if (snap || hov < 0) { HT.x = HT.t = top; HB.x = HB.t = top + ROW; HT.v = HB.v = 0; }
    else {
      const down = i > hov;
      tune(down ? HB : HT, 620, 36); tune(down ? HT : HB, 200, 20);
      HT.t = top; HB.t = top + ROW;
    }
    hov = i; HO.t = 1;
    trig.setAttribute('aria-activedescendant', opts[i].el.id);
  }
  function setOpen(o) {
    if (open === o) return;
    open = o;
    trig.setAttribute('aria-expanded', o);
    H.t = o ? MH : 0; Y.t = o ? -(GAP + MH) / 2 : 0; C.t = o ? 1 : 0; O.t = o ? 1 : 0;
    const n = opts.length;
    opts.forEach((p, i) => after(o ? .05 + i * .045 : (n - 1 - i) * .02, () => { p.s.t = open ? 1 : 0; }));
    if (o) hover(sel, true);
    else { hov = -1; HO.t = 0; trig.removeAttribute('aria-activedescendant'); }
  }
  function select(i) {
    if (i !== sel) {
      sel = i; front ^= 1;
      const s = slots[front];
      s.style.setProperty('--c', opts[i].c);
      s.lastElementChild.textContent = opts[i].name;
      R.x = 0; R.v = 0; R.t = 1;
    }
    opts.forEach(p => { p.k.t = p.i === sel ? 1 : 0; p.el.setAttribute('aria-selected', p.i === sel); });
    TS.x = .955;
    after(.24, () => setOpen(false));
  }

  const mine = () => { userUntil = clock + 7; };
  trig.addEventListener('click', () => { mine(); TS.x = .965; setOpen(!open); });
  opts.forEach(p => {
    p.el.addEventListener('pointerenter', () => { mine(); if (open) hover(p.i); });
    p.el.addEventListener('pointermove', () => { mine(); if (open) hover(p.i); });
    p.el.addEventListener('click', () => { mine(); if (open) select(p.i); });
  });
  dd.addEventListener('pointerdown', mine);
  // a press anywhere else closes it; composedPath sees through a shadow root
  addEventListener('pointerdown', e => { if (open && e.isTrusted && !e.composedPath().includes(dd)) setOpen(false); });
  trig.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); mine();
      if (!open) setOpen(true); else hover(hov + (e.key === 'ArrowDown' ? 1 : -1));
    } else if ((e.key === 'Enter' || e.key === ' ') && open && hov > -1) { e.preventDefault(); mine(); select(hov); }
    else if (e.key === 'Escape' && open) { mine(); setOpen(false); }
  });

  // idle: open, walk the highlight to another status, pick it, close, repeat
  const ORDER = [3, 0, 2, 1];
  let oi = 0;
  function auto() {
    if (clock < userUntil) { after(1, auto); return; }
    if (!open) { setOpen(true); after(.8, auto); return; }
    const target = ORDER[oi % ORDER.length];
    if (hov !== target) { hover(hov + Math.sign(target - hov)); after(.26, auto); return; }
    oi++;
    after(.34, () => { if (clock >= userUntil && open) select(target); after(2.2, auto); });
  }
  after(1.1, auto);

  Motion.register({
    frame(dt) {
      clock += dt;
      [H, Y, C, O, TS, R, HT, HB, HO].forEach(s => step(s, dt));
      opts.forEach(p => { step(p.s, dt); step(p.k, dt); });
    },
    render() {
      dd.style.transform = `translateY(${Y.x.toFixed(2)}px)`;
      trig.style.transform = `scale(${TS.x.toFixed(4)})`;
      chev.style.transform = `rotate(${(180 * C.x).toFixed(2)}deg)`;
      const h = Math.max(0, H.x), o = clamp(O.x, 0, 1);
      menu.style.height = h.toFixed(2) + 'px';
      menu.style.opacity = o.toFixed(3);
      menu.style.visibility = h < 1 ? 'hidden' : 'visible';
      menu.style.pointerEvents = open ? 'auto' : 'none';
      menu.style.transform = `scaleX(${(.9 + .1 * clamp(H.x / MH, 0, 1.06)).toFixed(4)})`;
      opts.forEach(p => {
        const s = clamp(p.s.x, 0, 1);
        p.el.style.opacity = s.toFixed(3);
        p.el.style.transform = `translateY(${((p.s.x - 1) * 14).toFixed(2)}px)`;
        p.tick.style.strokeDashoffset = (22 * (1 - clamp(p.k.x, 0, 1))).toFixed(2);
      });
      hl.style.opacity = (clamp(HO.x, 0, 1) * o).toFixed(3);
      const ht = clamp(Math.min(HT.x, HB.x - 16), PAD, MH - PAD - 16), hb = clamp(HB.x, ht + 16, MH - PAD);
      hl.style.height = (hb - ht).toFixed(2) + 'px';
      hl.style.transform = `translateY(${ht.toFixed(2)}px)`;
      const r = R.x, a = slots[front], b = slots[front ^ 1];
      a.style.opacity = clamp(r, 0, 1).toFixed(3);
      a.style.transform = `translateY(${((1 - r) * 20).toFixed(2)}px)`;
      b.style.opacity = clamp(1 - r, 0, 1).toFixed(3);
      b.style.transform = `translateY(${(-r * 20).toFixed(2)}px)`;
    },
  });
})();
