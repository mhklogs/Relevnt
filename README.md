<p align="center">
  <img src="public/favicon.svg" width="64" height="64" alt="Relevnt logo" />
</p>

<h1 align="center">Relevnt</h1>

<p align="center">
  <strong>B2B Outbound Sourcing &amp; Hyper-Personalized Outreach Suite.</strong><br />
  Turn a messy target description into LinkedIn Boolean search strings, then draft hyper-personalized cold outreach that actually gets replies.
</p>

<p align="center">
  <a href="#features">Features</a> · <a href="#quick-start">Quick Start</a> · <a href="#deployment">Deployment</a> · <a href="#tech-stack">Tech Stack</a> · <a href="#project-structure">Project Structure</a>
</p>

---

## Features

### 1. Sourcing Strategy Generator
Describe your ideal buyer in plain English and Relevnt returns a complete sourcing playbook:

- **Target persona** summary (`"CTO" OR "Chief Technology Officer"`)
- **Industry, location & company-size** filters for the LinkedIn sidebar
- A **copy-paste-ready Boolean search string** for LinkedIn Standard and Sales Navigator
- A tactical **pro tip** to out-hunt competitors in the niche

### 2. Hyper-Personalized Outreach Generator
Paste a prospect's recent LinkedIn activity and get two distinct, sub-100-word cold emails built on a 4-part framework:

- **Trigger Hook** – reacts to a specific detail from their post
- **Empathy Bridge** – connects to the operational challenge in their role
- **Value Proof** – a concrete, data-backed outcome from your offering
- **Low-Friction CTA** – a soft, open-ended next step

Extras: per-part highlighting ("Copy Blueprint"), live word-count vs. 100-word limit, inline editing, rich-text copy (keeps bold + links), and a `mailto:` draft launcher. It also adapts to non-email goals (e.g. LinkedIn connection invites).

---

## Quick Start

**Prerequisites:** Node.js (v24)

```bash
# 1. Install dependencies
npm install

# 2. Configure your Gemini API key
cp .env.example .env.local
# then set GEMINI_API_KEY in .env.local

# 3. Run locally
npm run dev
```

Open http://localhost:3000.

> No API key? The suite still loads and shows a friendly banner explaining how to enable AI generation — the UI degrades gracefully instead of erroring.

---

## Deployment

### Vercel
The repo ships with a `vercel.json` that builds the frontend and serves `/api/*` as serverless functions via `api/index.ts` (which imports `createApp` from `app.ts`).

1. Import the repo on Vercel.
2. Add `GEMINI_API_KEY` as an environment variable.
3. Deploy — no extra config needed.

### Standalone server
```bash
npm run build
NODE_ENV=production GEMINI_API_KEY=... npm start
```

---

## Scripts

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start Vite + Express dev server      |
| `npm run build`  | Build frontend + bundle the server   |
| `npm start`      | Run the production server            |
| `npm run lint`   | Type-check with `tsc --noEmit`       |

---

## Tech Stack

- **Frontend:** React 19, Vite 6, Tailwind CSS v4, `motion` / Lucide icons
- **Backend:** Express, `@google/genai` (Gemini 2.5 Flash), serverless-ready via `api/`
- **PWA:** installable app with offline-first service worker

---

## Project Structure

```
.
├── api/index.ts            # Vercel serverless entry (reuses createApp)
├── app.ts                  # Express app + all Gemini API routes + /api/health
├── server.ts               # Local dev/prod server (hooks in Vite + static build)
├── src/
│   ├── App.tsx             # Main two-step workflow UI
│   ├── components/         # OutreachForm (sourcing) + EmailForm (outreach)
│   ├── data/presets.ts     # One-click target presets
│   └── types.ts            # Shared TypeScript types
└── public/                 # PWA assets, favicon, fonts, service worker
```

---

<a href="https://github.com/mhklogs/Relevnt">Report an issue</a> · Built for elite Outbound Sales professionals.