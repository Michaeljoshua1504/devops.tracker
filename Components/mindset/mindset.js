// ── MINDSET ENGINE ──       

let editingMindsetId = null;

async function loadMindset() {       
  if(!sb) return;       
  try {    
    const { data, error } = await sb.from('mindset_moments').select('*').order('created_at', {ascending:false});       
    if(error || !data){    
      document.getElementById('mindset-list').innerHTML='<div style="color:var(--red);font-size:0.9rem">Error loading snapshots</div>';    
      return;    
    }       
    allMindset = data;       
    
    // Safely update stat counters
    const strongCount = data.filter(m => m.rating && m.rating.toLowerCase().includes('strong')).length;       
    const dashMindset = document.getElementById('dash-mindset');
    const strongEl = document.getElementById('strong-count');
    
    if(dashMindset) dashMindset.textContent = allMindset.length;
    if(strongEl) strongEl.textContent = strongCount;       
    
    renderMindset(data);    
  } catch(e) {    
    console.error("Mindset Load Error:", e);    
  }       
}

function filterMindset(f) {     
  const searchBar = document.getElementById('mindset-search');
  if(searchBar) searchBar.value = '';
  let filtered = [];    
    
  if (f === 'all') {    
    filtered = allMindset;    
  } else if (f === 'duplicates') {    
    const groups = {};    
    allMindset.forEach(m => {    
      const textToCheck = m.question || m.situation;   
      if(!textToCheck) return;    
      const q = textToCheck.toLowerCase().trim();    
      if(!groups[q]) groups[q] = [];    
      groups[q].push(m);    
    });    
       
    Object.keys(groups).forEach(q => {    
      if(groups[q].length > 1) {    
        const sortedGroup = groups[q].sort((a,b) => new Date(a.created_at) - new Date(b.created_at));    
        const taggedGroup = sortedGroup.map((item, index) => ({    
          ...item,    
          duplicateTag: index === 0 ? 'Original' : 'Duplicate'    
        }));    
        filtered = filtered.concat(taggedGroup);    
      }    
    });    
       
    if(filtered.length === 0) {    
      toast('No duplicates found! 🎉', 'success');    
      filtered = allMindset;    
    } else {    
      toast(`Found ${filtered.length} duplicate entries.`, 'success');    
    }    
      
  } else if (f === 'question') {  
    filtered = allMindset.filter(m => m.moment_type === 'Question');  
  } else if (f === 'situation') {  
    filtered = allMindset.filter(m => m.moment_type === 'Situation');  
  } else if (f === 'strong') {  
    filtered = allMindset.filter(m => m.rating && m.rating.toLowerCase().includes('strong'));  
  } else if (f === 'good') {  
    filtered = allMindset.filter(m => m.rating && m.rating.toLowerCase().includes('good'));  
  } else {    
    filtered = allMindset;    
  }    
    
  renderMindset(filtered);       
}

function searchMindset() {
  const term = document.getElementById('mindset-search').value.toLowerCase().trim();
  if (!term) { renderMindset(allMindset); return; }
  
  const filtered = allMindset.filter(m => {
    return (m.question || '').toLowerCase().includes(term) ||
           (m.situation || '').toLowerCase().includes(term) ||
           (m.concept || m.tag || '').toLowerCase().includes(term) ||
           (m.topic || m.linked_topic_name || '').toLowerCase().includes(term) ||
           (m.response || m.insight || '').toLowerCase().includes(term);
  });
  renderMindset(filtered);
}

