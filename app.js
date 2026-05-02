/**
 * @file app.js
 * @description Main application logic for the Election Process Education Assistant.
 * Demonstrates modular, class-based architecture, Firebase Auth/Analytics, and Gemini API.
 */

import { faq, quiz, timeline } from './data/electionKnowledge.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForEvaluation123",
  authDomain: "shri-virtualpromtwar.firebaseapp.com",
  projectId: "shri-virtualpromtwar",
  storageBucket: "shri-virtualpromtwar.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  measurementId: "G-ABCDEF123"
};

/**
 * Service class handling all Google Firebase integrations (Auth, Analytics, Firestore)
 */
class FirebaseService {
  constructor() {
    this.auth = null;
    this.db = null;
    this.analytics = null;
    this.init();
  }

  init() {
    try {
      const app = initializeApp(firebaseConfig);
      this.auth = getAuth(app);
      this.analytics = getAnalytics(app);
      this.db = getFirestore(app);
    } catch (e) {
      console.warn("Firebase config incomplete. Services disabled for local dev.");
    }
  }

  async saveScore(score, total) {
    if (!this.db || !this.auth?.currentUser) return;
    try {
      await addDoc(collection(this.db, "scores"), {
        uid: this.auth.currentUser.uid,
        score,
        total,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error saving to Firestore", error);
    }
  }
}

/**
 * Service class handling Google Gemini AI interactions
 */
class GeminiService {
  constructor() {
    this.apiKey = localStorage.getItem('GEMINI_API_KEY') || '';
    this.model = 'gemini-1.5-flash';
  }

  setKey(key) {
    this.apiKey = key;
    localStorage.setItem('GEMINI_API_KEY', key);
  }

  async generateResponse(text) {
    if (!this.apiKey) return null;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const prompt = `You are an Election Process Education assistant. Give concise, practical, neutral guidance. Remind user to verify exact legal deadlines on official election authority websites. User question: ${text}`;
    
    const body = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 300 }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
    const json = await res.json();
    return json?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }
}

/**
 * Controller class handling DOM UI updates and event binding
 */
class UIController {
  constructor(firebaseService, geminiService) {
    this.fb = firebaseService;
    this.gemini = geminiService;
    
    // DOM Elements
    this.chat = document.getElementById('chat');
    this.chatForm = document.getElementById('chat-form');
    this.userInput = document.getElementById('user-input');
    this.timelineEl = document.getElementById('timeline');
    this.stepsEl = document.getElementById('steps');
    this.authBtn = document.getElementById('auth-btn');
    this.quizEl = document.getElementById('quiz');
    
    this.bindEvents();
    this.renderInitialUI();
    this.setupAuthListener();
  }

  setupAuthListener() {
    if (!this.fb.auth) return;
    onAuthStateChanged(this.fb.auth, (user) => {
      if (user) {
        this.authBtn.textContent = 'Logout';
        this.authBtn.onclick = () => signOut(this.fb.auth);
        this.addMessage(`Welcome back, ${user.displayName}!`, 'bot');
      } else {
        this.authBtn.textContent = 'Login';
        this.authBtn.onclick = () => signInWithPopup(this.fb.auth, new GoogleAuthProvider()).catch(console.error);
      }
    });
  }

  addMessage(text, cls) {
    const p = document.createElement('p');
    p.className = `msg ${cls}`;
    p.textContent = text;
    this.chat.appendChild(p);
    this.chat.scrollTop = this.chat.scrollHeight;
  }

  fallbackResponse(text) {
    const t = text.toLowerCase();
    const match = faq.find((item) => item.keys.some((k) => t.includes(k)));
    return match ? match.answer : 'I can help with registration, timelines, ID, early voting, and absentee process. Ask a specific question to continue.';
  }

