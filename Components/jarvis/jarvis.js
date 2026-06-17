// 🟢 ==========================================
// 🟢 JARVIS AI LOGIC (GLOBAL WIDGET)
// 🟢 ==========================================

function toggleJarvis() {
  const widget = document.getElementById('jarvis-widget');
  const fab = document.getElementById('jarvis-fab');
  
  if (widget.style.display === 'none' || widget.style.display === '') {
    widget.style.display = 'flex';
    fab.style.transform = 'scale(0.9)'; 
    setTimeout(() => fab.style.transform = 'scale(1)', 150);
  } else {
    widget.style.display = 'none';
  }
}

// ── SEND MESSAGE & SECURE SUPABASE ENGINE ──
async function jSend() {
  const inputEl = document.getElementById('j-input');
  const text = inputEl.value.trim();
  if (!text) return;

  const msgsContainer = document.getElementById('j-msgs');

  // 1. Instantly inject the User's message (Blue Bubble)
  msgsContainer.innerHTML += `
    <div class="j-msg" style="display: flex; gap: 12px; justify-content: flex-end;">
      <div class="j-bubble" style="padding: 10px 14px; border-radius: 12px; background: var(--accent-blue); color: white; border: 1px solid var(--accent-blue); max-width: 85%; font-size: 0.9rem; line-height: 1.4;">
        ${escapeHTML(text)}
      </div>
    </div>
  `;

  // Clear input box and scroll to bottom
  inputEl.value = '';
  msgsContainer.scrollTop = msgsContainer.scrollHeight;

  // 2. Show Jarvis "Thinking..."
  const typingId = 'typing-' + Date.now();
  msgsContainer.innerHTML += `
    <div id="${typingId}" class="j-msg" style="display: flex; gap: 12px;">
      <div class="j-bubble" style="padding: 10px 14px; border-radius: 12px; background: var(--surface2); border: 1px solid var(--border); max-width: 85%; font-size: 0.9rem; color: var(--muted); font-style: italic;">
        Connecting to Jarvis Core...
      </div>
    </div>
  `;
  msgsContainer.scrollTop = msgsContainer.scrollHeight;

  // 3. Call your secure Supabase Edge Function!
  try {
    // This securely points to the edge function we just deployed
    const { data, error } = await sb.functions.invoke('jarvis-chat', {
      body: { message: text }
    });

    // Remove "Thinking..." bubble
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    if (error) throw new Error(error.message);

    // LOG THE RAW DATA TO THE CONSOLE FOR DEBUGGING
    console.log("RAW SUPABASE DATA:", data);

    // Extract the AI's reply from the edge function data
    let aiReply = "Error: Could not parse response.";
    if (data && data.choices && data.choices.length > 0) {
      aiReply = data.choices[0].message.content;
    } else if (data && data.error) {
      // Catch standard Groq errors
      aiReply = "Groq API Error: " + (data.error.message || JSON.stringify(data.error));
    } else {
      // If the data is completely unrecognizable, print the raw data to the screen!
      aiReply = "Unknown Backend Response: " + JSON.stringify(data);
    }

    // 4. Inject Jarvis's real response
    msgsContainer.innerHTML += `
      <div class="j-msg" style="display: flex; gap: 12px;">
        <div class="j-bubble" style="padding: 10px 14px; border-radius: 12px; background: var(--surface2); border: 1px solid var(--border); max-width: 85%; font-size: 0.9rem; color: var(--text); line-height: 1.4; white-space: pre-wrap;">
          ${escapeHTML(aiReply)}
        </div>
      </div>
    `;

  } catch (error) {
    // Handle Network Errors
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    msgsContainer.innerHTML += `
      <div class="j-msg" style="display: flex; gap: 12px;">
        <div class="j-bubble" style="padding: 10px 14px; border-radius: 12px; background: rgba(255, 69, 58, 0.1); border: 1px solid var(--red); max-width: 85%; font-size: 0.9rem; color: var(--red); line-height: 1.4;">
          Network Error: Failed to reach Jarvis Core. Check console.
        </div>
      </div>
    `;
    console.error("Edge Function Error:", error);
  }

  // Auto-scroll to the newest message
  msgsContainer.scrollTop = msgsContainer.scrollHeight;
}