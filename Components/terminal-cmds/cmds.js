// ── TERMINAL COMMANDS ENGINE ──       

let allCommands = [];
let currentCmdFilter = 'All';
let editingCmdId = null;

async function loadCommands() {
  if(!sb) return;
  try {
    const { data, error } = await sb.from('commands').select('*').order('command_text', {ascending: true});
    if (error) {
      console.error("Commands load error:", error);
      return;
    }
    allCommands = data || [];

    // Update tab header count
    const cmdsTitle = document.getElementById('cmds-tab-title');
    if(cmdsTitle) cmdsTitle.textContent = `Terminal Commands Runbook 💻 (${allCommands.length})`;

    renderFilters();
    // Sync sort button highlight on first load
    if (typeof updateSortButtons === 'function' && typeof sortState !== 'undefined') {
      const { field, dir } = sortState['cmds'];
      updateSortButtons('cmds', field, dir);
    }
    renderCommands();
  } catch(e) {
    console.error("Commands Load Error:", e);
  }
}

function renderFilters() {
  const container = document.getElementById('cmd-filters');
  if (!container) return;

  const filters = [
    { id: 'All', label: 'All', icon: '' },
    { id: 'Linux', label: 'Linux', icon: '🐧 ' },
    { id: 'Git', label: 'Git', icon: '🔀 ' },
    { id: 'Docker', label: 'Docker', icon: '🐳 ' },
    { id: 'Kubernetes', label: 'Kubernetes', icon: '☸️ ' },
    { id: 'Terraform', label: 'Terraform', icon: '🏗️ ' },
    { id: 'Python', label: 'Python', icon: '🐍 ' },
    { id: 'Cloud CLI', label: 'Cloud CLI', icon: '☁️ ' },
    { id: 'Duplicates', label: 'Duplicates', icon: '🔍 ' }
  ];

  // Initialize counts
  const counts = { All: allCommands.length, Duplicates: 0 };
  filters.forEach(f => { if(f.id !== 'All' && f.id !== 'Duplicates') counts[f.id] = 0; });

  // 🛡️ Safe counting: Uses .includes() to ignore emojis/spaces in dirty DB data
  allCommands.forEach(c => {
    const cat = (c.category || '').toLowerCase();
    const match = filters.find(f => cat.includes(f.id.toLowerCase()));
    if (match && match.id !== 'All' && match.id !== 'Duplicates') {
      counts[match.id]++;
    }
  });

  // Count exact duplicates
  const groups = {};
  allCommands.forEach(c => {
    const cmdText = (c.command_text || '').trim();
    if(!groups[cmdText]) groups[cmdText] = [];
    groups[cmdText].push(c);
  });
  Object.keys(groups).forEach(cmd => {
    if(groups[cmd].length > 1) counts['Duplicates'] += groups[cmd].length;
  });

  // Inject buttons with the live counts
  container.innerHTML = filters.map(f => {
    const isActive = currentCmdFilter === f.id;
    const btnClass = isActive ? 'btn' : 'btn btn-ghost';
    const bgStyle = isActive ? 'background:var(--accent-blue); color:#fff;' : '';
    return `
      <button class="${btnClass}" style="${bgStyle}" onclick="setCmdFilter('${f.id}')">
        ${f.icon}${f.label} 
        <span style="opacity:0.6; font-size:0.85em; margin-left:0.25rem; font-family:var(--font-mono);">(${counts[f.id]})</span>
      </button>`;
  }).join('');
}

// 🛡️ Global Scope Lock: Ensures dynamic buttons can always find this function
window.setCmdFilter = function(filter) {
  currentCmdFilter = filter;
  renderFilters(); 
  renderCommands();
};

