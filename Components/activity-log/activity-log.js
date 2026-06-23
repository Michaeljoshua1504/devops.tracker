// ── ACTIVITY LOG ENGINE ──
// Reads the immutable audit trail written by Postgres triggers
// (see activity_log_setup.sql). Every create/update/delete on
// sessions, topic_status, mindset_moments, notes, commands, and
// mini_projects lands here automatically — no matter what wrote it.

let allActivityLog = [];
let activityLogFilter = 'all';

const TAB_LABELS = {
  log: 'Session Log',
  topics: 'Topics',
  mindset: 'Mindset',
  notes: 'Daily Log',
  cmds: 'Terminal Cmds',
  projects: 'Portfolio'
};

async function loadActivityLog() {
  if (!sb) return;

  const { data, error } = await sb
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(300);

  if (error) {
    console.error('Activity log load error:', error.message || JSON.stringify(error));
    const list = document.getElementById('activity-log-list');
    if (list) list.innerHTML = '<div style="color:var(--red);font-size:0.9rem">Error loading activity log</div>';
    return;
  }

  allActivityLog = data || [];
  renderActivityLog(activityLogFilter);
}

function filterActivityLog(tab) {
  activityLogFilter = tab;

  document.querySelectorAll('#activity-log-filters button').forEach(b => {
    const isActive = b.dataset.filter === tab;
    b.classList.toggle('btn-primary', isActive);
    b.classList.toggle('btn-ghost', !isActive);
  });

  renderActivityLog(tab);
}

function searchActivityLog() {
  renderActivityLog(activityLogFilter);
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function renderActivityLog(filterTab = 'all') {
  const list = document.getElementById('activity-log-list');
  if (!list) return;

  const term = (document.getElementById('activity-log-search')?.value || '').toLowerCase().trim();

  let rows = allActivityLog;
  if (filterTab !== 'all') rows = rows.filter(r => r.tab === filterTab);
  if (term) {
    rows = rows.filter(r =>
      (r.summary || '').toLowerCase().includes(term) ||
      (r.table_name || '').toLowerCase().includes(term) ||
      (r.action || '').toLowerCase().includes(term)
    );
  }

  if (!rows.length) {
    list.innerHTML = '<div style="color:var(--muted);font-size:0.9rem">No activity recorded yet — make a change anywhere in the app and it will show up here.</div>';
    return;
  }

  list.innerHTML = rows.map((r, i) => {
    const safeId = 'log_' + i;
    const badgeClass = r.action === 'create' ? 'badge-done' : r.action === 'update' ? 'badge-next' : 'badge-delete';
    const actionLabel = r.action === 'create' ? '➕ Created' : r.action === 'update' ? '✏️ Updated' : '🗑️ Deleted';
    const tabLabel = TAB_LABELS[r.tab] || r.tab;

    const diffJson = JSON.stringify(
      { before: r.old_data || null, after: r.new_data || null },
      null, 2
    );

    return `
      <div class="session-item" onclick="toggleLogEntry(this, '${safeId}')">
        <div class="session-header">
          <div class="session-topic">
            <span class="badge ${badgeClass}" style="margin-right:0.5rem">${actionLabel}</span>
            ${escapeHTML(r.summary || r.table_name)}
          </div>
          <div style="display:flex;align-items:center;gap:0.6rem">
            <span class="concept-chip">${escapeHTML(tabLabel)}</span>
            <div class="session-date">${timeAgo(r.created_at)}</div>
            <span class="arrow-indicator" style="font-size:0.75rem;color:var(--muted)">▼</span>
          </div>
        </div>
        <div class="topic-expand" id="expand-${safeId}" style="display:none">
          <pre style="font-size:0.78rem;color:var(--text);background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:0.85rem;margin-top:1rem;overflow-x:auto;white-space:pre-wrap">${escapeHTML(diffJson)}</pre>
        </div>
      </div>`;
  }).join('');
}

function toggleLogEntry(el, safeId) {
  const expand = document.getElementById('expand-' + safeId);
  const arrow = el.querySelector('.arrow-indicator');
  const isOpen = expand.style.display !== 'none';
  expand.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.textContent = isOpen ? '▼' : '▲';
}