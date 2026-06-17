const STORAGE_KEY = 'thoria-theme';
const THEMES = ['default', 'minecraft', 'light'];

const THEME_ICONS = {
  default:  { src: 'Assets/Minecraft/assets/minecraft/textures/item/clock_00.png', alt: 'Default theme (night clock)' },
  light:    { src: 'Assets/Minecraft/assets/minecraft/textures/item/clock_31.png', alt: 'Light theme (day clock)' },
  minecraft:{ src: 'Assets/Minecraft/assets/minecraft/textures/item/stone_sword.png', alt: 'Minecraft theme (stone sword)' }
};

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) || 'default';
  applyTheme(saved);

  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  updateToggleIcon(saved);
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'default';
    const idx = THEMES.indexOf(current);
    const next = THEMES[(idx + 1) % THEMES.length];
    applyTheme(next);
    updateToggleIcon(next);
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  });
}

export function applyTheme(name) {
  const theme = THEMES.includes(name) ? name : 'default';
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
}

function updateToggleIcon(theme) {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  toggle.setAttribute('data-current', theme);
  const icon = toggle.querySelector('.theme-icon');
  if (!icon) return;

  const cfg = THEME_ICONS[theme] || THEME_ICONS.default;
  icon.innerHTML = `<img src="${cfg.src}" alt="${cfg.alt}" width="22" height="22" decoding="async" />`;
  toggle.title = `Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
  toggle.setAttribute('aria-label', `Toggle theme, current: ${theme}`);
}
