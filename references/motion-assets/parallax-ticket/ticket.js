// Parallax Ticket
// The card tilts toward the cursor; each layer moves by its own depth, so the green orb,
// the title and the VIP badge separate in space. A glare follows the cursor.
// Click flips it on a spring that overshoots a little, showing the QR on the back.
// Untouched, it floats gently so the depth is visible even without a cursor.
(() => {
  const { S, tune, step, clamp, spring, num } = Motion;
  const $ = id => document.getElementById(id);
  const stage = $('stage'), ticket = $('ticket'), glare = $('glare');
  const layers = [...ticket.querySelectorAll('.layer')].map(el => ({ el, depth: parseFloat(el.dataset.depth) }));

  const T = { tilt: num('--ticket-tilt', 14), depth: num('--ticket-depth', 18), flip: spring('--ticket-flip', '170 15') };

  // a QR-looking pattern: three finder squares and a stable pseudo random field
  (function qr() {
    const N = 25; let seed = 42, cells = '';
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#000"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#000"/>`;
    const inFinder = (x, y) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!inFinder(x, y) && rnd() > .52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    $('qr').innerHTML = `<svg viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges"><g fill="#000">${cells}</g>${finder(0, 0)}${finder(N - 7, 0)}${finder(0, N - 7)}</svg>`;
  })();

  const RX = S(0, 220, 18), RY = S(0, 220, 18), F = S(0, ...T.flip), G = S(0, 300, 26), LIFT = S(1, 300, 18);
  let hover = false, nx = 0, ny = 0, flipped = false, clock = 0, gx = 50, gy = 30;

  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    nx = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1);
    ny = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1);
    gx = (nx + 1) * 50; gy = (ny + 1) * 50;
    hover = true;
  });
  stage.addEventListener('pointerleave', () => { hover = false; });
  stage.addEventListener('pointerdown', () => { LIFT.t = .97; });
  addEventListener('pointerup', () => { LIFT.t = 1; });

  function flip() {
    flipped = !flipped;
    F.t = flipped ? 180 : 0;
    LIFT.v += 1.5;
    ticket.setAttribute('aria-pressed', flipped);
  }
  ticket.addEventListener('click', flip);
  ticket.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });

  Motion.register({
    frame(dt) {
      clock += dt;
      if (hover) { RX.t = -ny * T.tilt; RY.t = nx * T.tilt; G.t = 1; }
      else { RX.t = Math.sin(clock * .9) * 4; RY.t = Math.cos(clock * .7) * 7; G.t = .25; }
      [RX, RY, F, G, LIFT].forEach(s => step(s, dt));
    },
    render() {
      ticket.style.transform = `rotateX(${RX.x}deg) rotateY(${RY.x + F.x}deg) scale(${LIFT.x})`;
      // parallax: layers slide by depth against the tilt
      const ox = RY.x / T.tilt, oy = -RX.x / T.tilt;
      layers.forEach(l => { l.el.style.transform = `translate(${ox * T.depth * l.depth}px,${oy * T.depth * l.depth}px)`; });
      glare.style.setProperty('--g', clamp(G.x, 0, 1));
      glare.style.setProperty('--gx', (hover ? gx : 50 + ox * 30) + '%');
      glare.style.setProperty('--gy', (hover ? gy : 30 + oy * 30) + '%');
    },
  });
})();
