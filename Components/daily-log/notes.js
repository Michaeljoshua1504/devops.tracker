 // ── DAILY LOG ENGINE ──
// NOTE: editingNoteId is declared in index.html (core state).

let editingNoteId = null; // 👇 ADDED THIS!

async function loadNotes() {
  if (!sb) return;
  try {
    const { data, error } = await sb.from('notes').select('*');

    if (error) {
      console.error("Notes DB Error:", error);
      const container = document.getElementById('notes-list');
      if (container) container.innerHTML = `<div style="color:var(--red);font-size:0.9rem;">Error connecting: ${error.message}</div>`;
      return;
    }

    allNotes = data || [];
    document.getElementById('note-date').value = new Date().toISOString().split('T')[0];

    // Update tab header count
    const notesTitle = document.getElementById('notes-tab-title');
    if(notesTitle) notesTitle.textContent = `Daily Log (${allNotes.length})`;

    // Apply current sort preference (default: date desc)
    const sorted = (typeof initialSort === 'function')
      ? initialSort('notes', allNotes)
      : allNotes;
    if (typeof updateSortButtons === 'function') {
      const { field, dir } = (typeof sortState !== 'undefined') ? sortState['notes'] : { field: 'date', dir: 'desc' };
      updateSortButtons('notes', field, dir);
    }
    renderNotes(sorted);
  } catch (e) {
    console.error("Notes Crash Protected:", e);
  }
}

function searchNotes() {
  const term = document.getElementById('note-search').value.toLowerCase().trim();
  const base = term
    ? allNotes.filter(n =>
        (n.title || '').toLowerCase().includes(term) ||
        (n.note_text || n.entry || '').toLowerCase().includes(term) ||
        (n.date || '').toLowerCase().includes(term) ||
        (n.linked_topic || '').toLowerCase().includes(term))
    : allNotes;
  const { field, dir } = (typeof sortState !== 'undefined') ? sortState['notes'] : { field: 'date', dir: 'desc' };
  renderNotes((typeof applySortToData === 'function') ? applySortToData(base, field, dir) : base);
}

