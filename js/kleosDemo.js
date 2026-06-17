const MOCK_CREATORS = [
  { id: 1, nickname: 'AlicePlays', role: 'Streamer / Creator', roleColor: '#4A90D9', platform: 'YouTube', subs: '45.2K', views: 1250000, uploads: 12, verified: 8, sparkline: [2, 4, 1, 5, 3, 6, 4] },
  { id: 2, nickname: 'BobBuilds', role: 'Member', roleColor: '#6B7280', platform: 'YouTube', subs: '12.5K', views: 420000, uploads: 6, verified: 4, sparkline: [1, 2, 0, 3, 1, 2, 1] },
  { id: 3, nickname: 'CharlieClips', role: 'Shorts Creator', roleColor: '#F59E0B', platform: 'YouTube', subs: '8.1K', views: 310000, uploads: 22, verified: 18, sparkline: [5, 3, 7, 4, 6, 8, 5] },
  { id: 4, nickname: 'DanaStreams', role: 'Twitch Partner', roleColor: '#9146FF', platform: 'Twitch', subs: '6.4K', views: 180000, uploads: 9, verified: 7, sparkline: [2, 1, 3, 2, 4, 2, 3] },
  { id: 5, nickname: 'EvanEdits', role: 'Video Editor', roleColor: '#10B981', platform: 'YouTube', subs: '3.2K', views: 95000, uploads: 4, verified: 3, sparkline: [0, 1, 1, 0, 2, 1, 1] },
  { id: 6, nickname: 'FayeClips', role: 'Member', roleColor: '#6B7280', platform: 'Twitch', subs: '2.1K', views: 62000, uploads: 7, verified: 5, sparkline: [1, 1, 2, 1, 1, 3, 2] }
];

let chartLoaded = false;
let demoChart = null;
let barChart = null;

export function initKleosDemo() {
  const section = document.querySelector('#kleos .wrap');
  if (!section) return;

  // Insert demo toggle button after the tags in the kleos card
  const kleosCard = section.querySelector('.kleos');
  if (kleosCard) {
    const cta = kleosCard.querySelector('.btn-primary')?.parentNode;
    if (cta) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'btn btn-ghost kleos-demo-btn';
      toggleBtn.type = 'button';
      toggleBtn.innerHTML = 'Try the dashboard ↗';
      toggleBtn.addEventListener('click', () => toggleDemo());
      cta.insertBefore(toggleBtn, cta.querySelector('.btn-primary').nextSibling);
    }
  }

  // Build demo container
  const demo = document.createElement('div');
  demo.id = 'kleosDemo';
  demo.className = 'kleos-demo';
  demo.style.display = 'none';
  demo.innerHTML = buildDemoHTML();
  section.appendChild(demo);

  // Wire controls
  const search = demo.querySelector('.kd-search');
  const filters = demo.querySelectorAll('.kd-filter');
  const verifyBtn = demo.querySelector('.kd-verify-all');

  function render() {
    const term = search.value.toLowerCase();
    const role = demo.querySelector('.kd-filter[data-filter="role"]').value;
    const platform = demo.querySelector('.kd-filter[data-filter="platform"]').value;
    const filtered = MOCK_CREATORS.filter(c => {
      const matchTerm = c.nickname.toLowerCase().includes(term) || c.role.toLowerCase().includes(term);
      const matchRole = !role || c.role === role || (role === 'Member' && c.role === 'Member');
      const matchPlatform = !platform || c.platform === platform;
      return matchTerm && matchRole && matchPlatform;
    });
    renderCards(demo, filtered);
  }

  search.addEventListener('input', render);
  filters.forEach(f => f.addEventListener('change', render));
  verifyBtn.addEventListener('click', () => runVerifySimulation(demo));

  render();
}

function toggleDemo() {
  const demo = document.getElementById('kleosDemo');
  const open = demo.style.display !== 'none';
  if (open) {
    demo.style.display = 'none';
  } else {
    demo.style.display = 'block';
    loadCharts().then(() => renderCharts());
  }
}

function buildDemoHTML() {
  return `
    <div class="kd-header">
      <div class="kd-search-wrap">
        <input type="text" class="kd-search" placeholder="Search creators…" />
      </div>
      <div class="kd-filters">
        <select class="kd-filter chip-static" data-filter="role">
          <option value="">All Roles</option>
          <option>Streamer / Creator</option>
          <option>Member</option>
          <option>Shorts Creator</option>
          <option>Twitch Partner</option>
          <option>Video Editor</option>
        </select>
        <select class="kd-filter chip-static" data-filter="platform">
          <option value="">All Platforms</option>
          <option>YouTube</option>
          <option>Twitch</option>
        </select>
        <button class="kd-verify-all btn btn-ghost btn-sm" type="button">✓ Verify all</button>
      </div>
    </div>
    <div class="kd-grid"></div>
    <div class="kd-analytics">
      <div class="kd-chart-wrap">
        <h4>Upload Timeline</h4>
        <canvas id="kdTimeline"></canvas>
      </div>
      <div class="kd-chart-wrap">
        <h4>Leaderboard by Views</h4>
        <canvas id="kdLeaderboard"></canvas>
      </div>
    </div>
  `;
}

function renderCards(demo, list) {
  const grid = demo.querySelector('.kd-grid');
  grid.innerHTML = list.map(c => `
    <article class="kd-card" style="--role-color:${c.roleColor}">
      <div class="kd-stripe" style="background:${c.roleColor}"></div>
      <div class="kd-avatar">${c.nickname[0]}</div>
      <div class="kd-info">
        <div class="kd-name">${c.nickname}</div>
        <div class="kd-meta">${c.platform} · ${c.subs} subs · ${c.verified}/${c.uploads} verified</div>
        <div class="kd-sparkline">${c.sparkline.map(v => `<span style="height:${(v/8*100).toFixed(0)}%"></span>`).join('')}</div>
      </div>
      <div class="kd-views">${formatCompact(c.views)}</div>
    </article>
  `).join('');
}

function formatCompact(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

function runVerifySimulation(demo) {
  const btn = demo.querySelector('.kd-verify-all');
  const original = btn.textContent;
  let progress = 0;
  btn.disabled = true;
  btn.textContent = 'Verifying 0%';
  const int = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(int);
      btn.textContent = '✓ Verified 6 creators';
      btn.disabled = false;
      setTimeout(() => btn.textContent = original, 2000);
    } else {
      btn.textContent = `Verifying ${progress}%`;
    }
  }, 180);
}

function loadCharts() {
  if (chartLoaded || window.Chart) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js';
    s.onload = () => { chartLoaded = true; resolve(); };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function renderCharts() {
  if (!window.Chart) return;
  const ctx1 = document.getElementById('kdTimeline');
  const ctx2 = document.getElementById('kdLeaderboard');
  if (!ctx1 || !ctx2) return;

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = labels.map((_, i) => MOCK_CREATORS.reduce((s, c) => s + c.sparkline[i], 0));

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#10B981';

  if (demoChart) demoChart.destroy();
  demoChart = new Chart(ctx1, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Uploads',
        data,
        borderColor: accent,
        backgroundColor: accent + '33',
        fill: true,
        tension: 0.4,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' } }, x: { grid: { display: false } } }
    }
  });

  if (barChart) barChart.destroy();
  barChart = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: MOCK_CREATORS.map(c => c.nickname),
      datasets: [{
        label: 'Views',
        data: MOCK_CREATORS.map(c => c.views),
        backgroundColor: accent,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.05)' } }, x: { grid: { display: false } } }
    }
  });
}
