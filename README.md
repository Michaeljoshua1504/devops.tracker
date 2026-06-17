# 🚀 DevOps Learning Tracker & Jarvis AI Assistant

**Repository Description:** A full-stack DevOps learning tracker featuring a modular frontend deployed via GitHub Actions and a secure, serverless AI assistant (Jarvis) powered by Supabase Edge Functions and Groq LLMs.

---

## 🎯 Purpose & Use Case

When learning DevOps, it is easy to get lost in theory. This tracker solves that by providing:
1. **Milestone Tracking:** A structured dashboard to log, visualize, and track progress through complex DevOps tools (Linux, Docker, CI/CD, Kubernetes, Cloud Providers).
2. **On-Demand AI Mentorship:** A global, floating AI assistant named **Jarvis** embedded directly into the application to answer technical questions, explain infrastructure concepts, and debug configurations in real time.
3. **Dogfooding DevOps:** The repository itself is an active learning sandbox. Building this project involved migrating a monolithic architecture into a decoupled, secure, production-grade serverless ecosystem.

---

## 🏗️ Architecture Evolution

This project underwent a major architectural refactor to align with modern cloud-native engineering standards:

* **The Legacy Approach (Monolith):** Originally built as a single-file application with frontend UI logic mixed with backend API configurations. API keys were either exposed or routed through an intermediate proxy layer requiring manual repository overrides.
* **The Modern Approach (Serverless/Edge):** The application is now fully decoupled. The frontend is split into highly maintainable, modular components. The backend logic has been migrated completely out of the application code into secure cloud edge runtimes.

```text
[Frontend (GitHub Pages)] ──(Secure Invoke)──> [Supabase Edge Function (Deno)] ──> [Groq API (Llama 3.3)]
                                                        │
                                            [Supabase Secret Vault]
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5, CSS3, Modular JavaScript | Responsive tracking dashboard and global floating UI widget. |
| **Hosting** | GitHub Pages | High-availability static hosting for the user interface. |
| **CI/CD** | GitHub Actions (`deploy.yml`) | Automated integration and deployment pipeline triggered on code push. |
| **Backend Runtime** | Supabase Edge Functions | Serverless, low-latency Deno runtime to handle secure API routing. |
| **Secrets Management** | Supabase Vault | Secure cloud storage for external infrastructure credentials. |
| **AI Engine** | Groq Cloud API | Powering the Jarvis assistant using the `llama-3.3-70b-versatile` model. |
| **Local Infrastructure** | Docker & Docker-Compose | Maintained locally for infrastructure prototyping and testing environments. |

---

## 📁 Project Structure

The repository is organized following modular design principles:

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD automation pipeline
├── Components/
│   └── jarvis/
│       ├── jarvis.css          # Floating widget styling
│       └── jarvis.js           # Frontend Supabase SDK invocation logic
├── supabase/
│   └── functions/
│       └── jarvis-chat/
│           └── index.ts        # Serverless Deno backend function (Groq API bridge)
├── docker-compose.yml          # Local container infrastructure prototyping
├── Dockerfile                  # Base container blueprints
├── index.html                  # Main application dashboard entryway
└── README.md                   # Project documentation
```

---

## 🔐 Security & DevOps Implementations

### Zero-Trust Frontend API Keys
No API tokens or sensitive credentials are saved in the client-side code or exposed in public source control. The frontend leverages the Supabase client library to securely trigger a remote execution block:

```javascript
const { data, error } = await sb.functions.invoke('jarvis-chat', {
  body: { message: text }
});
```

### Serverless Environment Isolation
The edge backend fetches credentials directly out of its execution environment vault at runtime using secure hardware isolation variables:

```typescript
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
```

---

## 🚀 Deployment & Local Development

### Prerequisites
* Supabase CLI installed locally
* GitHub Repository configured with GitHub Pages access

### Deploying Backend Edge Functions
To update or push revisions to the serverless backend infrastructure, execute the following commands via the Supabase CLI:

```bash
# Set secure environment variables inside the cloud vault
npx supabase secrets set GROQ_API_KEY=gsk_your_real_key_here

# Deploy the updated edge runtime bundle
npx supabase functions deploy jarvis-chat
```

### Automated Frontend Pipeline
The frontend relies completely on automated Continuous Deployment. Any adjustments pushed to the production source branch automatically kick off a GitHub Actions pipeline runner to refresh the live site tracking environment.

```bash
git add .
git commit -m "Feat: Optimizing core tracking components and Jarvis edge execution blocks"
git push origin main
```