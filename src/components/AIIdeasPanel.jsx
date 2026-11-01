import React, { useState, useEffect } from 'react';
import {
  Lightbulb, Pin, Copy, RefreshCw, X, Check, Heart,
  Utensils, Music, Camera, Palette, Gift, Shirt, PartyPopper,
  ChevronRight
} from 'lucide-react';
import { getStoredApiKey } from '../services/storageService';

// Idea categories
const IDEA_CATEGORIES = [
  { id: 'theme', label: 'Theme & Decor Concepts', icon: Palette, color: 'text-rose-400 bg-rose-500/10' },
  { id: 'food', label: 'Culinary & Beverage Curation', icon: Utensils, color: 'text-amber-400 bg-amber-500/10' },
  { id: 'entertainment', label: 'Entertainment & Activities', icon: PartyPopper, color: 'text-purple-400 bg-purple-500/10' },
  { id: 'favors', label: 'Favors & Keepsake Gifts', icon: Gift, color: 'text-emerald-400 bg-emerald-500/10' },
  { id: 'dress', label: 'Dress Code & Styling Guide', icon: Shirt, color: 'text-cyan-400 bg-cyan-500/10' },
  { id: 'music', label: 'Music & Atmosphere Playlist', icon: Music, color: 'text-indigo-400 bg-indigo-500/10' },
  { id: 'photo', label: 'Photo Moments & Instagram Spots', icon: Camera, color: 'text-pink-400 bg-pink-500/10' },
  { id: 'personal', label: 'Unique Personal & Cultural Touches', icon: Heart, color: 'text-amber-300 bg-amber-400/10' }
];

