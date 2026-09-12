/* P4-28: progressively enhance the complete, static Philosophy section. */
(() => {
  const initialize = () => {
    document.querySelectorAll('[data-philosophy]').forEach(root => {
      if (root.dataset.phReady) return;
      const headings = [...root.querySelectorAll('[data-ph-heading]')];
      if (headings.length !== 3) return;
      const entries = headings.map(heading => {
        const id = heading.dataset.phHeading;
        return {
          id, heading,
          node: root.querySelector('[data-ph-node="' + id + '"]'),
          line: root.querySelector('[data-ph-line="' + id + '"]'),
          detail: root.querySelector('[data-ph-detail="' + id + '"]'),
        };
      });
      if (entries.some(entry => !entry.node || !entry.line || !entry.detail)) return;
      let selected = null;
      const select = id => {
        selected = selected === id ? null : id;
        entries.forEach(entry => {
          const active = entry.id === selected;
          entry.button.setAttribute('aria-pressed', String(active));
          entry.hint.textContent = active ? '図で強調中' : '図を強調';
          [entry.node, entry.line, entry.detail].forEach(element => element.toggleAttribute('data-ph-active', active));
        });
      };
      entries.forEach(entry => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ph-toggle';
        button.textContent = entry.heading.textContent;
        button.setAttribute('aria-label', entry.heading.textContent + 'を図で強調');
        button.setAttribute('aria-pressed', 'false');
        const hint = document.createElement('span');
        hint.className = 'ph-toggle-hint';
        hint.textContent = '図を強調';
        hint.setAttribute('aria-hidden', 'true');
        button.append(hint);
        button.addEventListener('click', () => select(entry.id));
        entry.heading.replaceChildren(button);
        entry.button = button;
        entry.hint = hint;
      });
      root.dataset.phReady = 'true';
      const map = root.querySelector('.ph-map');
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (!map || motion.matches || !('IntersectionObserver' in window)) return;
      entries.forEach(entry => {
        const trace = entry.line.cloneNode(false);
        trace.removeAttribute('data-ph-line');
        trace.setAttribute('class', 'ph-trace');
        trace.setAttribute('pathLength', '1');
        entry.line.parentNode.append(trace);
      });
      const observer = new IntersectionObserver(items => {
        if (!items.some(item => item.isIntersecting)) return;
        observer.disconnect();
        if (motion.matches) return;
        map.classList.add('ph-is-entering');
        map.addEventListener('animationend', () => map.classList.remove('ph-is-entering'), {once:true});
      }, {threshold:0.35});
      observer.observe(map);
      motion.addEventListener('change', event => {
        if (!event.matches) return;
        observer.disconnect();
        map.classList.remove('ph-is-entering');
      });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();
})();
