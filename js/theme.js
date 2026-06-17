const STORAGE_KEY = 'thoria-theme';
const THEMES = ['default', 'minecraft', 'light'];

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
  const label = toggle.getAttribute('aria-label') || 'Toggle theme';
  toggle.setAttribute('aria-label', label);
  toggle.setAttribute('data-current', theme);
  const icon = toggle.querySelector('.theme-icon');
  if (!icon) return;

  if (theme === 'minecraft') {
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/><path d="M7 11v2M17 9v2"/></svg>';
    toggle.title = 'Theme: Minecraft';
  } else if (theme === 'light') {
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    toggle.title = 'Theme: Light';
  } else {
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggle.title = 'Theme: Default';
  }
}