function renderCommands() {
  const list = document.getElementById('cmds-list');
  if(!list) return;

  const searchBox = document.getElementById('cmd-search');
  const term = searchBox ? searchBox.value.toLowerCase().trim() : '';

  let filtered = allCommands;

  if (currentCmdFilter !== 'All') {
    if (currentCmdFilter === 'Duplicates') {
      const groups = {};
      allCommands.forEach(c => {
        const cmdText = (c.command_text || '').trim();
        if(!groups[cmdText]) groups[cmdText] = [];
        groups[cmdText].push(c);
      });
      filtered = [];
      Object.keys(groups).forEach(cmd => {
        if(groups[cmd].length > 1) filtered = filtered.concat(groups[cmd]);
      });
    } else {
      // 🛡️ Safe matching: prevents breaks if categories have weird formats
      filtered = filtered.filter(c => (c.category || '').toLowerCase().includes(currentCmdFilter.toLowerCase()));
    }
  }

  if (term) {
    // 🛡️ Bulletproof Search: Safely compiles all data (including arrays) into one clean string to prevent crashes
    filtered = filtered.filter(c => {
      const linksData = Array.isArray(c.linked_commands) ? c.linked_commands.join(' ') : (c.linked_commands || c.linked_cmds || c.links || '');
      const searchString = `
        ${c.command_text || ''}
        ${c.meaning || c.description || ''}
        ${c.example || c.example_usage || ''}
        ${linksData}
        ${c.security_note || c.security || ''}
        ${c.category || ''}
      `.toLowerCase();
      
      return searchString.includes(term);
    });
  }

  if(!filtered || filtered.length === 0) {
    list.innerHTML = '<div style="color:var(--muted);font-size:0.9rem;padding:1rem;">No commands found matching this filter.</div>';
    return;
  }

  // Apply current sort preference
  if (typeof applySortToData === 'function' && typeof sortState !== 'undefined') {
    const { field, dir } = sortState['cmds'];
    filtered = applySortToData(filtered, field, dir);
  }

  list.innerHTML = filtered.map((c) => {
    const meaningText = c.meaning || c.description || c.plain_english || 'No description provided.';
    const exampleText = c.example || c.example_usage || '';
    const linkedText = c.linked_commands || c.linked_cmds || c.links || c.related_commands || c.tags || '';
    const securityText = c.security_note || c.security || c.warning || '';
    const topicLearned = c.topic_learned || c.topic || '';
    const futureTopics = c.future_topics || c.future || '';
    const category = (c.category || 'CLI').toUpperCase();
    
    const safeCommandText = (c.command_text || '').replace(/'/g, "\\'");
    
    const hasSecurity = securityText && String(securityText).trim().length > 0 && String(securityText).toLowerCase() !== 'null';
    const hasExample = exampleText && String(exampleText).trim().length > 0 && String(exampleText).toLowerCase() !== 'null';

    let badgeBg = 'var(--surface2)';
    let badgeColor = 'var(--muted)';
    if(category.includes('GIT')) { 
      badgeBg = '#d1fae5'; 
      badgeColor = '#6d28d9'; 
    } else if(category.includes('LINUX')) { 
      badgeBg = '#f3e8ff'; 
      badgeColor = '#9333ea'; 
    }

    let linkedPills = '';
    if (linkedText && String(linkedText).toLowerCase() !== 'null') {
      let linksArray = [];
      if (Array.isArray(linkedText)) {
        linksArray = linkedText;
      } else {
        linksArray = String(linkedText).split(',').map(l => l.trim()).filter(l => l);
      }
      
      if (linksArray.length > 0) {
        linkedPills = linksArray.map(link => 
          `<span style="display:inline-flex; align-items:center; gap:0.3rem; padding:0.25rem 0.6rem; background:var(--bg); border:1px solid var(--border); border-radius:6px; font-size:0.85rem; color:#0a84ff; font-weight:500;"><span style="color:var(--muted); font-size:0.9rem;">🔗</span> ${escapeHTML(link)}</span>`
        ).join('');
        linkedPills = `<div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.5rem;">${linkedPills}</div>`;
      }
    }
    
    const learnedHTML = topicLearned ? `<span style="margin-right:0.5rem">Learned: ${escapeHTML(topicLearned)}</span>` : '';
    const futureHTML = futureTopics ? `<span>Future: ${escapeHTML(futureTopics)}</span>` : '';

    return `
    <div style="padding: 1.5rem; margin-bottom: 1.25rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface);">
      
      <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem; font-size:0.85rem; color:var(--muted);">
        <span style="background:${badgeBg}; color:${badgeColor}; padding:0.2rem 0.5rem; border-radius:4px; font-weight:800; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">${escapeHTML(category)}</span>
        ${learnedHTML}
        ${futureHTML}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; background:#6b7280; padding:1.25rem; border-radius:6px; margin-bottom:1.25rem;">
        <span style="font-family:var(--font-mono); font-size:1.15rem; color:#ffffff; font-weight:600; letter-spacing:-0.02em;">${escapeHTML(c.command_text)}</span>
        <button style="background:none; border:none; cursor:pointer; font-size:1.3rem; padding:0;" onclick="navigator.clipboard.writeText('${safeCommandText}'); toast('Command copied! 📋', 'success')" title="Copy Command">📋</button>
      </div>

      <div style="font-size:1.1rem; font-weight:700; color:var(--text); margin-bottom:1rem;">
        ${escapeHTML(meaningText)}
      </div>

      ${hasExample ? `
        <div style="margin-bottom:1.25rem;">
          <div style="font-size:0.9rem; color:var(--muted); font-weight:700; margin-bottom:0.4rem;">Example:</div>
          <div style="font-family:var(--font-mono); font-size:0.95rem; color:var(--muted);">
            ${escapeHTML(exampleText)}
          </div>
        </div>
      ` : ''}

      ${linkedPills}

      ${hasSecurity ? `
        <div style="padding-top:1rem; border-top:1px solid rgba(239, 68, 68, 0.3);">
          <span style="font-size:0.9rem; color:#ef4444;">
            🔒 <strong style="font-weight:700;">Security Note:</strong> ${escapeHTML(securityText)}
          </span>
        </div>
      ` : ''}

     ${isAdmin ? `
        <div style="margin-top:1.25rem; display:flex; justify-content:flex-end; gap:0.5rem;">
          <button class="btn-edit" onclick="editCommand('${c.id}')">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteCommand('${c.id}')">🗑️ Delete</button>
        </div>
      ` : ''}
      
    </div>`;
  }).join('');
}

// ── MODAL LOGIC ──
function openCmdModal() {
  editingCmdId = null;
  
  const safeSetValue = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
    else console.warn(`Element with ID '${id}' not found on the page.`);
  };

  safeSetValue('cmd-text', '');
  safeSetValue('cmd-category', 'Linux');
  safeSetValue('cmd-meaning', '');
  safeSetValue('cmd-example', '');
  safeSetValue('cmd-topic', '');
  safeSetValue('cmd-future', '');
  safeSetValue('cmd-links', '');
  safeSetValue('cmd-security', '');

  const titleEl = document.getElementById('cmd-modal-title');
  if (titleEl) titleEl.textContent = '💻 Add Command';

  const modalEl = document.getElementById('cmdModal');
  if (modalEl) modalEl.classList.add('open');
}

