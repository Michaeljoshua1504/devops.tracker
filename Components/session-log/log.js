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

  // Apply the user's current sort preference (or default: date desc)
  const sorted = (typeof initialSort === 'function')
    ? initialSort('log', allSessions)
    : allSessions;

  // Sync sort button highlight on load
  if (typeof updateSortButtons === 'function') {
    const { field, dir } = (typeof sortState !== 'undefined') ? sortState['log'] : { field: 'date', dir: 'desc' };
    updateSortButtons('log', field, dir);
  }

  renderSessions(sorted);
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
        <div class="session-body" id="${sid}" style="display: none;">      
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
  const base = term
    ? allSessions.filter(s =>
        (s.topic_id || '').toLowerCase().includes(term) ||
        (s.topic_name || '').toLowerCase().includes(term) ||
        (s.date || '').toLowerCase().includes(term) ||
        (s.summary || '').toLowerCase().includes(term) ||
        (s.concepts || '').toLowerCase().includes(term) ||
        (s.full_notes || '').toLowerCase().includes(term))
    : allSessions;

  const { field, dir } = (typeof sortState !== 'undefined') ? sortState['log'] : { field: 'date', dir: 'desc' };
  renderSessions((typeof applySortToData === 'function') ? applySortToData(base, field, dir) : base);
}

// 🛡️ UPDATED: Now uses Supabase directly to advance the roadmap!
async function saveSession() {
  if(!sb) return;

  const payload = {
    date: getSafeVal('session-date'),
    time: getSafeVal('session-time'),
    topic_id: getSafeVal('session-topic-id').trim(),
    topic_name: getSafeVal('session-topic-name').trim(),
    full_notes: getSafeVal('session-notes').trim(),
    summary: getSafeVal('session-summary').trim(),
    concepts: getSafeVal('session-concepts').trim()
  };

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

  // --- NEW: ADVANCE THE ROADMAP (DB DRIVEN) ---
  try {
    // 1. Mark current topic as 'done'
    await sb.from('topic_status')
      .update({ status: 'done' })
      .eq('topic_id', payload.topic_id);

    // 2. Fetch all topics from DB and sort them logically (e.g., 1.9 before 1.10)
    const { data: allTopics } = await sb.from('topic_status').select('topic_id');
    
    if (allTopics && allTopics.length > 0) {
      const sortedIds = allTopics.map(t => t.topic_id).sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
      });

      // Find where we currently are in the database list
      const currentIndex = sortedIds.indexOf(payload.topic_id);
      
      // If there's a next topic in the database, mark it as 'next'
      if (currentIndex !== -1 && currentIndex + 1 < sortedIds.length) {
        const nextTopicId = sortedIds[currentIndex + 1];
        await sb.from('topic_status')
          .update({ status: 'next' })
          .eq('topic_id', nextTopicId);
      }
    }
  } catch (err) {
    console.error("Error advancing roadmap:", err);
  }
  // --------------------------------

  // --- HIDE THE BOX ---
  if (typeof closeSessionModal === "function") {
    closeSessionModal(); 
  } else {
    const modalBox = document.getElementById('sessionModal');
    if (modalBox) {
        modalBox.classList.remove('open');
    }
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
      if (typeof loadTopics === 'function') await loadTopics(); 
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
                  
                  // Revert the deleted topic back to 'next'
                  await sb.from('topic_status').update({     
                    status: 'next', session_note: null, full_notes: null     
                  }).eq('topic_id', topicId);
            
                  // --- NEW: REVERT ROADMAP (DB DRIVEN) ---
                  const { data: allTopics } = await sb.from('topic_status').select('topic_id');
                  if (allTopics && allTopics.length > 0) {
                    const sortedIds = allTopics.map(t => t.topic_id).sort((a, b) => {
                      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                    });
                    
                    const currentIndex = sortedIds.indexOf(topicId);
                    
                    if (currentIndex !== -1 && currentIndex + 1 < sortedIds.length) {
                      const nextTopicId = sortedIds[currentIndex + 1];
                      
                      const { data: nextTopicData } = await sb.from('topic_status')
                        .select('status')
                        .eq('topic_id', nextTopicId)
                        .single();
                        
                      if (nextTopicData && nextTopicData.status === 'next') {     
                        await sb.from('topic_status')
                          .update({ status: 'todo' })
                          .eq('topic_id', nextTopicId);     
                      }     
                    }
                  }
                  // --------------------------------------------------------
                }     
            }

            if (typeof syncUI === 'function') {
                await syncUI(); 
            } else if (typeof loadTopics === 'function') {
                await loadTopics(); // Auto-refresh topics on delete
            }
        }
    );
}

// ── UI INTERACTION ENGINE ──
window.toggleSession = function(element, sid) {
    const body = document.getElementById(sid);
    const arrow = document.getElementById('arrow-' + sid);

    if (!body) {
        console.error("🚨 Dev Error: Could not find the session body with ID:", sid);
        return;
    }

    if (body.style.display === 'none') {
        body.style.display = 'block';
        if (arrow) arrow.textContent = '▲';
    } else {
        body.style.display = 'none';
        if (arrow) arrow.textContent = '▼';
    }
};