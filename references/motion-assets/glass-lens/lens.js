// Glass Lens
// A round magnifying glass over a photo. Three copies of the photo sit inside
// the glass, each zoomed a little more and shown a little closer to the rim,
// so the view bends outward like a real convex lens. The glass follows the
// cursor on a soft spring with a slight tilt in the direction it moves.
// Press to zoom in. With no cursor around, it drifts across the photo.
(() => {
  const { S, step, spring, num } = Motion;
  const $ = id => document.getElementById(id);
  const poster = $('poster'), lens = $('lens'), view = $('lensView');

  const T = { follow: spring('--lens-follow', '150 20'), zoom: num('--lens-zoom', 1.6), press: num('--lens-zoom-press', 2.2), size: num('--lens-size', 128) };
  const L = T.size;
  lens.style.width = lens.style.height = L + 'px';

  // l0 = whole glass, l1 = outer band, l2 = rim: each bends a bit more
  const BEND = [1, 1.05, 1.12];
  const copies = BEND.map((b, i) => {
    const layer = document.createElement('div');
    layer.className = 'layer l' + i;
    const c = poster.cloneNode(true);
    c.removeAttribute('id'); c.removeAttribute('role'); c.removeAttribute('aria-label');
    layer.appendChild(c); view.appendChild(layer);
    return { c, b };
  });

  const X = S(innerWidth / 2, ...T.follow), Y = S(innerHeight / 2, ...T.follow);
  const Z = S(T.zoom, 260, 26);
  let px = null, py = null, lastPointer = -1e9, clock = 0;

  addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; lastPointer = performance.now(); });
  document.documentElement.addEventListener('pointerleave', () => { px = null; });
  addEventListener('pointerdown', e => { px = e.clientX; py = e.clientY; lastPointer = performance.now(); Z.t = T.press; });
  addEventListener('pointerup', () => { Z.t = T.zoom; });

  Motion.register({
    frame(dt) {
      clock += dt;
      const idle = px === null || performance.now() - lastPointer > 2500;
      if (idle) {
        // a slow loop over the photo, through the flowers and the trees
        const r = poster.getBoundingClientRect();
        X.t = r.left + r.width / 2 + Math.cos(clock * .42) * r.width * .26;
        Y.t = r.top + r.height / 2 + Math.sin(clock * .84) * r.height * .14 + r.height * .16;
      } else { X.t = px; Y.t = py; }
      step(X, dt); step(Y, dt); step(Z, dt);
    },
    render() {
      const x = X.x, y = Y.x;
      // a hand-held glass leans a little into its motion; no squash
      const tilt = Math.max(-6, Math.min(6, X.v / 220));
      lens.style.transform = `translate(${(x - L / 2).toFixed(2)}px,${(y - L / 2).toFixed(2)}px) rotate(${tilt.toFixed(2)}deg)`;

      // line each copy up with the real photo, then zoom around the glass centre
      const r = poster.getBoundingClientRect();
      const ox = r.left - (x - L / 2), oy = r.top - (y - L / 2);
      const origin = `${(x - r.left).toFixed(2)}px ${(y - r.top).toFixed(2)}px`;
      copies.forEach(({ c, b }) => {
        c.style.transformOrigin = origin;
        c.style.transform = `translate(${ox.toFixed(2)}px,${oy.toFixed(2)}px) scale(${(Z.x * b).toFixed(4)})`;
      });
      // undo the tilt inside so the photo itself stays level
      view.style.transform = `rotate(${(-tilt).toFixed(2)}deg)`;
    },
  });
})();
