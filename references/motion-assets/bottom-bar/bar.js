// Bottom Bar
// Each tab's label has its own width spring: the picked tab opens to show its
// name while the old one closes, and the highlight pill follows the picked
// tab's live position and width. The icon squashes and pops on pick.
(() => {
  const { S, step, clamp, after } = Motion;
  const $ = id => document.getElementById(id);

  // narrow cards: shrink the whole bar to fit instead of cutting it off
  const fitBox = el => { const room = el.parentElement.clientWidth - 24, w = el.offsetWidth; el.style.transform = `translate(-50%,-50%) scale(${Math.min(1, room / w).toFixed(4)})`; };
  const hl = $('hl'), its = [...document.querySelectorAll('.it')];
  const tabs = its.map(el => {
    const nm = el.querySelector('.nm');
    nm.style.width = 'auto'; const full = nm.offsetWidth + 8; nm.style.width = '0px';
    return { el, nm, svg: el.querySelector('svg'), full, w: S(0, 300, 26), p: S(1, 520, 14) };
  });
  const X = S(0, 340, 28), W = S(0, 340, 28);
  let cur = -1, clock = 0, userUntil = 0, first = true;

  function pick(i) {
    cur = i;
    tabs.forEach((t, k) => { t.el.setAttribute('aria-selected', k === i); t.w.t = k === i ? t.full : 0; });
    tabs[i].p.x = .72; tabs[i].p.v = 6;
  }
  tabs.forEach((t, i) => t.el.addEventListener('click', () => { userUntil = clock + 7; pick(i); }));
  pick(0);
  let n = 1;
  (function auto() { if (clock >= userUntil) pick(n++ % tabs.length); after(1.7, auto); })();

  Motion.register({
    frame(dt) {
      fitBox($('bar'));
      clock += dt;
      tabs.forEach(t => { step(t.w, dt); step(t.p, dt); });
      const el = tabs[cur].el;
      X.t = el.offsetLeft; W.t = el.offsetWidth;
      if (first) { X.x = X.t; W.x = W.t; first = false; }
      step(X, dt); step(W, dt);
    },
    render() {
      tabs.forEach(t => {
        const w = Math.max(0, t.w.x);
        t.nm.style.width = w.toFixed(2) + 'px';
        t.nm.style.paddingLeft = clamp(w / t.full, 0, 1) * 8 + 'px';
        t.nm.style.opacity = clamp(w / t.full * 1.4 - .4, 0, 1).toFixed(3);
        t.svg.style.transform = `scale(${t.p.x.toFixed(4)})`;
      });
      hl.style.transform = `translateX(${X.x.toFixed(2)}px)`;
      hl.style.width = W.x.toFixed(2) + 'px';
    },
  });
})();
