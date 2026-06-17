// ── SESSIONS ENGINE ──       
let editingSessionId = null;

// 🛡️ DEFENSIVE HELPERS: Prevents "null" crashes forever!
function getSafeVal(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`🚨 Dev Warning: Cannot find HTML element with id="${id}"`);
        return '';
    }
    return el.value;
}

function setSafeVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

async function loadSessions() {       
  if(!sb) return;       
  const { data, error } = await sb.from('sessions').select('*');       
  if(error) { 
    console.error('Sessions load error:', error.message || JSON.stringify(error)); 
    return; 
  }
  
  allSessions = data || [];
  
  // Sort sessions numerically by topic ID (e.g., 1.1, 1.2, 1.10)
  allSessions.sort((a, b) => {       
    const idA = a.topic_id || '';       
    const idB = b.topic_id || '';       
    return idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' });       
  });
  
  renderSessions(allSessions);
}

function renderSessions(data) {
  const list = document.getElementById('sessions-list');
  if(!list) return;
  
  if(!data || data.length === 0){       
    list.innerHTML='<div style="color:var(--muted);font-size:0.9rem">No sessions saved yet. Use the action button above to record your first entry.</div>';       
    return;       
  }
  
  list.innerHTML = data.map((s, i) => {       
    const concepts = s.concepts ? s.concepts.split(',').map(c=>`<span class="concept-chip">${escapeHTML(c.trim())}</span>`).join('') : '';       
    const sid = 'sess-' + i;
    const editedAt = s.extra_data && s.extra_data.edited_at ? `<span style="font-size:0.75rem;color:var(--muted);margin-left:0.5rem">· edited ${new Date(s.extra_data.edited_at).toLocaleDateString()}</span>` : '';
    
    return `
      <div class="session-item" onclick="toggleSession(this, '${sid}')">       
        <div class="session-header">       
          <div class="session-topic">${s.topic_id ? escapeHTML(s.topic_id)+' — ' : ''}${escapeHTML(s.topic_name || 'Session')}${editedAt}</div>       
          <div style="display:flex;align-items:center;gap:0.75rem">       
            <div class="session-date">${escapeHTML(s.date || '')} ${escapeHTML(s.time || '')}</div>       
            <span id="arrow-${sid}" style="font-size:0.75rem;color:var(--muted)">▼</span>       
          </div>       
        </div>       
        <div class="session-summary">${escapeHTML(s.summary || '')}</div>       
        <div class="session-body" id="${sid}">       
          ${s.full_notes ? `<div style="font-size:0.9rem;color:var(--text);line-height:1.6;white-space:pre-wrap;margin-top:1rem;padding:1rem;background:var(--bg);border-radius:10px;border:1px solid var(--border)">${escapeHTML(s.full_notes)}</div>` : ''}       
          ${concepts ? `<div class="session-concepts">${concepts}</div>` : ''}       
          <div style="margin-top:1rem; display:flex; justify-content:flex-end; gap:0.5rem;">     
            ${isAdmin ? `<button class="btn btn-ghost" style="font-size:0.78rem; padding:0.35rem 0.75rem;" onclick="event.stopPropagation(); openEditSessionModal('${s.id}')">✏️ Edit</button>` : ''}
            ${isAdmin ? `<button class="btn btn-ghost" style="color:var(--red); border:1px solid rgba(255,69,58,0.2); font-size:0.78rem; padding:0.35rem 0.75rem;" onclick="event.stopPropagation(); deleteSession('${s.id || ''}', '${s.topic_id || ''}')">🗑️ Delete Entry</button>` : ''}
          </div>     
        </div>       
      </div>`;       
  }).join('');       
}

function searchSessions() {
  const term = document.getElementById('session-search').value.toLowerCase().trim();
  if (!term) { 
    renderSessions(allSessions); 
    return; 
  }
  
  const filtered = allSessions.filter(s => {
    return (s.topic_id || '').toLowerCase().includes(term) ||
           (s.topic_name || '').toLowerCase().includes(term) ||
           (s.date || '').toLowerCase().includes(term) ||
           (s.summary || '').toLowerCase().includes(term) ||
           (s.concepts || '').toLowerCase().includes(term) ||
           (s.full_notes || '').toLowerCase().includes(term);
  });
  
  renderSessions(filtered);
}

