const STORAGE_KEY = 'event_planner_celebrations_v2';
const API_KEY_STORAGE = 'gemini_api_key_v1';

export const INITIAL_EVENTS = [
  {
    id: 'evt-101',
    name: "Rohan & Ananya's Royal Wedding",
    category: 'Marriage',
    date: '2026-11-28',
    time: '18:30',
    venue: 'The Leela Palace, Udaipur',
    host: 'The Sharma & Singhania Families',
    description: 'Join us to celebrate the sacred union of two hearts with royal regalia, musical sangeet, and traditional pheras under the stars.',
    createdAt: '2026-10-20T10:00:00.000Z'
  },
  {
    id: 'evt-102',
    name: "Aarav's 10th Superhero Birthday Carnival",
    category: 'Birthday',
    date: '2026-11-18',
    time: '16:30',
    venue: 'Sunset Meadows Club & Lawn, Pune',
    host: 'Karan & Pooja Deshmukh',
    description: 'An action-packed milestone birthday with superhero obstacle courses, magic show, custom cake, and endless fun.',
    createdAt: '2026-10-21T09:00:00.000Z'
  },
  {
    id: 'evt-103',
    name: 'Greenwood Eco Community & Cultural Festival',
    category: 'Community',
    date: '2026-12-05',
    time: '11:00',
    venue: 'Central Community Grounds, New Delhi',
    host: 'Greenwood Resident Action Committee',
    description: 'A vibrant neighborhood celebration uniting 500+ residents with folk music, zero-waste food stalls, games, and senior felicitation.',
    createdAt: '2026-10-21T11:00:00.000Z'
  },
  {
    id: 'evt-104',
    name: 'Grand Deepotsav & Diwali Gala',
    category: 'Diwali',
    date: '2026-11-08',
    time: '19:00',
    venue: 'The Courtyard Grand Ballroom, Mumbai',
    host: 'Vikram & Sunita Mehta',
    description: 'An auspicious evening illuminated by a thousand golden diyas, soulful sufi music, festive mithai, and joyful fireworks.',
    createdAt: '2026-10-21T12:00:00.000Z'
  },
  {
    id: 'evt-105',
    name: 'Global Tech Leaders Summit & Awards',
    category: 'Corporate',
    date: '2026-11-15',
    time: '09:30',
    venue: 'Grand Hyatt Convention Center, Hyderabad',
    host: 'Apex Global Ventures & Nexa Labs',
    description: 'An executive symposium convening industry pioneers, disruptive innovators, and visionary founders for transformative keynotes.',
    createdAt: '2026-10-24T08:00:00.000Z'
  },
  {
    id: 'evt-106',
    name: 'Silver Jubilee 25th Anniversary',
    category: 'Anniversary',
    date: '2026-12-10',
    time: '19:00',
    venue: 'Emerald Lawn, Taj West End, Goa',
    host: 'Aditya & Priya Kapoor',
    description: 'Celebrating 25 magnificent years of love, laughter, shared dreams, and lifelong companionship surrounded by cherished friends.',
    createdAt: '2026-10-25T11:00:00.000Z'
  }
];

export const getStoredEvents = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EVENTS;
  } catch (err) {
    console.error('Failed to load events from localStorage:', err);
    return INITIAL_EVENTS;
  }
};

export const saveStoredEvents = (events) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save events to localStorage:', err);
  }
};

export const getStoredApiKey = () => {
  try {
    return localStorage.getItem(API_KEY_STORAGE) || import.meta.env.VITE_GEMINI_API_KEY || '';
  } catch {
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  }
};

export const saveStoredApiKey = (key) => {
  try {
    if (!key) {
      localStorage.removeItem(API_KEY_STORAGE);
    } else {
      localStorage.setItem(API_KEY_STORAGE, key.trim());
    }
  } catch (err) {
    console.error('Failed to save API key to localStorage:', err);
  }
};
