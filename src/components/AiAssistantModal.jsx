import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Send, Bot, User, X, RefreshCw, Copy, Check,
  Lightbulb
} from 'lucide-react';
import { getStoredApiKey } from '../services/storageService';

// Smart preset conversation starters tailored to event vertical
const CONTEXTUAL_PROMPTS = {
  Marriage: [
    'How should I divide my budget between venue, catering, and photography?',
    'What are the critical countdown milestones for the last 30 days before the wedding?',
    'What questions should I ask wedding caterers before signing?',
    'Suggest 3 unique Sangeet entertainment ideas that get both families dancing.'
  ],
  Birthday: [
    'What is a fun, cohesive theme and decoration plan for this birthday?',
    'How do I calculate food and drink quantities for 50 party guests?',
    'Give me a 3-week planning checklist so I do not rush last minute.',
    'Suggest memorable and eco-friendly return gift ideas.'
  ],
  Community: [
    'How do we manage crowd safety and volunteer roles for this community festival?',
    'What low-cost, high-engagement activities work best for all age groups?',
    'Give me a checklist for securing municipal and police ground permissions.',
    'How can we partner with local food vendors for community stalls?'
  ],
  Diwali: [
    'How to organize a seamless Diwali Deepotsav gathering for 80 guests?',
    'What are traditional and contemporary sweet platter combinations?',
    'Suggest eco-friendly lighting and floral rangoli decoration ideas.'
  ],
  Corporate: [
    'What is an ideal run-of-show schedule for an executive summit and awards evening?',
    'How to design an engaging keynote room layout and networking lounge?',
    'What are best practices for corporate audio-visual and stage lighting?'
  ],
  Anniversary: [
    'How to craft a heartwarming 25th anniversary milestone tribute and toast?',
    'Suggest intimate floral dinner decor and acoustic music playlists.',
    'What are thoughtful commemorative gifts for the couple?'
  ]
};

