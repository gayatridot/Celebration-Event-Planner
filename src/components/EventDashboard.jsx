import React, { useState, useMemo, useRef } from 'react';
import { Search, Sparkles, Plus } from 'lucide-react';
import { EventCard } from './EventCard';
import { EVENT_CATEGORIES } from '../constants/categories';


// Decorative invitation-card animation used in the dashboard hero.
// It is self-contained, so no additional component or CSS file is required.
const HeroInvitationAnimation = () => {
  const sceneRef = useRef(null);

  const handleMouseMove = (event) => {
    if (
      !sceneRef.current ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    const bounds = sceneRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    sceneRef.current.style.setProperty('--parallax-x', `${x * 12}px`);
    sceneRef.current.style.setProperty('--parallax-y', `${y * 12}px`);
  };

  const resetMouse = () => {
    if (!sceneRef.current) return;
    sceneRef.current.style.setProperty('--parallax-x', '0px');
    sceneRef.current.style.setProperty('--parallax-y', '0px');
  };

  return (
    <div
      ref={sceneRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMouse}
      className="invitation-hero-scene relative mx-auto h-[390px] w-full max-w-[490px] overflow-hidden rounded-3xl sm:h-[440px] lg:h-[460px]"
      aria-label="Animated showcase of wedding, birthday and celebration invitation cards"
    >
      <style>{`
        @keyframes invitation-card-float {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -13px; }
        }
        @keyframes invitation-card-float-back {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 12px; }
        }
        @keyframes invitation-decoration-float {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -15px; }
        }
        @keyframes invitation-sparkle {
          0%, 100% { opacity: .25; scale: .7; }
          50% { opacity: 1; scale: 1.2; }
        }
        @keyframes invitation-orbit-glow {
          0%, 100% { opacity: .65; }
          50% { opacity: 1; }
        }
        @keyframes invitation-platform-pulse {
          from { opacity: .45; scale: .85; }
          to { opacity: 1; scale: 1.15; }
        }
        .invitation-main-card {
          transform: translate(var(--parallax-x, 0px), var(--parallax-y, 0px)) rotate(-8deg);
          animation: invitation-card-float 5.5s ease-in-out infinite;
        }
        .invitation-middle-card {
          transform: translate(var(--parallax-x, 0px), var(--parallax-y, 0px)) rotate(9deg);
          animation: invitation-card-float-back 5s ease-in-out infinite;
        }
        .invitation-back-card {
          transform: translate(var(--parallax-x, 0px), var(--parallax-y, 0px)) rotate(14deg);
          animation: invitation-card-float 6s ease-in-out infinite;
        }
        .invitation-decoration {
          animation: invitation-decoration-float 4s ease-in-out infinite;
        }
        .invitation-sparkle {
          animation: invitation-sparkle 2s ease-in-out infinite;
        }
        .invitation-orbit {
          animation: invitation-orbit-glow 3s ease-in-out infinite;
        }
        .invitation-platform-light {
          animation: invitation-platform-pulse 2s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .invitation-hero-scene *,
          .invitation-hero-scene *::before,
          .invitation-hero-scene *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Soft ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[85px]" />
      <div className="pointer-events-none absolute bottom-8 left-1/3 h-40 w-64 rounded-full bg-amber-500/10 blur-[65px]" />

      {/* Glowing orbit rings */}
      <div className="invitation-orbit pointer-events-none absolute left-[3%] top-[44%] z-[4] h-24 w-[94%] rotate-[-12deg] rounded-[50%] border-y-2 border-amber-300/80 shadow-[0_0_15px_rgba(255,179,77,0.65)]" />
      <div className="invitation-orbit pointer-events-none absolute left-[9%] top-[56%] z-[4] h-16 w-[83%] rotate-[12deg] rounded-[50%] border-y border-violet-300/50" />

      {/* Back card: birthday */}
      <div className="invitation-back-card absolute left-[48%] top-[17%] z-[1] flex h-[260px] w-[166px] flex-col items-center justify-center rounded-xl border border-fuchsia-300/70 bg-gradient-to-br from-violet-800 to-[#211638] px-3 text-center text-amber-100 shadow-[0_20px_50px_rgba(0,0,0,.4)] sm:h-[300px] sm:w-[190px]">
        <span className="mb-4 text-2xl text-amber-200">✦</span>
        <span className="mb-4 text-[7px] tracking-[.25em] sm:text-[8px]">A SPECIAL DAY</span>
        <h3 className="font-serif text-2xl leading-tight sm:text-3xl">Let's<br />Celebrate!</h3>
        <span className="mt-5 text-xl">✧ 🎂 ✧</span>
        <span className="absolute bottom-5 text-[6px] tracking-[.2em] sm:text-[7px]">BIRTHDAY INVITATION</span>
      </div>

      {/* Middle card: celebration */}
      <div className="invitation-middle-card absolute left-[34%] top-[14%] z-[2] flex h-[270px] w-[170px] flex-col items-center justify-center rounded-xl border-2 border-amber-300/90 bg-gradient-to-br from-[#fff4df] to-[#eac8b6] px-3 text-center text-[#603c35] shadow-[0_20px_50px_rgba(0,0,0,.35)] sm:h-[310px] sm:w-[195px]">
        <span className="mb-4 text-2xl text-amber-700">✧</span>
        <span className="mb-4 text-[7px] tracking-[.22em] sm:text-[8px]">YOU ARE INVITED</span>
        <h3 className="font-serif text-2xl leading-tight sm:text-3xl">Join the<br />Celebration</h3>
        <span className="mt-5 text-xl">✦ ✨ ✦</span>
        <span className="absolute bottom-5 text-[6px] tracking-[.16em] sm:text-[7px]">A MOMENT TO REMEMBER</span>
      </div>

      {/* Main wedding invitation */}
      <div className="invitation-main-card absolute left-[12%] top-[12%] z-[3] h-[275px] w-[178px] rounded-xl border-2 border-amber-300 bg-gradient-to-br from-[#20244f] via-[#111735] to-[#080d27] p-2 text-amber-200 shadow-[0_24px_65px_rgba(0,0,0,.55),0_0_28px_rgba(255,187,87,.18)] sm:left-[15%] sm:h-[320px] sm:w-[210px]">
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden border border-amber-300/60 px-2 text-center">
          <span className="absolute left-2 top-2 text-lg text-amber-300">❀</span>
          <span className="absolute right-2 top-2 text-lg text-amber-300">❀</span>
          <span className="text-[6px] tracking-[.18em] sm:text-[7px]">TOGETHER WITH THEIR FAMILIES</span>
          <h3 className="mt-6 font-serif text-[36px] italic leading-[1.08] text-amber-200 drop-shadow-[0_0_14px_rgba(255,198,113,.4)] sm:mt-8 sm:text-[43px]">
            You're<br />Invited
          </h3>
          <div className="mt-4 flex items-center gap-2 text-sm"><span>────</span><span>♡</span><span>────</span></div>
          <span className="mt-3 text-2xl sm:text-3xl">♧ ♧</span>
          <span className="mt-4 text-[6px] tracking-[.16em] sm:text-[7px]">A BEAUTIFUL BEGINNING</span>
          <span className="absolute bottom-2 left-2 text-lg text-amber-300">❀</span>
          <span className="absolute bottom-2 right-2 text-lg text-amber-300">❀</span>
        </div>
      </div>

      {/* Floating celebration details */}
      <span className="invitation-decoration absolute right-[12%] top-[5%] z-[5] text-4xl drop-shadow-[0_0_12px_rgba(255,178,83,.5)] sm:text-5xl">💌</span>
      <span className="invitation-decoration absolute bottom-[17%] right-[6%] z-[5] text-3xl [animation-delay:-1.5s] sm:text-4xl">🎁</span>
      <span className="invitation-decoration absolute bottom-[23%] left-[5%] z-[5] text-2xl [animation-delay:-2s] sm:text-3xl">🎀</span>
      <span className="invitation-decoration absolute left-[17%] top-[7%] z-[5] text-3xl [animation-delay:-1s] sm:text-4xl">🌸</span>
      <span className="invitation-decoration absolute bottom-[12%] left-[18%] z-[5] text-3xl [animation-delay:-2.5s] sm:text-4xl">🌺</span>

      {/* Tiny golden sparkles */}
      {[
        'left-[7%] top-[23%]',
        'right-[7%] top-[32%]',
        'left-[12%] bottom-[13%]',
        'right-[28%] top-[12%]',
        'left-[5%] top-[57%]',
        'right-[16%] bottom-[22%]',
      ].map((position, index) => (
        <span
          key={index}
          className={`invitation-sparkle absolute z-[6] text-lg text-amber-300 drop-shadow-[0_0_10px_#ffb33d] ${position}`}
          style={{ animationDelay: `${index * 0.3}s` }}
        >
          {index % 2 === 0 ? '✦' : '✧'}
        </span>
      ))}

      {/* Glowing platform beneath the cards */}
      <div className="pointer-events-none absolute bottom-[5%] left-[17%] h-9 w-[68%] rounded-[50%] border border-violet-300/40 shadow-[0_0_24px_rgba(135,75,255,.4),inset_0_0_20px_rgba(135,75,255,.2)] [transform:perspective(200px)_rotateX(55deg)]">
        <div className="invitation-platform-light absolute left-1/2 top-1/2 h-1 w-1/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100 shadow-[0_0_15px_6px_#ffb74d]" />
      </div>
    </div>
  );
};

