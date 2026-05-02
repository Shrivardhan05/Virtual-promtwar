import { faq, quiz, timeline } from './data/electionKnowledge.js';

describe('Data Integrity Tests', () => {
  test('FAQ data should contain expected objects with keys and answers', () => {
    expect(faq.length).toBeGreaterThan(0);
    expect(faq[0]).toHaveProperty('keys');
    expect(faq[0]).toHaveProperty('answer');
  });

  test('Quiz data should contain questions, options, and correct answers', () => {
    expect(quiz.length).toBeGreaterThan(0);
    expect(quiz[0]).toHaveProperty('q');
    expect(quiz[0].options.length).toBeGreaterThan(1);
    expect(typeof quiz[0].correct).toBe('number');
  });

  test('Timeline data should contain sequential phases', () => {
    expect(timeline.length).toBeGreaterThan(0);
    expect(timeline[0]).toHaveProperty('phase');
    expect(timeline[0]).toHaveProperty('detail');
  });
});

describe('UI and Fallback Logic', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="chat"></div>
      <form id="chat-form">
        <input id="user-input" value="test input" />
      </form>
    `;
  });

  test('Fallback logic correctly matches FAQ keys', () => {
    const text = 'register';
    const match = faq.find((item) => item.keys.some((k) => text.includes(k)));
    expect(match).toBeDefined();
    expect(match.answer).toContain('Register to vote');
  });
});
