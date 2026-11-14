// Dynamic Menu
// Width and height have their own springs, the height a little softer so the
// panel lands after it has widened. The two toggle lines meet in the middle
// and turn into a cross. Links rise in with a short stagger and drop away in
// reverse when it closes.
(() => {
  const { S, step, clamp, after } = Motion;
  const $ = id => document.getElementById(id);
  const menu = $('menu'), head = $('head'), b1 = $('b1'), b2 = $('b2');
  const lis = [...document.querySelectorAll('.links li')].map(el => ({ el, s: S(0, 260, 22) }));
  const W = S(150, 320, 26), H = S(52, 240, 22), X = S(0, 380, 24);
  let open = false, clock = 0, userUntil = 0;
  const big = () => Math.min(300, menu.parentElement.clientWidth - 48);

  function set(o) {
    open = o;
    head.setAttribute('aria-expanded', o);
    W.t = o ? big() : 150; H.t = o ? 52 + 4 + lis.length * 48 + 10 : 52; X.t = o ? 1 : 0;
    lis.forEach((l, i) => after(o ? .08 + i * .05 : (lis.length - 1 - i) * .03, () => { l.s.t = open ? 1 : 0; }));
  }
  head.addEventListener('click', () => { userUntil = clock + 8; set(!open); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', e => e.preventDefault()));
  (function auto() { if (clock >= userUntil) set(!open); after(open ? 2.8 : 1.4, auto); })();

  Motion.register({
    frame(dt) { clock += dt; [W, H, X].forEach(s => step(s, dt)); lis.forEach(l => step(l.s, dt)); },
    render() {
      menu.style.width = W.x.toFixed(2) + 'px';
      menu.style.height = H.x.toFixed(2) + 'px';
      menu.style.borderRadius = (26 - 4 * clamp(X.x, 0, 1)).toFixed(2) + 'px';
      const x = clamp(X.x, -.1, 1.1);
      // two lines 8px apart meet in the middle and turn 45 degrees each way
      b1.style.transform = `translateY(${(-4 * (1 - x)).toFixed(2)}px) rotate(${(45 * x).toFixed(2)}deg)`;
      b2.style.transform = `translateY(${(4 * (1 - x)).toFixed(2)}px) rotate(${(-45 * x).toFixed(2)}deg)`;
      lis.forEach(l => {
        l.el.style.opacity = clamp(l.s.x, 0, 1).toFixed(3);
        l.el.style.transform = `translateY(${((1 - l.s.x) * 18).toFixed(2)}px)`;
      });
    },
  });
})();
