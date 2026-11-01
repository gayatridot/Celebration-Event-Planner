import React from 'react';
import { Sparkles, Plus, KeyRound, RefreshCw, CalendarDays, Bot } from 'lucide-react';

export const Navbar = ({
  eventCount,
  onOpenCreateModal,
  onOpenAssistant,
  onOpenApiModal,
  onResetSamples,
  hasApiKey
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[1.5px] shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-amber-200 to-rose-200 bg-clip-text text-transparent">
                Celebration & Event Planner
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              GenAI-powered planning for weddings, birthdays & community festivals
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Events Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
            <span>{eventCount} {eventCount === 1 ? 'Event' : 'Events'}</span>
          </div>

          {/* AI Planning Copilot Button */}
          <button
            onClick={onOpenAssistant}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-purple-200 border border-purple-500/30 transition-all shadow-sm"
            title="Open GenAI Planning Copilot"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Reset Demo Events Button */}
          <button
            onClick={onResetSamples}
            title="Reset to default sample celebrations"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
            title="Configure Gemini API Key"
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">AI Settings</span>
            <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400 ring-2 ring-emerald-500/20' : 'bg-cyan-400'}`} />
          </button>

          {/* Create Event CTA */}
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-600 hover:from-indigo-600 hover:to-emerald-700 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>
    </header>
  );
};