// Rich cultural fallback idea repository
const CULTURAL_IDEAS_DATABASE = {
  Marriage: {
    theme: [
      { title: 'Royal Rajwada Sunset Mandap', desc: 'Carved jharokhas with cascading marigolds, brass urlis with floating candles, and vintage velvet bolsters.' },
      { title: 'Minimalist Botanical Garden Vows', desc: 'Eucalyptus garlands, white tuberoses, fairy-light canopies, and warm timber geometric arches.' },
      { title: 'Midnight Starlight Sangeet', desc: 'Deep indigo & champagne drapery, mirror-mosaic stage backdrops, and fiber-optic starry skies.' }
    ],
    food: [
      { title: 'Live Artisanal Chaat & Kulhad Station', desc: 'Fresh banarasi tamatar chaat, palak patta crisps, and saffron malai rabdi in earthen pots.' },
      { title: 'Signature Couple Mocktails', desc: 'Craft two bespoke drinks: "The Royal Groom" (spiced guava) and "Blushing Bride" (rose petal elderflower fizz).' },
      { title: 'Midnight Masala Chai & Jalebi Counter', desc: 'Crispy hot kesar jalebis with steamed ginger chai served during the late-night pheras.' }
    ],
    entertainment: [
      { title: 'Interactive Audio Guestbook Telephone', desc: 'A vintage rotary telephone where guests pick up the receiver and record voice blessings for the couple.' },
      { title: 'Flashmob Sangeet Finale', desc: 'Surprise synchronized choreography uniting both bride & groom families on the dance floor.' },
      { title: 'Live Sufi & Folk Fusion Acoustic Duo', desc: 'Soulful live acoustic renditions during dinner to create an unforgettable warm ambience.' }
    ],
    favors: [
      { title: 'Artisanal Brass Diyas & Honey Jars', desc: 'Handcrafted mini brass lamps with organic saffron-infused honey pots in block-printed pouches.' },
      { title: 'Customized Scented Soy Candles', desc: 'Mogra & sandalwood scented candles stamped with the wedding monogram and date.' }
    ],
    dress: [
      { title: 'Royal Heritage Velvet & Pastel Silk', desc: 'Guests invited in soft pastel silks for morning rituals, switching to jewel-toned velvets for the grand evening gala.' }
    ],
    music: [
      { title: 'Shehnai Fusion & Acoustic Sitar Entrance', desc: 'Instrumental acoustic crossover of classical raagas blended with modern cinematic soundtracks.' }
    ],
    photo: [
      { title: 'Floral Mirror Selfie Arch', desc: 'Full-length baroque mirror framed with bougainvillea and a custom neon sign: "Better Together".' }
    ],
    personal: [
      { title: 'Ancestral Photo Tribute Gallery', desc: 'Framed black-and-white wedding portraits of parents and grandparents honouring family lineage.' }
    ]
  },
  Birthday: {
    theme: [
      { title: 'Neon Disco Roller Gala', desc: 'Glow-in-the-dark LED bracelets, roller-skating music, retro synthwave lights and iridescent balloon clusters.' },
      { title: 'Enchanted Secret Garden Adventure', desc: 'Moss-covered centerpieces, fairy lights in bell jars, butterfly installations and floral crowns.' },
      { title: 'Hollywood Red Carpet VIP Premiere', desc: 'Stanchions, red velvet runner, custom step-and-repeat backdrop, and Oscars-style golden statues.' }
    ],
    food: [
      { title: 'Gourmet Slider & Mini Taco Bar', desc: 'Bite-sized sliders, Mexican street corn cups, and build-your-own taco plates with vibrant salsas.' },
      { title: 'Liquid Nitrogen Ice Cream Alchemy', desc: 'Live flash-frozen dessert bar creating custom smoking ice cream scoops in front of guests.' }
    ],
    entertainment: [
      { title: 'Crowd-Sourced Video Roast / Toast Reel', desc: 'A 5-minute video compilation of hilarious and heartfelt video clips from friends worldwide.' },
      { title: 'Interactive Trivia & Memory Wheel', desc: 'Custom quiz game about the birthday star with funny forfeit challenges and prizes.' }
    ],
    favors: [
      { title: 'Personalized Polaroid Keepsake Keychains', desc: 'Take instant photos of each guest during the party and slip them into personalized acrylic keychains.' }
    ],
    dress: [
      { title: 'Retro 80s Glam or Chic Monochrome', desc: 'Choose a playful color dress code like all-black chic or retro pastel vibes.' }
    ],
    music: [
      { title: 'Decade-by-Decade Dance Throwbacks', desc: 'Playlist curated with the #1 billboard hits from each year of the celebrant\'s life.' }
    ],
    photo: [
      { title: '360-Degree Video Spin Platform', desc: 'Slow-motion confetti video booth creating instant viral reels for guests to air-drop.' }
    ],
    personal: [
      { title: 'Time Capsule Message Box', desc: 'Guests write letters or predictions for the birthday celebrant to open on their next milestone birthday.' }
    ]
  },
  Community: {
    theme: [
      { title: 'Eco-Friendly Heritage Festival', desc: 'Biodegradable bamboo pavilions, khadi fabric banners, solar-powered fairy lanterns, and terracotta planters.' },
      { title: 'Unity & Harmony Cultural Bazaar', desc: 'Multi-regional art pavilions, interactive pottery workshops, and community message mural walls.' }
    ],
    food: [
      { title: 'Regional Flavors Food Street', desc: 'Stalls showcasing specialties from different cultural regions run by community home chefs.' },
      { title: 'Zero-Waste Community Langar / Feast', desc: 'Nutritious communal meal served on leaf plates with zero single-use plastics.' }
    ],
    entertainment: [
      { title: 'Community Talent & Storytelling Showcase', desc: 'Youth dance performances, senior citizens’ folk songs, and theatrical sketches celebrating local history.' },
      { title: 'Inter-Neighborhood Tug-of-War & Games', desc: 'Friendly light-hearted sporting activities bringing diverse age groups together.' }
    ],
    favors: [
      { title: 'Seed Bombs & Plant Saplings', desc: 'Native flowering seed balls and tulsi/succulent pots packaged with a message on environmental stewardship.' }
    ],
    dress: [
      { title: 'Regional Cultural Splendor', desc: 'Encourage attendees to wear handloom weaves and traditional regional outfits representing their roots.' }
    ],
    music: [
      { title: 'Live Percussion Dhol & Brass Band Parade', desc: 'High-energy marching percussion group welcoming attendees at the entrance grounds.' }
    ],
    photo: [
      { title: 'Community "Humans of Our Neighborhood" Wall', desc: 'Portrait wall highlighting unsung local heroes, volunteers, teachers, and shopkeepers.' }
    ],
    personal: [
      { title: 'Senior Citizens Honor Ceremony', desc: 'Special shawl and felicitation ceremony acknowledging the elder pioneers of the community.' }
    ]
  }
};

