// Plan Switch
// The highlight has two edges on two springs: the edge that leads is stiff,
// the one that trails is soft, so it stretches on the way and lands whole.
// Yearly: price drums roll 20 to 16, the save chip pops from its right edge,
// the billing line rolls up and the free months row grows open (height on a
// spring) with its check popping a beat later. Upgrade: the pill closes into
// a circle with a spinner, then opens again green with "You're on Pro".
(() => {
  const { S, tune, step, clamp, spring, after } = Motion;
  const $ = id => document.getElementById(id);
  const card = $('card'), hl = $('hl'), bM = $('bMonth'), bY = $('bYear'), save = $('save'), extra = $('extra'), cta = $('cta'), ctaIn = $('ctaIn');
  const extraCk = extra.querySelector('.ck');

  const T = { lead: spring('--spring-lead', '620 36'), trail: spring('--spring-trail', '190 19'), pop: spring('--spring-pop', '520 16'), fade: spring('--spring-fade', '420 32'), soft: spring('--spring-soft', '260 24') };
  const L = S(0), R = S(0);
  const SV = S(1, ...T.pop), EX = S(1, ...T.soft), EK = S(1, ...T.pop), CW = S(1, ...T.soft), CP = S(1, ...T.pop);
  [[SV, T.pop], [EX, T.soft], [EK, T.pop], [CW, T.soft], [CP, T.pop]].forEach(([s, t]) => tune(s, ...t));

  // ---------- rolling bits ----------
  function line(el, h = 20) {
    let items = [], cur = null;
    return {
      set(w, html) {
        if (w === cur) return;
        items.forEach(o => { o.y.t = -h; o.o.t = 0; o.dead = true; });
        const sp = document.createElement('span'); if (html) sp.innerHTML = html; else sp.textContent = w; el.appendChild(sp);
        const o = { el: sp, y: S(cur == null ? 0 : h), o: S(cur == null ? 1 : 0) };
        tune(o.y, ...T.fade); tune(o.o, ...T.fade); o.y.t = 0; o.o.t = 1; items.push(o); cur = w;
      },
      step(dt) { items.forEach(o => { step(o.y, dt); step(o.o, dt); }); items = items.filter(o => { if (o.dead && o.o.x < .02) { o.el.remove(); return false; } return true; }); },
      render() { items.forEach(o => { o.el.style.transform = `translateY(${o.y.x.toFixed(2)}px)`; o.el.style.opacity = clamp(o.o.x, 0, 1).toFixed(3); }); },
    };
  }
  function roller(el, n, px) {
    const cols = [];
    for (let i = 0; i < n; i++) {
      const c = document.createElement('span'), s = document.createElement('span');
      c.className = 'rc'; s.className = 'rs'; s.innerHTML = [...'0123456789'].map(d => `<i>${d}</i>`).join('');
      c.appendChild(s); el.appendChild(c);
      const y = S(0); tune(y, 260, 22 + i * 2);
      cols.push({ c, s, y });
    }
    let first = true;
    return {
      set(v) { const str = String(v).padStart(n, '0'); cols.forEach((col, i) => { const go = () => { col.y.t = +str[i]; }; if (first) { go(); col.y.x = col.y.t; } else after(i * .045, go); }); first = false; },
      step(dt) { cols.forEach(c => step(c.y, dt)); },
      render() { cols.forEach(c => { c.s.style.transform = `translateY(${(-c.y.x * px).toFixed(2)}px)`; }); },
    };
  }
  const price = roller($('price'), 2, 48), bill = line($('bill')), btn = line(ctaIn, 48);

  // ---------- billing ----------
  let yearly = null, clock = 0, userUntil = 0, cycles = 0;
  function pick(y) {
    if (y === yearly) return;
    const first = yearly == null; yearly = y;
    bM.setAttribute('aria-checked', !y); bY.setAttribute('aria-checked', y);
    const b = y ? bY : bM, l = b.offsetLeft, r = l + b.offsetWidth;
    const right = !first && y;                       // moving right: the right edge leads
    tune(L, ...(right ? T.trail : T.lead)); tune(R, ...(right ? T.lead : T.trail));
    L.t = l; R.t = r; if (first) { L.x = l; R.x = r; }
    price.set(y ? 16 : 20);
    bill.set(y ? 'Billed $192 yearly' : 'Billed monthly, cancel anytime');
    SV.t = y ? 1 : 0; if (y) SV.x = Math.min(SV.x, .3);
    EX.t = y ? 1 : 0;
    if (y) { EK.x = .3; EK.t = 0; after(.16, () => { EK.t = 1; }); }
    if (first) { SV.x = SV.t; EX.x = EX.t; EK.x = EK.t = y ? 1 : 0; }
  }
  [[bM, false], [bY, true]].forEach(([b, y]) => b.addEventListener('click', () => { userUntil = clock + 8; pick(y); }));
  $('card').querySelector('.seg').addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault(); userUntil = clock + 8; pick(e.key === 'ArrowRight'); (yearly ? bY : bM).focus();
  });

  // ---------- upgrade ----------
  const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12.5l4 4 8-9"/></svg>';
  let state = 'idle';
  function setBtn(s) {
    state = s;
    if (s === 'idle') { cta.classList.remove('is-done'); CW.t = 1; btn.set('idle', 'Upgrade to Pro'); cta.setAttribute('aria-label', 'Upgrade to Pro'); }
    if (s === 'busy') { CW.t = 0; btn.set('busy', '<span class="spin" aria-hidden="true"></span>'); cta.setAttribute('aria-label', 'Upgrading'); }
    if (s === 'done') { cta.classList.add('is-done'); CW.t = 1; CP.x = .92; btn.set('done', `${CHECK}You're on Pro`); cta.setAttribute('aria-label', "You're on Pro"); }
  }
  function upgrade() {
    if (state !== 'idle') return;
    CP.x = .94; setBtn('busy');
    after(1.2, () => { setBtn('done'); after(2.4, () => setBtn('idle')); });
  }
  cta.addEventListener('click', () => { userUntil = clock + 8; upgrade(); });

  pick(true); setBtn('idle');
  function auto() {
    if (clock >= userUntil && state === 'idle') {
      cycles++;
      if (cycles % 5 === 0) upgrade(); else pick(!yearly);
    }
    after(2.6, auto);
  }
  after(2, auto);

  let spin = 0;
  Motion.register({
    frame(dt) { clock += dt; spin += dt; [L, R, SV, EX, EK, CW, CP].forEach(s => step(s, dt)); price.step(dt); bill.step(dt); btn.step(dt); },
    render() {
      hl.style.transform = `translateX(${L.x.toFixed(2)}px)`;
      hl.style.width = Math.max(36, R.x - L.x).toFixed(2) + 'px';
      price.render(); bill.render(); btn.render();
      const sv = Math.max(0, SV.x);
      save.style.transform = `scale(${sv.toFixed(4)})`; save.style.opacity = clamp(sv * 1.4, 0, 1).toFixed(3);
      const ex = clamp(EX.x, 0, 1.08);
      extra.style.height = (30 * ex).toFixed(2) + 'px'; extra.style.opacity = clamp(EX.x * 1.6 - .4, 0, 1).toFixed(3);
      extraCk.style.transform = `scale(${Math.max(0, EK.x).toFixed(4)})`;
      const full = card.clientWidth - 16, w = 48 + (full - 48) * clamp(CW.x, 0, 1.03);
      cta.style.width = w.toFixed(2) + 'px'; cta.style.transform = `scale(${CP.x.toFixed(4)})`;
      const sp = ctaIn.querySelector('.spin'); if (sp) sp.style.transform = `rotate(${(spin * 360 * 1.3 % 360).toFixed(1)}deg)`;
    },
  });
})();
