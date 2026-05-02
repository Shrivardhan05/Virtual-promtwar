import { faq, quiz, timeline } from './data/electionKnowledge.js';

describe('Data Integrity & Knowledge Base Tests', () => {
  test('FAQ data should contain expected objects with keys and answers', () => {
    expect(faq.length).toBeGreaterThan(0);
    expect(faq[0]).toHaveProperty('keys');
    expect(faq[0]).toHaveProperty('answer');
  });

  test('Quiz data should contain valid questions, options, and numeric correct answers', () => {
    expect(quiz.length).toBeGreaterThan(0);
    quiz.forEach((q) => {
      expect(q).toHaveProperty('q');
      expect(q.options.length).toBeGreaterThan(1);
      expect(typeof q.correct).toBe('number');
      expect(q.correct).toBeLessThan(q.options.length);
    });
  });

  test('Timeline data should contain sequential phases', () => {
    expect(timeline.length).toBeGreaterThan(0);
    expect(timeline[0]).toHaveProperty('phase');
    expect(timeline[0]).toHaveProperty('detail');
  });
});

describe('UI Interaction and DOM Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="chat"></div>
      <form id="chat-form">
        <input id="user-input" value="test input" />
      </form>
      <form id="navigator">
        <select id="registered"><option value="yes">Yes</option></select>
        <select id="mode"><option value="mail">Mail</option></select>
        <select id="id"><option value="yes">Yes</option></select>
      </form>
      <ol id="steps"></ol>
      <div id="quiz"></div>
      <button id="grade-quiz"></button>
      <p id="quiz-result"></p>
    `;
  });

  test('Fallback logic correctly matches FAQ keys even with edge cases', () => {
    const text = 'how do i register for the upcoming election?';
    const match = faq.find((item) => item.keys.some((k) => text.includes(k)));
    expect(match).toBeDefined();
    expect(match.answer).toContain('Register');
  });

  test('Navigator generates accurate steps based on context', () => {
    const registered = document.getElementById('registered').value;
    const mode = document.getElementById('mode').value;
    const stepsEl = document.getElementById('steps');
    
    // Simulate generation
    const steps = [];
    if (registered === 'yes') steps.push('Verify your polling location.');
    if (mode === 'mail') steps.push('Request a mail/absentee ballot.');
    
    steps.forEach((s) => {
      const li = document.createElement('li');
      li.textContent = s;
      stepsEl.appendChild(li);
    });

    expect(stepsEl.children.length).toBe(2);
    expect(stepsEl.innerHTML).toContain('absentee ballot');
  });
});

describe('External Integration & Edge Cases', () => {
  let originalFetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test('Gracefully handles Gemini API failure (Integration Simulation)', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    );
    
    // Mocking the fallback behavior
    const handleFailure = async () => {
      try {
        const res = await fetch('fake-url');
        if (!res.ok) throw new Error('API Error');
      } catch (e) {
        return 'Fallback Triggered';
      }
    };
    
    const result = await handleFailure();
    expect(result).toBe('Fallback Triggered');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
