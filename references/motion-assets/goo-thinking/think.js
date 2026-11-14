// Goo Thinking
// Thinking: three dots hop one after another, and the goo filter pulls each
// hopping dot out of its neighbours like a drop. Answer: the dots slide into
// one, the drop sinks away, and the pill springs open into the reply. Then it
// closes back to dots and thinks about the next one. Click to skip ahead.
(() => {
  const { S, step, clamp, after, cancel } = Motion;
  const $ = id => document.getElementById(id);
  const wrap = $('wrap'), bubble = $('bubble'), answer = $('answer');
  const dots = [...document.querySelectorAll('.goo i')].map((el, i) => ({ el, x: S(19 + i * 13, 300, 22), y: S(0, 420, 14), i }));
  const REPLIES = [
    'Here is a plan: tidy the backlog on Monday, ship the fix on Wednesday, and write the update on Friday.',
    'Short version: the sign-up drop is on the second step. Cutting the phone field should win most of it back.',
    'Three ideas for the launch: a 20 second demo, a thread with the before and after, and a note to the beta list.',
  ];
  const W = S(64, 240, 24), H = S(40, 240, 24), drop = S(1, 300, 26), A = S(0, 260, 28), big = S(1, 300, 24);
  let phase = 'think', n = 0, hop = .3, k = 0, timers = [];
  const later = (s, f) => { const t = after(s, () => { timers = timers.filter(x => x !== t); f(); }); timers.push(t); };

  function think() {
    phase = 'think';
    A.t = 0;
    later(.25, () => {
      W.t = 64; H.t = 40;
      dots.forEach(d => { d.x.t = 19 + d.i * 13; });
      drop.t = 1; big.t = 1;
      bubble.setAttribute('aria-label', 'Thinking');
    });
    later(2.6, reply);
  }

  function reply() {
    phase = 'merge';
    dots.forEach(d => { d.x.t = 32 - 4.5; d.y.t = 0; });          // run together in the middle
    big.t = 1.45;
    later(.45, () => { drop.t = 0; });                               // the drop sinks away
    later(.6, () => {
      phase = 'answer';
      answer.textContent = REPLIES[n++ % REPLIES.length];
      bubble.setAttribute('aria-label', answer.textContent);
      W.t = wrap.offsetWidth;
      H.t = answer.offsetHeight + 22;
      later(.12, () => { A.t = 1; });
    });
    later(4.4, think);
  }

  bubble.addEventListener('click', () => { timers.forEach(cancel); timers = []; phase === 'answer' ? think() : reply(); });
  think();

  Motion.register({
    frame(dt) {
      // One dot hops at a time, left to right, then a short rest.
      if (phase === 'think' && (hop -= dt) <= 0) {
        dots[k % 3].y.v = -95;
        k++;
        hop = k % 3 ? .16 : .46;
      }
      [W, H, drop, A, big].forEach(s => step(s, dt));
      dots.forEach(d => { step(d.x, dt); step(d.y, dt); });
    },
    render() {
      bubble.style.width = W.x.toFixed(2) + 'px';
      bubble.style.height = H.x.toFixed(2) + 'px';
      // Merged, the three read as one bigger drop; then the drop sinks to nothing.
      const s = clamp(drop.x, 0, 1.2) * big.x;
      dots.forEach(d => {
        d.el.style.transform = `translate(${d.x.x.toFixed(2)}px,${(15.5 + d.y.x).toFixed(2)}px) scale(${s.toFixed(3)})`;
      });
      answer.style.opacity = clamp(A.x, 0, 1).toFixed(3);
      answer.style.transform = `translateY(${((1 - A.x) * 8).toFixed(2)}px)`;
    },
  });
})();
