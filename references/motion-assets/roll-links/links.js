// Roll Links
// A menu of big words. Hovering one turns its letters over one after another,
// left to right, each on its own spring, and dims the rest. Leaving turns them
// back the same way. With nobody pointing, it hovers the links itself in turn.
(() => {
  const { S, step, after } = Motion;
  const nav = document.getElementById('links');
  const ITEMS = ['Work', 'Studio', 'Journal', 'Contact'];
  const STAGGER = .03;
  let pointer = false, auto = 0, autoT = .8;

  const links = ITEMS.map((word, i) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'lk';
    el.setAttribute('aria-label', word);
    const word$ = document.createElement('span');
    word$.style.display = 'flex';
    word$.setAttribute('aria-hidden', 'true');
    const letters = [...word].map(ch => {
      const c = document.createElement('span');
      c.className = 'ch';
      c.innerHTML = `<span class="in"><i></i><i></i></span>`;
      c.querySelectorAll('i').forEach(x => { x.textContent = ch; });
      word$.appendChild(c);
      return { in: c.firstChild, s: S(0, 380, 24) };
    });
    const n = document.createElement('span');
    n.className = 'n';
    n.textContent = String(i + 1).padStart(2, '0');
    n.setAttribute('aria-hidden', 'true');
    el.append(word$, n);
    nav.appendChild(el);
    const link = { el, letters, on: false };
    el.addEventListener('pointerenter', () => { pointer = true; hover(link); });
    el.addEventListener('pointerleave', () => { unhover(link); });
    el.addEventListener('focus', () => hover(link));
    el.addEventListener('blur', () => unhover(link));
    return link;
  });
  nav.addEventListener('pointerleave', () => { pointer = false; autoT = .9; });

  function hover(link) {
    links.forEach(l => { if (l !== link && l.on) unhover(l); });
    link.on = true;
    link.el.classList.add('on');
    nav.classList.add('hot');
    link.letters.forEach((l, k) => after(k * STAGGER, () => { if (link.on) l.s.t = 1; }));
  }
  function unhover(link) {
    link.on = false;
    link.el.classList.remove('on');
    if (!links.some(l => l.on)) nav.classList.remove('hot');
    link.letters.forEach((l, k) => after(k * STAGGER, () => { if (!link.on) l.s.t = 0; }));
  }

  Motion.register({
    frame(dt) {
      if (!pointer && (autoT -= dt) <= 0) {
        const cur = links.find(l => l.on);
        if (cur) { unhover(cur); autoT = .35; auto = (auto + 1) % links.length; }
        else { hover(links[auto]); autoT = 1.1; }
      }
      links.forEach(link => link.letters.forEach(l => step(l.s, dt)));
    },
    render() {
      links.forEach(link => link.letters.forEach(l => {
        l.in.style.transform = `translateY(${(-l.s.x * 50).toFixed(2)}%)`;
      }));
    },
  });
})();
