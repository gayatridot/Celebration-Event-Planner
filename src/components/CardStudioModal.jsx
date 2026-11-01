import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  Languages,
  Palette,
  RefreshCw,
  Sliders,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Flame,
  Award,
  Crown,
  Edit3,
  LayoutTemplate,
  PartyPopper,
  Gift
} from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { LANGUAGES, TONES } from '../constants/languages';
import { EVENT_CATEGORIES } from '../constants/categories';
import { generateCardContent } from '../services/geminiService';

// Expanded Vibrant & Event-Wise Theme Palette
export const THEMES = [
  {
    id: 'sunset-wedding',
    name: 'Sunset Vows (Wedding)',
    tag: 'Romantic & Warm',
    background: 'bg-gradient-to-br from-rose-500 via-pink-600 to-amber-500 text-white',
    borderColor: 'border-amber-200/80',
    borderGlow: 'shadow-[0_0_35px_rgba(251,113,133,0.45)]',
    textColor: 'text-amber-100',
    accentColor: 'text-rose-100',
    subtextColor: 'text-rose-50/90',
    dividerColor: 'from-amber-200/0 via-amber-200 to-amber-200/0',
    metaBg: 'bg-black/25 border border-white/20'
  },
  {
    id: 'birthday-confetti',
    name: 'Birthday Bash (Party)',
    tag: 'Vibrant & Playful',
    background: 'bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 text-white',
    borderColor: 'border-fuchsia-200/80',
    borderGlow: 'shadow-[0_0_35px_rgba(217,70,239,0.45)]',
    textColor: 'text-fuchsia-100',
    accentColor: 'text-amber-200',
    subtextColor: 'text-fuchsia-50/90',
    dividerColor: 'from-fuchsia-200/0 via-fuchsia-200 to-fuchsia-200/0',
    metaBg: 'bg-black/30 border border-white/20'
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold & Navy',
    tag: 'Classic Luxury',
    background: 'bg-gradient-to-br from-[#161b43] via-[#0f172a] to-[#090e17] text-amber-100',
    borderColor: 'border-amber-300/80',
    borderGlow: 'shadow-[0_0_35px_rgba(251,191,36,0.3)]',
    textColor: 'text-amber-200',
    accentColor: 'text-amber-300',
    subtextColor: 'text-slate-300',
    dividerColor: 'from-amber-300/0 via-amber-300 to-amber-300/0',
    metaBg: 'bg-slate-900/60 border border-amber-500/2og'
  },
  {
    id: 'emerald-royale',
    name: 'Emerald Royale',
    tag: 'Deep Green & Gold',
    background: 'bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-emerald-100',
    borderColor: 'border-emerald-300/70',
    borderGlow: 'shadow-[0_0_35px_rgba(52,211,153,0.3)]',
    textColor: 'text-emerald-200',
    accentColor: 'text-amber-300',
    subtextColor: 'text-emerald-50/80',
    dividerColor: 'from-emerald-300/0 via-emerald-300 to-emerald-300/0',
    metaBg: 'bg-emerald-900/40 border border-emerald-500/20'
  },
  {
    id: 'diwali-festive',
    name: 'Diwali Sparkle (Festive)',
    tag: 'Bright & Auspicious',
    background: 'bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 text-white',
    borderColor: 'border-yellow-300',
    borderGlow: 'shadow-[0_0_35px_rgba(250,204,21,0.5)]',
    textColor: 'text-yellow-200',
    accentColor: 'text-amber-100',
    subtextColor: 'text-amber-50',
    dividerColor: 'from-yellow-300/0 via-yellow-300 to-yellow-300/0',
    metaBg: 'bg-black/30 border border-yellow-400/30'
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    tag: 'Soft & Aesthetic',
    background: 'bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 text-slate-800',
    borderColor: 'border-purple-400',
    borderGlow: 'shadow-[0_0_35px_rgba(192,132,252,0.4)]',
    textColor: 'text-purple-950',
    accentColor: 'text-indigo-900',
    subtextColor: 'text-slate-700',
    dividerColor: 'from-purple-400/0 via-purple-500 to-purple-400/0',
    metaBg: 'bg-white/60 border border-purple-300'
  }
];

export const getThemeById = (id) => {
  return THEMES.find((t) => t.id === id) || THEMES[0];
};

