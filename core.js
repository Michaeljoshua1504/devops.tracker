// ── GLOBAL CONFIG ──       
const SUPABASE_URL = 'https://btzyjrscjmxrcyllzwic.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HgG7jZWwCaliP50xjQyY5w_xLLl2D4o';

// ── GLOBAL STATE ──       
let sb = null;       
let isAdmin = false;
let allMindset = [];      
let allProjects = [];
let allSessions = [];
let allNotes = [];
let nextTopicGlobal = null;  

// ── UTILITIES ──  
function escapeHTML(str) {  
  if (!str) return '';  
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");  
}

function toast(msg, type='success') {       
  const el = document.getElementById('toast');       
  if(!el) return;
  el.textContent = msg;       
  el.className = 'show ' + type;       
  setTimeout(() => el.className = '', 3000);       
}

// ── INIT ──       
window.addEventListener('DOMContentLoaded', () => {       
  initTheme();      
  initSupabase(SUPABASE_URL, SUPABASE_KEY);      
  setTimeout(checkAdminStatus, 500);
});

// ── THEME ENGINE ──      
function initTheme() {      
  const savedTheme = localStorage.getItem('theme') || 'dark';      
  document.documentElement.setAttribute('data-theme', savedTheme);      
  updateThemeToggleIcon(savedTheme);      
}

function toggleTheme() {      
  const currentTheme = document.documentElement.getAttribute('data-theme');      
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';      
  document.documentElement.setAttribute('data-theme', nextTheme);      
  localStorage.setItem('theme', nextTheme);      
  updateThemeToggleIcon(nextTheme);      
}

function updateThemeToggleIcon(theme) {      
  const btn = document.getElementById('themeToggleBtn');      
  if(btn) btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';      
}

// ── SUPABASE CONNECTION ──             
function initSupabase(url, key) {       
  try {       
    sb = window.supabase.createClient(url, key);       
    testConnection();       
  } catch(e) {       
    setStatus(false,'init error');       
  }       
}

async function testConnection() {       
  try {       
    const { data, error } = await sb.from('topic_status').select('id').limit(1);       
    if(error) throw error;       
    setStatus(true,'Connected to Supabase');       
    syncUI();      
  } catch(e) {       
    setStatus(false,'connection failed');
    const statusEl = document.getElementById('statusText');
    if(statusEl) statusEl.innerHTML = 'connection failed &nbsp;<span onclick="retryConnection()" style="cursor:pointer;color:var(--accent-blue);text-decoration:underline;font-size:0.75rem">retry</span>';
  }       
}

function retryConnection() {
  document.getElementById('statusText').textContent = 'retrying…';
  document.getElementById('statusDot').className = 'dot';
  initSupabase(SUPABASE_URL, SUPABASE_KEY);
}

function setStatus(ok, msg) {       
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusText');
  if(dot) dot.className = 'dot' + (ok?' connected':'');       
  if(txt) txt.textContent = msg;       
}

// ── MASTER STATE MANAGER (BULLETPROOF VERSION) ──    
async function syncUI() {    
  // 1. Fetch data safely
  try { if (typeof loadDashboard === 'function') await loadDashboard(); } catch(e) { console.error('Dashboard Error:', e); }
  try { if (typeof loadTopics === 'function') await loadTopics(); } catch(e) { console.error('Topics Error:', e); }
  try { if (typeof loadSessions === 'function') await loadSessions(); } catch(e) { console.error('Sessions Error:', e); }
  try { if (typeof loadProjects === 'function') await loadProjects(); } catch(e) { console.error('Projects Error:', e); }
  try { if (typeof loadMindset === 'function') await loadMindset(); } catch(e) { console.error('Mindset Error:', e); }
  try { if (typeof loadNotes === 'function') await loadNotes(); } catch(e) { console.error('Notes Error:', e); }
  
  // Un-extracted modules
  try { if (typeof loadCommands === 'function') await loadCommands(); } catch(e) { console.error('Commands Error:', e); }
  try { if (typeof loadWarRoom === 'function') await loadWarRoom(); } catch(e) { console.error('War Room Error:', e); }
  try { if (typeof loadActivityLog === 'function') await loadActivityLog(); } catch(e) { console.error('Activity Log Error:', e); }

  // 2. Force dynamic lists to redraw — always use sortState so saved sort is respected
  if (typeof renderMindset === 'function' && allMindset.length)
    renderMindset(applySortToData(allMindset, sortState.mindset.field, sortState.mindset.dir));
  if (typeof renderNotes === 'function' && allNotes.length)
    renderNotes(applySortToData(allNotes, sortState.notes.field, sortState.notes.dir));
  if (typeof renderSessions === 'function' && allSessions.length)
    renderSessions(applySortToData(allSessions, sortState.log.field, sortState.log.dir));
  if (typeof renderProjects === 'function' && allProjects.length)
    renderProjects(applySortToData(allProjects, sortState.projects.field, sortState.projects.dir));
  if (typeof renderCommands === 'function') renderCommands();
  // Also sync all sort button highlights after redraw
  ['log','projects','mindset','notes','cmds','warroom'].forEach(tab => {
    if (typeof updateSortButtons === 'function' && sortState[tab]) {
      updateSortButtons(tab, sortState[tab].field, sortState[tab].dir);
    }
  });
}

