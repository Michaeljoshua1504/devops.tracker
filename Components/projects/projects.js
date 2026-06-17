// ── PORTFOLIO PROJECTS ENGINE ──  

// We use this variable instead of a hidden HTML input to prevent crashes
let editingProjectId = null; 
let projectToDeleteId = null;

async function loadProjects() {  
    if(!sb) return;  
    try {  
        const { data, error } = await sb.from('mini_projects').select('*').order('topic_id');  
        if(error) {  
            document.getElementById('projects-list').innerHTML = `<div style="color:var(--red)">Error loading projects: ${error.message}</div>`;  
            return;  
        }  
        allProjects = data || [];  
        
        // Safely update dashboard stat if the DOM element exists
        const dashProj = document.getElementById('dash-projects');
        if(dashProj) dashProj.textContent = allProjects.length;  
        
        renderProjects(allProjects);  
    } catch(e) {  
        console.error("Projects Load Error:", e);  
    }  
}

function renderProjects(data) {  
    const container = document.getElementById('projects-list');  
    if(!container) return;

    if(!data || data.length === 0) {  
        container.innerHTML = '<div style="color:var(--muted);font-size:0.9rem">No projects deployed yet. Add your first build!</div>';  
        return;  
    }  
      
    container.innerHTML = data.map(p => {  
        const safeCode = p.code_snippet ? escapeHTML(p.code_snippet) : '';
        const codeSnippet = safeCode ? `<div style="margin-top:1.25rem"><div style="font-size:0.75rem;font-weight:600;color:var(--muted);text-transform:uppercase;margin-bottom:0.5rem;letter-spacing:0.05em">Code Engine Artifact / Tech Stack</div><pre style="background:var(--bg);padding:1rem;border-radius:10px;font-family:var(--font-mono);font-size:0.85rem;color:var(--accent);overflow-x:auto;border:1px solid var(--border)"><code>${safeCode}</code></pre></div>` : '';  
          
        const githubBtn = p.github_url ? `<a href="${escapeHTML(p.github_url)}" target="_blank" class="btn btn-ghost" style="font-size:0.8rem;padding:0.4rem 0.85rem;text-decoration:none;color:var(--text)">🔗 View Source</a>` : '';

        // Time log — always visible, small
        const createdDate = p.created_at ? new Date(p.created_at).toLocaleString() : 'Unknown';
        const editedDate = p.extra_data && p.extra_data.edited_at ? new Date(p.extra_data.edited_at).toLocaleString() : null;
        const timeLogId = 'proj-timelog-' + p.id;
        const timeLogBtn = `<button class="btn btn-ghost" style="font-size:0.72rem;padding:0.25rem 0.6rem;color:var(--muted);" onclick="event.stopPropagation();document.getElementById('${timeLogId}').style.display=document.getElementById('${timeLogId}').style.display==='none'?'block':'none'">🕒 Log</button>`;
        const timeLogPanel = `<div id="${timeLogId}" style="display:none;margin-top:0.75rem;padding:0.6rem 0.85rem;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:0.78rem;color:var(--muted)">
          <div>📅 Created: ${createdDate}</div>
          ${editedDate ? `<div style="margin-top:0.25rem">✏️ Last edited: ${editedDate}</div>` : ''}
        </div>`;

        return `
        <div class="session-item" style="cursor:default; padding: 1.5rem">  
            <div class="session-header">  
                <div class="session-topic" style="color:var(--accent-blue); font-size:1.1rem">${escapeHTML(p.project_name || 'Untitled')}</div>  
                <div class="session-date" style="font-size:0.85rem">Topic ${escapeHTML(p.topic_id || '')} • ${p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}</div>  
            </div>  
            <div style="font-size:0.95rem;color:var(--text);line-height:1.6;margin-top:0.75rem">${escapeHTML(p.theory_concept || '')}</div>  
            ${codeSnippet}
            ${timeLogPanel}
            
            <div style="margin-top:1.25rem; display:flex; justify-content:flex-end; gap:0.5rem; align-items:center; flex-wrap:wrap">  
                ${timeLogBtn}
                ${githubBtn}  
                ${isAdmin ? `<button class="btn-edit" onclick="openEditProject('${p.id}')">✏️ Edit</button>` : ''}
                ${isAdmin ? `<button class="btn-delete" onclick="deleteProject('${p.id}')">🗑️ Delete</button>` : ''}
                </div>  
        </div>`;  
    }).join('');  
}

// ── BULLETPROOF HELPER (Sets value only if HTML element exists) ──
function safeSetValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
}

