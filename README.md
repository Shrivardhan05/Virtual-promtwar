# Election Process Education Assistant

An interactive web assistant that helps users understand election processes, timelines, and decision steps in a simple, guided way.

## Chosen Vertical
**Election Process Education**

## What this project does
This solution provides:
- A guided **chat assistant** that answers election-process questions using a rule-based knowledge engine.
- A dynamic **timeline** view for major election phases.
- A **step-by-step navigator** based on user context (first-time voter, absentee voter, student, etc.).
- A short **knowledge quiz** for learning validation.
- A clean dashboard-like UI inspired by the provided template.

## Google Services Integration
The app is built so you can enable Google services quickly:
1. **Gemini API (optional):** Replace the local rule engine with Gemini for richer answers.
2. **Google Cloud Run deployment:** Included Dockerfile for containerized deployment.
3. **Firebase Hosting (optional):** Can host this static app directly.

> For evaluation safety, the default implementation works without external API keys.

## Approach and Logic
### 1) Context-aware decision flow
The assistant asks profile questions and routes users to tailored steps:
- Registration status
- Residence state/region
- Voting mode (in-person/mail/early voting)
- ID availability

### 2) Policy-safe information design
- Gives educational guidance only.
- Recommends checking local election authority for legal deadlines.
- Avoids legal claims when local-specific details are unknown.

### 3) Usability
- Accessible labels and keyboard-friendly controls.
- Clear cards and timeline sections.
- Lightweight app (<10 MB repository target).

## How it works
- `index.html`: UI structure.
- `styles.css`: responsive layout and theme.
- `app.js`: assistant logic, timeline engine, and quiz.
- `data/electionKnowledge.js`: curated knowledge base and routing prompts.

## Assumptions
- Election rules vary by country/state; this project provides a generalized learning framework.
- Users should verify exact deadlines with official election websites.
- Internet/API integration is optional and can be enabled later.

## Run locally
Open `index.html` directly in browser, or run a local server:

```bash
python3 -m http.server 8080
```

Then visit: `http://localhost:8080`

## Deploy (Cloud Run)
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/election-assistant

gcloud run deploy election-assistant \
  --image gcr.io/PROJECT_ID/election-assistant \
  --platform managed \
  --allow-unauthenticated
```

## Repository Rules Compliance
- Single branch workflow.
- Public GitHub repository ready.
- Lightweight static app structure for size control.