// ── TABS ROUTING ──       
function showTab(name, btn) {       
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));       
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));       
  document.getElementById('tab-' + name).classList.add('active');       
  if(btn) btn.classList.add('active');       
}

// ── AUTHENTICATION ──
function handleLogoClick() {
    if (isAdmin) document.getElementById('logout-modal').classList.add('open');
    else document.getElementById('login-modal').classList.add('open');
}

async function adminLogin() {
    const emailInput = document.getElementById('login-email');
    const pwdInput = document.getElementById('login-pwd');
    const errDiv = document.getElementById('login-error');
    errDiv.textContent = 'Logging in...';

    try {
        const { data, error } = await sb.auth.signInWithPassword({
            email: emailInput.value,
            password: pwdInput.value
        });

        if (error) {
            errDiv.textContent = error.message || 'Login failed.';
        } else {
            isAdmin = true;
            document.getElementById('login-modal').classList.remove('open');
            applyAdminUI();
            toast('Admin mode enabled! 🔓', 'success');
            
            // 👇 THE FIX: Erase the credentials from the DOM so Chrome forgets them!
            emailInput.value = '';
            pwdInput.value = '';
        }
    } catch (e) { 
        errDiv.textContent = 'Network error.'; 
    }
}

async function adminLogout() {
    // 👇 Tell the SDK to destroy the secure token
    await sb.auth.signOut(); 
    
    isAdmin = false;
    applyVisitorUI();
    document.getElementById('logout-modal').classList.remove('open');
    toast('Logged out. 🔒', 'success');
}

async function checkAdminStatus() {
    // 👇 Ask the SDK if a valid, unexpired token actually exists in the browser
    const { data: { session } } = await sb.auth.getSession();
    
    if (session) { 
        isAdmin = true; 
        applyAdminUI(); 
    } else { 
        isAdmin = false; 
        applyVisitorUI(); 
    }
}

function applyVisitorUI() {
    document.body.classList.remove('admin-mode');
    
    const saveBtn = document.getElementById('save-session-btn');
    if (saveBtn) saveBtn.style.display = 'none';
    
    syncUI();
}

function applyAdminUI() {
    document.body.classList.add('admin-mode');
    
    // Explicitly show the Save Session button on the Dashboard
    const saveBtn = document.getElementById('save-session-btn');
    if (saveBtn) saveBtn.style.display = 'block'; 
    
    syncUI(); 
}

// =========================================================================
// QUARANTINED UN-EXTRACTED LOGIC
// =========================================================================

// ── JARVIS ──
const jHistory = [];
async function jSend() {
    const input = document.getElementById('j-input');
    const text = input.value.trim();
    if (!text) return;
    const msgs = document.getElementById('j-msgs');
    msgs.innerHTML += `<div class="j-msg j-user"><div class="j-bubble">${escapeHTML(text)}</div></div>`;
    input.value = '';
}

// ── UNIVERSAL UNDO ENGINE (PRO UPGRADE) ──
let undoPending = null; 
let undoInterval = null;

function triggerUniversalDelete(table, id, itemName, restoreCallback, commitCallback = null) {
    if (undoPending) forceCommitDelete();

    let secondsLeft = 60; 
    undoPending = { table, id, restoreCallback, commitCallback };

    const toast = document.getElementById('undo-toast');
    const textEl = document.getElementById('undo-text');
    const timerEl = document.getElementById('undo-timer');
    
    textEl.innerText = `${itemName} deleted.`;
    timerEl.innerText = `${secondsLeft}s`;
    toast.classList.add('show');

    undoInterval = setInterval(() => {
        secondsLeft--;
        timerEl.innerText = `${secondsLeft}s`;
        if (secondsLeft <= 0) forceCommitDelete(); 
    }, 1000);
}

async function forceCommitDelete() {
    if (!undoPending) return;
    
    clearInterval(undoInterval);
    const { table, id, commitCallback } = undoPending;
    undoPending = null; 
    
    document.getElementById('undo-toast').classList.remove('show');
    
    if (commitCallback) {
        await commitCallback();
    } else {
        await sb.from(table).delete().eq('id', id);
    }
}

