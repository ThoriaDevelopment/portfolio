const DEFAULT_TITLE = 'Thoria | Minecraft Server Administrator & Media Manager';
const TECHNO_TITLE = 'Technoblade | So long, Nerds!';
const DEFAULT_AVATAR = 'Assets/Thoria/inrising.png';
const TECHNO_AVATAR = 'Assets/Thoria/Technoblade.webp';

export function initTechnobladeSwap() {
  const swappable = document.querySelectorAll('[data-thoria-default]');
  const avatar = document.querySelector('.hero-avatar');
  if (!swappable.length && !avatar) return;

  function apply(theme) {
    const isTechno = theme === 'technoblade';
    swappable.forEach(el => {
      const text = isTechno ? el.getAttribute('data-thoria-techno') : el.getAttribute('data-thoria-default');
      if (text) el.textContent = text;
    });
    if (avatar) {
      avatar.src = isTechno ? TECHNO_AVATAR : DEFAULT_AVATAR;
      avatar.alt = isTechno ? 'Technoblade' : 'Thoria';
    }
    document.title = isTechno ? TECHNO_TITLE : DEFAULT_TITLE;
  }

  window.addEventListener('themechange', (e) => apply(e.detail));
  apply(document.documentElement.getAttribute('data-theme') || 'default');
}