// ── RENDER NOTES LIST ──
function renderNotes(data) {
  const container = document.getElementById('notes-list');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<div style="color:var(--muted);font-size:0.9rem;">No journal entries yet.</div>';
    return;
  }

  container.innerHTML = data.map((n) => {
    // 🕵️ SUPER CATCH-ALL: Checks every possible column name in your database
    const contentVal = n.note_text || n.entry || n.content || n.body || n.text || n.description || '';
    
    const safeTitle = (n.title || 'Daily Log').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeText = contentVal.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeTopic = n.linked_topic ? n.linked_topic.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';

    // Beautiful badge for the linked topic
    const topicHtml = safeTopic ? `<div style="margin-top:0.4rem; font-size:0.8rem; color:var(--accent-blue);">🔗 ${safeTopic}</div>` : '';

    return `
    <div class="session-item" style="cursor:default; margin-bottom:1rem; padding:1.2rem;">
      <div class="session-header" style="display:flex; justify-content:space-between; align-items:center; width:100%">
        <div style="font-size:0.85rem; font-weight:600; color:var(--accent2); text-transform:uppercase;">👤 ${n.author || 'DevOps Log'}</div>
        <div class="session-date" style="font-size:0.85rem; color:var(--muted);">${n.date || (n.created_at ? n.created_at.split('T')[0] : '')}</div>
      </div>
      <div style="font-size:1.1rem; font-weight:700; color:var(--text); margin-top:0.6rem; margin-bottom:0.1rem;">${safeTitle}</div>
      ${topicHtml}
      <div style="font-size:0.9rem; line-height:1.6; color:var(--muted); margin-top:0.6rem; white-space:pre-wrap;">${safeText}</div>
      <div style="margin-top:1.5rem; display:flex; justify-content:flex-end; gap:0.5rem;">
        ${isAdmin ? `<button class="btn-edit" onclick="triggerEdit('${n.id}')">Edit ✏️</button>` : ''}
        ${isAdmin ? `<button class="btn-delete" onclick="deleteNote('${n.id}')">🗑️ Delete Note</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

async function saveNote() {
  if (!sb) { toast('Not connected to database.', 'error'); return; }

  let dateVal = document.getElementById('note-date').value;
  if (!dateVal) dateVal = new Date().toISOString().split('T')[0];

  const author  = document.getElementById('note-author').value.trim() || 'DevOps Log';
  const title   = document.getElementById('note-title').value.trim()  || 'Daily Log';
  const content = document.getElementById('note-text').value.trim();
  const linkedTopic = document.getElementById('note-topic') ? document.getElementById('note-topic').value.trim() : '';
  
  if (!content) { toast('Please write an entry first.', 'error'); return; }

  if (editingNoteId) {
    // UPDATE PATH
    const { data, error } = await sb
      .from('notes')
      .update({ date: dateVal, author, title, note_text: content, linked_topic: linkedTopic })
      .eq('id', editingNoteId)
      .select();

    if (error) { toast('Error: ' + error.message, 'error'); return; }

    if (!data || data.length === 0) {
      toast('❌ Update blocked by Supabase RLS Policies!', 'error');
      return;
    }

    toast('Note Updated! ✏️', 'success');

  } else {
    // INSERT PATH
    const { error } = await sb.from('notes').insert({
      date: dateVal, author, title, note_text: content, linked_topic: linkedTopic
    });
    
    if (error) { toast('Error: ' + error.message, 'error'); return; }
    
    toast('Note Saved! 🎉', 'success');
  }

  cancelEditNote(); 
  
  // Refresh the UI to show the data
  await syncUI();
}

// ── THE BULLETPROOF EDIT FUNCTION ──
function triggerEdit(id) {
  const n = allNotes.find(x => String(x.id) === String(id));
  if (!n) return;

  const titleEl = document.getElementById('note-title');
  const textEl = document.getElementById('note-text');
  const dateEl = document.getElementById('note-date');
  const authorEl = document.getElementById('note-author');
  const topicEl = document.getElementById('note-topic');

  // 1. FORCE the form to become visible and glow
  const formContainer = textEl.closest('.card');
  if (formContainer) {
    formContainer.style.display = 'block'; 
    formContainer.style.border = '2px solid var(--accent-blue)'; 
    formContainer.style.boxShadow = '0 0 15px rgba(10, 132, 255, 0.2)';
  }

  // 2. Fill the form
  const contentVal = n.note_text || n.entry || n.content || n.body || n.text || n.description || '';
  titleEl.value = n.title || '';
  textEl.value  = contentVal;
  dateEl.value  = n.date || '';
  authorEl.value = n.author || 'Michael Joshua';
  if (topicEl) topicEl.value = n.linked_topic || '';

  // 3. Update the UI to "Edit Mode"
  document.getElementById('note-form-title').innerText = '✏️ Edit Journal Entry';
  
  const cancelBtn = document.getElementById('cancel-note-edit');
  if (cancelBtn) cancelBtn.style.display = 'inline-flex'; // Show Cancel button!

  const saveBtn = formContainer.querySelector('.btn-save') || document.querySelector('.btn-save');
  if (saveBtn) saveBtn.innerText = 'Update Note';
  
  editingNoteId = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── CANCEL EDIT MODE ──
function cancelEditNote() {
  editingNoteId = null; // Clear the memory

  // 1. Empty the form boxes
  document.getElementById('note-title').value = '';
  document.getElementById('note-text').value  = '';
  document.getElementById('note-date').value  = new Date().toISOString().split('T')[0];
  document.getElementById('note-author').value = 'Michael Joshua';
  
  const topicEl = document.getElementById('note-topic');
  if (topicEl) topicEl.value = '';

  // 2. Reset the text and hide the cancel button
  document.getElementById('note-form-title').innerText = 'New Journal Entry';
  
  const cancelBtn = document.getElementById('cancel-note-edit');
  if (cancelBtn) cancelBtn.style.display = 'none';

  // 3. Remove the glowing blue border
  const textEl = document.getElementById('note-text');
  if (textEl) {
    const formContainer = textEl.closest('.card');
    if (formContainer) {
      formContainer.style.border = '1px solid var(--border)';
      formContainer.style.boxShadow = 'var(--card-shadow)';
      
      const saveBtn = formContainer.querySelector('.btn-save');
      if (saveBtn) saveBtn.innerText = 'Save Note';
    }
  }
}

// ── DELETE NOTE (WITH 60s UNDO) ──
function deleteNote(id) {
    const noteToRestore = allNotes.find(x => String(x.id) === String(id));
    if (!noteToRestore) return;
    
    // Instantly hide it from the UI
    allNotes = allNotes.filter(x => String(x.id) !== String(id));
    renderNotes(allNotes); 
    
    // Trigger the Universal Engine 
    triggerUniversalDelete('notes', id, `Journal "${noteToRestore.title || 'Entry'}"`, async () => {
        // BULLETPROOF UNDO: The database restored it, so we just re-fetch the fresh list!
        await loadNotes(); 
    });
}