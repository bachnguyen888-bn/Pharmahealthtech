// ClearHealth landing page: its only script. Optional by design; without it, the pilot form
// falls back to the plain email address shown beside it.
// 1. Arrow buttons for the "What we catch" carousel (the row also scrolls by swipe or trackpad).
// 2. Close the mobile menu after a link in it is tapped.
// 3. Show the back-to-top button once the hero has scrolled away.
// 4. Pilot form: the site has no server, so the form writes the email for the visitor to send.
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

  const toTop = document.querySelector('.to-top');
  const hero = document.querySelector('.hero');
  if (toTop && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { toTop.hidden = entry.isIntersecting; }).observe(hero);
  }

  const form = document.getElementById('pilot-form');
  const done = document.getElementById('pilot-done');
  if (form && done) {
    const to = form.dataset.to;
    const message = document.getElementById('pilot-message');
    const send = document.getElementById('pilot-send');
    const status = document.getElementById('pilot-copy-status');
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // the browser has already checked the required fields
      const data = new FormData(form);
      const field = (name) => String(data.get(name) || '').trim();
      const subject = `Pilot sign-up: ${field('pharmacy')}`;
      const lines = [
        'Hello ClearHealth,',
        '',
        'We would like to join the MFP Refund Recovery pilot.',
        '',
        `Name: ${field('name')}`,
        `Pharmacy: ${field('pharmacy')}`,
        `Email: ${field('email')}`,
      ];
      if (field('phone')) lines.push(`Phone: ${field('phone')}`);
      if (field('notes')) lines.push('', field('notes'));
      const body = lines.join('\n');
      message.value = `To: ${to}\nSubject: ${subject}\n\n${body}`;
      send.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, '\r\n'))}`;
      status.textContent = '';
      form.hidden = true;
      done.hidden = false;
      done.focus();
    });
    document.getElementById('pilot-copy').addEventListener('click', async () => {
      message.select();
      try {
        await navigator.clipboard.writeText(message.value);
        status.textContent = 'Copied. Paste it into a new email.';
      } catch {
        status.textContent = 'Selected. Press Ctrl+C (or ⌘C on a Mac) to copy it.';
      }
    });
    document.getElementById('pilot-edit').addEventListener('click', () => {
      done.hidden = true;
      form.hidden = false;
      form.querySelector('input').focus();
    });
  }
})();
