import { copyToClipboard } from './utils.js';

export function initReferences() {
  document.querySelectorAll('.reference-card').forEach(card => {
    const btn = card.querySelector('.ref-discord');
    const label = card.querySelector('.ref-username');
    if (!btn || !label) return;

    const realName = card.dataset.discord;
    const prankName = card.dataset.prank;
    const realText = '@' + realName;
    const prankText = '@' + prankName;
    let clicks = 0;
    let finished = false;
    let copiedTimer = null;

    btn.addEventListener('click', async (e) => {
      e.stopPropagation();

      // Always copy the real username, even when the label shows the prank.
      const ok = await copyToClipboard(realName);
      if (ok) {
        btn.classList.add('copied');
        const original = label.textContent;
        label.textContent = 'Copied!';
        clearTimeout(copiedTimer);
        copiedTimer = setTimeout(() => {
          btn.classList.remove('copied');
          label.textContent = original;
        }, 1200);
      }

      if (finished) return;
      clicks++;

      if (clicks === 3) {
        label.textContent = prankText;
        btn.setAttribute('aria-label', `Copy Discord username ${prankName}`);
        btn.classList.add('ref-pranked');
      } else if (clicks === 4) {
        label.textContent = realText;
        btn.setAttribute('aria-label', `Copy Discord username ${realName}`);
        btn.classList.remove('ref-pranked');
        finished = true;
      }
    });
  });
}
