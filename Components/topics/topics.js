// ── ROADMAP CONSTANTS ──       
const PHASES = [       
  { label:'Phase 1 — Foundations', ids:['1.1','1.2','1.3','1.4','1.5','1.6','1.7'] },       
  { label:'Phase 2 — Networking + Cloud', ids:['2.1','2.2','2.3','2.4','2.5','2.6','2.7','2.8','2.9','2.10'] },       
  { label:'Phase 3 — Python for DevOps', ids:['3.1','3.2','3.3','3.4','3.5','3.6','3.7'] },       
  { label:'Phase 4 — Git', ids:['4.1','4.2','4.3','4.4','4.5'] },       
  { label:'Phase 5 — Docker', ids:['5.1','5.2','5.3','5.4','5.5','5.6'] },       
  { label:'Phase 6 — CI/CD', ids:['6.1','6.2','6.3','6.4','6.5','6.6','6.7','6.8','6.9'] },       
  { label:'Phase 7 — IaC + Kubernetes', ids:['7.1','7.2','7.3','7.4','7.5','7.6','7.7','7.8','7.9','7.10'] },       
  { label:'Phase 8 — AIOps', ids:['8.1','8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9','8.10','8.11','8.12','8.13'] },       
];

// ── ROADMAP TOPICS ENGINE ──     
async function loadTopics() {       
  if(!sb) return;       
  const [topicsRes, sessionsRes] = await Promise.all([     
    sb.from('topic_status').select('*').order('id'),     
    sb.from('sessions').select('*')     
  ]);

  if(topicsRes.error || !topicsRes.data){       
    document.getElementById('topics-list').innerHTML='<div style="color:var(--red);font-size:0.9rem">Error loading topics</div>';       
    return;       
  }

  const topicsMap = {};       
  topicsRes.data.forEach(t => topicsMap[t.topic_id] = t);

  const latestSessions = {};     
  if (sessionsRes.data) {     
    sessionsRes.data.sort((a,b) => (b.date + b.time).localeCompare(a.date + a.time));     
    sessionsRes.data.forEach(s => {     
      if (s.topic_id && !latestSessions[s.topic_id]) {     
        latestSessions[s.topic_id] = s;     
      }     
    });     
  }

  let html = '';       
  PHASES.forEach(phase => {       
    html += `<div class="phase-header">${phase.label}</div>`;       
    phase.ids.forEach(tid => {       
      let t = topicsMap[tid];       
      if(!t) return;

      const matchingSession = latestSessions[tid];     
      const displayNotes = (matchingSession && matchingSession.full_notes) ? matchingSession.full_notes : (t.full_notes || '');     
      const displaySummary = (matchingSession && matchingSession.summary) ? matchingSession.summary : (t.session_note || '');     
      const displayConcepts = (matchingSession && matchingSession.concepts) ? matchingSession.concepts : '';

      const badge = t.status === 'done' ? 'badge-done' : t.status === 'next' ? 'badge-next' : 'badge-todo';       
      const label = t.status === 'done' ? 'Done' : t.status === 'next' ? 'Next' : 'Todo';       
          
      const hasFullNotes = displayNotes.trim().length > 0;       
      const hasSummary = displaySummary.trim().length > 0;     
      const hasConcepts = displayConcepts.trim().length > 0;

      const safeDomId = tid.replace('.', '_');

      let conceptsHtml = '';     
      if (hasConcepts) {     
        const chips = displayConcepts.split(',').filter(c => c.trim() !== '').map(c =>     
          `<span class="chip" style="display:inline-block; background:var(--surface, #2a2a2a); border:1px solid var(--border, #444); color:var(--text, #fff); padding:0.3rem 0.8rem; border-radius:100px; font-size:0.75rem; font-weight:500;">${escapeHTML(c.trim())}</span>`     
        ).join('');     
            
        conceptsHtml = `     
          <div style="margin-top:1.2rem; padding-top:1rem; border-top:1px solid var(--border)">     
            <div style="font-size:0.75rem;color:var(--accent2);font-weight:600;text-transform:uppercase;margin-bottom:0.75rem;letter-spacing:0.5px;">💡 Key Concepts</div>     
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem; align-items:center;">     
              ${chips}     
            </div>     
          </div>`;     
      }     
          
      const notesHtml = (hasFullNotes || hasSummary || hasConcepts)       
        ? `<div class="topic-expand" id="expand-${safeDomId}" style="display:none">       
            <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border)">       
              ${hasFullNotes ? `       
                <div style="font-size:0.75rem;color:var(--accent2);font-weight:600;text-transform:uppercase;margin-bottom:0.5rem">📖 Full Teaching Notes</div>       
                <div style="font-size:0.9rem;color:var(--text);line-height:1.6;white-space:pre-wrap;margin-bottom:1rem">${escapeHTML(displayNotes)}</div>       
              ` : ''}       
              ${hasSummary ? `       
                <div style="font-size:0.75rem;color:var(--accent2);font-weight:600;text-transform:uppercase;margin-bottom:0.4rem">📝 Summary</div>       
                <div style="font-size:0.88rem;color:var(--muted);line-height:1.5">${escapeHTML(displaySummary)}</div>       
              ` : ''}       
              ${conceptsHtml}     
            </div>       
          </div>`       
        : `<div class="topic-expand" id="expand-${safeDomId}" style="display:none">       
            <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border);font-size:0.85rem;color:var(--muted)">       
              No teaching notes saved yet.       
            </div>       
          </div>`;

      html += `<div class="topic-item" onclick="toggleTopicNotes(this, '${safeDomId}')" style="flex-direction:column;align-items:stretch">       
        <div style="display:flex;align-items:center;gap:1rem">       
          <div class="topic-id">${t.topic_id || tid}</div>       
          <div style="flex:1"><div class="topic-name">${escapeHTML(t.topic_name)}</div></div>       
          <span class="badge ${badge}">${label}</span>       
          <span class="arrow-indicator" style="font-size:0.75rem;color:var(--muted)">▼</span>       
        </div>       
        ${notesHtml}       
      </div>`;       
    });       
  });

  document.getElementById('topics-list').innerHTML = html;       
}

function toggleTopicNotes(el, safeId) {       
  const expand = document.getElementById('expand-' + safeId);       
  const arrow = el.querySelector('.arrow-indicator');       
  const isOpen = expand.style.display !== 'none';       
  expand.style.display = isOpen ? 'none' : 'block';       
  if(arrow) arrow.textContent = isOpen ? '▼' : '▲';       
}