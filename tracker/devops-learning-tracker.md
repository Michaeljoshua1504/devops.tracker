# DevOps + AI + Multi-Cloud Learning Tracker

> Upload this file to your Claude Project. At the start of every session, Claude reads this and continues exactly where we left off.

---

## Our Approach (Never Change This)

### Core Principles
- **One topic per session**
- **Concept first, always** — understand the PROBLEM before touching any tool
- **Tool-independent thinking** — learn ideas so deeply you can pick up ANY tool, not just one specific one
- **AI woven in from day one** — not a separate advanced topic, but part of everything
- **Multi-cloud from the start** — AWS, Azure, GCP compared side by side
- **Simple language, real-world analogies**
- **One hands-on exercise per session**
- **Mini-Project Rule:** Every topic MUST have a mini-project. A topic is only marked ✅ Done AFTER the mini-project code is built and successfully pushed to the `devops-portfolio` GitHub repo.
- **Mini-Project Folder Creation Rule:** Every mini-project section MUST include the full terminal steps to create the correct folder inside devops-portfolio BEFORE copying the script or pushing to GitHub. These steps must never be omitted or provided separately after the fact. The sequence is always: create folder → copy file → cd into folder → verify → git push.
- **Mini-Project Verification:** Before marking any mini-project complete, Claude must ask Mikey to confirm the script/code actually ran successfully in his terminal — pushing to GitHub alone is not enough confirmation.
- **No Silent Status Changes:** Claude must never mark a topic ✅ Done on its own initiative, even if teaching and practice felt complete. A topic only moves to ✅ Done when Mikey explicitly says "Topic X.X is done. Update the tracker file."
- **Python only when it relates to a real DevOps task**
- **Always explain WHY a tool exists before HOW to use it**
- **Security is not a phase — it is a thread.** Every topic from Phase 1 onward includes a security lens. When we learn networking, we ask: how can this be attacked? When we write scripts, we ask: are passwords hardcoded? When we build pipelines, we add automated scanning.

### What "Concept First, Tool Independent" Means
Before learning any tool, we answer:
- What PROBLEM does this solve?
- What would happen if this tool did not exist?
- If this tool disappeared tomorrow, could I use another one?

### What "AI + DevOps" Actually Means
There are two layers — you need both:

**Layer 1 — AI as your learning co-pilot (starts today)**
Use AI (Claude, ChatGPT, Copilot, Gemini) while you learn and work.

**Layer 2 — AI built into DevOps work itself (learned progressively)**
- Use AI tools to write infrastructure code faster
- Build pipelines that automatically scan code using AI
- Set up systems where AI watches servers and predicts failures
- Call AI APIs (Claude, OpenAI, Gemini, Groq) from scripts to automate decisions
- Deploy and manage AI models in the cloud

---

## How to Use This File

1. After every session/topic, update the status of that topic and add detailed session notes
2. Save the updated file
3. At the start of the next chat, paste this exact message:

> "Here is my updated learning tracker. Read it and continue from where we left off."

---

## Detecting Which Mode We're In (Topic Learning vs. Problem-Solving)

There are two separate flows in this file: regular **Topic/Curriculum sessions** (Master Topic List, one topic at a time) and **Multi-Day Problem/Situation Mode** (debugging or building something outside the curriculum, e.g. tracker app issues).

Claude must figure out which mode applies **before** doing any real work, using this logic:

1. **If Mikey's opening message makes the mode obvious, just proceed — do not ask.**
   - Examples that are obviously a Topic session: "continue the curriculum," "let's continue from where we left off," pasting this tracker file with no other context.
   - Examples that are obviously Problem Mode: describing a specific bug or issue ("the Jarvis button broke again"), saying "we're solving a problem today," asking to build/fix something outside the Master Topic List.