function renderMindset(data) {       
  const list = document.getElementById('mindset-list');
  if(!list) return;

  if(!data || data.length === 0) {       
    list.innerHTML = '<div style="color:var(--muted);font-size:0.9rem">No mindset moments found.</div>';       
    return;       
  }     

  list.innerHTML = data.map((m, i) => {       
    const mid = 'mindset-acc-' + i;       
      
    const isStrong = m.rating && m.rating.toLowerCase().includes('strong');  
    const ratingClass = isStrong ? 'rating-strong' : 'rating-good';       
    const ratingLabel = isStrong ? 'Strong instinct' : 'Good direction';       
       
    let dupBadge = '';    
    if (m.duplicateTag === 'Original') {    
      dupBadge = `<span class="concept-tag" style="background:rgba(48,209,88,0.15);color:var(--green);border:1px solid var(--green)">✓ Original</span>`;    
    } else if (m.duplicateTag === 'Duplicate') {    
      dupBadge = `<span class="concept-tag" style="background:rgba(255,69,58,0.15);color:var(--red);border:1px solid var(--red)">🗑️ Duplicate</span>`;    
    }

    const mType = m.moment_type || 'Question';  
    const mSource = m.insight_source || 'AI';  
      
    const typeBadge = mType === 'Question'   
         ? '<span class="badge-question">❓ Question</span>'   
         : '<span class="badge-situation">🎬 Situation</span>';  
           
    const sourceBadge = mSource === 'Me'   
         ? '<span class="badge-me">🧠 Me</span>'   
         : '<span class="badge-ai">🤖 AI</span>';

    return `<div class="mindset-item" onclick="toggleMindset('${mid}')">       
      <div style="margin-bottom: 8px; display: flex; gap: 8px;">  
         ${typeBadge}  
         ${sourceBadge}  
      </div>  
      <div class="mindset-q">${escapeHTML(m.question || m.situation || 'Untitled')}</div>       
      <div class="mindset-meta">       
        <span class="${ratingClass}">★ ${ratingLabel}</span>       
        ${m.tag || m.concept ? `<span class="concept-tag">${escapeHTML(m.tag || m.concept)}</span>` : ''}       
        ${m.topic || m.linked_topic_name ? `<span class="concept-tag" style="background:transparent; border-color:var(--border); color:var(--muted)">→ ${escapeHTML(m.topic || m.linked_topic_name)}</span>` : ''}       
        ${dupBadge}    
      </div>       
      <div id="${mid}" style="display:none;margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border);font-size:0.9rem;color:var(--muted);line-height:1.6">       
        <strong>Insight/Action Taken:</strong><br>  
        ${escapeHTML(m.insight || m.response || '')}    
        <div style="margin-top:1rem; display:flex; justify-content:flex-end; gap:0.5rem;">    
          ${isAdmin ? `<button class="btn btn-ghost" style="font-size:0.78rem; padding:0.35rem 0.75rem;" onclick="event.stopPropagation(); editMindsetMoment('${m.id}')">✏️ Edit</button>` : ''}
          ${isAdmin ? `<button class="btn btn-ghost" style="color:var(--red); border:1px solid rgba(255,69,58,0.2); font-size:0.78rem; padding:0.35rem 0.75rem;" onclick="event.stopPropagation(); deleteMindset('${m.id}')">🗑️ Delete</button>` : ''}
        </div>    
      </div>       
    </div>`;       
  }).join('');       
}

function toggleMindset(mid) {       
  const el = document.getElementById(mid);       
  if(el) el.style.display = el.style.display === 'none' ? 'block' : 'none';       
}

// ── MODAL LOGIC ──
function openMindsetModal() {
  // Reset existing fields
  editingMindsetId = null;
  document.getElementById('mind-question').value = '';
  document.getElementById('mind-rating').value = 'good';
  document.getElementById('mind-concept').value = '';
  document.getElementById('mind-topic').value = '';
  document.getElementById('mind-response').value = '';
  document.querySelector('#mindsetModal h2').textContent = '🧠 Add Mindset Moment';

  // --- NEW DATE AND TIME AUTO-FILL ---
  const dateInput = document.getElementById('moment-date');
  const timeInput = document.getElementById('moment-time');
  const now = new Date();

  if (dateInput && timeInput) {
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    dateInput.value = localDate.toISOString().split('T')[0];
    timeInput.value = now.toTimeString().slice(0, 5);
  }
  // -----------------------------------

  // Open the modal
  document.getElementById('mindsetModal').classList.add('open');
}

