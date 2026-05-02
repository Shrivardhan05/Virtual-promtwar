import { faq, quiz, timeline } from './data/electionKnowledge.js';

const chat = document.getElementById('chat');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const timelineEl = document.getElementById('timeline');
const stepsEl = document.getElementById('steps');

function addMessage(text, cls) {
  const p = document.createElement('p');
  p.className = `msg ${cls}`;
  p.textContent = text;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
}

function respond(text) {
  const t = text.toLowerCase();
  const match = faq.find((item) => item.keys.some((k) => t.includes(k)));
  if (match) return match.answer;
  return 'I can help with registration, timelines, ID, early voting, and absentee process. Ask a specific question to continue.';
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  addMessage(respond(text), 'bot');
  userInput.value = '';
});

document.querySelectorAll('[data-q]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const q = btn.getAttribute('data-q');
    addMessage(q, 'user');
    addMessage(respond(q), 'bot');
  });
});

timeline.forEach((item) => {
  const li = document.createElement('li');
  li.innerHTML = `<strong>${item.phase}:</strong> ${item.detail}`;
  timelineEl.appendChild(li);
});

document.getElementById('navigator').addEventListener('submit', (e) => {
  e.preventDefault();
  stepsEl.innerHTML = '';
  const registered = document.getElementById('registered').value;
  const mode = document.getElementById('mode').value;
  const id = document.getElementById('id').value;

  const steps = [];
  if (registered === 'no') steps.push('Register to vote through your official election portal.');
  if (registered === 'unsure') steps.push('Verify your voter registration status online before deadlines.');
  if (id !== 'yes') steps.push('Check acceptable voter ID rules and prepare alternate documents if needed.');
  if (mode === 'mail') steps.push('Request a mail/absentee ballot and track request approval status.');
  if (mode === 'early') steps.push('Find your early voting centers and available dates.');
  if (mode === 'in_person') steps.push('Locate your polling station and confirm polling hours.');
  steps.push('Review your sample ballot to reduce errors on election day.');
  steps.push('Verify all local deadlines from official election authority sources.');

  steps.forEach((s) => {
    const li = document.createElement('li');
    li.textContent = s;
    stepsEl.appendChild(li);
  });
});

const quizEl = document.getElementById('quiz');
quiz.forEach((item, i) => {
  const block = document.createElement('div');
  block.innerHTML = `<p><strong>Q${i + 1}.</strong> ${item.q}</p>`;

  item.options.forEach((op, idx) => {
    const id = `q${i}_${idx}`;
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="q${i}" value="${idx}" id="${id}" /> ${op}`;
    block.appendChild(label);
  });

  quizEl.appendChild(block);
});

document.getElementById('grade-quiz').addEventListener('click', () => {
  let score = 0;
  quiz.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && Number(selected.value) === q.correct) score += 1;
  });

  document.getElementById('quiz-result').textContent = `You scored ${score}/${quiz.length}.`;
});

addMessage('Hi! I can guide you through election steps and timelines. Ask me anything to start.', 'bot');
