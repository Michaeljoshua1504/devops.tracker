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
  try { await loadCommands(); } catch(e) { console.error('Commands Error:', e); }
  try { await loadWarRoom(); } catch(e) { console.error('War Room Error:', e); }

  // 2. Force dynamic lists to redraw
  if (typeof renderMindset === 'function' && allMindset.length) renderMindset(allMindset);
  if (typeof renderNotes === 'function' && allNotes.length) renderNotes(allNotes);
  if (typeof renderSessions === 'function' && allSessions.length) renderSessions(allSessions);
  if (typeof renderProjects === 'function' && allProjects.length) renderProjects(allProjects);
  if (typeof renderCommands === 'function') renderCommands();
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
    const email = document.getElementById('login-email').value;
    const pwd = document.getElementById('login-pwd').value;
    const errDiv = document.getElementById('login-error');
    errDiv.textContent = 'Logging in...';

    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pwd })
        });
        const data = await response.json();

        if (response.ok && data.access_token) {
            localStorage.setItem('sb_access_token', data.access_token);
            isAdmin = true;
            document.getElementById('login-modal').classList.remove('open');
            applyAdminUI();
            toast('Admin mode enabled! 🔓', 'success');
        } else {
            errDiv.textContent = data.error_description || 'Login failed.';
        }
    } catch (e) { errDiv.textContent = 'Network error.'; }
}

function adminLogout() {
    localStorage.removeItem('sb_access_token');
    isAdmin = false;
    applyVisitorUI();
    document.getElementById('logout-modal').classList.remove('open');
    toast('Logged out. 🔒', 'success');
}

function checkAdminStatus() {
    if (localStorage.getItem('sb_access_token')) { isAdmin = true; applyAdminUI(); } 
    else { isAdmin = false; applyVisitorUI(); }
}

function applyVisitorUI() {
    document.body.classList.remove('admin-mode');
    syncUI();
}

function applyAdminUI() {
    document.body.classList.add('admin-mode');
    syncUI(); 
}

// =========================================================================
// QUARANTINED UN-EXTRACTED LOGIC (Will be moved to separate folders soon)
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

// Added an optional 5th parameter: commitCallback
function triggerUniversalDelete(table, id, itemName, restoreCallback, commitCallback = null) {
    if (undoPending) forceCommitDelete();

    let secondsLeft = 60; 
    
    // Store the advanced callback
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
    
    // IF a complex function was provided (like your roadmap revert), run THAT.
    // OTHERWISE, just do a standard database row deletion.
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

// ── HELPER UTILITY: ESCAPE HTML TO PREVENT CRASHES ──
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}