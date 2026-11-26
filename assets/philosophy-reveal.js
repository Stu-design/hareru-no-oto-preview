/* Reveal Home principles and selected short cards once; content is visible without JS. */
(() => {
  const start = () => {
    const list = document.querySelector('.philosophy-principles ol');
    if (!list || list.dataset.revealReady || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    list.dataset.revealReady = 'true';
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('principle-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    Array.from(list.children).forEach(item => observer.observe(item));

    const cards = document.querySelectorAll('#courses .c-course-card, #courses .course-card, #teachers .c-teacher-card, #teachers .teacher-card, #support .c-info-grid > .c-item, #support .support-grid > article');
    const cardObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('card-revealed');
        cardObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    cards.forEach(card => {
      const finish = () => card.classList.remove('card-revealed');
      card.addEventListener('animationend', finish, { once: true });
      card.addEventListener('animationcancel', finish, { once: true });
      card.addEventListener('focusin', () => {
        finish();
        cardObserver.unobserve(card);
      }, { once: true });
      cardObserver.observe(card);
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