export const EventDashboard = ({
  events,
  onOpenCreateModal,
  onOpenCardStudio,
  onOpenBudget,
  onOpenTimeline,
  onOpenVendors,
  onOpenIdeas,
  onOpenAssistant,
  onEditEvent,
  onDeleteEvent
}) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-asc'); // 'date-asc' | 'date-desc' | 'name'

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        const matchesCategory = selectedCategory === 'ALL' || evt.category === selectedCategory;
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          evt.name?.toLowerCase().includes(query) ||
          evt.venue?.toLowerCase().includes(query) ||
          evt.host?.toLowerCase().includes(query) ||
          evt.category?.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'date-asc') {
          return new Date(a.date) - new Date(b.date);
        } else if (sortBy === 'date-desc') {
          return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'name') {
          return (a.name || '').localeCompare(b.name || '');
        }
        return 0;
      });
  }, [events, selectedCategory, searchQuery, sortBy]);

  // Compute metrics
  const stats = useMemo(() => {
    const total = events.length;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcoming = events.filter((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      return d >= now;
    }).length;

    // Category with most events
    const catCounts = events.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});

    let topCat = 'Celebrations';
    let max = 0;
    Object.entries(catCounts).forEach(([k, v]) => {
      if (v > max) {
        max = v;
        topCat = k;
      }
    });

    return { total, upcoming, topCat };
  }, [events]);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner with invitation-card animation */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 p-6 shadow-2xl sm:p-8 md:p-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-3">
          {/* Left: existing hero copy and metrics */}
          <div className="relative z-10 min-w-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-indigo-500/15 px-3.5 py-1 text-xs font-semibold text-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>GenAI Celebration & Event Planning Assistant</span>
            </div>

            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-100 sm:text-4xl md:text-5xl">
              Plan Grand Occasions. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
                Budgets, Timelines & AI Ideas.
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Your intelligent event concierge for weddings, birthdays, and community festivals. Effortlessly manage <strong>real-time budgets</strong>, <strong>countdown milestone checklists</strong>, <strong>vendor quotes & ratings</strong>, <strong>AI concept inspiration</strong>, and compose <strong>bilingual AI invitation cards</strong>.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-800/80 pt-6 text-xs sm:gap-8 sm:text-sm">
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400">Total Celebrations</span>
                <span className="text-xl font-bold text-slate-100 sm:text-2xl">{stats.total}</span>
              </div>
              <div className="hidden h-9 w-px self-center bg-slate-800 sm:block" />
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400">Upcoming Milestones</span>
                <span className="text-xl font-bold text-emerald-400 sm:text-2xl">{stats.upcoming}</span>
              </div>
              <div className="hidden h-9 w-px self-center bg-slate-800 sm:block" />
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400">Active Category Focus</span>
                <span className="text-xl font-bold text-amber-300 sm:text-2xl">{stats.topCat}</span>
              </div>
            </div>
          </div>

          {/* Right: animated invitation-card showcase */}
          <div className="relative z-0 flex min-w-0 items-center justify-center lg:-mr-4">
            <HeroInvitationAnimation />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="space-y-4">
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${selectedCategory === 'ALL'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-indigo-400'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
          >
            All Celebrations ({events.length})
          </button>

          {EVENT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = events.filter((e) => e.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-200 border border-amber-400/50 shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.id}</span>
                <span className="text-[11px] opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search and Sort Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event name, venue location, or host..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0 hidden md:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="date-asc">Date: Upcoming First</option>
              <option value="date-desc">Date: Furthest First</option>
              <option value="name">Event Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onOpenCardStudio={onOpenCardStudio}
              onOpenBudget={onOpenBudget}
              onOpenTimeline={onOpenTimeline}
              onOpenVendors={onOpenVendors}
              onOpenIdeas={onOpenIdeas}
              onOpenAssistant={onOpenAssistant}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800/80 rounded-3xl">
          <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
            🪔
          </div>
          <h3 className="text-lg font-bold text-slate-100">No Celebration Events Found</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'ALL'
              ? 'No events match your current filter criteria. Try adjusting or clearing your filters.'
              : 'Start by creating your first celebration or milestone event to design custom AI cards.'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            {searchQuery || selectedCategory !== 'ALL' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Reset Filters
              </button>
            ) : null}
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-500 to-emerald-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-emerald-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