export const CardStudioModal = ({
  isOpen,
  onClose,
  event,
  onToast
}) => {
  const categoryMeta = (event?.category && EVENT_CATEGORIES.find((c) => c.id === event.category)) || EVENT_CATEGORIES[0];

  // Map category to a bright intelligent default theme
  const getDefaultThemeForCategory = (cat) => {
    switch (cat) {
      case 'Marriage': return 'sunset-wedding';
      case 'Birthday': return 'birthday-confetti';
      case 'Diwali': return 'diwali-festive';
      case 'Party': return 'birthday-confetti';
      case 'New Year': return 'birthday-confetti';
      case 'Anniversary': return 'sunset-wedding';
      case 'Christmas': return 'emerald-royale';
      default: return 'royal-gold';
    }
  };

  // Studio States
  const [selectedThemeId, setSelectedThemeId] = useState(() => getDefaultThemeForCategory(event?.category));
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedTone, setSelectedTone] = useState('Warm & Poetic');
  const [fontChoice, setFontChoice] = useState('serif');
  const [borderStyle, setBorderStyle] = useState('ornate');
  const [activeTab, setActiveTab] = useState('design'); // 'design' | 'content'

  // Card Content State
  const [cardContent, setCardContent] = useState({
    headline: '',
    tagline: '',
    message: '',
    hostLine: '',
    specialNote: '',
    source: '',
    isLiveAi: false
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const cardRef = useRef(null);

  // Initialize card content when modal opens or event changes
  useEffect(() => {
    if (event) {
      setSelectedThemeId(getDefaultThemeForCategory(event.category));
      handleGenerate(selectedLang, selectedTone);
    }
  }, [event]);

  // AI Content Generator trigger
  const handleGenerate = async (lang = selectedLang, tone = selectedTone) => {
    setIsGenerating(true);
    try {
      const generated = await generateCardContent({
        event,
        language: lang,
        tone: tone
      });
      setCardContent(generated);
      if (generated.isLiveAi) {
        onToast?.('Card copy freshly generated with Google Gemini 1.5 Flash!', 'success');
      } else {
        onToast?.('Multilingual card copy generated via Smart Cultural Engine!', 'info');
      }
    } catch (err) {
      console.error('Generation error:', err);
      onToast?.('Could not generate AI card copy, used fallback.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Language switch handler
  const handleLanguageChange = (langCode) => {
    setSelectedLang(langCode);
    handleGenerate(langCode, selectedTone);
  };

  // Export Card as PNG via html2canvas
  const handleExportPng = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      await new Promise((r) => setTimeout(r, 100));

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const filename = `${(event?.name || 'Event').replace(/[^a-zA-Z0-9]/g, '_')}_Invitation_Card.png`;
      link.href = image;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      try {
        confetti({
          particleCount: 110,
          spread: 90,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn(e);
      }

      onToast?.(`Downloaded "${filename}" in high resolution!`, 'success');
    } catch (err) {
      console.error('Failed to export card image:', err);
      onToast?.('Failed to download card image. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy invitation text to clipboard
  const handleCopyText = () => {
    const textToCopy = `✨ ${cardContent.headline} ✨\n${cardContent.tagline}\n\n${cardContent.message}\n\n📅 Date: ${event.date}\n⏰ Time: ${event.time}\n📍 Venue: ${event.venue}\n\n${cardContent.hostLine}\n${cardContent.specialNote ? `\nNote: ${cardContent.specialNote}` : ''}`;

    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
    onToast?.('Invitation text copied to clipboard!', 'success');
  };

  const currentTheme = getThemeById(selectedThemeId);

  // Formatted event date
  const formattedDate = (() => {
    if (!event?.date) return '';
    try {
      const d = new Date(event.date);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return event?.date || '';
    }
  })();

  // Cultural / Occasion invocation header
  const getCulturalHeader = () => {
    switch (event?.category) {
      case 'Marriage':
        return selectedLang === 'hi' || selectedLang === 'mr' || selectedLang === 'gu'
          ? '|| श्री गणेशाय नमः ||'
          : '|| Auspicious Vivaha Mahotsav ||';
      case 'Birthday':
        return '✦ Happy Birthday Celebration ✦';
      case 'Party':
        return '✦ Celebration Time & Good Vibes ✦';
      case 'Diwali':
        return selectedLang === 'hi' || selectedLang === 'mr' || selectedLang === 'gu'
          ? '|| ॐ महालक्ष्म्यै नमः ||'
          : '|| Shubh Deepavali Mahotsav ||';
      case 'Christmas':
        return '★ Merry Christmas & Happy Holidays ★';
      case 'New Year':
        return '✦ Welcome 2027 Celebration ✦';
      case 'Corporate':
        return '◆ Distinguished Leadership Gathering ◆';
      case 'Anniversary':
        return '♥ Celebrating Everlasting Love ♥';
      default:
        return '✦ Auspicious Celebration ✦';
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-indigo-500/20 border border-amber-500/30 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  Gemini AI Card Studio
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {event.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-sm sm:max-w-md">
                Bespoke multilingual invitations for "{event.name}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{hasCopied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleExportPng}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Download PNG'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Body: Split View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

          {/* Left Controls Column with Tabs */}
          <div className="lg:col-span-5 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/40 overflow-hidden">

            {/* Sub-Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900/60 p-1.5 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('design')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${activeTab === 'design'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                Theme & Style
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${activeTab === 'content'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                AI Copy & Text
              </button>
            </div>

            {/* Scrollable Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {activeTab === 'design' ? (
                <>
                  {/* Theme Palette */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-amber-400" />
                      Vibrant Event Theme Palettes
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {THEMES.map((th) => {
                        const isSelected = selectedThemeId === th.id;
                        return (
                          <button
                            key={th.id}
                            type="button"
                            onClick={() => setSelectedThemeId(th.id)}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${isSelected
                              ? 'border-amber-400 bg-amber-500/10 text-amber-200 ring-1 ring-amber-400/40'
                              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                              }`}
                          >
                            <div className={`w-7 h-7 rounded-lg ${th.background} border ${th.borderColor} shrink-0 shadow-sm`} />
                            <div className="truncate">
                              <div className="text-xs font-semibold truncate text-slate-200">{th.name}</div>
                              <div className="text-[10px] text-slate-400">{th.tag}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Typography & Border Style */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                        Typography
                      </label>
                      <div className="flex gap-1">
                        {[
                          { id: 'serif', label: 'Serif' },
                          { id: 'cinzel', label: 'Cinzel' },
                          { id: 'sans', label: 'Modern' }
                        ].map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setFontChoice(f.id)}
                            className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] border font-medium ${fontChoice === f.id
                              ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                              }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                        Border Frame
                      </label>
                      <div className="flex gap-1">
                        {[
                          { id: 'ornate', label: 'Ornate' },
                          { id: 'double', label: 'Double' },
                          { id: 'minimal', label: 'Minimal' }
                        ].map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setBorderStyle(b.id)}
                            className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] border font-medium ${borderStyle === b.id
                              ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                              }`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Language Selector */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-indigo-400" />
                      Target Language
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {LANGUAGES.map((lang) => {
                        const isSelected = selectedLang === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`px-2 py-2 rounded-xl border text-center transition-all ${isSelected
                              ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200 font-semibold ring-1 ring-indigo-500/40'
                              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200 text-xs'
                              }`}
                          >
                            <div className="text-sm">{lang.flag}</div>
                            <div className="text-[11px] font-medium mt-0.5 truncate">{lang.nativeName}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tone Selector */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                        Poetic Tone
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">{selectedTone}</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {TONES.map((tone) => {
                        const isSelected = selectedTone === tone.label;
                        return (
                          <button
                            key={tone.id}
                            type="button"
                            onClick={() => {
                              setSelectedTone(tone.label);
                              handleGenerate(selectedLang, tone.label);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${isSelected
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                              }`}
                          >
                            {tone.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* AI Regeneration Button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => handleGenerate(selectedLang, selectedTone)}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white shadow-lg transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>{isGenerating ? 'Gemini 1.5 Crafting Copy...' : 'Regenerate with Gemini AI'}</span>
                    </button>
                  </div>

                  {/* Editable Fields */}
                  <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Headline</label>
                      <input
                        type="text"
                        value={cardContent.headline}
                        onChange={(e) => setCardContent({ ...cardContent, headline: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Poetic Message</label>
                      <textarea
                        rows={3}
                        value={cardContent.message}
                        onChange={(e) => setCardContent({ ...cardContent, message: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 font-medium block mb-1">Host Line</label>
                      <input
                        type="text"
                        value={cardContent.hostLine}
                        onChange={(e) => setCardContent({ ...cardContent, hostLine: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card Preview Column */}
          <div className="lg:col-span-7 p-4 sm:p-8 bg-slate-950 flex flex-col items-center justify-center overflow-y-auto">
            <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400 max-w-[440px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Card Preview
              </span>
              <span>High-Resolution Render</span>
            </div>

            {/* THE INVITATION CARD */}
            <div
              ref={cardRef}
              className={`w-full max-w-[440px] rounded-3xl p-6 sm:p-8 relative transition-all duration-300 ${currentTheme.background} ${currentTheme.borderGlow} ${fontChoice === 'cinzel'
                ? 'font-cinzel'
                : fontChoice === 'serif'
                  ? 'font-serif'
                  : 'font-sans'
                }`}
              style={{
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
                border: borderStyle === 'minimal' ? '1px solid rgba(255,255,255,0.2)' : undefined
              }}
            >
              {borderStyle !== 'minimal' && (
                <div
                  className={`absolute inset-3 rounded-2xl pointer-events-none transition-all ${borderStyle === 'double'
                    ? `border-2 ${currentTheme.borderColor} border-dashed`
                    : `border-2 ${currentTheme.borderColor}`
                    }`}
                />
              )}

              {borderStyle === 'ornate' && (
                <>
                  <div className="absolute top-4 left-4 text-amber-200/90 text-xs font-serif">❧</div>
                  <div className="absolute top-4 right-4 text-amber-200/90 text-xs font-serif">☙</div>
                  <div className="absolute bottom-4 left-4 text-amber-200/90 text-xs font-serif">❧</div>
                  <div className="absolute bottom-4 right-4 text-amber-200/90 text-xs font-serif">☙</div>
                </>
              )}

              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="text-[11px] font-semibold tracking-widest uppercase opacity-90 drop-shadow-sm">
                  {getCulturalHeader()}
                </div>

                <div className="w-12 h-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shadow-lg backdrop-blur-sm">
                  {event.category === 'Marriage' && <Crown className="w-6 h-6 text-amber-200" />}
                  {event.category === 'Birthday' && <PartyPopper className="w-6 h-6 text-yellow-200" />}
                  {event.category === 'Party' && <Gift className="w-6 h-6 text-fuchsia-200" />}
                  {event.category === 'Diwali' && <Flame className="w-6 h-6 text-yellow-300" />}
                  {event.category === 'Christmas' && <Sparkles className="w-6 h-6 text-emerald-200" />}
                  {event.category === 'New Year' && <Sparkles className="w-6 h-6 text-amber-200" />}
                  {event.category === 'Corporate' && <Award className="w-6 h-6 text-cyan-200" />}
                  {event.category === 'Anniversary' && <Heart className="w-6 h-6 text-rose-200" />}
                </div>

                <div className="space-y-1">
                  <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight drop-shadow-sm ${currentTheme.textColor}`}>
                    {cardContent.headline || event.name}
                  </h1>
                  <p className={`text-xs sm:text-sm font-medium tracking-wide italic ${currentTheme.accentColor}`}>
                    {cardContent.tagline}
                  </p>
                </div>

                <div className="w-3/4 flex items-center justify-center gap-2 py-0.5">
                  <div className={`h-[1px] flex-1 bg-gradient-to-r ${currentTheme.dividerColor}`} />
                  <span className="text-amber-200 text-xs">✦ ❖ ✦</span>
                  <div className={`h-[1px] flex-1 bg-gradient-to-r ${currentTheme.dividerColor}`} />
                </div>

                <div className="text-xs sm:text-sm font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-black/30 border border-white/20 shadow-inner">
                  {event.name}
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed px-2 font-normal max-w-sm ${currentTheme.subtextColor}`}>
                  {cardContent.message}
                </p>

                <div className={`w-full rounded-2xl p-3 text-xs ${currentTheme.metaBg} space-y-1.5 backdrop-blur-md shadow-sm`}>
                  <div className="flex items-center justify-center gap-2 font-semibold">
                    <Calendar className="w-3.5 h-3.5 opacity-80" />
                    <span>{formattedDate}</span>
                    {event.time && (
                      <>
                        <span className="opacity-40">•</span>
                        <Clock className="w-3.5 h-3.5 opacity-80" />
                        <span>{event.time}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 font-medium opacity-95">
                    <MapPin className="w-3.5 h-3.5 shrink-0 opacity-90" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <p className={`text-xs sm:text-sm font-semibold tracking-wide ${currentTheme.textColor}`}>
                    {cardContent.hostLine || `Cordially invited by ${event.host}`}
                  </p>
                </div>

                {cardContent.specialNote && (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-medium bg-black/40 border border-white/25 shadow-sm">
                    <span>{cardContent.specialNote}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CardStudioModal;