function executeUndo() {
    if (!undoPending) return;
    clearInterval(undoInterval);
    const { restoreCallback } = undoPending;
    undoPending = null;
    document.getElementById('undo-toast').classList.remove('show');
    if (restoreCallback) restoreCallback();
    toast('Action undone!', 'success');
}
// =========================================================================
// GLOBAL SORT ENGINE
// =========================================================================
// One utility used by all tabs. Each tab stores its own sort state.
// Handles: date strings (YYYY-MM-DD), ISO timestamps, topic IDs (1.1, 1.10),
//          and plain alphabetical text.

const sortState = (() => {
  // Defaults — used on first visit or if localStorage has no saved sort
  const defaults = {
    log:      { field: 'date',         dir: 'desc' },
    projects: { field: 'created_at',   dir: 'desc' },
    mindset:  { field: 'created_at',   dir: 'desc' },
    notes:    { field: 'date',         dir: 'desc' },
    cmds:     { field: 'command_text', dir: 'asc'  },
    warroom:  { field: 'date',         dir: 'desc' }
  };

  // Try to load any previously saved sort preferences from localStorage
  try {
    const raw = localStorage.getItem('tracker_sort_state');
    console.log('[Sort] localStorage raw:', raw);
    const saved = JSON.parse(raw || '{}');
    // Merge saved prefs over defaults — only valid tabs, only valid keys
    Object.keys(defaults).forEach(tab => {
      if (saved[tab] && saved[tab].field && saved[tab].dir) {
        defaults[tab] = { field: saved[tab].field, dir: saved[tab].dir };
        console.log('[Sort] Restored', tab, '→', saved[tab].field, saved[tab].dir);
      }
    });
  } catch(e) {
    console.warn('[Sort] Could not restore sort preferences:', e);
  }

  console.log('[Sort] Final sortState:', JSON.stringify(defaults));
  return defaults;
})();

/**
 * Sort an array of objects by a field + direction.
 * Handles dates, timestamps, topic IDs (numeric semver), and strings.
 */
function applySortToData(data, field, dir) {
  if (!data || !data.length) return data;
  const asc = dir === 'asc';

  return [...data].sort((a, b) => {
    let valA = a[field] ?? '';
    let valB = b[field] ?? '';

    // Topic ID: numeric semver sort (1.9 before 1.10)
    if (field === 'topic_id') {
      return (asc ? 1 : -1) *
        String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: 'base' });
    }

    // Date or timestamp: parse to ms
    const msA = valA ? Date.parse(valA) : 0;
    const msB = valB ? Date.parse(valB) : 0;
    if (!isNaN(msA) && !isNaN(msB) && (msA || msB)) {
      return asc ? msA - msB : msB - msA;
    }

    // Plain string / alphabetical
    return (asc ? 1 : -1) *
      String(valA).toLowerCase().localeCompare(String(valB).toLowerCase());
  });
}

/**
 * Called by sort buttons in each tab.
 * tab   — key in sortState (e.g. 'log')
 * field — the data field to sort by
 * renderFn — the tab's render function, e.g. renderSessions
 * dataArr  — the full unsearched data array for that tab (e.g. allSessions)
 */
function applySort(tab, field, renderFn, dataArr) {
  const state = sortState[tab];

  // Toggle direction if same field clicked again
  if (state.field === field) {
    state.dir = state.dir === 'asc' ? 'desc' : 'asc';
  } else {
    state.field = field;
    state.dir   = 'desc'; // default new field to newest-first
  }

  // Persist the updated sort preference to localStorage
  try {
    const toSave = JSON.stringify(sortState);
    localStorage.setItem('tracker_sort_state', toSave);
    console.log('[Sort] Saved', tab, field, '→', JSON.parse(toSave)[tab]);
  } catch(e) {
    console.warn('[Sort] Could not save sort preference:', e);
  }

  updateSortButtons(tab, state.field, state.dir);
  renderFn(applySortToData(dataArr, state.field, state.dir));
}

/**
 * Highlight the active sort button and update its arrow.
 */
function updateSortButtons(tab, activeField, dir) {
  const arrow = dir === 'asc' ? ' ↑' : ' ↓';
  document.querySelectorAll(`[data-sort-tab="${tab}"]`).forEach(btn => {
    const isActive = btn.getAttribute('data-sort-field') === activeField;
    btn.style.background = isActive ? 'var(--accent-blue)' : '';
    btn.style.color      = isActive ? '#fff' : '';
    // Update label: strip old arrow, add new one if active
    btn.textContent = btn.getAttribute('data-sort-label') + (isActive ? arrow : '');
  });
}

/**
 * Call this after data loads to apply the saved sort state immediately.
 * Prevents the list from appearing unsorted on first load.
 */
function initialSort(tab, dataArr) {
  const { field, dir } = sortState[tab];
  return applySortToData(dataArr, field, dir);
}
