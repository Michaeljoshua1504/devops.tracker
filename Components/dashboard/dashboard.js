// ── DASHBOARD LOGIC (Protected against missing data) ──       

async function loadDashboard() {       
  if(!sb) return;    
  try {    
    const [topicsRes, sessionsRes, mindsetRes] = await Promise.all([       
      sb.from('topic_status').select('*'),       
      sb.from('sessions').select('topic_id'),    
      sb.from('mindset_moments').select('id', { count: 'exact', head: true })    
    ]);

    if (topicsRes.error) {    
      console.error("Dashboard Topics Error:", topicsRes.error);    
      return;    
    }

    const sessionsMap = {};       
    if (sessionsRes.data) {       
      sessionsRes.data.forEach(s => { if(s.topic_id) sessionsMap[s.topic_id] = true; });       
    }

    let doneCount = 0;       
    const phase1Ids = ['1.1','1.2','1.3','1.4','1.5','1.6','1.7'];       
    const phase2Ids = ['2.1','2.2','2.3','2.4','2.5','2.6','2.7','2.8','2.9','2.10'];     
    let p1done = 0;       
    let p2done = 0;      
    let p38done = 0;

    topicsRes.data.forEach(t => {       
      let isDone = t.status === 'done' || !!sessionsMap[t.topic_id];       
      if (isDone) {       
        doneCount++;       
        if (phase1Ids.includes(t.topic_id)) p1done++;       
        else if (phase2Ids.includes(t.topic_id)) p2done++;      
        else p38done++;      
      }       
    });

    const mindsetCount = mindsetRes.count || 0;    
    const pct = Math.round((doneCount / 67) * 100);

    // Update DOM nodes
    document.getElementById('dash-done').textContent = doneCount;       
    document.getElementById('dash-pct').textContent = pct + '%';       
    document.getElementById('dash-mindset').textContent = mindsetCount;

    const p1pct = Math.round((p1done / 7) * 100);       
    document.getElementById('phase1-pct').textContent = p1pct + '%';       
    document.getElementById('phase1-bar').style.width = p1pct + '%';

    const p2pct = Math.round((p2done / 10) * 100);       
    document.getElementById('phase2-pct').textContent = p2pct + '%';       
    document.getElementById('phase2-bar').style.width = p2pct + '%';

    const p38pct = Math.round((p38done / 50) * 100);       
    document.getElementById('phase38-pct').textContent = p38pct + '%';       
    document.getElementById('phase38-bar').style.width = p38pct + '%';

    // Fetch Up Next
    const { data: nextTopics } = await sb       
      .from('topic_status')       
      .select('topic_id, topic_name')       
      .eq('status', 'next')       
      .limit(1);

    if(nextTopics && nextTopics.length > 0) {       
      const n = nextTopics[0];       
      document.getElementById('dash-next-topic').textContent = `Next: ${n.topic_id} — ${n.topic_name}`;       
      nextTopicGlobal = n;      
    } else {      
      document.getElementById('dash-next-topic').textContent = `All active streams caught up!`;      
      nextTopicGlobal = null;      
    }      
  } catch(e) {    
    console.error("Dashboard Crash Protected:", e);    
  }    
}

// ── SESSION MODAL CONTROLS ──

function openSessionModal() {
  const modal = document.getElementById('sessionModal');
  if (!modal) return;

  // 1. Auto-fill Date
  const dateInput = document.getElementById('session-date');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

  // 2. Auto-fill Current Time
  const timeInput = document.getElementById('session-time');
  if (timeInput) {
    const now = new Date();
    // Format to HH:MM for the HTML time input
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    timeInput.value = `${hh}:${mm}`;
  }

  // 3. Auto-fill Next Topic (Reads directly from your Dashboard "Up Next" widget)
  const nextTopicDiv = document.getElementById('dash-next-topic');
  const idInput = document.getElementById('session-topic-id');
  const nameInput = document.getElementById('session-topic-name');

  if (nextTopicDiv && idInput && nameInput) {
    let text = nextTopicDiv.innerText || '';
    
    // Remove the "Next: " prefix
    text = text.replace(/^Next:\s*/i, '').trim();

    // Split the text at the dash (handles both regular dashes "-" and em-dashes "—")
    const match = text.match(/^(.*?)\s*[-—]\s*(.*)$/);
    
    // Make sure it's not saying "Loading..." before filling the inputs
    if (match && !text.toLowerCase().includes('loading') && !text.toLowerCase().includes('completed')) {
      idInput.value = match[1].trim();   // Grabs the "1.5"
      nameInput.value = match[2].trim(); // Grabs the "Your first shell script"
    } else {
      idInput.value = '';
      nameInput.value = '';
    }
  }

  // Show the modal
  modal.classList.add('open');
}

function closeSessionModal() {
  const modal = document.getElementById('sessionModal');
  if (modal) modal.classList.remove('open');
}