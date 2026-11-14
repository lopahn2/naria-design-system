// Rubber Dock
// The pill's two edges are separate springs: the leading edge is stiff, the trailing
// edge is lazy, so moving between tabs stretches the pill like rubber. Clicking the
// active tab morphs the whole dock into a card.
(() => {
  const { S, tune, step, clamp, spring, num, svg, after } = Motion;
  const $ = id => document.getElementById(id);

  const ICONS = [
    ['Overview', '<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/>'],
    ['Search', '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>'],
    ['Inbox', '<path d="M4 13.5 6.2 5.6A1 1 0 0 1 7.2 5h9.6a1 1 0 0 1 1 .6L20 13.5V18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M4 13.5h4.5l1.2 2h4.6l1.2-2H20"/>'],
    ['Profile', '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1.2-3.2 3.8-5 7-5s5.8 1.8 7 5"/>'],
  ];
  const dock = $('dock'), tabs = $('tabs'), ind = $('ind'), ground = $('ground');
  const baseIcons = $('baseIcons'), topIcons = $('topIcons');
  const panels = [...document.querySelectorAll('.panel')];

  ICONS.forEach(([name, p]) => {
    const b = document.createElement('button');
    b.setAttribute('role', 'tab'); b.setAttribute('aria-label', name); b.innerHTML = svg(p);
    baseIcons.appendChild(b);
    const d = document.createElement('div'); d.innerHTML = svg(p); topIcons.appendChild(d);
  });
  const btns = [...baseIcons.children], tops = [...topIcons.children];

  const chart = $('chart');
  [38, 52, 44, 70, 58, 82, 64, 90, 72, 100, 86, 78].forEach((h, i) => {
    const b = document.createElement('div');
    b.className = 'bar' + (i === 9 ? ' hi' : '');
    b.style.setProperty('--h', h + '%'); b.style.setProperty('--b', i);
    chart.appendChild(b);
  });

  // motion tokens
  const T = {
    lead: spring('--dock-lead', '640 38'), trail: spring('--dock-trail', '150 16'),
    dragLead: spring('--dock-drag-lead', '1100 56'), dragTrail: spring('--dock-drag-trail', '320 26'),
    openW: spring('--dock-open-w', '340 21'), openH: spring('--dock-open-h', '230 21'),
    close: spring('--dock-close', '420 30'), pop: spring('--dock-pop', '520 16'),
    expW: num('--dock-expanded-w', 340),
  };

  // geometry
  const TAB = 56, GAP = 4, N = 4, TW = N * TAB + (N - 1) * GAP;
  const cx = i => TAB / 2 + i * (TAB + GAP);
  const COL = { W: TW + 12, H: TAB + 12 };
  const PANEL_H = 300;
  let panelH = [];
  const measure = () => { panelH = panels.map(p => Math.min(PANEL_H, p.offsetHeight)); };
  const expW = () => Math.min(T.expW, innerWidth - 24);

  const L = S(cx(0) - TAB / 2), R = S(cx(0) + TAB / 2);
  const W = S(TAB + 12, 260, 20), H = S(COL.H, 400, 34);
  const nudge = S(0, 300, 18);
  const pops = btns.map(() => S(1, ...T.pop));
  const all = [L, R, W, H, nudge, ...pops];

  let active = 0, expanded = false;

  function moveTo(center, dir, drag = false) {
    const lead = drag ? T.dragLead : T.lead;
    const trail = drag ? T.dragTrail : T.trail;
    if (dir === 0) { tune(L, 600, 44); tune(R, 600, 44); }
    else {
      const [l, r] = dir > 0 ? [trail, lead] : [lead, trail];
      tune(L, ...l); tune(R, ...r);
    }
    L.t = center - TAB / 2; R.t = center + TAB / 2;
  }

  function setActive(i, dirHint) {
    i = clamp(i, 0, N - 1);
    const dir = dirHint ?? Math.sign(cx(i) - (L.x + R.x) / 2);
    moveTo(cx(i), dir);
    const prev = active;
    active = i;
    pops[i].v -= 3.2;
    btns.forEach((b, j) => { b.setAttribute('aria-selected', j === i); b.tabIndex = j === i ? 0 : -1; });
    if (expanded && prev !== i) swapPanel(prev, i, Math.sign(i - prev));
  }

  function setExpanded(v) {
    if (v === expanded) return;
    expanded = v;
    if (v) {
      measure();
      W.t = expW(); H.t = COL.H + panelH[active];
      tune(W, ...T.openW); tune(H, ...T.openH);   // width lands first, height overshoots after
      showPanel(active, 0, true);
    } else {
      W.t = COL.W; H.t = COL.H;
      tune(W, T.close[0] * .72, T.close[1] * .66); tune(H, ...T.close);
      hidePanel(active, 0);
    }
    pops[active].v -= 2.4;
  }

  function prep(p, x, y) {
    p.classList.add('prep');
    p.style.setProperty('--x', x + 'px'); p.style.setProperty('--y', y + 'px');
    void p.offsetWidth;
    p.classList.remove('prep');
  }
  function showPanel(i, dir, fromClosed) {
    const p = panels[i];
    prep(p, dir * 28, fromClosed ? 14 : 0);
    requestAnimationFrame(() => p.classList.add('on'));
    if (i === 1) typeIn();
  }
  function hidePanel(i, dir) {
    const p = panels[i];
    p.style.setProperty('--x', -dir * 28 + 'px'); p.style.setProperty('--y', dir ? '0px' : '6px');
    p.classList.remove('on');
  }
  function swapPanel(from, to, dir) {
    hidePanel(from, dir); showPanel(to, dir, false);
    tune(H, 260, 20); H.t = COL.H + panelH[to];   // the card re-morphs to fit each tab
  }

  // typewriter in the search field
  let typeRun = 0;
  function typeIn() {
    const el = $('typed'), word = 'elastic morph', run = ++typeRun;
    el.textContent = '';
    const tick = n => after(.07, () => {
      if (run !== typeRun) return;
      el.textContent = word.slice(0, n);
      if (n < word.length) tick(n + 1);
    });
    after(.26, () => tick(1));
  }

  // input
  let drag = null, suppressClick = false;
  const rubber = (x, min, max, d = 46) =>
    x < min ? min - (1 - 1 / ((min - x) * .55 / d + 1)) * d :
    x > max ? max + (1 - 1 / ((x - max) * .55 / d + 1)) * d : x;
  const localX = e => {
    const r = dock.getBoundingClientRect();
    return e.clientX - (r.left + r.width / 2 - nudge.x) + TW / 2;
  };
  tabs.addEventListener('pointerdown', e => {
    drag = { id: e.pointerId, x0: e.clientX, last: localX(e), live: false, dir: 0 };
  });
  tabs.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.live && Math.abs(e.clientX - drag.x0) > 4) {
      drag.live = true; tabs.setPointerCapture(e.pointerId); tabs.classList.add('dragging');
    }
    if (!drag.live) return;
    const raw = localX(e);
    const d = raw - drag.last; drag.last = raw;
    if (Math.abs(d) > .5) drag.dir = Math.sign(d);
    const c = rubber(raw, cx(0), cx(N - 1));
    moveTo(c, drag.dir, true);
    nudge.t = (c - clamp(c, cx(0), cx(N - 1))) * .35;
  });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.live) {
      const c = (L.t + R.t) / 2;
      nudge.t = 0;
      setActive(Math.round((c - cx(0)) / (TAB + GAP) + drag.dir * .18), drag.dir || 0);
      suppressClick = true; setTimeout(() => suppressClick = false, 0);
      tabs.classList.remove('dragging');
    }
    drag = null;
  };
  tabs.addEventListener('pointerup', endDrag);
  tabs.addEventListener('pointercancel', endDrag);

  btns.forEach((b, i) => b.addEventListener('click', e => {
    e.stopPropagation();
    if (suppressClick) return;
    if (i === active) setExpanded(!expanded); else setActive(i);
  }));
  document.addEventListener('click', e => { if (expanded && !dock.contains(e.target)) setExpanded(false); });
  addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { setActive(active + 1); btns[active].focus(); }
    else if (e.key === 'ArrowLeft') { setActive(active - 1); btns[active].focus(); }
    else if (e.key === 'Escape') setExpanded(false);
  });
  addEventListener('resize', () => { if (expanded) W.t = expW(); });

  // switches
  const swSlow = $('sw-slow');
  swSlow.addEventListener('click', () => Motion.setSlow(!Motion.slow));
  Motion.onSlow(v => swSlow.setAttribute('aria-checked', v));
  document.querySelectorAll('.sw:not(#sw-slow)').forEach(s =>
    s.addEventListener('click', () => s.setAttribute('aria-checked', s.getAttribute('aria-checked') !== 'true')));

  Motion.register({
    frame: dt => all.forEach(s => step(s, dt)),
    render() {
      const w = W.x, h = Math.max(H.x, 40);
      const open = clamp((h - COL.H) / PANEL_H, 0, 1);
      const give = clamp(-H.v / 9000, -.04, .04);   // height racing => width gives a little
      dock.style.width = w * (1 + give) + 'px';
      dock.style.height = h + 'px';
      dock.style.borderRadius = Math.min(h / 2, 34 - 8 * open) + 'px';
      dock.style.transform = `translate(calc(-50% + ${nudge.x}px),${h / 2}px)`;
      ground.style.width = w * .86 + 'px';
      ground.style.transform = `translate(calc(-50% + ${nudge.x * .6}px),${h / 2 + 22}px) scaleY(${1 + open * .5})`;

      let l = L.x, r = R.x; if (r < l) [l, r] = [r, l];
      const iw = Math.max(r - l, 24);
      const ih = TAB * clamp(1 / Math.sqrt(iw / TAB), .66, 1.1);   // area preserving
      const top = (TAB - ih) / 2;
      ind.style.width = iw + 'px'; ind.style.height = ih + 'px';
      ind.style.borderRadius = ih / 2 + 'px';
      ind.style.transform = `translate3d(${l}px,${top}px,0)`;
      // dark icon layer clipped to the pill, so icons invert exactly where the pill is
      topIcons.style.clipPath = `inset(${top}px ${TW - l - iw}px ${TAB - top - ih}px ${l}px round ${ih / 2}px)`;
      pops.forEach((p, i) => {
        const t = `scale(${p.x})`;
        btns[i].firstChild.style.transform = t; tops[i].firstChild.style.transform = t;
      });
    },
  });

  setActive(0, 0);
  after(.35, () => { W.t = COL.W; tune(W, 220, 15); });   // intro: one pill grows into the dock
})();
