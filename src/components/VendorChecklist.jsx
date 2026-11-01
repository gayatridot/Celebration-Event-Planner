import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Store, Phone, Mail, Star, CheckCircle2, Circle, Plus, Trash2,
  Sparkles, DollarSign, Users, X, ChevronDown, ChevronUp,
  BarChart3, MessageSquare, Loader2, Search,
  CreditCard, PhoneCall, FileText
} from 'lucide-react';
import { getStoredApiKey } from '../services/storageService';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Predefined vendor categories per event type */
const VENDOR_CATEGORIES = {
  Wedding: [
    'Venue', 'Caterer', 'Photographer/Videographer', 'Florist', 'DJ/Band',
    'Decorator', 'Makeup Artist', 'Priest/Officiant', 'Transport', 'Mehndi Artist'
  ],
  Birthday: [
    'Venue', 'Caterer', 'Cake Baker', 'Entertainer/Magician',
    'Balloon/Decoration', 'Photography', 'Party Planner'
  ],
  Diwali: [
    'Caterer', 'Sweet Maker', 'Decorator', 'Fireworks/Lights',
    'Pooja Items', 'Musician'
  ],
  Corporate: [
    'Venue', 'Caterer', 'AV/Tech', 'Speaker/Host',
    'Event Manager', 'Security', 'Photographer'
  ],
  Community: [
    'Venue', 'Caterer', 'Entertainment', 'Sound/Lights',
    'Security', 'Decoration', 'Volunteers'
  ]
};

/** Status pipeline with display labels and colours */
const STATUS_OPTIONS = [
  { value: 'not-booked', label: 'Not Booked', color: 'text-slate-400', bg: 'bg-slate-700', icon: Circle },
  { value: 'contacted', label: 'Contacted', color: 'text-blue-400', bg: 'bg-blue-900/40', icon: PhoneCall },
  { value: 'quoted',    label: 'Quoted',    color: 'text-amber-400', bg: 'bg-amber-900/40', icon: FileText },
  { value: 'booked',    label: 'Booked',    color: 'text-emerald-400', bg: 'bg-emerald-900/40', icon: CheckCircle2 },
  { value: 'paid',      label: 'Paid',      color: 'text-indigo-400', bg: 'bg-indigo-900/40', icon: CreditCard }
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a blank vendor object */
const createVendor = (category) => ({
  id: crypto.randomUUID(),
  category,
  name: '',
  phone: '',
  email: '',
  status: 'not-booked',
  quotedPrice: '',
  finalPrice: '',
  notes: '',
  rating: 0,
  createdAt: new Date().toISOString()
});

/** localStorage key for vendor data scoped to an event */
const storageKey = (eventId) => `event_vendors_${eventId}`;

/** Load vendor list from localStorage */
const loadVendors = (eventId) => {
  try {
    const raw = localStorage.getItem(storageKey(eventId));
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.vendors || [];
    }
  } catch { /* corrupted data – start fresh */ }
  return null;
};

/** Persist vendor list to localStorage */
const saveVendors = (eventId, vendors) => {
  localStorage.setItem(storageKey(eventId), JSON.stringify({ vendors }));
};