export const AiAssistantModal = ({ isOpen, onClose, event, onToast }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your **GenAI Celebration Planner Copilot** for **"${event?.name || 'your event'}"** (${event?.category || 'Celebration'}).\n\nI can help you dynamically optimize budgets, construct milestone timelines, draft vendor interview checklists, and brainstorm bespoke creative themes. What would you like to plan today?`,
      timestamp: 'Just now'
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Contextual prompts based on active event category
  const prompts = (event?.category && CONTEXTUAL_PROMPTS[event.category]) || CONTEXTUAL_PROMPTS.Community;

  // Send Message Handler
  const handleSendMessage = async (textToSend = inputValue) => {
    const userText = textToSend.trim();
    if (!userText || isTyping) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const apiKey = getStoredApiKey();

    if (apiKey && apiKey.trim() !== '') {
      try {
        const systemContext = `You are an elite, certified AI Event Planner and Concierge.
You are helping the client organize an event with the following profile:
- Event Name: "${event.name}"
- Category: "${event.category}"
- Date: "${event.date}"
- Time: "${event.time || 'Evening'}"
- Venue: "${event.venue}"
- Host: "${event.host}"
- Details: "${event.description || 'N/A'}"

Provide a structured, deeply practical, and culturally authentic response with clear bullet points, specific timelines or dollar/rupee budget guidelines when appropriate. Keep tone warm, authoritative, and encouraging.`;

        const conversationHistory = messages
          .slice(-6)
          .map((m) => `${m.sender === 'user' ? 'Client' : 'Planner'}: ${m.text}`)
          .join('\n');

        const fullPrompt = `${systemContext}\n\nRecent conversation:\n${conversationHistory}\nClient: ${userText}\nPlanner:`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: fullPrompt }] }],
              generationConfig: {
                temperature: 0.75,
                maxOutputTokens: 850
              }
            })
          }
        );

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            setMessages((prev) => [
              ...prev,
              {
                id: `ai-${Date.now()}`,
                sender: 'assistant',
                text: reply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
            setIsTyping(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Gemini chat error, falling back to smart planner engine:', err);
      }
    }

    // Smart Fallback reasoning responses
    setTimeout(() => {
      let fallbackResponse = '';
      const lower = userText.toLowerCase();

      if (lower.includes('budget') || lower.includes('cost') || lower.includes('money')) {
        fallbackResponse = `**Financial Strategy for "${event.name}" (${event.category}):**\n\n` +
          `• **Venue & Mandap / Production (25-30%):** Always lock packages that include tables, ambient lighting, and generator backup.\n` +
          `• **Catering & Hospitality (30-35%):** Prioritize quality over quantity; 3 live interactive food stations generate more compliments than 15 static buffet items.\n` +
          `• **Media & Photography (10-12%):** Book candid photo + drone video teams early.\n` +
          `• **Decor & Ambience (12-15%):** Use seasonal marigolds, tuberoses, and fairy lights to save 25% without sacrificing elegance.\n` +
          `• **Contingency Fund (5-7%):** Keep a liquid emergency cash reserve for day-of vendor gratuities and overtime extensions.`;
      } else if (lower.includes('timeline') || lower.includes('milestone') || lower.includes('schedule') || lower.includes('checklist')) {
        fallbackResponse = `**Key Countdown Milestones for "${event.name}":**\n\n` +
          `1. **T-Minus 60 Days:** Finalize venue agreement, advance deposits, and sound permits.\n` +
          `2. **T-Minus 30 Days:** Complete menu tasting; launch digital invitation cards via Card Studio.\n` +
          `3. **T-Minus 14 Days:** Lock final RSVP headcount with your banquet caterer to avoid per-plate penalties.\n` +
          `4. **T-Minus 3 Days:** Conduct sound check, coordinate host scripts, and pack day-of emergency kits (safety pins, powerbanks, breath mints).\n` +
          `5. **Day Of:** Designate a trusted friend or coordinator to manage vendor arrivals so the hosts can celebrate stress-free!`;
      } else if (lower.includes('vendor') || lower.includes('photographer') || lower.includes('caterer') || lower.includes('negotiat')) {
        fallbackResponse = `**Vendor Selection & Negotiation Best Practices:**\n\n` +
          `• **Always get 3 itemized quotes:** Never accept lump-sum estimates. Ask for line-item pricing (e.g. per-plate cost vs stall setup fee).\n` +
          `• **Payment Terms:** Structure payments as 40% advance upon signing, 40% upon setup on event morning, and the remaining 20% post-event completion.\n` +
          `• **Contract Safeguards:** Ensure contracts specify exact arrival times, backup equipment policies, and overtime charges per hour.`;
      } else {
        fallbackResponse = `**GenAI Planning Advice for "${event.name}":**\n\n` +
          `• **Curate Emotional Anchor Points:** Whether it is a surprise photo montage, a grandfather's blessing, or a synchronized family dance, plan 1-2 highlight moments.\n` +
          `• **Guest Comfort First:** Ensure clear parking signage, hydration/chai counters on arrival, and comfortable seating for elders.\n` +
          `• **Digital Invitations:** Use our **Card Studio** to export high-resolution multilingual cards in English, Hindi, Marathi, Gujarati, or Spanish for WhatsApp and digital passes!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: fallbackResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    onToast?.('Response copied to clipboard!', 'success');
  };

  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-modal-title"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="assistant-modal-title" className="text-base sm:text-lg font-bold text-slate-100">
                  GenAI Planning Assistant
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {event.category} Copilot
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-sm sm:max-w-md">
                Real-time decisions, budgeting advice, timeline strategies & ideas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'reset',
                    sender: 'assistant',
                    text: `Session refreshed. How can I help you refine the budget, schedule, or vendors for "${event.name}"?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Reset Chat Session"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-1"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/30">
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.text, index)}
                        className="hover:text-white p-0.5"
                        title="Copy answer"
                      >
                        {copiedIndex === index ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px]">GenAI Copilot formulating tailored plan...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Ribbon */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" /> Suggested:
          </span>
          {prompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-3 py-1 rounded-xl text-[11px] font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-700/60 shrink-0 transition-colors truncate max-w-xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask anything about ${event.name} (budgets, schedules, vendors, ideas)...`}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 transition-all disabled:opacity-40"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantModal;