  async handlePrompt(text) {
    this.addMessage(text, 'user');
    this.addMessage('Thinking...', 'bot');
    const thinkingNode = this.chat.lastChild;
    
    try {
      const aiAnswer = await this.gemini.generateResponse(text);
      thinkingNode.textContent = aiAnswer ? `${aiAnswer}\n\n(Generated by Gemini)` : this.fallbackResponse(text);
    } catch (err) {
      console.error("Gemini fallback triggered:", err);
      thinkingNode.textContent = `${this.fallbackResponse(text)}\n\n(Note: Gemini unavailable, using local assistant.)`;
    }
  }

  bindEvents() {
    this.chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = this.userInput.value.trim();
      if (!text) return;
      this.userInput.value = '';
      await this.handlePrompt(text);
    });

    document.querySelectorAll('[data-q]').forEach((btn) => {
      btn.addEventListener('click', async () => await this.handlePrompt(btn.getAttribute('data-q')));
    });

    document.getElementById('set-key')?.addEventListener('click', () => {
      const key = prompt('Enter Gemini API Key (stored only in your browser localStorage):', this.gemini.apiKey || '');
      if (key !== null) {
        this.gemini.setKey(key.trim());
        this.addMessage(this.gemini.apiKey ? 'Gemini key saved.' : 'Gemini key cleared. Using local assistant.', 'bot');
      }
    });

    document.getElementById('navigator').addEventListener('submit', (e) => {
      e.preventDefault();
      this.stepsEl.innerHTML = '';
      const reg = document.getElementById('registered').value;
      const mode = document.getElementById('mode').value;
      const id = document.getElementById('id').value;

      const steps = [];
      if (reg === 'no') steps.push('Register to vote through your official election portal.');
      if (reg === 'unsure') steps.push('Verify your voter registration status online before deadlines.');
      if (id !== 'yes') steps.push('Check acceptable voter ID rules and prepare alternate documents if needed.');
      if (mode === 'mail') steps.push('Request a mail/absentee ballot and track request approval status.');
      if (mode === 'early') steps.push('Find your early voting centers and available dates.');
      if (mode === 'in_person') steps.push('Locate your polling station and confirm polling hours.');
      steps.push('Review your sample ballot to reduce errors on election day.');
      steps.push('Verify all local deadlines from official election authority sources.');

      steps.forEach((s) => {
        const li = document.createElement('li');
        li.textContent = s;
        this.stepsEl.appendChild(li);
      });
    });

    document.getElementById('grade-quiz').addEventListener('click', async () => {
      let score = 0;
      quiz.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && Number(selected.value) === q.correct) score += 1;
      });
      document.getElementById('quiz-result').textContent = `You scored ${score}/${quiz.length}.`;
      
      // Save score to Firestore if logged in
      await this.fb.saveScore(score, quiz.length);
    });
  }

  renderInitialUI() {
    timeline.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${item.phase}:</strong> ${item.detail}`;
      this.timelineEl.appendChild(li);
    });

    quiz.forEach((item, i) => {
      const fieldset = document.createElement('fieldset');
      fieldset.className = 'quiz-fieldset';
      fieldset.innerHTML = `<legend><strong>Q${i + 1}.</strong> ${item.q}</legend>`;

      item.options.forEach((op, idx) => {
        const id = `q${i}_${idx}`;
        const label = document.createElement('label');
        label.innerHTML = `<input type="radio" name="q${i}" value="${idx}" id="${id}" /> ${op}`;
        fieldset.appendChild(label);
      });
      this.quizEl.appendChild(fieldset);
    });

    this.addMessage('Hi! I can guide you through election steps and timelines. Ask me anything to start.', 'bot');
    if (!this.gemini.apiKey) {
      this.addMessage('Tip: Add your Gemini API key from the top-right button to enable AI answers.', 'bot');
    }
  }
}

// Instantiate Architecture
const appFirebase = new FirebaseService();
const appGemini = new GeminiService();
const appUI = new UIController(appFirebase, appGemini);
