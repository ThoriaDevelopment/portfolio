const FORM_ENDPOINT = 'https://formspree.io/f/mrevvjnw';

export function initContactTicket() {
  const form = document.getElementById('ticketForm');
  if (!form) return;
  const status = form.querySelector('.ticket-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const email = data.get('email')?.toString().trim();
    const subject = data.get('subject')?.toString();
    const message = data.get('message')?.toString().trim();

    let ok = true;
    form.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('error'));

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.querySelector('[name="email"]').classList.add('error');
      ok = false;
    }
    if (!subject) {
      form.querySelector('[name="subject"]').classList.add('error');
      ok = false;
    }
    if (!message || message.length < 10) {
      form.querySelector('[name="message"]').classList.add('error');
      ok = false;
    }
    if (!ok) {
      showStatus('Please fill all fields correctly.', true);
      return;
    }

    if (!FORM_ENDPOINT) {
      showStatus('Ticket form endpoint not configured yet. Email officialthoria@gmail.com directly.', true);
      return;
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        showStatus('✓ Ticket submitted. Thoria will respond soon.');
        form.reset();
      } else {
        showStatus('Something went wrong. Please email directly.', true);
      }
    } catch (e) {
      showStatus('Network error. Please email directly.', true);
    }
  });

  function showStatus(msg, isError = false) {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle('show', true);
    status.style.borderColor = isError ? '#ef4444' : 'var(--accent)';
    status.style.background = isError ? 'rgba(239,68,68,.10)' : 'rgba(16,185,129,.10)';
    setTimeout(() => status.classList.remove('show'), 5000);
  }
}