// ── GET VALUE FROM TWO POSSIBLE HTML IDs (Super Catch-All) ──
function safeGetValue(id1, id2) {
    const el1 = document.getElementById(id1);
    if (el1 && el1.value.trim()) return el1.value.trim();
    const el2 = document.getElementById(id2);
    if (el2 && el2.value.trim()) return el2.value.trim();
    return '';
}

function openEditProject(id) {
    const p = allProjects.find(x => String(x.id) === String(id));
    if (!p) return;
    
    editingProjectId = id; // Lock in the ID
    
    // Safely check both possible naming conventions in your HTML file
    safeSetValue('proj-topic', p.topic_id);
    safeSetValue('proj-phase', p.topic_id);
    
    safeSetValue('proj-name', p.project_name);
    safeSetValue('proj-title', p.project_name);
    
    safeSetValue('proj-theory', p.theory_concept);
    safeSetValue('proj-desc', p.theory_concept);
    
    safeSetValue('proj-code', p.code_snippet);
    safeSetValue('proj-tech', p.code_snippet);
    
    safeSetValue('proj-url', p.github_url);
    safeSetValue('proj-repo', p.github_url);
    
    const title = document.querySelector('#projectModal h2');
    if(title) title.textContent = '✏️ Edit Project';
    
    const modal = document.getElementById('projectModal');
    if(modal) modal.classList.add('open');
}

function openProjectModal() {  
    editingProjectId = null; // Clear ID so we know it's a NEW project
    
    // Clear the form safely
    ['proj-topic', 'proj-phase', 'proj-name', 'proj-title', 'proj-theory', 'proj-desc', 'proj-code', 'proj-tech', 'proj-url', 'proj-repo'].forEach(id => {
        safeSetValue(id, '');
    });
    
    const title = document.querySelector('#projectModal h2');
    if(title) title.textContent = '🚀 Add Portfolio Project';
    
    const modal = document.getElementById('projectModal');
    if(modal) modal.classList.add('open');  
}

function closeProjectModal() {  
    const modal = document.getElementById('projectModal');
    if(modal) modal.classList.remove('open');  
}

async function saveProject() {  
    if(!sb) { toast('Not connected', 'error'); return; }  
    
    // Safely pulls from whichever inputs exist in your HTML
    const payload = {  
        topic_id: safeGetValue('proj-topic', 'proj-phase'),  
        project_name: safeGetValue('proj-name', 'proj-title'),  
        theory_concept: safeGetValue('proj-theory', 'proj-desc'),  
        code_snippet: safeGetValue('proj-code', 'proj-tech'),  
        github_url: safeGetValue('proj-url', 'proj-repo')  
    };  
      
    if(!payload.topic_id || !payload.project_name || !payload.theory_concept) {  
        toast('Please fill in Topic ID, Name, and Concept', 'error'); return;  
    }  
      
    let error;  
    if(editingProjectId) {  
        // UPDATE Existing
        const res = await sb.from('mini_projects')
            .update({...payload, extra_data: { edited_at: new Date().toISOString() }})
            .eq('id', editingProjectId);  
        error = res.error;  
    } else {  
        // INSERT New
        const res = await sb.from('mini_projects').insert([payload]);  
        error = res.error;  
    }  
      
    if(error) { toast('Error saving project: ' + error.message, 'error'); return; }  
      
    toast('Project Deployed! 🚀', 'success');  
    closeProjectModal();  
    await syncUI();  
}

// ── DELETE PROJECT (WITH 60s UNDO) ──

function deleteProject(id) {
    // 1. Find the exact project data
    const projectToRestore = allProjects.find(x => String(x.id) === String(id));
    if (!projectToRestore) return;
    
    // 2. Instantly hide it from the UI (without touching the database yet)
    allProjects = allProjects.filter(x => String(x.id) !== String(id));
    renderProjects(allProjects); 
    
    // 3. Trigger the Universal 60-second Undo Engine
    // 3. Trigger Universal Engine
    triggerUniversalDelete('mini_projects', id, `Project "${projectToRestore.project_name}"`, () => {
        // THIS RUNS IF YOU CLICK UNDO:
        allProjects.push(projectToRestore); // Put the data back
        
        // Sort them so it goes back to its original spot
        allProjects.sort((a, b) => {
            const tA = a.topic_id || '';
            const tB = b.topic_id || '';
            return tA.localeCompare(tB);
        });
        
        renderProjects(allProjects); // Re-render the screen
    });
}