export const AIIdeasPanel = ({ isOpen, onClose, event, onToast }) => {
  const storageKey = event?.id ? `event_ideas_${event.id}` : 'temp_ideas';

  // Local state for pinned ideas
  const [pinnedIdeas, setPinnedIdeas] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse pinned ideas:', e);
    }
    return [];
  });

  // Sync pinned ideas
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(pinnedIdeas));
    } catch (e) {
      console.error('Failed to save pinned ideas:', e);
    }
  }, [pinnedIdeas, storageKey]);

  // Active Category State
  const [activeCategoryId, setActiveCategoryId] = useState('theme');
  const [ideasCache, setIdeasCache] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const activeCategory = IDEA_CATEGORIES.find((c) => c.id === activeCategoryId) || IDEA_CATEGORIES[0];

  // Fetch or generate ideas for selected category
  const generateIdeasForCategory = async (catId = activeCategoryId, forceRefresh = false) => {
    if (!forceRefresh && ideasCache[catId]) {
      return;
    }

    setIsLoading(true);
    const categoryObj = IDEA_CATEGORIES.find((c) => c.id === catId);
    const apiKey = getStoredApiKey();

    if (apiKey && apiKey.trim() !== '') {
      try {
        const prompt = `You are an acclaimed creative director and experiential event designer for high-end celebrations.
Generate 5 imaginative, personalized, and culturally resonant ideas for this event category:
Event Name: "${event.name}"
Category: "${event.category}"
Date: "${event.date}"
Host: "${event.host}"
Venue: "${event.venue}"
Idea Domain: "${categoryObj.label}"
Additional Event Context: "${event.description || ''}"

Return strictly valid JSON with this exact schema (no markdown, just JSON):
{
  "ideas": [
    {
      "title": "Creative, punchy concept title",
      "desc": "2-3 sentences explaining how to execute this idea with elegance and high guest impact.",
      "budgetImpact": "Low / Medium / High",
      "wowFactor": "High / Exceptional"
    }
  ]
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.85,
                maxOutputTokens: 900,
                responseMimeType: 'application/json'
              }
            })
          }
        );

        if (res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(raw.replace(/```json/gi, '').replace(/```/g, '').trim());
            if (Array.isArray(parsed.ideas) && parsed.ideas.length > 0) {
              setIdeasCache((prev) => ({
                ...prev,
                [catId]: { items: parsed.ideas, source: 'gemini-1.5-flash' }
              }));
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Gemini AI idea generator error, falling back to database:', err);
      }
    }

    // Fallback Ideas from Database
    const categoryDb =
      CULTURAL_IDEAS_DATABASE[event.category]?.[catId] ||
      CULTURAL_IDEAS_DATABASE['Marriage']?.[catId] ||
      CULTURAL_IDEAS_DATABASE['Community']?.[catId] ||
      [
        {
          title: `Bespoke ${categoryObj.label} Arrangement`,
          desc: `Curate personalized touches reflecting ${event.host}'s style and the spirit of ${event.name} with warm lighting and authentic aesthetics.`,
          budgetImpact: 'Medium',
          wowFactor: 'High'
        }
      ];

    setIdeasCache((prev) => ({
      ...prev,
      [catId]: {
        items: categoryDb.map((item) => ({
          ...item,
          budgetImpact: item.budgetImpact || 'Medium',
          wowFactor: item.wowFactor || 'High'
        })),
        source: 'smart-cultural-engine'
      }
    }));
    setIsLoading(false);
  };

  // Trigger load on category change
  useEffect(() => {
    generateIdeasForCategory(activeCategoryId);
  }, [activeCategoryId, event.id]);

  // Toggle Pin Idea
  const handleTogglePin = (idea) => {
    const isPinned = pinnedIdeas.some((p) => p.title === idea.title);
    if (isPinned) {
      setPinnedIdeas((prev) => prev.filter((p) => p.title !== idea.title));
      onToast?.(`Removed "${idea.title}" from saved ideas`, 'info');
    } else {
      const newPin = {
        id: `pin-${Date.now()}`,
        category: activeCategory.label,
        title: idea.title,
        desc: idea.desc,
        budgetImpact: idea.budgetImpact,
        pinnedAt: new Date().toISOString()
      };
      setPinnedIdeas((prev) => [newPin, ...prev]);
      onToast?.(`Pinned "${idea.title}" to your idea board!`, 'success');
    }
  };

  // Copy single idea
  const handleCopyIdea = (idea, id) => {
    const text = `💡 ${idea.title}\n${idea.desc}\n(Category: ${activeCategory.label} • Event: ${event.name})`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    onToast?.('Idea copied to clipboard!', 'success');
  };

  // Copy all pinned ideas
  const handleCopyAllPinned = () => {
    if (pinnedIdeas.length === 0) return;
    const text = `✨ Curated Event Ideas for "${event.name}" (${event.category})
${pinnedIdeas
  .map(
    (p, i) =>
      `${i + 1}. [${p.category}] ${p.title}\n   ${p.desc}`
  )
  .join('\n\n')}`;
    navigator.clipboard.writeText(text);
    onToast?.('All saved ideas copied to clipboard!', 'success');
  };

  const currentCategoryData = ideasCache[activeCategoryId] || { items: [] };

  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-ideas-title"
    >
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-indigo-500/20 border border-amber-500/30 text-amber-300">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ai-ideas-title" className="text-base sm:text-lg font-bold text-slate-100">
                  GenAI Event Concept & Inspiration Studio
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {event.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-sm sm:max-w-md">
                Bespoke themes, decor, menus & interactive activities for "{event.name}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pinnedIdeas.length > 0 && (
              <button
                onClick={handleCopyAllPinned}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
                title="Copy all pinned ideas"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Export Pinned ({pinnedIdeas.length})</span>
              </button>
            )}

            <button
              onClick={() => generateIdeasForCategory(activeCategoryId, true)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-pink-500/20 hover:from-amber-500/30 hover:to-pink-500/30 text-amber-200 border border-amber-500/30 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Regenerate</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-1"
              aria-label="Close Ideas Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Layout: Split Sidebar & Ideas Stream */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Categories Sidebar (4 Cols) */}
          <div className="lg:col-span-4 p-4 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/40 overflow-y-auto space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-2">
              Inspiration Categories
            </span>

            {IDEA_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategoryId === cat.id;
              const pinnedCountInCat = pinnedIdeas.filter((p) => p.category === cat.label).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-slate-100 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border border-current/20 ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{cat.label}</div>
                      <div className="text-[10px] text-slate-500">
                        {event.category} curated concepts
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {pinnedCountInCat > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {pinnedCountInCat} pinned
                      </span>
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 opacity-40 ${isSelected ? 'opacity-100 text-indigo-400' : ''}`} />
                  </div>
                </button>
              );
            })}

            {/* Pinned Ideas Quick Tray */}
            {pinnedIdeas.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block px-2 mb-2 flex items-center gap-1.5">
                  <Pin className="w-3.5 h-3.5 text-amber-400" />
                  Saved Favorited Ideas ({pinnedIdeas.length})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {pinnedIdeas.map((pin) => (
                    <div
                      key={pin.id}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between gap-2"
                    >
                      <div className="truncate">
                        <div className="font-semibold text-slate-200 truncate">{pin.title}</div>
                        <div className="text-[10px] text-slate-500 truncate">{pin.category}</div>
                      </div>
                      <button
                        onClick={() => handleTogglePin(pin)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Unpin idea"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Ideas Feed (8 Cols) */}
          <div className="lg:col-span-8 p-5 overflow-y-auto bg-slate-950/20 space-y-4">
            {/* Category Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <activeCategory.icon className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm sm:text-base font-bold text-slate-100">
                  {activeCategory.label}
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Powered by {currentCategoryData.source === 'gemini-1.5-flash' ? 'Google Gemini AI' : 'Smart Cultural Engine'}
              </span>
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 mx-auto text-amber-400 animate-spin" />
                <p className="text-sm text-slate-300">
                  GenAI is synthesizing aesthetic themes, cultural touchpoints & guest memories...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentCategoryData.items?.map((idea, index) => {
                  const isPinned = pinnedIdeas.some((p) => p.title === idea.title);
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isPinned
                          ? 'bg-slate-900/90 border-amber-500/40 ring-1 ring-amber-500/20'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-200 transition-colors">
                            {idea.title}
                          </h4>

                          <button
                            onClick={() => handleTogglePin(idea)}
                            className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                              isPinned
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                            }`}
                            title={isPinned ? 'Unpin Idea' : 'Pin Idea'}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                          {idea.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {idea.budgetImpact && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                              Budget: {idea.budgetImpact}
                            </span>
                          )}
                          {idea.wowFactor && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                              {idea.wowFactor} Impact
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleCopyIdea(idea, index)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                          title="Copy text"
                        >
                          {copiedId === index ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIIdeasPanel;