/** Format a number as currency (INR) */
const formatCurrency = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return '—';
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Interactive star rating */
function StarRating({ rating, onChange, disabled }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5" role="radiogroup" aria-label="Vendor rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          className="p-0.5 transition-transform hover:scale-110 disabled:cursor-default"
          onClick={() => onChange(rating === star ? 0 : star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          <Star
            size={16}
            className={`transition-colors ${
              (hover || rating) >= star
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/** Status badge / dropdown */
function StatusBadge({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const current = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  const Icon = current.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
          ${current.bg} ${current.color} border border-slate-700 hover:border-slate-500
          transition-colors cursor-pointer`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Icon size={12} />
        {current.label}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            className="absolute left-0 top-full mt-1 z-40 w-40 bg-slate-800 border border-slate-700
              rounded-lg shadow-xl overflow-hidden"
          >
            {STATUS_OPTIONS.map((opt) => {
              const OptIcon = opt.icon;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={opt.value === status}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors
                      hover:bg-slate-700 ${opt.color} ${opt.value === status ? 'bg-slate-700/50' : ''}`}
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                  >
                    <OptIcon size={14} />
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

/** Single vendor card */
function VendorCard({ vendor, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (field, value) => {
    onUpdate({ ...vendor, [field]: value });
  };

  const statusMeta = STATUS_OPTIONS.find((s) => s.value === vendor.status) || STATUS_OPTIONS[0];

  return (
    <div
      className={`bg-slate-900/60 border rounded-xl transition-all duration-200
        ${vendor.status === 'booked' || vendor.status === 'paid'
          ? 'border-emerald-800/50'
          : 'border-slate-800'
        } hover:border-slate-600`}
    >
      {/* ---- Header row ---- */}
      <div className="flex items-center gap-3 p-3.5">
        {/* Category icon */}
        <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center
          ${statusMeta.bg} ${statusMeta.color}`}>
          <Store size={16} />
        </div>

        {/* Category + name */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-medium mb-0.5">
            {vendor.category}
          </p>
          <input
            type="text"
            value={vendor.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Vendor name…"
            aria-label={`${vendor.category} vendor name`}
            className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600
              outline-none border-b border-transparent focus:border-amber-500/50 transition-colors"
          />
        </div>

        {/* Status badge */}
        <StatusBadge status={vendor.status} onChange={(v) => handleChange('status', v)} />

        {/* Expand / collapse */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          aria-label={expanded ? 'Collapse vendor details' : 'Expand vendor details'}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(vendor.id)}
          className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-900/20 transition-colors"
          aria-label={`Delete ${vendor.category} vendor`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* ---- Expanded details ---- */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-slate-400">
              <Phone size={14} className="shrink-0" />
              <input
                type="tel"
                value={vendor.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Phone number"
                aria-label="Phone"
                className="flex-1 bg-slate-800/60 text-sm text-slate-200 rounded-lg px-3 py-1.5
                  placeholder:text-slate-600 outline-none border border-slate-700
                  focus:border-amber-500/50 transition-colors"
              />
            </label>

            <label className="flex items-center gap-2 text-slate-400">
              <Mail size={14} className="shrink-0" />
              <input
                type="email"
                value={vendor.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Email address"
                aria-label="Email"
                className="flex-1 bg-slate-800/60 text-sm text-slate-200 rounded-lg px-3 py-1.5
                  placeholder:text-slate-600 outline-none border border-slate-700
                  focus:border-amber-500/50 transition-colors"
              />
            </label>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-slate-400">
              <DollarSign size={14} className="shrink-0" />
              <input
                type="number"
                min="0"
                value={vendor.quotedPrice}
                onChange={(e) => handleChange('quotedPrice', e.target.value)}
                placeholder="Quoted price"
                aria-label="Quoted price"
                className="flex-1 bg-slate-800/60 text-sm text-slate-200 rounded-lg px-3 py-1.5
                  placeholder:text-slate-600 outline-none border border-slate-700
                  focus:border-amber-500/50 transition-colors"
              />
            </label>

            <label className="flex items-center gap-2 text-slate-400">
              <CreditCard size={14} className="shrink-0" />
              <input
                type="number"
                min="0"
                value={vendor.finalPrice}
                onChange={(e) => handleChange('finalPrice', e.target.value)}
                placeholder="Final price"
                aria-label="Final price"
                className="flex-1 bg-slate-800/60 text-sm text-slate-200 rounded-lg px-3 py-1.5
                  placeholder:text-slate-600 outline-none border border-slate-700
                  focus:border-emerald-500/50 transition-colors"
              />
            </label>
          </div>

          {/* Notes */}
          <label className="block">
            <span className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <MessageSquare size={12} /> Notes
            </span>
            <textarea
              value={vendor.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add notes about this vendor…"
              rows={2}
              aria-label="Notes"
              className="w-full bg-slate-800/60 text-sm text-slate-300 rounded-lg px-3 py-2
                placeholder:text-slate-600 outline-none border border-slate-700
                focus:border-amber-500/50 transition-colors resize-none"
            />
          </label>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Rating:</span>
            <StarRating rating={vendor.rating} onChange={(r) => handleChange('rating', r)} />
          </div>
        </div>
      )}
    </div>
  );
}

/** Visual progress bar */
function ProgressBar({ booked, total }) {
  const pct = total > 0 ? Math.round((booked / total) * 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">Vendor progress</span>
        <span className="text-slate-300 font-medium">{booked}/{total} booked · {pct}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out
            bg-gradient-to-r from-amber-500 to-emerald-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% vendors booked`}
        />
      </div>
    </div>
  );
}

/** Comparison / summary panel */
function ComparisonPanel({ vendors }) {
  const totalQuoted = vendors.reduce((s, v) => s + (parseFloat(v.quotedPrice) || 0), 0);
  const totalFinal  = vendors.reduce((s, v) => s + (parseFloat(v.finalPrice) || 0), 0);
  const bookedCount = vendors.filter((v) => v.status === 'booked' || v.status === 'paid').length;
  const paidCount   = vendors.filter((v) => v.status === 'paid').length;

  const stats = [
    { label: 'Total Quoted', value: formatCurrency(totalQuoted), icon: DollarSign, accent: 'text-amber-400' },
    { label: 'Total Final',  value: formatCurrency(totalFinal),  icon: CreditCard, accent: 'text-emerald-400' },
    { label: 'Booked',       value: `${bookedCount}/${vendors.length}`, icon: CheckCircle2, accent: 'text-indigo-400' },
    { label: 'Paid',         value: `${paidCount}/${vendors.length}`,   icon: CreditCard,  accent: 'text-purple-400' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
          <s.icon size={18} className={`mx-auto mb-1 ${s.accent}`} />
          <p className="text-lg font-bold text-slate-200">{s.value}</p>
          <p className="text-[11px] text-slate-500 uppercase tracking-wider">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function VendorChecklist({ isOpen, onClose, event, onToast }) {
  const [vendors, setVendors] = useState([]);
  const [initialised, setInitialised] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showComparison, setShowComparison] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [showAi, setShowAi] = useState(false);

  // Determine the event category for predefined vendors
  const eventCategory = event?.category || '';
  const predefined = VENDOR_CATEGORIES[eventCategory] || VENDOR_CATEGORIES['Community'];

  // --- Initialise vendors from localStorage or predefined list ---
  useEffect(() => {
    if (!isOpen || !event?.id) return;

    const stored = loadVendors(event.id);
    if (stored) {
      setVendors(stored);
    } else {
      // Seed from predefined categories
      const seeded = predefined.map((cat) => createVendor(cat));
      setVendors(seeded);
      saveVendors(event.id, seeded);
    }
    setInitialised(true);
    // Reset transient state on open
    setSearchTerm('');
    setFilterStatus('all');
    setShowAi(false);
    setAiSuggestions('');
  }, [isOpen, event?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Persist on change (skip first mount) ---
  useEffect(() => {
    if (initialised && event?.id) {
      saveVendors(event.id, vendors);
    }
  }, [vendors]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- CRUD helpers ---
  const updateVendor = useCallback((updated) => {
    setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  }, []);

  const deleteVendor = useCallback((id) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    onToast?.('Vendor removed', 'info');
  }, [onToast]);

  const addCustomVendor = useCallback(() => {
    const cat = customCategory.trim();
    if (!cat) return;
    const v = createVendor(cat);
    setVendors((prev) => [...prev, v]);
    setCustomCategory('');
    onToast?.(`Added "${cat}" vendor slot`, 'success');
  }, [customCategory, onToast]);

  // --- Filter & search ---
  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      const matchSearch =
        !searchTerm ||
        v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'all' || v.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [vendors, searchTerm, filterStatus]);

  // --- Stats ---
  const bookedCount = vendors.filter((v) => v.status === 'booked' || v.status === 'paid').length;

  // --- AI Vendor Suggestions ---
  const fetchAiSuggestions = useCallback(async () => {
    const apiKey = getStoredApiKey?.();
    if (!apiKey) {
      onToast?.('Please set your Gemini API key in Settings first.', 'error');
      return;
    }

    setAiLoading(true);
    setShowAi(true);
    setAiSuggestions('');

    const vendorSummary = vendors
      .map((v) => `${v.category}: ${v.name || '(none)'} — ${v.status}`)
      .join('\n');

    const prompt = `You are an expert event planner assistant. The user is planning a "${eventCategory}" event named "${event?.name || 'Untitled'}".

Here is their current vendor list:
${vendorSummary}

Please provide:
1. **Search Tips** — Where and how to find the best vendors for this type of event (2-3 concise tips)
2. **Negotiation Advice** — How to negotiate pricing and terms with vendors (2-3 tips)
3. **What to Look For** — Key quality indicators and red flags when choosing vendors (2-3 tips)
4. **Missing Vendors** — Any vendor categories they might be missing for this type of event

Keep it concise, practical, and formatted with bullet points. Use plain text, no markdown headers.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
          })
        }
      );

      if (!res.ok) throw new Error(`API returned ${res.status}`);

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No suggestions returned. Try again later.';
      setAiSuggestions(text);
    } catch (err) {
      console.error('Gemini AI error:', err);
      // Smart fallback with static tips
      setAiSuggestions(
        `⚡ AI suggestions unavailable — here are general tips:\n\n` +
        `• Search Tips: Use Google Maps reviews, ask for referrals from friends and other vendors, check social media portfolios.\n` +
        `• Negotiation: Always get at least 3 quotes, ask about package deals, negotiate payment terms (50% advance, 50% after).\n` +
        `• What to Look For: Check reviews and past work photos, verify insurance/licenses, get everything in writing.\n` +
        `• For ${eventCategory} events, ensure you have backup vendors for critical roles like catering and venue.`
      );
    } finally {
      setAiLoading(false);
    }
  }, [vendors, eventCategory, event?.name, onToast]);

  // --- Don't render when closed ---
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Vendor checklist"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-2xl
        shadow-2xl my-4 sm:my-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* =============== HEADER =============== */}
        <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800
          rounded-t-2xl px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Store className="text-amber-400" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100">Vendor Checklist</h2>
                <p className="text-xs text-slate-500">
                  {event?.name || 'Event'} · {eventCategory} · {vendors.length} vendors
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-slate-800
                transition-colors"
              aria-label="Close vendor checklist"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress bar */}
          <ProgressBar booked={bookedCount} total={vendors.length} />

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 min-w-[180px] bg-slate-800/60
              border border-slate-700 rounded-lg px-3 py-1.5">
              <Search size={14} className="text-slate-500 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vendors…"
                aria-label="Search vendors"
                className="flex-1 bg-transparent text-sm text-slate-200 outline-none
                  placeholder:text-slate-600"
              />
            </div>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter by status"
              className="bg-slate-800/60 text-sm text-slate-300 border border-slate-700
                rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:border-slate-500
                transition-colors"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            {/* Toggle comparison */}
            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                border transition-colors ${
                  showComparison
                    ? 'bg-indigo-900/40 border-indigo-700 text-indigo-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              aria-pressed={showComparison}
            >
              <BarChart3 size={14} />
              Summary
            </button>

            {/* AI suggestions */}
            <button
              type="button"
              onClick={fetchAiSuggestions}
              disabled={aiLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-gradient-to-r from-purple-900/40 to-indigo-900/40
                border border-purple-700/50 text-purple-300 hover:text-purple-200
                hover:border-purple-600 transition-colors disabled:opacity-50"
            >
              {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              AI Tips
            </button>
          </div>
        </div>

        {/* =============== BODY =============== */}
        <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto overscroll-contain
          scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">

          {/* Comparison panel */}
          {showComparison && <ComparisonPanel vendors={vendors} />}

          {/* AI suggestions panel */}
          {showAi && (
            <div className="bg-purple-950/20 border border-purple-800/40 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-purple-300">
                  <Sparkles size={15} />
                  AI Vendor Suggestions
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAi(false)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Close AI suggestions"
                >
                  <X size={16} />
                </button>
              </div>
              {aiLoading ? (
                <div className="flex items-center gap-2 text-sm text-slate-400 py-3">
                  <Loader2 size={16} className="animate-spin" />
                  Generating suggestions…
                </div>
              ) : (
                <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {aiSuggestions}
                </p>
              )}
            </div>
          )}

          {/* Vendor cards */}
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <Users size={32} className="mx-auto text-slate-700 mb-2" />
              <p className="text-sm text-slate-500">
                {vendors.length === 0
                  ? 'No vendors yet. Add one below!'
                  : 'No vendors match your search or filter.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onUpdate={updateVendor}
                  onDelete={deleteVendor}
                />
              ))}
            </div>
          )}
        </div>

        {/* =============== FOOTER — add custom vendor =============== */}
        <div className="sticky bottom-0 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800
          rounded-b-2xl px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 bg-slate-800/60 border border-slate-700
              rounded-lg px-3 py-1.5">
              <Plus size={14} className="text-slate-500 shrink-0" />
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomVendor()}
                placeholder="Add custom vendor category…"
                aria-label="Custom vendor category"
                className="flex-1 bg-transparent text-sm text-slate-200 outline-none
                  placeholder:text-slate-600"
              />
            </div>
            <button
              type="button"
              onClick={addCustomVendor}
              disabled={!customCategory.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium
                bg-amber-500/10 text-amber-400 border border-amber-700/50
                hover:bg-amber-500/20 hover:border-amber-600 transition-colors
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus size={15} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorChecklist;