2. **If the opening message is ambiguous** (e.g. just "hey," "let's keep working," or anything that doesn't clearly signal either mode), **Claude must stop and ask:**
   > "Is this a learning/curriculum day, or a problem-solving day?"

   Claude does not guess in ambiguous cases — it asks once, then commits to whichever mode Mikey states for the rest of that conversation.
3. Once a mode is set for a conversation, Claude stays in that mode unless Mikey explicitly says otherwise (e.g. switching mid-conversation from a topic to a side bug, or vice versa).

---

Once the mini-project for the current topic has been built and pushed to GitHub, say exactly this to Claude:

> **"Topic X.X is done. Update the tracker file."**

(Replace X.X with the topic number, e.g. "Topic 1.5 is done. Update the tracker file.")

**When Claude receives this message, Claude must:**
1. Change that topic's status to ✅ Done in the Master Topic List
2. Add session notes to that topic's row
3. Add a new row to the Session History table
4. Add any new entries to the Mindset Moments table
5. Update the Current Status section (last completed topic, next topic, total completed)
6. Update the "Last updated" line at the bottom of the file
7. Produce the fully updated tracker file as a downloadable `.md` file

**What you do after that:**
- Download the updated `.md` file
- Replace the old tracker file in your Claude Project with this new one

One sentence triggers the full update — you never need to re-explain what needs to change.

---

## Multi-Day Problem/Situation Mode (Separate From Topic Sessions)

This mode is for when Mikey and Claude work across multiple days on a **problem or situation** (e.g. debugging the tracker app, building a feature) rather than a curriculum topic. It runs in parallel to the Topic flow above and uses its own triggers.

### Check-in Behavior During the Work

- Claude does not have a live clock and cannot watch time pass on its own. Claude tracks rough elapsed time based on how much active back-and-forth has happened in the conversation.
- Roughly every 3–4 hours of active work (approximate, not a literal stopwatch), Claude should proactively check in — e.g. "We've been at this a while — want to keep going, or call it a day?"
- If Mikey says it's not done yet (e.g. "it's only 6 or 7, let's keep going"), Claude continues working normally and checks in again after another stretch. Claude does not push or repeat the question immediately.
- If Mikey says "Day X end" (whether prompted by Claude's check-in or said unprompted at any time), that is the trigger for the Daily Output below.

### Daily Output — Triggered by "Day X end"

When Mikey says **"Day X end,"** Claude must produce exactly **two separate downloadable files** covering ONLY that day's work:

**File 1 — All Tabs Except War Room** (one combined file):
- Session Log
- Portfolio / Mini Project (if applicable that day)
- Mindset Moments
- Daily Log / Journal
- Terminal Cmds (deduped per the normal Terminal Cmds rule — see Section 5 below — only commands not already logged in a previous day or topic)

**File 2 — War Room Report** (separate file):
- Full detailed report of that day's work: what problem was being solved, what was tried, what worked, what didn't, current state at end of day (fully solved / partially solved / new issue discovered)
- Every command actually used that day, listed in full — the Terminal Cmds dedup rule does NOT apply here. Repeated commands (`ls`, `cd`, `chmod +x`, etc.) are still listed if they were actually used.

Daily reports are isolated — Day 1's report content is never repeated inside Day 2's report. Each daily file covers only that day.

Claude tells Mikey to download and save both files after producing them.

### Final Day Output — Triggered by "All done"

When Mikey says **"all done"** (or equivalent, signaling the problem/situation is fully resolved), Claude must:
1. Ask Mikey to paste in the saved daily reports from all previous days in this stretch (could be 2 days, could be more)
2. Wait for Mikey to paste them
3. Combine the pasted prior days' reports with the final day's live conversation into **one single, complete, final report** covering the entire multi-day stretch, across all 6 tabs (Session Log, Portfolio, Mindset Moments, Daily Log, Terminal Cmds, War Room)
4. This final combined report is the ONLY place where all days appear together — it replaces needing to separately reference each day's individual files afterward
5. Produce this as downloadable file(s) — Terminal Cmds dedup applies to the combined Session Log/tabs file; War Room dedup never applies, per the normal rules

**Accuracy Rule applies fully here too:** Claude builds this final report only from what Mikey actually pasted and what is actually in the live conversation — never inventing or filling gaps with plausible-sounding details for days Claude doesn't have real information about.

---

## Problem-Solving Framework (Always Apply This)

1. **Observe** — What is actually happening?
2. **Ask why** — Five times if needed. Find the root cause.
3. **Isolate** — Change one thing at a time.
4. **Verify** — Prove it is fixed. Do not assume.
5. **Document** — Write down what broke and how you fixed it.

---

## Accuracy Rule (Never Skip This)

Claude must base every Session Log, Mindset Moment, Daily Log, Terminal Cmd, and War Room report **only on what was actually discussed, taught, run, or built in the real conversation.**

- Never infer, assume, or invent architecture, commands, tools, error messages, or outcomes that were not explicitly part of the session.
- If Claude is unsure whether something happened (e.g. uncertain if a command was actually run, or whether a tool was actually used), Claude must ask Mikey to confirm rather than filling in a plausible-sounding detail.
- "Sounding professional or detailed" is never a reason to add content that didn't happen. A short, accurate report is always better than a long, embellished one.

---

## Explain Before Implementing Rule (Never Skip This)

In both **Problem Mode** and **Topic Mode**, whenever Mikey asks Claude to change, fix, add, or build anything — Claude must first explain what it is going to change and why, then **stop and wait** for Mikey to confirm before writing or pushing any code.

- Claude explains the change in plain English: what file(s) will be touched, what specifically will be different, and why that solves the problem.
- If Claude has misunderstood, Mikey will correct it. Claude must then re-explain based on the correction and wait again.
- This loop repeats — explain → wait → correct if needed → explain again — until Mikey explicitly says **"yes"** or **"correct"** or equivalent confirmation.
- Only after that confirmation does Claude proceed to implement.
- This rule applies to every change, no matter how small. A one-line fix still gets explained first.

---

## Goal-Based Fix Loop Rule

When Mikey gives Claude a **goal** to fix or implement (rather than a specific one-shot change), Claude operates in a loop until that goal is fully reached:

1. **Diagnose** — understand the root cause before writing any code
2. **Fix** — implement the change
3. **Self-test** — verify the fix logically (simulate the flow, check for edge cases, confirm no regressions)
4. **If the goal is not yet reached** — loop back to step 1 with the new information and fix again
5. **Only report back to Mikey when the goal is confirmed reached** — not after each individual attempt

**What counts as a goal:**
- "Fix the sort persistence — it's still not working"
- "Make the date show on mindset cards"
- "Get the push working across all tabs"

**What is NOT a goal (these still follow Explain Before Implementing):**
- "Change the label on this button"
- "Add a count to the title"
- Any specific one-shot change where the expected outcome is obvious

**During the loop:**
- Claude does not ask for permission between loop iterations
- Claude does not narrate each individual attempt unless it hits a dead end and genuinely needs Mikey's input (e.g. needs to know what the browser console says)
- Claude self-tests after each fix before deciding whether to loop again
- If Claude loops more than 3 times without reaching the goal, it stops and reports the situation honestly to Mikey rather than continuing blindly

---

## Handoff Checkpoint Rule (Problem Mode Only — Auto, Silent, No Command Needed)

During any Problem Mode session, Claude must silently update the **Handoff Note** section of this tracker file at each of these checkpoints — without being asked, without narrating it, just do it:

1. **Bug/problem identified** — when the root cause or symptom is clearly understood
2. **Fix attempted** — whether it passed or failed, update with what was tried and the outcome
3. **Code pushed to GitHub** — update FILES TOUCHED with what was pushed
4. **New problem discovered mid-session** — update CONTEXT and NEXT STEP immediately
5. **Problem fully resolved** — set STATUS to `clear` and reset all fields to `—`

**Topic Mode checkpoints (also auto, also silent):**

6. **Mini-project started** — set STATUS to `active`, CONTEXT to what is being built, NEXT STEP to the immediate next action
7. **Error hit during mini-project or exercise** — update ROOT CAUSE with the error, TRIED with what was attempted, NEXT STEP with what to try next
8. **Mini-project successfully pushed** — set STATUS to `clear` and reset all fields to `—`

**How to update the Handoff Note:**
- Fetch the current tracker file from GitHub (same as session start)
- Update only the Handoff Note section fields — do not touch anything else
- Push the updated tracker file back to GitHub immediately
- Do this silently — no narration, no "I'm updating the handoff note" — just do it in the background

**What account #2 does on session start:**
- Fetch the tracker file as normal
- Check the Handoff Note STATUS field first
- If STATUS is `active`: announce to Mikey — "We were mid-session on [CONTEXT]. Last known state: [ROOT CAUSE]. Next step was: [NEXT STEP]. Picking up from there." — then proceed
- If STATUS is `clear`: proceed with normal session start (curriculum or problem mode as usual)

**Handoff Note field definitions:**
- `STATUS`: either `active` (mid-problem) or `clear` (nothing in progress)
- `LAST UPDATED`: timestamp of last update in format `DD Mon YYYY HH:MM`
- `MODE`: `Problem Mode` or `Topic Mode`
- `CONTEXT`: one sentence — what problem/task we are working on
- `ROOT CAUSE`: what we know about why the problem exists (or `investigating` if not yet known)
- `TRIED`: comma-separated list of approaches already attempted this session
- `NEXT STEP`: the single most immediate next action to take
- `FILES TOUCHED`: comma-separated list of files already modified/pushed this session

---

## Master Topic List (67 Topics Total)

### Phase 1 — Foundations (How Computers Think)

| # | Topic | Status | Session Notes |
|---|-------|--------|---------------|
| 1.1 | How computers work — input, processing, output mental model | ✅ Done | Computer = city analogy. Hardware vs OS vs apps. Input → Process → Output. ATM example. Why Linux: free, stable, lightweight, open source. |
| 1.2 | The terminal — what it is and why it exists | ✅ Done | Terminal = direct line to OS. Mayor analogy. Commands vs clicking. Servers are text-only. AI as co-pilot from day one. |
| 1.3 | Terminal hands-on — navigating like a detective | ✅ Done | Learned to navigate file system like a detective. pwd, ls, cd, cd .., cd ~. Explored /etc/ folder. |
| 1.4 | Files and folders — how computers organise everything | ✅ Done | File = named container. Folder = tree structure. Absolute vs relative paths. /etc/ for config, /var/log/ for logs. Permission denied = first preview of Topic 1.7. |
| 1.5 | Your first shell script — making the computer do a task for you | ✅ Done | Shebang, variables, command substitution $(), echo, nano, chmod +x, ./script.sh. Mini-project: server_report.sh — a formatted server briefing script. Pushed to Phase-1-Foundations/Topic-1.5-Shell-Script/ in devops-portfolio. Security lens: never hardcode credentials in scripts. AI lens: command substitution is the same pattern used later to capture AI API responses in scripts. |
| 1.6 | Processes — what is actually running inside your computer | ✅ Done | Process vs program analogy (recipe vs cooking). PID, parent-child processes, foreground vs background, process states (Running/Sleeping/Zombie). ps aux column breakdown. Mac vs Linux ps syntax difference (BSD -r/-m vs GNU --sort). Mini-project: process_monitor.sh — reports top 5 CPU, top 5 memory, total process count. 742 processes confirmed running. Pushed to Phase-1-Foundations/Topic-1.6-Processes/. Security lens: processes are the first thing inspected in incident response. AI lens: AIOps tools monitor process data at scale. |
| 1.7 | Permissions — who is allowed to do what, and why this matters in security | ✅ Done | Apartment building analogy for locks. Three actors: owner, group, others. Three permissions: read (r), write (w), execute (x). Numeric chmod system (r=4, w=2, x=1). ls -l permission string decoding — dashes are placeholders within each group's 3 fixed slots, not separators between groups. chmod 600 for secrets, chmod 755 for scripts. Root/sudo. Principle of least privilege. find command with -perm flags for security auditing. Mini-project: permissions_audit.sh — scans for world-writable files, executables, full permission listing. Ran against ~/  — clean result, spotted Android emulator executable. Pushed to Phase-1-Foundations/Topic-1.7-Permissions/. |

---

### Phase 2 — Networking + Cloud Fundamentals

| # | Topic | Status | Session Notes |
|---|-------|--------|---------------|
| 2.1 | How the internet works — the problem it was solving | ✅ Done | Packets and routing — the two core decisions the internet is built on. Private vs public IP ranges (192.168.x.x, 10.x.x.x). DNS as the phone book. HTTPS encrypts the pipe but not the endpoints. traceroute hands-on — decoded every hop from Bangalore home router through Airtel backbone to Google's network. Mini-project: network_detective.sh — reports connectivity, local IP, public IP, and full traceroute. Pushed to Phase-2-Networking-and-Cloud-Fundamentals/Topic-2.1-How-the-Internet-Works/. Security lens: HTTPS limitations — server compromise, DNS poisoning, certificate theft, endpoint malware. AI lens: AI companies manage the same network infrastructure at massive scale — AIOps monitors it in Phase 8. |
| 2.2 | IP addresses, DNS, ports — how computers find each other | ⬜ Not started | |
| 2.3 | What is "the cloud" — really | ⬜ Not started | |
| 2.4 | AWS vs Azure vs GCP — same problems, different names | ⬜ Not started | |
| 2.5 | Virtual machines — renting a computer in someone else's building | ⬜ Not started | |
| 2.6 | Storage in the cloud — S3, Blob, GCS compared | ⬜ Not started | |
| 2.7 | Networking in the cloud — VPCs, subnets, security groups | ⬜ Not started | |
| 2.8 | Cloud Security & IAM — who is allowed to do what across AWS, Azure, GCP | ⬜ Not started | |
| 2.9 | Managed Databases & Serverless Compute | ⬜ Not started | |
| 2.10 | FinOps — understanding and controlling cloud costs | ⬜ Not started | |

---

### Phase 3 — Python for DevOps Tasks

| # | Topic | Status | Session Notes |
|---|-------|--------|---------------|
| 3.1 | Why Python — the problem it solves for DevOps | ⬜ Not started | |
| 3.2 | Variables, logic, loops — teaching the computer to think | ⬜ Not started | |
| 3.3 | Reading and writing files with Python | ⬜ Not started | |
| 3.4 | Talking to APIs with Python — how services communicate | ⬜ Not started | |
| 3.5 | Using AI APIs — calling Claude, OpenAI from a script | ⬜ Not started | |
| 3.6 | Cloud SDKs — controlling AWS, Azure, GCP with Python | ⬜ Not started | |
| 3.7 | Libraries for DevOps — boto3, requests, and real automation tasks | ⬜ Not started | |

---

### Phase 4 — Git and Version Control

| # | Topic | Status | Session Notes |
|---|-------|--------|---------------|
| 4.1 | The problem Git solves — why saving files is not enough | ⬜ Not started | |
| 4.2 | Repositories, commits, branches — the core concepts | ⬜ Not started | |
| 4.3 | GitHub — storing your work in the cloud | ⬜ Not started | |
| 4.4 | Collaborating — pull requests, code review | ⬜ Not started | |
| 4.5 | Remote repositories and collaboration workflows | ⬜ Not started | |

---

### Phase 5 — Docker and Containers

| # | Topic | Status | Session Notes |
|---|-------|--------|---------------|
| 5.1 | The "works on my machine" problem | ⬜ Not started | |
| 5.2 | What a container actually is — the shipping container analogy | ⬜ Not started | |
| 5.3 | Writing a Dockerfile — packaging your app | ⬜ Not started | |
| 5.4 | Container registries — AWS ECR, Azure ACR, GCP Artifact Registry | ⬜ Not started | |
| 5.5 | Docker Volumes and Persistent Data | ⬜ Not started | |
| 5.6 | Multi-Container Apps with Compose | ⬜ Not started | |

---

### Phase 6 — CI/CD Pipelines

| # | Topic | Status | Session Notes |
|---|-------|--------|---------------|
| 6.1 | The problem — why manual deployment is dangerous | ⬜ Not started | |
| 6.2 | What CI/CD means in plain English | ⬜ Not started | |
| 6.3 | GitHub Actions — your first pipeline | ⬜ Not started | |
| 6.4 | Deploying to AWS, Azure, GCP with a pipeline | ⬜ Not started | |
| 6.5 | AI in pipelines — automated code review, security scanning | ⬜ Not started | |
| 6.6 | Automated Image Building and Pushing | ⬜ Not started | |
| 6.7 | Deployment Strategies | ⬜ Not started | |
| 6.8 | Pipeline Monitoring and Notifications | ⬜ Not started | |
| 6.9 | DevSecOps in pipelines — automated vulnerability scanning, secrets detection | ⬜ Not started | |

---

### Phase 7 — Infrastructure as Code + Kubernetes

| # | Topic | Status | Session Notes |
|---|-------|--------|---------------|
| 7.1 | Terraform — infrastructure as code | ⬜ Not started | |
| 7.2 | Terraform with AWS, Azure, GCP | ⬜ Not started | |
| 7.3 | Kubernetes — managing containers at scale | ⬜ Not started | |
| 7.4 | Managed Kubernetes — EKS (AWS), AKS (Azure), GKE (GCP) | ⬜ Not started | |
| 7.5 | K8s Services and Networking | ⬜ Not started | |
| 7.6 | ConfigMaps and Secrets | ⬜ Not started | |
| 7.7 | Helm Package Manager | ⬜ Not started | |
| 7.8 | GitOps with ArgoCD | ⬜ Not started | |
| 7.9 | Advanced Orchestration Configurations | ⬜ Not started | |
| 7.10 | Security scanning for IaC — finding exposed passwords and misconfigurations in Terraform | ⬜ Not started | |

---

### Phase 8 — Monitoring, Observability, AIOps + MLOps

| # | Topic | Status | Session Notes |
|---|-------|--------|---------------|
| 8.1 | Logs, metrics, traces — the three pillars of observability | ⬜ Not started | |
| 8.2 | Monitoring tools across clouds — CloudWatch, Azure Monitor, GCP Operations | ⬜ Not started | |
| 8.3 | AIOps — using AI to detect and fix problems automatically | ⬜ Not started | |
| 8.4 | AI models in the cloud — Bedrock (AWS), Azure OpenAI, Vertex AI (GCP) | ⬜ Not started | |
| 8.5 | Log Aggregation and Pipelines | ⬜ Not started | |
| 8.6 | Anomaly Detection and Systems Alerting | ⬜ Not started | |
| 8.7 | Automated Incident Remediation Scripting | ⬜ Not started | |
| 8.8 | MLOps — model versioning, registries, data pipelines for LLMs | ⬜ Not started | |
| 8.9 | Model drift — detecting when your AI quietly stops working correctly | ⬜ Not started | |
| 8.10 | GPU infrastructure — how AI workloads scale differently from normal apps | ⬜ Not started | |
| 8.11 | AI-powered alert summariser — building the real thing | ⬜ Not started | |
| 8.12 | Disaster recovery and chaos engineering — what happens when a cloud region dies | ⬜ Not started | |
| 8.13 | Incident response and post-mortems — blameless culture, how outages become improvements | ⬜ Not started | |

---

## Handoff Note (Auto-Updated — Do Not Edit Manually)

> This section is automatically maintained by Claude during Problem Mode sessions.
> It is updated silently at key checkpoints so that if the usage limit hits mid-session,
> account #2 can pick up exactly where account #1 left off.

```
STATUS: clear
LAST UPDATED: —
MODE: —
CONTEXT: —
ROOT CAUSE: —
TRIED: —
NEXT STEP: —
FILES TOUCHED: —
```

---

## Current Status

- **Last completed topic:** 2.1 — How the internet works — the problem it was solving
- **Next topic:** 2.2 — IP addresses, DNS, ports — how computers find each other
- **Phase:** 2 — Networking + Cloud Fundamentals
- **Total topics completed:** 8 of 67

## Current Skill Snapshot

A quick read for any session to orient fast, without scanning the full topic table.

- **Comfortable with:** Terminal navigation (pwd, ls, cd and variants), file/folder structure, absolute vs relative paths, basic permission errors, navigating the tracker app's own codebase at a surface level. Shell scripting fundamentals — shebang, variables, command substitution $(), echo, chmod +x, nano, running scripts with ./. Process inspection and control — ps aux, ps aux -r, ps aux -m, top, kill, jobs, background processes with &. Reading ps aux output columns. Mac vs Linux syntax differences in ps and wc. File permissions — owner/group/others, rwx, chmod numeric system (600, 755), ls -l permission string decoding, root/sudo, principle of least privilege, find command with -perm flags. Networking fundamentals — packets, routing, hops, private vs public IP ranges, DNS, HTTPS and its limitations, traceroute output reading.
- **In progress:** Nothing currently in progress — Topic 2.1 fully complete. Starting Topic 2.2 next.
- **Not yet covered:** IP addresses and DNS deep dive, all of cloud, Python, Git/GitHub fundamentals, Docker, CI/CD, Terraform/Kubernetes, monitoring/MLOps.
- **Outside the curriculum but real hands-on experience:** Building/debugging the tracker web app itself (HTML/CSS/JS, Supabase) and the Jarvis AI assistant integration — this happened in parallel to the curriculum, not as part of it. Claude should not assume curriculum topics (e.g. Git, CI/CD, APIs) are "done" just because they appeared in this side project; they still need to be formally taught in their proper phase.

---

## Ecosystem Status

**1. Tracker Web App**
- **URL:** michaeljoshua1504.github.io/devops.tracker
- **GitHub:** github.com/Michaeljoshua1504/devops.tracker
- **Backend:** Supabase (6 tables)
- **Status:** All tabs (Dashboard, Session Log, Topics, Portfolio, Mindset, Daily Log, Terminal Cmds, War Room) are 100% working.
- **Jarvis:** Fixed. It is now a functioning floating button, not a tab.

**2. Portfolio Repository**
- **URL:** github.com/Michaeljoshua1504/devops-portfolio
- **Purpose:** Storage for all end-of-topic mini-projects.
- **Structure Rule:** `Phase-X-Name/Topic-X.X-Name/` (e.g., `Phase-1-Foundations/Topic-1.5-Health-Check/`)

---

## End of Session Output Format (Claude Must Follow This Exactly)

After the topic is taught AND the mini-project is pushed to GitHub, Claude must generate all session outputs below in this exact structure, ready for copy-paste into the Tracker App.

---

### 1. SESSION LOG — Save Completed Session

**Instructions for Claude:**
The Full Teaching Notes must be detailed and complete. If someone read only the teaching notes, they should be able to fully understand the topic without needing anything else. Include:
- The problem the topic solves (why it exists)
- Every concept taught, with full explanation
- All analogies used
- All code blocks shown during the session
- The security lens point for this topic
- The AI lens point for this topic
- Key decisions or corrections made during the session

```
DATE:
TIME:
TOPIC ID:
TOPIC NAME:
FULL TEACHING NOTES:
SUMMARY (2 TO 3 LINES MAX):
KEY CONCEPTS (COMMA SEPARATED):
```

---

### 2. PORTFOLIO — Add Portfolio Project

```
TITLE:
TOPIC ID:
DESCRIPTION:
TECH STACK:
GITHUB URL: (Direct link to the specific topic folder in devops-portfolio)
```

---

### 3. MINDSET MOMENTS — Add Mindset Moment

**Instructions for Claude — How to identify Mindset Moments:**
During every session, watch for these signals and flag them as Mindset Moments:
- Mikey asks a question that shows he is thinking about the "why" not just the "how"
- Mikey makes a connection between two concepts on his own without being prompted
- Mikey pushes back or questions something instead of just accepting it
- Mikey proposes an improvement, addition, or alternative approach
- A concept suddenly clicks and Mikey demonstrates he understands it deeply
- A mistake is made, caught, and the root cause is understood — not just the fix
- Mikey thinks about scale, security, cost, or future implications without being asked

Capture every moment that qualifies. There may be 1 or there may be 5 per session. Do not miss them. One block per moment.

**INSIGHT SOURCE rule:** Ask one question before writing this field — "Did Mikey already know this, or did Claude have to explain it?" If Mikey spotted it, caught it, or figured it out unprompted → `Me`. If Mikey asked a question and Claude explained the answer → `AI`. The rating captures how sharp the question was. The source captures where the knowledge came from. These are two separate things — never conflate them.

**INSIGHT / OUTCOME rule:** When INSIGHT SOURCE is `Me` — write what Claude did in response to Mikey's catch (verified, corrected, updated memory, fixed code, etc). When INSIGHT SOURCE is `AI` — write the actual substance of what Claude explained or taught in response to Mikey's question. The framing must match who generated the insight — never write the same way regardless of source. In the tracker app UI, the field label changes dynamically: `Outcome / Action Taken` when source is Me, `What Claude Explained` when source is AI.

```
DATE:
TIME:
MOMENT TYPE: (either Question or Situation — one specific value, never both written together)
INSIGHT SOURCE: (AI or Me)
QUESTION OR SITUATION:
RATING: (Good Direction or Strong Instinct)
CONCEPT / TAG:
LINKED TOPIC:
INSIGHT / ACTION TAKEN:
```

---

### 4. DAILY LOG — Journal Entry

**Instructions for Claude:**
The Daily Log is a short, personal, minimal journal entry. It is NOT a technical document.
Write it like a personal diary — what happened today, what was built, what clicked, what felt hard.
Maximum 3 to 5 short paragraphs. No code blocks. No bullet lists. Just plain human language.
Think of it as: "If Mikey looked back at this in a year, would it remind him of how this day felt?"

```
DATE:
AUTHOR: Michael Joshua
TITLE:
LINKED TOPIC:
ENTRY:
```

---

### 5. TERMINAL CMDS — Add Command

**Instructions for Claude:**
Every single command used during the session must be logged here — not just the main ones.
This includes commands used during:
- The teaching/explanation phase
- The hands-on exercise
- The mini-project build
- Any bug fixing or problem solving

If 10 commands were used, 10 blocks get produced. One block per command. No command gets skipped.

**Dedup Rule:** Only log a command in the Terminal Cmds tab the FIRST time it ever appears across all sessions. If a command (e.g. `ls`, `cd`, `chmod +x`) is used again in a later session, do NOT create a duplicate block here — it's already in the runbook. Just continue using it normally in teaching.
**This dedup rule applies ONLY to the Terminal Cmds tab.** It does NOT apply to the War Room report — see Section 6 below.

```
COMMAND TEXT:
CATEGORY: (Linux / Git / Docker / Kubernetes / Terraform / Python / Cloud CLI)
TOPIC REFERENCE:
MEANING / WHAT IT DOES:
EXAMPLE USAGE:
FUTURE NOTES: (Which future topics will this command appear in again? e.g. "Used again in Topic 4.2, Topic 6.3")
SECURITY NOTES:
LINKED COMMANDS:
```

---

### 6. WAR ROOM — New Report

**Instructions for Claude:**
The War Room report is the complete, detailed archive of the session. It is the opposite of the Daily Log.
The Daily Log is minimal and personal. The War Room report is thorough and technical.

For a Build Report (clean teaching session), include ALL of the following:
- What topic was taught and what real-world problem it solves
- Full explanation of every concept covered
- The mini-project: what it is, why it was built, how it was built step by step
- Every command used, with what it does and why it was used — including commands repeated from earlier sessions (e.g. `ls`, `cd`, `chmod +x`). **The Terminal Cmds dedup rule does NOT apply here. The War Room report always lists every command actually used in this session, new or repeated, with nothing skipped.**
- All key notes and decisions made during the session
- Security lens: what security consideration was introduced
- AI lens: how AI connects to this topic
- Mindset moments from the session (brief: just the question or situation and the insight)
- Any issues or errors hit during the session and exactly how they were fixed

For a Bug/Issue Report, include:
- What broke and when
- The exact error or symptom observed
- Root cause analysis (the "why" behind the problem)
- Every step taken to investigate
- The fix applied
- How the fix was verified
- What to watch for in future to prevent recurrence
- AI lens: how AI connects to this problem or solution (required — never skip this, even in Problem Mode)

Claude must produce TWO things for every War Room entry — in this exact order:

**Part 1 — Form Fields (paste these into the War Room UI form):**
```
DATE:
REPORT TYPE: (Build Report / Bug Issue / Deep Dive / Incident Post-Mortem)
TITLE:
ERROR CODE: (if applicable, otherwise leave blank)
SOLUTION / FIX: (short plain-English summary of what was built or fixed — 2 to 4 sentences max)
```

**Part 2 — Detailed Report File:**
Claude produces the full detailed .md file covering everything listed above (concepts, commands, security lens, AI lens, mindset moments, etc). Mikey attaches this file to the "ATTACH DETAILED AI REPORT" field in the War Room UI form.

---

## Session History

| Session | Date | Topic | Key Concepts |
|---------|------|-------|--------------|
| 1 | 25 May 2026 | 1.1 — How computers work | Hardware vs OS vs apps, Input → Process → Output, Linux for servers, Problem-solving framework |
| 2 | 25 May 2026 | 1.2 — The terminal | Terminal vs shell vs command line, Commands vs clicking, Servers are text-only, AI as co-pilot |
| 3 | 03 Jun 2026 | 1.3 — Terminal hands-on | pwd, ls, cd, cd .., cd ~, navigating like a detective, exploring /etc/ |
| 4 | 03 Jun 2026 | 1.4 — Files and folders | Files, folders, paths, absolute vs relative, /etc/, /var/log/, permission denied preview |
| 5 | 09 Jun 2026 | Tracker debugging | Fixed blank tabs, fixed markdown escape characters, full DB audit, Jarvis fixed as floating button |
| 6 | 18 Jun 2026 | 1.5 — Shell scripts (teaching) | Shebang, variables, echo, chmod +x, ./script.sh, nano editing, security lens on hardcoded passwords, health_check.sh practice built. Mini project pending. |
| 7 | 22 Jun 2026 | 1.5 — Shell scripts (mini-project) | Built server_report.sh using variables, command substitution $(), echo, nano, chmod +x, ./ — pushed to devops-portfolio. Topic 1.5 marked complete. |
| 8 | 23 Jun 2026 | 1.6 — Processes | Process vs program, PID, parent-child, foreground vs background, process states, ps aux column reading, Mac vs Linux syntax, kill, jobs, &. Built process_monitor.sh. 742 processes confirmed. |
| 9 | 25 Jun 2026 | 1.7 — Permissions | Owner/group/others, rwx, numeric chmod (600/755), ls -l decoding, root/sudo, principle of least privilege, find with -perm flags. Built permissions_audit.sh. Phase 1 complete. |
| 10 | 29 Jun 2026 | 2.1 — How the internet works | Packets, routing, hops, private vs public IP ranges, DNS, HTTPS and its limitations, traceroute output decoded hop by hop. Built network_detective.sh — reports connectivity, local IP, public IP, full traceroute. |

---

## Mindset Moments (Great Questions Asked)

| Date | Question | Why It Matters |
|------|----------|----------------|
| 25 May 2026 | Should we automate the tracking instead of uploading manually? | Systems thinking — automate repetitive tasks |
| 25 May 2026 | Why Supabase and not MongoDB or Firebase? | Trade-off analysis — always ask why one tool over another |
| 25 May 2026 | What if we need unstructured data later? | Thinking about scale and future needs |
| 25 May 2026 | What if I miss something — you can add a tab for that | Iterative design — build, then improve |
| 25 May 2026 | Will old chats contaminate the new instructions? | System reliability — how state and context works |
| 03 Jun 2026 | Is my path correct even though I got permission denied? | Separating your work from the system's response — path was right, access was blocked |
| 03 Jun 2026 | Proposed adding DevSecOps, MLOps, FinOps, Cross-cloud networking to roadmap | Thinking beyond tools to architecture, security, and economics of cloud systems |
| 03 Jun 2026 | Should we add Incident Response and Post-Mortems? | Understanding that DevOps is about people and process, not just servers |
| 09 Jun 2026 | Why fix one thing at a time instead of everything at once? | Surgical over sweeping — isolate the variable, verify the fix, then move on |
| 09 Jun 2026 | Why can't the browser call the API directly? | CORS is intentional browser security — the fix is a proxy, not a bypass |
| 09 Jun 2026 | How do I check if the code and DB are in sync? | Auditing references — every table, column, and element ID must have a matching counterpart |
| 18 Jun 2026 | I saved health_check.sh in practice — is that the mini project? | Understanding the difference between practice exercises and portfolio mini projects |
| 18 Jun 2026 | How do I edit an already created script in nano? | Practical file editing — nano opens existing files the same way it creates new ones |
| 22 Jun 2026 | Spotted that PHASE field in Portfolio was wrong — should be TOPIC ID | Output format precision — every field must map exactly to what the tracker app expects, not what sounds right |
| 22 Jun 2026 | Caught that HELPFUL LINKS was wrong — the field is linked_commands and stores related command names, not URLs | Schema-first thinking — always verify what the database column actually expects before writing to it |
| 23 Jun 2026 | Caught that folder creation steps were missing before the mini-project push — called it out directly | Completeness checking — every deployment sequence must include the full path of steps, not just the headline actions |
| 23 Jun 2026 | Caught that MOMENT TYPE was written as "Question or Situation" instead of one specific value — corrected the output format rule | Output format precision — every field must contain a single concrete value, never a placeholder or combined option |
| 25 Jun 2026 | After chmod 755, asked why output was -rwxr-xr-x instead of -rwx-rx-rx — expected dashes to separate groups, not act as placeholders within each group's 3 fixed slots | Careful output reading — questioning when reality doesn't match the mental model is exactly the right instinct |
| 29 Jun 2026 | Asked how traceroute output reveals which IPs belong to Airtel vs Google vs home router | Systems thinking — understanding that every IP block is publicly registered and private ranges are globally standardised |
| 29 Jun 2026 | Asked whether HTTPS still leaves room for attacks even with encryption | Security depth — correctly identified that HTTPS secures the pipe but not the endpoints, and that DNS poisoning and certificate theft are real attack vectors |
| 29 Jun 2026 | Asked how to make home IP invisible like hops 6 and 7 | Privacy and security instinct — correctly connected router silence to IP hiding, leading to VPN and Tor concepts |
| 29 Jun 2026 | Caught that the Vercel proxy description was outdated — correctly stated Jarvis now runs on Supabase Edge Functions | Accuracy instinct — always verifying that what's being described matches what's actually running in production |

---

## Notes and Corrections
- 27 Jun 2026: Persistent sort bug fully resolved — confirmed by Mikey. Root cause: syncUI() force-redraw block in core.js was calling renderSessions(allSessions) raw after every load, overwriting the correctly sorted render. Fixed by passing all data through sortState in the force-redraw block. Sort now holds permanently across reloads on all tabs.


- Approach updated 26 May 2026: added "concept first, tool independent" and full AI + DevOps definition
- Roadmap expanded 03 Jun 2026: added DevSecOps thread, MLOps, model drift, GPU infrastructure, FinOps, managed databases, serverless compute, security scanning for IaC, DevSecOps in pipelines, disaster recovery, chaos engineering, incident response and post-mortems
- Security is a thread woven through all phases, not a single topic
- Supabase is the source of truth for topic tracking
- Total topics: 67 across 8 phases
- Tab IDs must never change — they are linked to Supabase table queries. Only nav button labels can be renamed safely.
- 09 Jun 2026: Tracker app fully debugged. All tabs working. Jarvis fixed as floating button.
- 18 Jun 2026: Mini project rules added. devops-portfolio repo and folder structure established. End of session output format locked in for all 6 tracker tabs. Detailed instructions added for each output type. Topic only marked Done after mini project pushed to GitHub.
- 18 Jun 2026: Added the end-of-topic tracker update trigger — saying "Topic X.X is done. Update the tracker file." now triggers Claude to fully update and re-output this file.
- 18 Jun 2026: Added 5 reliability improvements — (1) no silent status changes without explicit "Topic X.X is done" confirmation, (2) Current Skill Snapshot section for fast orientation, (3) command dedup rule for Terminal Cmds tab only — War Room always lists every command, repeated or not, (4) Accuracy Rule — Claude must never invent architecture/commands/outcomes not actually part of the session, (5) mini-project verification — Claude must confirm the code actually ran before marking complete.
- 18 Jun 2026: Added "Multi-Day Problem/Situation Mode" — a separate flow from Topic sessions, for multi-day debugging/build work. Includes elapsed-time check-ins (~every 3-4 hours), a "Day X end" trigger producing two separate daily files (all tabs except War Room, and War Room separately), and an "all done" trigger that asks Mikey to paste prior days' reports back so Claude can combine everything into one final accurate multi-day report.
- 18 Jun 2026: Added mode-detection logic — Claude proceeds without asking when the opening message clearly signals Topic Mode or Problem Mode, and only asks "Is this a learning day or a problem-solving day?" when genuinely ambiguous (Option 2, chosen over always-asking).
- 22 Jun 2026: Portfolio output format corrected — field is `TOPIC ID:` not `PHASE:`. Terminal Cmds output format corrected — last field is `LINKED COMMANDS:` (stores related command names as array e.g. ["git add .","git status"]) not `HELPFUL LINKS:`. FUTURE NOTES field means "which future topics will this command appear in again" — not general tips or warnings. Both changes apply to all future session outputs.
- 23 Jun 2026: War Room output format corrected — Claude must always produce TWO parts: (1) short form field content (DATE, REPORT TYPE, TITLE, ERROR CODE, SOLUTION/FIX) for pasting into the UI, followed by (2) the full detailed .md file to attach. Never produce the .md file alone without the form fields.
- 24 Jun 2026: Mindset Moment TYPE field corrected — must be a single specific value, either `Question` or `Situation`, never written as "Question or Situation" together. The output format template has been updated to reflect this.
- 24 Jun 2026: Mini-Project Folder Creation Rule added to Core Principles — Claude must always include the full terminal steps to create the correct devops-portfolio folder as part of the mini-project instructions, never omitting them or providing them separately after the fact. Sequence is always: create folder → copy file → cd into folder → verify → git push.
- 25 Jun 2026: devops-portfolio confirmed at /Users/adminrags/Documents/Projects/Devops/devops-portfolio on Mac mini — not at ~/devops-portfolio. All future mini-project folder creation commands must use this full path.
- 26 Jun 2026: Problem Mode Session Log rule locked in — for Problem Mode sessions, the SESSION LOG tab is skipped entirely. The War Room report is the complete record for all problem/debugging/build sessions. The SESSION LOG tab is only for curriculum topic sessions.
- 28 Jun 2026: Tracker site cleanup session — three post-fix tasks completed: (1) removed all debug console.log lines added during sort debugging from core.js and log.js, (2) added renderWarRoom() to syncUI force-redraw block for sort consistency, (3) verified Daily Log sort field 'date' is correct — matches actual Supabase column name, no change needed.
- 27 Jun 2026: Problem Mode output completeness rule — when Mikey says "done with the problem mode" or equivalent, Claude must produce ALL applicable outputs in a single response in this order: (1) Mindset Moments, (2) Daily Log, (3) Terminal Cmds, (4) War Room Part 1 form fields, (5) War Room Part 2 .md file. Never split outputs across multiple messages or produce them piecemeal.
- 26 Jun 2026: Tracker auto-fetch/push system live — Claude fetches the tracker from GitHub at the start of every session using the GitHub Contents API and pushes updates back automatically. No manual upload/download steps required. GitHub PAT stored in Claude Project instructions file.
- 26 Jun 2026: Site code fetch rule locked in — when fixing bugs or updating the tracker site (index.html, style.css, core.js, Components folder), Claude must always fetch the relevant file(s) directly from the devops.tracker GitHub repo using the GitHub Contents API. Mikey must never paste site code directly into the chat. This protects the token from exposure and keeps the fetch flow consistent. Repo: Michaeljoshua1504/devops.tracker. Same token used for tracker file fetch/push.

---

## What Claude Must Do at the Start of Every Session

1. Read this file completely
2. Determine which mode applies — Topic/Curriculum or Multi-Day Problem Mode — using the logic in "Detecting Which Mode We're In" above. Only ask if the opening message is genuinely ambiguous.
3. Say "Welcome back! Continuing from Topic X.X — [topic name]" OR acknowledge the tracker task if one is pending
4. Do NOT re-explain already completed topics unless asked
5. Apply the full approach: concept first, tool independent, AI woven in, security lens always on
6. Guide Mikey to build the mini-project step by step
7. Give exact Git commands to push the project to devops-portfolio in the correct folder structure
8. Generate all 6 end-of-session outputs in the exact format defined above
9. Produce the War Room report as a downloadable .md file
10. When Mikey says "Topic X.X is done. Update the tracker file.", perform the full tracker update described in "How to Trigger an End-of-Topic Tracker Update" above and output a new downloadable tracker file
11. If in Multi-Day Problem Mode, follow that section above instead — check in periodically, respond to "Day X end" with the two-file daily output, and respond to "all done" by requesting prior days' reports and combining everything into one final report

---

- 27 Jun 2026: Explain Before Implementing Rule added — Claude must explain every planned change in plain English and wait for Mikey's confirmation ("yes" or "correct") before writing or pushing any code. Applies in both Problem Mode and Topic Mode. Loop repeats until confirmed.
- 27 Jun 2026: Persistent sort added to tracker site — sort preferences for all tabs are saved to localStorage so they survive page reloads and browser restarts.
- 27 Jun 2026: Handoff Note system added — a new `Handoff Note` section in the tracker file is automatically updated by Claude at key Problem Mode checkpoints (bug identified, fix attempted, code pushed, new problem found, problem resolved). Account #2 reads this on session start to pick up exactly where account #1 left off. No manual command needed — Claude updates silently in the background.

- 27 Jun 2026: Goal-Based Fix Loop Rule added — when Mikey gives a goal (not a one-shot change), Claude loops: diagnose → fix → self-test → loop again until goal is reached, reporting back only when done. Max 3 loops before stopping to report.
- 27 Jun 2026: Handoff Checkpoint Rule extended to Topic Mode — Claude also silently updates the Handoff Note when a mini-project starts, when an error hits during the mini-project, and when the mini-project is successfully pushed.

*Last updated: 29 Jun 2026 — Mindset form UI updated: dynamic label for Question/Situation field based on moment type, dynamic label for response field based on insight source (What Claude Explained / Outcome / Action Taken), colour-coded saved card labels (blue = AI, green = Me). INSIGHT SOURCE and INSIGHT/OUTCOME rules locked in tracker. Topic 2.1 complete. Next: 2.2. Total: 8 of 67.*
