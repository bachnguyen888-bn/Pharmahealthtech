// MFP Refund Recovery: the page's only script. Optional by design; everything works without it.
// 1. Arrow buttons for the "What we catch" carousel (the row also scrolls by swipe or trackpad).
// 2. Close the mobile menu after a link in it is tapped.
(() => {
  const track = document.getElementById('catch-track');
  const nav = document.querySelector('.carousel-nav');
  if (track && nav) {
    const [prev, next] = nav.querySelectorAll('button');
    const step = () => {
      const card = track.querySelector('li');
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : 300;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };
    nav.hidden = false;
    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-dir]');
      if (!btn) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollBy({ left: Number(btn.dataset.dir) * step(), behavior: reduce ? 'auto' : 'smooth' });
    });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  for (const link of document.querySelectorAll('.menu-panel a')) {
    link.addEventListener('click', () => { link.closest('details').open = false; });
  }
})();