// 🛡️ UPDATED: No longer crashes looking for 'saveModal'
function openEditSessionModal(id) {
  const s = allSessions.find(x => String(x.id) === String(id));
  if (!s) return;
  
  editingSessionId = id; // Set global memory

  // Safely fill the form boxes 
  setSafeVal('m-date', s.date || '');
  setSafeVal('m-time', s.time || '');
  setSafeVal('m-topicid', s.topic_id || '');
  setSafeVal('m-topicname', s.topic_name || '');
  setSafeVal('m-fullnotes', s.full_notes || '');
  setSafeVal('m-summary', s.summary || '');
  setSafeVal('m-concepts', s.concepts || '');
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  toast('Editing Session: ' + (s.topic_id || ''), 'info');
}

function toggleSession(cardElement, sid) {       
  const body = document.getElementById(sid);       
  const arrow = document.getElementById('arrow-' + sid);       
  const isExpanding = !cardElement.classList.contains('expanded');

  cardElement.classList.toggle('expanded');       
  if(body) body.style.display = isExpanding ? 'block' : 'none';       
  if(arrow) arrow.textContent = isExpanding ? '▲' : '▼';       
}

// 🛡️ UPDATED: Bulletproof Save Function
async function saveSession() {
  if(!sb) return;

  // Uses safe helper to avoid "Cannot read properties of null"
 const payload = {
    date: getSafeVal('session-date'),
    time: getSafeVal('session-time'),
    topic_id: getSafeVal('session-topic-id').trim(),
    topic_name: getSafeVal('session-topic-name').trim(),
    full_notes: getSafeVal('session-notes').trim(),
    summary: getSafeVal('session-summary').trim(),
    concepts: getSafeVal('session-concepts').trim()
  };

  // If the IDs are wrong, payload.topic_id will be empty, and this will catch it!
  if(!payload.topic_id || !payload.summary) {
    toast('Missing Topic ID or Summary (Or your HTML IDs do not match the JS!)', 'error');
    return;
  }

  if(editingSessionId) {
    const { error } = await sb.from('sessions').update(payload).eq('id', editingSessionId);
    if(error) { toast('Error: ' + error.message, 'error'); return; }
    toast('Session Updated! 💾', 'success');
  } else {
    const { error } = await sb.from('sessions').insert([payload]);
    if(error) { toast('Error: ' + error.message, 'error'); return; }
    toast('Session Saved! 🎉', 'success');
  }

  // Clear memory
  editingSessionId = null;
  
  // Clear the text boxes safely
  setSafeVal('m-topicid', '');
  setSafeVal('m-topicname', '');
  setSafeVal('m-fullnotes', '');
  setSafeVal('m-summary', '');
  setSafeVal('m-concepts', '');
  
  // Safe UI reload
  if (typeof syncUI === 'function') {
      await syncUI();
  } else {
      await loadSessions();
  }
}

// ── DELETE SESSION (WITH 60s UNDO & ROADMAP REVERT) ──
function deleteSession(id, topicId) {     
    if(!sb) return;     

    const numericId = parseInt(id, 10);     
    if (isNaN(numericId)) {     
        toast('Error: Invalid Session ID tracking format.', 'error');     
        return;     
    }

    const sessionToRestore = allSessions.find(x => String(x.id) === String(id));
    if (!sessionToRestore) return;

    allSessions = allSessions.filter(x => String(x.id) !== String(id));
    if (typeof renderSessions === 'function') renderSessions(allSessions);

    triggerUniversalDelete('sessions', numericId, `Session "${sessionToRestore.topic_id || 'Entry'}"`,
        async () => {
            await loadSessions(); 
        },
        async () => {
            const { error: delErr } = await sb.from('sessions').delete().eq('id', numericId);
            if(delErr) {     
                toast('Delete failed: ' + delErr.message, 'error');     
                return;     
            }

            if(topicId) {     
                const { data: remainingLogs, error: countErr } = await sb.from('sessions').select('id').eq('topic_id', topicId);     
                if (!countErr && (!remainingLogs || remainingLogs.length === 0)) {     
                  
                  await sb.from('topic_status').update({     
                    status: 'next', session_note: null, full_notes: null     
                  }).eq('topic_id', topicId);
            
                  const parts = topicId.split('.');     
                  if(parts.length === 2) {     
                    const nextId = parts[0] + '.' + (parseInt(parts[1], 10) + 1);     
                    const { data: nextTopic } = await sb.from('topic_status').select('status').eq('topic_id', nextId).single();     
                    if(nextTopic && nextTopic.status === 'next') {     
                      await sb.from('topic_status').update({ status: 'todo' }).eq('topic_id', nextId);     
                    }     
                  }     
                }     
            }

            if (typeof syncUI === 'function') {
                await syncUI(); 
            }
        }
    );
}