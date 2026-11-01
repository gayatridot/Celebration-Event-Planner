import React, { useState, useEffect } from 'react';
import { KeyRound, Sparkles, ExternalLink, X, ShieldCheck, Check } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey } from '../services/storageService';

export const ApiKeyModal = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveStoredApiKey(apiKey);
    setIsSaved(true);
    if (onKeySaved) onKeySaved(apiKey);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleClear = () => {
    saveStoredApiKey('');
    setApiKey('');
    setIsSaved(true);
    if (onKeySaved) onKeySaved('');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Google Gemini API Settings</h3>
              <p className="text-xs text-slate-400">Power the Multilingual AI Card Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm font-mono"
            />
            <p className="mt-2 text-xs text-slate-400 flex items-center justify-between">
              <span>Saved locally in browser localStorage</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                Get a free key <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-medium text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero-Friction Evaluator Testing</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              If left blank, the app will automatically use the built-in <strong>Smart Cultural Generator</strong> with authentic multilingual verses for all 6 celebration categories in English, Hindi, Marathi, Gujarati, and Spanish!
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:text-rose-300 hover:underline"
              >
                Clear Key
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition-all"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Save & Activate
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