function closeCmdModal() {
  document.getElementById('cmdModal').classList.remove('open');
}

function editCommand(id) {
  const c = allCommands.find(x => String(x.id) === String(id));
  if(!c) return;
  editingCmdId = id;
  
  document.getElementById('cmd-text').value = c.command_text || '';
  document.getElementById('cmd-category').value = c.category || 'Linux';
  document.getElementById('cmd-meaning').value = c.meaning || c.description || '';
  document.getElementById('cmd-example').value = c.example || c.example_usage || '';
  document.getElementById('cmd-topic').value = c.topic_learned || '';
  document.getElementById('cmd-future').value = c.future_topics || '';
  
  let links = c.linked_commands || c.linked_cmds || c.links || '';
  if(Array.isArray(links)) links = links.join(', ');
  document.getElementById('cmd-links').value = links;
  
  document.getElementById('cmd-security').value = c.security_note || c.security || '';
  
  document.getElementById('cmd-modal-title').textContent = '✏️ Edit Command';
  document.getElementById('cmdModal').classList.add('open');
}

async function saveCommand() {
  if(!sb) return;

  let rawLinked = document.getElementById('cmd-links').value.trim();
  rawLinked = rawLinked.replace(/[\[\]"]/g, ''); 
  const linkedArray = rawLinked.split(',').map(s => s.trim()).filter(Boolean);

  const payload = {
    command_text: document.getElementById('cmd-text').value.trim(),
    category: document.getElementById('cmd-category').value,
    meaning: document.getElementById('cmd-meaning').value.trim(),
    example: document.getElementById('cmd-example').value.trim(),
    topic_learned: document.getElementById('cmd-topic').value.trim(),
    future_topics: document.getElementById('cmd-future').value.trim(),
    linked_commands: linkedArray, 
    security_note: document.getElementById('cmd-security').value.trim()
  };
  
  if(!payload.command_text || !payload.category || !payload.meaning) {
    toast('Command, Category, and Plain English Meaning are required', 'error');
    return;
  }
  
  if(editingCmdId) {
    const { error } = await sb.from('commands').update(payload).eq('id', editingCmdId);
    if(error) { toast('Error updating: ' + error.message, 'error'); return; }
    toast('Command Updated! 💻', 'success');
  } else {
    const { error } = await sb.from('commands').insert([payload]);
    if(error) { toast('Error saving: ' + error.message, 'error'); return; }
    toast('Command Added! 💻', 'success');
  }
  
  closeCmdModal();
  await syncUI(); 
}

// ── DELETE COMMAND (WITH 60s UNDO) ──
function deleteCommand(id) {
    const cmdToRestore = allCommands.find(x => String(x.id) === String(id));
    if (!cmdToRestore) return;
    
    allCommands = allCommands.filter(x => String(x.id) !== String(id));
    renderCommands(); 
    
    triggerUniversalDelete('commands', id, `Command "${cmdToRestore.command_text}"`, () => {
        allCommands.push(cmdToRestore); 
        allCommands.sort((a, b) => (a.command_text || '').localeCompare(b.command_text || ''));
        renderCommands(); 
    });
}