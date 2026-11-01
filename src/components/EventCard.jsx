import React, { useState } from 'react';
import {
  Sparkles, Calendar, Clock, MapPin, User, Edit3, Trash2, ArrowUpRight,
  Wallet, ListChecks, Store, Lightbulb, Bot
} from 'lucide-react';
import { EVENT_CATEGORIES } from '../constants/categories';

export const EventCard = ({
  event,
  onOpenCardStudio,
  onOpenBudget,
  onOpenTimeline,
  onOpenVendors,
  onOpenIdeas,
  onOpenAssistant,
  onEdit,
  onDelete
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const categoryMeta = EVENT_CATEGORIES.find((c) => c.id === event.category) || EVENT_CATEGORIES[0];

  // Calculate days difference
  const getDaysBadge = () => {
    if (!event.date) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(event.date);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { text: 'Today! 🎉', style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse' };
    } else if (diffDays === 1) {
      return { text: 'Tomorrow', style: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    } else if (diffDays > 1) {
      return { text: `In ${diffDays} days`, style: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
    } else {
      return { text: 'Past event', style: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  const daysBadge = getDaysBadge();

  // Format date readable
  const formattedDate = (() => {
    try {
      const d = new Date(event.date);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return event.date;
    }
  })();

  // Format time (12-hour format)
  const formattedTime = (() => {
    if (!event.time) return '';
    try {
      const [h, m] = event.time.split(':');
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const cleanH = hour % 12 || 12;
      return `${cleanH}:${m} ${ampm}`;
    } catch {
      return event.time;
    }
  })();

  return (
    <div className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col justify-between">
      {/* Top Accent Gradient Bar */}
      <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${categoryMeta.color} rounded-full opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div>
        {/* Header row: Category Pill + Countdown Pill + Assistant Quick Pill */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md bg-slate-950/60 border-slate-700/60 text-slate-200">
            <span>{categoryMeta.emoji}</span>
            <span>{event.category}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {daysBadge && (
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${daysBadge.style}`}>
                {daysBadge.text}
              </span>
            )}

            {/* Quick AI Assistant Trigger */}
            <button
              onClick={() => onOpenAssistant?.(event)}
              className="p-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
              title="Open GenAI Planning Assistant"
              aria-label="Ask AI Assistant about this event"
            >
              <Bot className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight group-hover:text-amber-200 transition-colors line-clamp-2">
          {event.name}
        </h3>

        {/* Optional Description */}
        {event.description && (
          <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Meta Grid */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium">{formattedDate}</span>
            {formattedTime && (
              <>
                <span className="text-slate-600">•</span>
                <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{formattedTime}</span>
              </>
            )}
          </div>

          {/* Venue */}
          <div className="flex items-center gap-2 text-slate-400 truncate">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate" title={event.venue}>{event.venue}</span>
          </div>

          {/* Host */}
          <div className="flex items-center gap-2 text-slate-400 truncate">
            <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate" title={event.host}>Host: {event.host}</span>
          </div>
        </div>

        {/* Feature Action Grid (Budgets, Timelines, Vendors, Ideas) */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
          {/* Budget */}
          <button
            onClick={() => onOpenBudget?.(event)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950/60 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-all text-left"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="font-semibold block text-[11px]">Budget</span>
              <span className="text-[10px] text-slate-500">Expenses & ROI</span>
            </div>
          </button>

          {/* Timeline */}
          <button
            onClick={() => onOpenTimeline?.(event)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950/60 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-300 transition-all text-left"
          >
            <ListChecks className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <div className="truncate">
              <span className="font-semibold block text-[11px]">Timeline</span>
              <span className="text-[10px] text-slate-500">Checklists</span>
            </div>
          </button>

          {/* Vendors */}
          <button
            onClick={() => onOpenVendors?.(event)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950/60 hover:bg-amber-950/30 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-all text-left"
          >
            <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="font-semibold block text-[11px]">Vendors</span>
              <span className="text-[10px] text-slate-500">Quotes & Ratings</span>
            </div>
          </button>

          {/* AI Ideas */}
          <button
            onClick={() => onOpenIdeas?.(event)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950/60 hover:bg-purple-950/30 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 transition-all text-left"
          >
            <Lightbulb className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <div className="truncate">
              <span className="font-semibold block text-[11px]">AI Ideas</span>
              <span className="text-[10px] text-slate-500">Themes & Menus</span>
            </div>
          </button>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {/* Card Studio CTA (Primary) */}
        <button
          onClick={() => onOpenCardStudio(event)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-indigo-500/20 hover:from-amber-500 hover:via-rose-500 hover:to-indigo-500 text-amber-200 hover:text-white border border-amber-500/30 hover:border-transparent transition-all duration-200 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-400 group-hover:text-white" />
          <span>Card Studio</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        {/* Secondary Edit & Delete */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(event)}
            title="Edit Event"
            aria-label="Edit Event Details"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {showConfirmDelete ? (
            <div className="flex items-center gap-1 bg-rose-950/80 border border-rose-500/40 rounded-xl px-2 py-1">
              <span className="text-[10px] text-rose-300 font-semibold">Delete?</span>
              <button
                onClick={() => onDelete(event.id)}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-200 px-1"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="text-[11px] text-slate-400 hover:text-slate-200 px-1"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmDelete(true)}
              title="Delete Event"
              aria-label="Delete Event"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
