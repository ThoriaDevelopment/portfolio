import { initTheme } from './theme.js';
import { initSound } from './sound.js';
import { initScrollEffects } from './scrollEffects.js';
import { initBlocks } from './blocks.js';
import { initCursor, initCopyChips } from './cursor.js';
import { initTilt } from './tilt.js';
import { initGallery } from './gallery.js';
import { initAchievements } from './achievements.js';
import { initTerminal } from './terminal.js';
import { initHireBar } from './hireBar.js';
import { initServerStatus } from './serverStatus.js';
import { initContactTicket } from './contactTicket.js';
import { initKleosDemo } from './kleosDemo.js';
import { initGuideModal } from './guideModal.js';
import { initMiniGameTriggers } from './minigames.js';
import { initTechnobladeSwap } from './technoblade.js';

function initNav() {
  const nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', (window.scrollY || 0) > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear().toString();
}

(function boot() {
  document.documentElement.classList.add('js');
  initYear();
  initTheme();
  initNav();
  initSound();
  initScrollEffects();
  initBlocks();
  initCursor();
  initCopyChips();
  initTilt();
  initGallery();
  initAchievements();
  initTerminal();
  initHireBar();
  initServerStatus();
  initContactTicket();
  initKleosDemo();
  initGuideModal();
  initMiniGameTriggers();
  initTechnobladeSwap();
})();
