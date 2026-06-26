// ── WAR ROOM ENGINE ──       

let allWarRoomReports = [];
let currentWRFilter = 'all';
let editingWRId = null;

async function loadWarRoom() {
  if(!sb) return;
  try {
    // Grabbing your reports from Supabase
    const { data, error } = await sb.from('war_room_reports').select('*').order('date', {ascending: false});
    
    if (error) {
      const list = document.getElementById('warroom-list');
      if(list) list.innerHTML = `<div style="color:var(--red); padding:1rem;">🚨 Supabase Error: ${error.message}</div>`;
      return;
    }
    
    allWarRoomReports = data || [];
    // Sync sort button highlight on first load
    if (typeof updateSortButtons === 'function' && typeof sortState !== 'undefined') {
      const { field, dir } = sortState['warroom'];
      updateSortButtons('warroom', field, dir);
    }
    renderWarRoom();
  } catch(e) {
    console.error("War Room Load Error:", e);
  }
}

function setWRFilter(filter) {
  currentWRFilter = filter;
  
  // Update button active states visually
  document.querySelectorAll('#wr-filters button').forEach(btn => {
    if(btn.getAttribute('data-filter') === filter) {
      btn.className = 'btn';
      btn.style.background = 'var(--accent-blue)';
      btn.style.color = '#fff';
    } else {
      btn.className = 'btn btn-ghost';
      btn.style.background = '';
      btn.style.color = '';
    }
  });
  
  renderWarRoom();
}

function renderWarRoom() {
  const list = document.getElementById('warroom-list');
  if(!list) return;

  const searchBox = document.getElementById('wr-search');
  const term = searchBox ? searchBox.value.toLowerCase().trim() : '';

  let filtered = allWarRoomReports;

  // 1. Filter by Category
  if (currentWRFilter !== 'all') {
    filtered = filtered.filter(r => (r.type || '').toLowerCase() === currentWRFilter.toLowerCase());
  }

  // 2. Filter by Search Term
  if (term) {
    filtered = filtered.filter(r => 
      (r.title || '').toLowerCase().includes(term) ||
      (r.error_code || '').toLowerCase().includes(term) ||
      (r.solution || '').toLowerCase().includes(term)
    );
  }

  if(!filtered || filtered.length === 0) {
    list.innerHTML = '<div style="color:var(--muted);font-size:0.9rem;padding:1rem;">No reports found. The battlefield is quiet.</div>';
    return;
  }

  // Apply current sort preference
  if (typeof applySortToData === 'function' && typeof sortState !== 'undefined') {
    const { field, dir } = sortState['warroom'];
    filtered = applySortToData(filtered, field, dir);
  }

  list.innerHTML = filtered.map((r, i) => {
    // Badge Styling based on type
    let badgeColor = 'var(--muted)';
    let badgeBg = 'var(--surface2)';
    let typeLabel = r.type || 'Report';
    
    if(typeLabel.toLowerCase() === 'bug') { badgeColor = '#ff453a'; badgeBg = 'rgba(255,69,58,0.12)'; typeLabel = '🐛 Bug'; }
    if(typeLabel.toLowerCase() === 'deep dive') { badgeColor = '#0a84ff'; badgeBg = 'rgba(10,132,255,0.12)'; typeLabel = '📚 Deep Dive'; }
    if(typeLabel.toLowerCase() === 'build') { badgeColor = '#30d158'; badgeBg = 'rgba(48,209,88,0.12)'; typeLabel = '🔨 Build'; }
    if(typeLabel.toLowerCase() === 'incident') { badgeColor = '#ff9f0a'; badgeBg = 'rgba(255,159,10,0.12)'; typeLabel = '🔥 Incident'; }

    // The Preview Button (Opens inline viewer)
    const previewBtn = r.file_url ? 
        `<button class="btn btn-ghost" style="margin-top: 1rem; margin-right: 0.5rem; font-size:0.8rem; padding: 0.4rem 0.8rem;" onclick="event.stopPropagation(); previewFile('${r.file_url}')">👁️ Preview AI Report</button>` 
        : '';

    // The Lead-Capture Download Button
    const dlButton = r.file_url ? 
        `<button class="btn" style="background: var(--accent-blue); color: white; border: none; margin-top: 1rem; font-size:0.8rem; padding: 0.4rem 0.8rem;" onclick="event.stopPropagation(); triggerDownload('${r.id}', '${r.file_url}')">📥 Download PDF</button>` 
        : '';

    return `
    <div class="card" onclick="const b = this.querySelector('.session-body'); b.style.display = b.style.display === 'none' ? 'block' : 'none';" style="padding: 1.5rem; margin-bottom: 1.25rem; cursor: pointer; transition: 0.2s;">
      
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
        <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
          <span class="badge" style="background:${badgeBg}; color:${badgeColor}; border:none; padding:0.3rem 0.75rem; border-radius:6px; font-weight:700; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">${typeLabel}</span>
          <span style="font-size:0.85rem; color:var(--muted); font-family:var(--font-mono);">${new Date(r.date || r.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div style="font-size:1.3rem; font-weight:700; color:var(--text); letter-spacing:-0.02em;">
        ${escapeHTML(r.title || 'Untitled Report')}
      </div>

      <div class="session-body" style="display:none; margin-top:1.5rem; border-top:1px solid var(--border); padding-top:1.5rem;">
        
        ${r.error_code ? `
        <div style="background:rgba(255,69,58,0.1); border:1px solid rgba(255,69,58,0.2); padding:0.75rem; border-radius:8px; margin-bottom:1rem; font-family:var(--font-mono); font-size:0.85rem; color:#ff453a;">
          > Error: ${escapeHTML(r.error_code)}
        </div>` : ''}

        ${r.solution ? `
        <div style="background:var(--surface2); border:1px solid var(--border); padding:1rem; border-radius:8px; border-left:3px solid #30d158; margin-bottom:1rem;">
          <div style="font-size:0.75rem; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.4rem;">The Solution</div>
          <div style="font-size:0.95rem; line-height:1.6; white-space:pre-wrap;">${escapeHTML(r.solution)}</div>
        </div>` : ''}

        <div style="display: flex; flex-wrap: wrap;">
            ${previewBtn}
            ${dlButton}
        </div>

        ${isAdmin ? `
          <div style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:0.5rem;">
            <button class="btn btn-ghost" style="font-size:0.75rem; padding:0.35rem 0.75rem" onclick="event.stopPropagation(); editWarRoomReport('${r.id}')">✏️ Edit</button>
            <button class="btn btn-ghost" style="color:var(--red); font-size:0.75rem; padding:0.35rem 0.75rem" onclick="event.stopPropagation(); deleteWarRoomReport('${r.id}')">🗑️ Delete</button>
          </div>
        ` : ''}
      </div>
      
    </div>`;
  }).join('');
}

