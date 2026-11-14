// Pull to Refresh
// Dragging the list down meets rubber resistance. A white drop stretches out of the
// handle (goo filter keeps them fused); past the threshold it pops, snaps off and
// becomes the spinner. Then a new message lands at the top and the list springs home.
(() => {
  const { S, tune, step, clamp, spring, num, after } = Motion;
  const $ = id => document.getElementById(id);
  const body = $('body'), list = $('list'), drop = $('drop'), spin = $('spin'), updated = $('updated');

  const T = { th: num('--pull-threshold', 88), back: spring('--pull-return', '260 18'), hold: num('--pull-hold-ms', 1300) / 1000 };
  const HOLD = 64, REST_Y = 5, REST_S = .25;

  const P = S(0, ...T.back);           // list offset
  const D = S(REST_Y, 380, 20);        // drop center y
  const DS = S(REST_S, 420, 18);       // drop scale
  const SP = S(0, 400, 26);            // spinner opacity / scale
  let mode = 'idle', drag = null, armed = false, poolIdx = 0;

  const POOL = [
    ['NV', 'Nova sold again', 'Two new orders since lunch'],
    ['KL', 'New review on Kalypso', 'Cleanest kit I bought this year'],
    ['SR', 'Shotreel render done', 'Your 4K export is ready'],
    ['CB', 'Cobalt in the top 10', 'Trending in templates this week'],
  ];

  // half speed at first so the threshold is easy to reach, then real resistance
  const rubber = d => {
    d = Math.max(0, d);
    return d <= 180 ? d * .55 : 99 + 60 * (1 - 1 / ((d - 180) * .55 / 60 + 1));
  };

  body.addEventListener('pointerdown', e => {
    if (mode !== 'idle') return;
    drag = { id: e.pointerId, y0: e.clientY };
    mode = 'pulling'; armed = false;
    tune(P, 900, 50);
    body.classList.add('dragging');
    try { body.setPointerCapture(e.pointerId); } catch {}
  });
  body.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    P.t = rubber(e.clientY - drag.y0);
    const over = P.t >= T.th;
    if (over && !armed) { armed = true; DS.v += 4; updated.textContent = 'Release to refresh'; }
    if (!over && armed) { armed = false; updated.textContent = 'Pull to refresh'; }
    if (!over && !armed && P.t > 8 && updated.textContent !== 'Pull to refresh') updated.textContent = 'Pull to refresh';
  });
  const end = e => {
    if (!drag || e.pointerId !== drag.id) return;
    drag = null; body.classList.remove('dragging');
    if (P.t >= T.th) refresh();
    else {
      mode = 'idle';
      tune(P, ...T.back); P.t = 0;
      updated.textContent = 'Updated just now';
    }
  };
  body.addEventListener('pointerup', end);
  body.addEventListener('pointercancel', end);
  // keyboard: R refreshes
  addEventListener('keydown', e => { if ((e.key === 'r' || e.key === 'R') && mode === 'idle') { P.x = 0; refresh(); } });

  function refresh() {
    mode = 'loading';
    tune(P, ...T.back); P.t = HOLD;
    updated.textContent = 'Updating…';
    after(T.hold, () => {
      addRow();
      mode = 'settling';
      tune(P, ...T.back); P.t = 0;
      updated.textContent = 'Updated just now';
      after(.6, () => { mode = 'idle'; });
    });
  }

  function addRow() {
    const [i, t, s] = POOL[poolIdx++ % POOL.length];
    const row = document.createElement('div');
    row.className = 'row new';
    row.innerHTML = `<div class="av" data-av="${poolIdx % 12 + 1}" aria-hidden="true"></div><div class="tx"><b>${t}</b><span>${s}</span></div><time>now</time><span class="dot"></span>`;
    list.insertBefore(row, list.firstChild);
    // keep the list short so it never scrolls
    while (list.children.length > 6) list.lastElementChild.remove();
  }

  Motion.register({
    frame(dt) {
      const p = clamp(P.x / T.th, 0, 1);
      if (mode === 'pulling') { D.t = Math.max(REST_Y, P.x * .5); DS.t = REST_S + (1 - REST_S) * p; SP.t = 0; }
      else if (mode === 'loading') { D.t = HOLD / 2; DS.t = 1; SP.t = 1; }
      else { D.t = REST_Y; DS.t = REST_S; SP.t = 0; }
      step(P, dt); step(D, dt); step(DS, dt); step(SP, dt);
    },
    render() {
      list.style.transform = `translateY(${P.x}px)`;
      // the drop stretches vertically while it is being pulled fast
      const st = 1 + clamp(Math.abs(D.v) / 1600, 0, .35);
      drop.style.transform = `translateY(${D.x - 16}px) scale(${DS.x / st},${DS.x * st})`;
      // while it spins, a clean circle sits on top and the goo drop fades out under it
      spin.style.transform = `translateY(${D.x - 16}px) scale(${.6 + .4 * SP.x})`;
      drop.style.opacity = (1 - clamp(SP.x, 0, 1)).toFixed(3);
      spin.style.opacity = clamp(SP.x, 0, 1);
    },
  });
})();
