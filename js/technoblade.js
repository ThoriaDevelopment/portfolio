const DEFAULT_TITLE = 'Thoria — Minecraft Server Administrator & Media Manager';
const TECHNO_TITLE = 'Technoblade — So long, Nerds!';

export function initTechnobladeSwap() {
  const swappable = document.querySelectorAll('[data-thoria-default]');
  if (!swappable.length) return;

  function apply(theme) {
    const isTechno = theme === 'technoblade';
    swappable.forEach(el => {
      const text = isTechno ? el.getAttribute('data-thoria-techno') : el.getAttribute('data-thoria-default');
      if (text) el.textContent = text;
    });
    document.title = isTechno ? TECHNO_TITLE : DEFAULT_TITLE;
  }

  window.addEventListener('themechange', (e) => apply(e.detail));
  apply(document.documentElement.getAttribute('data-theme') || 'default');
}
