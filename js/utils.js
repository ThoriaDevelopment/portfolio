export const $ = (sel, el = document) => el.querySelector(sel);
export const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

export function throttle(fn, limit) {
  let last;
  return function(...args) {
    const now = performance.now();
    if (!last || now - last >= limit) {
      last = now;
      fn.apply(this, args);
    }
  };
}

export function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouch() {
  return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
}

export async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { return false; }
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
  document.body.removeChild(ta);
  return ok;
}

export function observeOnce(els, cb, opts = {}) {
  if (!('IntersectionObserver' in window)) {
    els.forEach(cb);
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        cb(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12, ...opts });
  els.forEach(el => obs.observe(el));
}
