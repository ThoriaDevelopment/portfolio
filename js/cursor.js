import { isTouch, prefersReducedMotion, copyToClipboard } from './utils.js';

export function initCursor() {
  if (isTouch() || prefersReducedMotion()) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(cursor);
  document.body.appendChild(dot);

  let mx = 0, my = 0, cx = 0, cy = 0, dx = 0, dy = 0;
  let raf = null;

  function move(x, y) {
    mx = x; my = y;
    if (!raf) raf = requestAnimationFrame(loop);
  }

  function loop() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    dx += (mx - dx) * 0.35;
    dy += (my - dy) * 0.35;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    dot.style.left = dx + 'px';
    dot.style.top = dy + 'px';
    raf = null;
    if (Math.abs(mx - cx) > 0.1 || Math.abs(my - cy) > 0.1) {
      raf = requestAnimationFrame(loop);
    }
  }

  window.addEventListener('pointermove', (e) => move(e.clientX, e.clientY), { passive: true });
  requestAnimationFrame(() => { cursor.classList.add('is-ready'); dot.classList.add('is-ready'); });

  // hover states
  const hoverTargets = 'a, button, [role="button"], .chip, .proof-thumb, .gallery-thumb, .gallery-main, .doc-card, .hire-btn, .kleos-demo-btn, .faq summary, [data-copy]';
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest(hoverTargets)) cursor.classList.add('hover');
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest(hoverTargets)) cursor.classList.remove('hover');
  });

  // magnetic buttons
  document.querySelectorAll('.btn, .chip, .hire-btn').forEach(el => {
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });

  // ripples
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.btn, .chip, .card, .proof-thumb, .gallery-thumb, .gallery-main, .doc-card, .faq summary, .hire-btn');
    if (!t) return;
    const rect = t.getBoundingClientRect();
    const r = document.createElement('span');
    r.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = size + 'px';
    r.style.left = (e.clientX - rect.left - size / 2) + 'px';
    r.style.top = (e.clientY - rect.top - size / 2) + 'px';
    t.style.position = 'relative';
    t.style.overflow = 'hidden';
    t.appendChild(r);
    setTimeout(() => r.remove(), 520);
  });
}

export function initCopyChips() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      await copyToClipboard(text);
      const label = btn.querySelector('.chip-label');
      btn.classList.add('copied');
      if (label) label.textContent = 'Copied! ' + text;
      setTimeout(() => {
        btn.classList.remove('copied');
        if (label) label.textContent = 'Discord ' + text;
      }, 1600);
    });
  });
}
