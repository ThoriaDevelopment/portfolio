import { prefersReducedMotion, observeOnce } from './utils.js';

export function initScrollEffects() {
  initReveal();
  initCountUp();
  initTypewriter();
  initParallax();
  initVelocitySkew();
}

function initReveal() {
  const reduced = prefersReducedMotion();
  document.querySelectorAll('.reveal-grid').forEach(grid => {
    const items = grid.querySelectorAll('.reveal');
    items.forEach((el, i) => { el.style.transitionDelay = (i * 0.07) + 's'; });
  });

  if (reduced) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
  }, 1600);
}

function initCountUp() {
  const reduced = prefersReducedMotion();
  const counters = Array.from(document.querySelectorAll('.stat[data-count]'));
  counters.forEach(el => {
    if (!reduced) {
      const b = el.querySelector('b');
      if (b) b.textContent = '0';
    }
  });

  const statsGrid = document.querySelector('.stats');
  if (statsGrid && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          counters.forEach(animateCount);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    cio.observe(statsGrid);
  } else {
    counters.forEach(animateCount);
  }
}

function fmtNum(n) {
  if (n >= 100) return Math.round(n).toString();
  if (n % 1 !== 0) return (Math.round(n * 10) / 10).toString();
  return Math.round(n).toString();
}

function animateCount(el) {
  const target = parseFloat(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const b = el.querySelector('b');
  if (!b) return;
  if (prefersReducedMotion()) {
    b.textContent = fmtNum(target) + suffix;
    return;
  }
  const dur = 900;
  let start = null;
  function step(ts) {
    if (start === null) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const e2 = 1 - Math.pow(1 - p, 3);
    b.textContent = fmtNum(target * e2) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else b.textContent = fmtNum(target) + suffix;
  }
  requestAnimationFrame(step);
}

function initTypewriter() {
  const nameEl = document.getElementById('typeName');
  if (!nameEl || prefersReducedMotion()) return;
  const full = nameEl.textContent.trim();
  nameEl.textContent = '';
  const caret = document.createElement('span');
  caret.className = 'caret';
  nameEl.parentNode.insertBefore(caret, nameEl.nextSibling);
  let i = 0;
  function tick() {
    if (i <= full.length) {
      nameEl.textContent = full.slice(0, i);
      i++;
      setTimeout(tick, 70);
    }
  }
  setTimeout(tick, 380);
}

function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg || prefersReducedMotion()) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      if (y < window.innerHeight) {
        heroBg.style.transform = 'translate3d(0,' + (y * 0.22) + 'px,0) scale(1.05)';
      }
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

function initVelocitySkew() {
  if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;
  let lastY = 0;
  let targetSkew = 0;
  let currentSkew = 0;
  let raf = null;

  function loop() {
    currentSkew += (targetSkew - currentSkew) * 0.08;
    const skewValue = Math.abs(currentSkew) > 0.02 ? currentSkew : 0;
    document.querySelectorAll('.skew-layer').forEach(el => {
      el.style.transform = skewValue ? `skewY(${skewValue}deg)` : '';
    });
    if (Math.abs(targetSkew - currentSkew) > 0.001) raf = requestAnimationFrame(loop);
    else raf = null;
  }

  window.addEventListener('scroll', () => {
    const y = window.scrollY || 0;
    const v = y - lastY;
    lastY = y;
    targetSkew = Math.max(-0.6, Math.min(0.6, v * 0.02));
    if (!raf) raf = requestAnimationFrame(loop);
    setTimeout(() => { targetSkew = 0; if (!raf) raf = requestAnimationFrame(loop); }, 120);
  }, { passive: true });
}
