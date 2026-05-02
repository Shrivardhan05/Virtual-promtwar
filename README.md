# Election Process Education Assistant (Gemini + Firebase Ready)

An interactive web assistant that helps users understand election process timelines, required steps, and voting pathways.

## What's improved for hackathon quality
- Gemini-powered dynamic assistant responses (with local fallback engine).
- Cleaner UX with instant quick prompts and personalized navigator.
- Firebase Hosting setup included for the fastest public deployment.
- Lightweight static architecture suitable for challenge constraints.

## Features
- **AI Assistant (Gemini API):** Uses `gemini-1.5-flash` via REST API from browser.
- **Fallback Smart Logic:** If Gemini key is unavailable, app still works with rule-based responses.
- **Election Timeline:** Key election phases in sequence.
- **Personalized Voter Steps:** Generates a contextual checklist.
- **Learning Quiz:** Quick concept validation for users.

## Run locally
```bash
python3 -m http.server 8080
```
Open: `http://localhost:8080`

## Gemini setup
1. Open app.
2. Click **Set Gemini Key**.
3. Paste your Gemini API key.
4. Key is stored in browser `localStorage` (client-side only).

> For production security, proxy Gemini calls through a backend (Cloud Run/Functions) rather than exposing keys in browser.

## Fastest Firebase deployment
1. Install Firebase CLI
```bash
npm i -g firebase-tools
```
2. Login
```bash
firebase login
```
3. Set your project id in `.firebaserc` (replace `YOUR_FIREBASE_PROJECT_ID`).
4. Deploy hosting
```bash
firebase deploy --only hosting
```

After deploy, use the Firebase Hosting URL as the deployed link in submission.

## Challenge deliverables mapping
- **Code Quality:** Modular data (`data/electionKnowledge.js`) + clear app logic.
- **Security:** Fallback mode without mandatory key; production key-handling note included.
- **Efficiency:** No heavy dependencies; static assets only.
- **Testing:** Manual functional checks + lightweight footprint.
- **Accessibility:** Semantic labels and keyboard-friendly controls.
- **Google Services:** Gemini API + Firebase Hosting integration.

## Assumptions
- Election rules and deadlines vary by locality.
- App provides educational guidance and asks users to verify official local deadlines.
