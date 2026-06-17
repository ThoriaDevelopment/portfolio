import { copyToClipboard } from './utils.js';

const RESUME_PATH = 'Assets/Thoria/Resume.pdf';
const BOOKING_URL = ''; // TODO: add Calendly / Google Calendar link

export function initHireBar() {
  const bar = document.createElement('div');
  bar.className = 'hire-bar';
  bar.innerHTML = `
    <div class="hire-dock" id="hireDock">
      <button class="hire-btn" aria-label="Contact" title="Contact" data-action="contact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg></button>
      <button class="hire-btn" aria-label="Copy Discord" title="Discord" data-action="discord"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.25.5a18 18 0 0 1 4.3 1.4 16.5 16.5 0 0 0-15 0A18 18 0 0 1 8.85 3.5L8.6 3a19.8 19.8 0 0 0-4.9 1.4C.6 9 .1 13.5.1 18a19.8 19.8 0 0 0 6 3l.5-.7a13 13 0 0 1-2-1l.5-.36A14.2 14.2 0 0 0 12 20.4a14.2 14.2 0 0 0 6.4-1.46l.5.36a13 13 0 0 1-2 1l.5.7a19.8 19.8 0 0 0 6-3c0-4.5-.5-9-3.6-13.6zM8.3 15.3c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2zm7.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2z"/></svg></button>
      <button class="hire-btn" aria-label="Download resume" title="Resume" data-action="resume"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/></svg></button>
      <button class="hire-btn" aria-label="Schedule a call" title="Schedule" data-action="schedule"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></button>
      <button class="hire-btn" aria-label="Toggle sound" title="Sound" data-action="sound"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg></button>
    </div>
    <button class="hire-toggle" id="hireToggle" aria-pressed="false" aria-label="Open hire menu">
      <span>Hire Me</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex:none"><path d="m18 15-6-6-6 6"/></svg>
    </button>
  `;
  document.body.appendChild(bar);

  const dock = bar.querySelector('#hireDock');
  const toggle = bar.querySelector('#hireToggle');
  let open = false;

  function setOpen(v) {
    open = v;
    toggle.setAttribute('aria-pressed', open ? 'true' : 'false');
    if (open) dock.classList.add('visible');
    else dock.classList.remove('visible');
  }

  toggle.addEventListener('click', () => setOpen(!open));

  bar.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      handleAction(action);
      setOpen(false);
    });
  });

  // auto-show after scrolling a bit (desktop only)
  let shown = false;
  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  window.addEventListener('scroll', () => {
    if (shown || isMobile) return;
    if ((window.scrollY || 0) > window.innerHeight * 0.5) {
      shown = true;
      setTimeout(() => setOpen(true), 400);
    }
  }, { passive: true });

  function handleAction(action) {
    if (action === 'contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'discord') {
      copyToClipboard('@inrising');
    } else if (action === 'resume') {
      if (RESUME_PATH) {
        const a = document.createElement('a');
        a.href = RESUME_PATH;
        a.download = 'Thoria-Resume.pdf';
        a.click();
      } else {
        alert('Resume not uploaded yet.');
      }
    } else if (action === 'schedule') {
      if (BOOKING_URL) window.open(BOOKING_URL, '_blank', 'noopener');
      else alert('Booking link not configured yet.');
    } else if (action === 'sound') {
      document.getElementById('soundToggle')?.click();
    }
  }
}
