/* Reveal each principle once. Content stays visible without JS or motion support. */
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
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