function closeMindsetModal() {
  document.getElementById('mindsetModal').classList.remove('open');
}

function editMindsetMoment(id) {
  const m = allMindset.find(x => String(x.id) === String(id));
  if(!m) return;
  editingMindsetId = id;

  if(m.moment_type === 'Situation') {
    document.querySelector('input[name="moment_type"][value="Situation"]').click();
  } else {
    document.querySelector('input[name="moment_type"][value="Question"]').click();
  }
  
  if(m.insight_source === 'Me') {
    document.querySelector('input[name="insight_source"][value="Me"]').checked = true;
  } else {
    document.querySelector('input[name="insight_source"][value="AI"]').checked = true;
  }

  document.getElementById('mind-question').value = m.question || m.situation || '';
  document.getElementById('mind-rating').value = m.rating || 'good';
  document.getElementById('mind-concept').value = m.concept || m.tag || '';
  document.getElementById('mind-topic').value = m.topic || m.linked_topic_name || '';
  document.getElementById('mind-response').value = m.insight || m.response || '';
  
  document.querySelector('#mindsetModal h2').textContent = '✏️ Edit Mindset Moment';
  document.getElementById('mindsetModal').classList.add('open');
}

async function saveMindsetMoment() {
  if(!sb) return;
  
  const mType = document.querySelector('input[name="moment_type"]:checked').value;
  const mSource = document.querySelector('input[name="insight_source"]:checked').value;
  
  // 👇 Grab the new Date and Time values 👇
  const momentDate = document.getElementById('moment-date').value;
  const momentTime = document.getElementById('moment-time').value;
  
  // Cleaned up payload to prevent 400 Bad Request error!
  const payload = {
    date: momentDate, // <-- NEW
    time: momentTime, // <-- NEW
    moment_type: mType,
    insight_source: mSource,
    question: document.getElementById('mind-question').value.trim(),
    rating: document.getElementById('mind-rating').value,
    concept: document.getElementById('mind-concept').value.trim(),
    
    // 👇 CHANGED THIS LINE! 👇
    linked_topic_name: document.getElementById('mind-topic').value.trim(), 
    
    response: document.getElementById('mind-response').value.trim()
  };

  if(!payload.question || !payload.response) {
    toast('Please fill out the question and response fields.', 'error');
    return;
  }

  if(editingMindsetId) {
    const { error } = await sb.from('mindset_moments').update(payload).eq('id', editingMindsetId);
    if(error) { 
        toast('Error updating: ' + error.message, 'error'); 
        console.error(error);
        return; 
    }
    toast('Moment Updated! 🧠', 'success');
  } else {
    const { error } = await sb.from('mindset_moments').insert([payload]);
    if(error) { 
        toast('Error saving: ' + error.message, 'error'); 
        console.error(error);
        return; 
    }
    toast('Moment Saved! 🧠', 'success');
  }

  closeMindsetModal();
  
  // Safely sync UI
  if (typeof syncUI === 'function') {
      await syncUI();
  } else {
      await loadMindset();
  }
}

// ── DELETE MINDSET MOMENT (WITH 60s UNDO) ──
function deleteMindset(id) {
    const itemToRestore = allMindset.find(x => String(x.id) === String(id));
    if (!itemToRestore) return;
    
    // Instantly hide it from the UI
    allMindset = allMindset.filter(x => String(x.id) !== String(id));
    renderMindset(allMindset); 
    
    // Trigger Universal Engine 
    if (typeof triggerUniversalDelete === 'function') {
        triggerUniversalDelete('mindset_moments', id, 'Mindset moment', () => {
            // UNDO ACTION
            allMindset.push(itemToRestore); 
            allMindset.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            renderMindset(allMindset);
        });
    } else {
        console.error("Undo engine not found!");
    }
}