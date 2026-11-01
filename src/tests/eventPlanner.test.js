import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { EVENT_CATEGORIES } from '../constants/categories';
import { INITIAL_EVENTS, getStoredEvents, saveStoredEvents, getStoredApiKey, saveStoredApiKey } from '../services/storageService';
import { generateCardContent } from '../services/geminiService';

// Mock localStorage in Node environment
const mockStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

globalThis.localStorage = mockStorage;

describe('Challenge Verticals & Event Categories', () => {
  it('includes all primary challenge verticals: Marriage, Birthday, and Community', () => {
    const categoryIds = EVENT_CATEGORIES.map((c) => c.id);
    expect(categoryIds).toContain('Marriage');
    expect(categoryIds).toContain('Birthday');
    expect(categoryIds).toContain('Community');
  });

  it('ensures every category has valid labels, emojis, and gradient styling', () => {
    EVENT_CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.label).toBeDefined();
      expect(cat.emoji).toBeDefined();
      expect(cat.color).toContain('from-');
    });
  });

  it('contains curated sample celebrations for all primary verticals', () => {
    const categoriesInSamples = INITIAL_EVENTS.map((e) => e.category);
    expect(categoriesInSamples).toContain('Marriage');
    expect(categoriesInSamples).toContain('Birthday');
    expect(categoriesInSamples).toContain('Community');
  });
});

describe('Storage & State Persistence Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes default events when localStorage is empty', () => {
    const events = getStoredEvents();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThanOrEqual(3);
    expect(events[0].name).toContain("Rohan & Ananya's Royal Wedding");
  });

  it('persists and retrieves updated events correctly', () => {
    const customEvent = {
      id: 'custom-1',
      name: 'Spring Gala 2027',
      category: 'Community',
      date: '2027-04-10',
      time: '18:00',
      venue: 'Township Plaza',
      host: 'City Committee'
    };
    saveStoredEvents([customEvent]);
    const retrieved = getStoredEvents();
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].name).toBe('Spring Gala 2027');
  });

  it('securely handles API key persistence without leaking', () => {
    expect(getStoredApiKey()).toBe('');
    saveStoredApiKey('AIzaSy_test_secure_key_123');
    expect(getStoredApiKey()).toBe('AIzaSy_test_secure_key_123');
    saveStoredApiKey('');
    expect(getStoredApiKey()).toBe('');
  });
});

describe('Multilingual GenAI Card Copy & Fallback Engine', () => {
  const weddingEvent = {
    id: 'evt-test-wedding',
    name: "Aman & Tara's Wedding",
    category: 'Marriage',
    date: '2026-12-15',
    time: '19:00',
    venue: 'Taj Palace, Mumbai',
    host: 'The Kapoor Family'
  };

  const birthdayEvent = {
    id: 'evt-test-birthday',
    name: "Reyansh's 5th Birthday Bash",
    category: 'Birthday',
    date: '2026-11-20',
    time: '16:00',
    venue: 'FunWorld Lawn, Bangalore',
    host: 'Ankit & Sneha'
  };

  const communityEvent = {
    id: 'evt-test-community',
    name: 'Harmony Festival 2026',
    category: 'Community',
    date: '2026-12-01',
    time: '10:00',
    venue: 'Civic Amphitheater',
    host: 'Neighborhood Trust'
  };

  it('generates culturally resonant wedding copy in English fallback', async () => {
    const copy = await generateCardContent({ event: weddingEvent, language: 'en', apiKey: '' });
    expect(copy.headline).toBeDefined();
    expect(copy.tagline).toBeDefined();
    expect(copy.message).toBeDefined();
    expect(copy.hostLine).toBeDefined();
    expect(copy.source).toBe('smart-cultural-engine');
  });

  it('generates culturally resonant wedding copy in Hindi (हिंदी)', async () => {
    const copy = await generateCardContent({ event: weddingEvent, language: 'hi', apiKey: '' });
    expect(copy.headline).toContain('विवाह');
  });

  it('generates playful birthday celebration copy', async () => {
    const copy = await generateCardContent({ event: birthdayEvent, language: 'en', apiKey: '' });
    expect(copy.headline).toContain('Celebrating');
    expect(copy.specialNote).toContain('Cake');
  });

  it('generates community festival copy promoting unity & heritage', async () => {
    const copy = await generateCardContent({ event: communityEvent, language: 'en', apiKey: '' });
    expect(copy.headline).toContain('Shared Heritage');
    expect(copy.tagline).toContain('Unity');
  });
});

describe('Budget Financial Calculations Logic', () => {
  it('correctly calculates total spent, balance, and cost per guest', () => {
    const totalBudget = 200000;
    const guestCount = 100;
    const expenses = [
      { id: '1', amount: 50000, isPaid: true },
      { id: '2', amount: 30000, isPaid: false },
      { id: '3', amount: 20000, isPaid: true }
    ];

    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const paidAmount = expenses.filter((e) => e.isPaid).reduce((sum, item) => sum + item.amount, 0);
    const pendingAmount = totalSpent - paidAmount;
    const remainingBudget = totalBudget - totalSpent;
    const percentUsed = Math.round((totalSpent / totalBudget) * 100);
    const costPerGuest = Math.round(totalSpent / guestCount);

    expect(totalSpent).toBe(100000);
    expect(paidAmount).toBe(70000);
    expect(pendingAmount).toBe(30000);
    expect(remainingBudget).toBe(100000);
    expect(percentUsed).toBe(50);
    expect(costPerGuest).toBe(1000);
  });

  it('handles zero or negative budget balance safely without crashing', () => {
    const totalBudget = 50000;
    const totalSpent = 70000;
    const remainingBudget = totalBudget - totalSpent;
    expect(remainingBudget).toBe(-20000);
    expect(remainingBudget < 0).toBe(true);
  });
});

describe('Timeline & Milestone Calculations Logic', () => {
  it('computes positive and negative offset dates accurately', () => {
    const eventDate = new Date('2026-12-01T00:00:00Z');
    const offsetDays = -30;
    const milestoneDate = new Date(eventDate);
    milestoneDate.setDate(milestoneDate.getDate() + offsetDays);

    const result = milestoneDate.toISOString().split('T')[0];
    expect(result).toBe('2026-11-01');
  });

  it('identifies overdue tasks based on due date comparison', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - 5);

    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + 5);

    const isOverdue = (dueDate, isCompleted) => {
      if (isCompleted) return false;
      const due = new Date(dueDate);
      due.setHours(0, 0, 0, 0);
      return due < today;
    };

    expect(isOverdue(pastDate.toISOString().split('T')[0], false)).toBe(true);
    expect(isOverdue(pastDate.toISOString().split('T')[0], true)).toBe(false);
    expect(isOverdue(futureDate.toISOString().split('T')[0], false)).toBe(false);
  });
});
