const SERVERS = [
  { name: 'ArchMC', host: 'arch.mc', ip: 'arch.mc' },
  { name: 'VoidSentMC', host: 'play.voidsent.net', ip: 'play.voidsent.net' }
];
const API_BASE = 'https://api.mcstatus.io/v2/status/java/';

export function initServerStatus() {
  const container = document.getElementById('serverStatus');
  if (!container) return;

  container.innerHTML = '';
  SERVERS.forEach(s => {
    const pill = document.createElement('button');
    pill.className = 'status-pill chip-static';
    pill.type = 'button';
    pill.setAttribute('data-ip', s.ip);
    pill.innerHTML = `
      <span class="status-dot unknown" aria-hidden="true"></span>
      <span>${s.name} · ${s.ip}</span>
    `;
    pill.addEventListener('click', () => {
      const ip = pill.getAttribute('data-ip');
      navigator.clipboard.writeText(ip).catch(() => {});
      pill.classList.add('copied');
      const span = pill.querySelector('span:last-child');
      const original = span.textContent;
      span.textContent = 'Copied ' + ip;
      setTimeout(() => { span.textContent = original; pill.classList.remove('copied'); }, 1400);
    });
    container.appendChild(pill);
    checkStatus(s.host, pill);
  });
}

async function checkStatus(host, pill) {
  try {
    const res = await fetch(API_BASE + encodeURIComponent(host), { cache: 'no-store' });
    if (!res.ok) throw new Error('status ' + res.status);
    const data = await res.json();
    updatePill(pill, data.online ? 'online' : 'offline', data);
  } catch (e) {
    // Fallback to simulated online pulse if API fails
    updatePill(pill, 'online', null, true);
  }
}

function updatePill(pill, status, data, simulated = false) {
  const dot = pill.querySelector('.status-dot');
  dot.classList.remove('unknown', 'online', 'offline');
  dot.classList.add(status);
  const text = pill.querySelector('span:last-child');
  const ip = pill.getAttribute('data-ip');
  let extra = '';
  if (data && data.players) extra = ` · ${data.players.online}/${data.players.max}`;
  if (simulated) extra = ' · live status unavailable';
  text.textContent = `${ip}${extra}`;
}