// ── MODAL LOGIC ──
function openWarRoomModal() {
  editingWRId = null;
  document.getElementById('wr-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('wr-type').value = 'Bug';
  document.getElementById('wr-title').value = '';
  document.getElementById('wr-error').value = '';
  document.getElementById('wr-solution').value = '';
  document.getElementById('wr-file').value = '';
  
  document.getElementById('wr-modal-title').textContent = '🚨 New War Room Report';
  document.getElementById('warRoomModal').classList.add('open');
}

function closeWarRoomModal() {
  document.getElementById('warRoomModal').classList.remove('open');
}

function editWarRoomReport(id) {
  const r = allWarRoomReports.find(x => String(x.id) === String(id));
  if(!r) return;
  editingWRId = id;
  
  document.getElementById('wr-date').value = r.date || '';
  document.getElementById('wr-type').value = r.type || 'Bug';
  document.getElementById('wr-title').value = r.title || '';
  document.getElementById('wr-error').value = r.error_code || '';
  document.getElementById('wr-solution').value = r.solution || '';
  document.getElementById('wr-file').value = ''; // Don't pre-fill files securely
  
  document.getElementById('wr-modal-title').textContent = '✏️ Edit Report';
  document.getElementById('warRoomModal').classList.add('open');
}

async function saveWRReport() {
  if(!sb) return;
  
  // 👇 CRITICAL SECURITY FIX: Force Supabase to get the secure session token 
  const { data: { session }, error: sessionError } = await sb.auth.getSession();
  
  if (!session) {
      toast("Security Block: Not authenticated as Admin. Please log in.", "error");
      return;
  }
  
  const payload = {
    date: document.getElementById('wr-date').value,
    type: document.getElementById('wr-type').value,
    title: document.getElementById('wr-title').value.trim(),
    error_code: document.getElementById('wr-error').value.trim(),
    solution: document.getElementById('wr-solution').value.trim()
  };
  
  if(!payload.title || !payload.solution) {
    toast('Title and Solution are required', 'error');
    return;
  }

  const fileInput = document.getElementById('wr-file');
  
  // IF A FILE WAS ATTACHED: Upload it to Supabase Storage
  if (fileInput.files && fileInput.files.length > 0) {
      toast('Uploading file...', 'success');
      const file = fileInput.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`; 
      
      const { data: uploadData, error: uploadError } = await sb.storage
          .from('war_room_files')
          .upload(fileName, file);

      if (uploadError) {
          toast('File upload failed: ' + uploadError.message, 'error');
          return;
      }

      // Get the public URL to save in the database
      const { data: publicUrlData } = sb.storage.from('war_room_files').getPublicUrl(fileName);
      payload.file_url = publicUrlData.publicUrl;
  }
  
  if(editingWRId) {
    const { error } = await sb.from('war_room_reports').update(payload).eq('id', editingWRId);
    if(error) { toast('Error updating: ' + error.message, 'error'); return; }
    toast('Report Updated! 🚨', 'success');
  } else {
    const { error } = await sb.from('war_room_reports').insert([payload]);
    if(error) { toast('Error saving: ' + error.message, 'error'); return; }
    toast('Report Logged! 🚨', 'success');
  }
  
  closeWarRoomModal();
  await syncUI(); 
}

// ── DELETE WAR ROOM REPORT (WITH 60s UNDO) ──
function deleteWarRoomReport(id) {
    const reportToRestore = allWarRoomReports.find(x => String(x.id) === String(id));
    if (!reportToRestore) return;
    
    // Hide instantly
    allWarRoomReports = allWarRoomReports.filter(x => String(x.id) !== String(id));
    renderWarRoom(); 
    
    // Trigger Universal Delete 
    triggerUniversalDelete('war_room_reports', id, `Report "${reportToRestore.title}"`, () => {
        allWarRoomReports.push(reportToRestore); 
        allWarRoomReports.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
        renderWarRoom();
    });
}

// ── INLINE DOCUMENT PREVIEWER ──
function previewFile(fileUrl) {
    const frame = document.getElementById('file-viewer-frame');
    if (frame) frame.src = fileUrl;
    document.getElementById('viewer-modal').classList.add('open');
}

// ── DOWNLOAD LEAD CAPTURE SYSTEM ──
let activeDownloadUrl = null;
let activeReportId = null;

function triggerDownload(reportId, fileUrl) {
    activeReportId = reportId;
    activeDownloadUrl = fileUrl;
    
    // If admin is logged in, bypass the popup and download instantly
    if (isAdmin) {
        window.open(activeDownloadUrl, '_blank');
        return;
    }

    // Otherwise, show the Lead Capture modal
    document.getElementById('download-email').value = '';
    document.getElementById('download-modal').classList.add('open');
}

async function processDownload() {
    const emailInput = document.getElementById('download-email').value.trim();
    if (!emailInput || !emailInput.includes('@')) {
        toast('Please enter a valid email address.', 'error');
        return;
    }

    // Save the recruiter's email
    await sb.from('report_downloads').insert({
        report_id: activeReportId,
        email: emailInput
    });

    // Close modal and download!
    document.getElementById('download-modal').classList.remove('open');
    toast('Downloading report...', 'success');
    window.open(activeDownloadUrl, '_blank');
}
/**
 * Bridge called by sort buttons in index.html.
 * Updates sortState via applySort, then re-runs renderWarRoom
 * which already reads sortState['warroom'] internally.
 */
function renderWarRoomSorted(data) {
  // data is passed by applySort but renderWarRoom reads allWarRoomReports directly,
  // so we just trigger a re-render — the sort is already applied inside renderWarRoom.
  renderWarRoom();
}
