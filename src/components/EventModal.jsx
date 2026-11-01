import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Tag, FileText, Sparkles, Check } from 'lucide-react';
import { EVENT_CATEGORIES } from '../constants/categories';
import confetti from 'canvas-confetti';

export const EventModal = ({
  isOpen,
  onClose,
  onSave,
  eventToEdit = null
}) => {
  const isEditing = Boolean(eventToEdit);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Marriage',
    date: '',
    time: '18:00',
    venue: '',
    host: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        name: eventToEdit.name || '',
        category: eventToEdit.category || 'Marriage',
        date: eventToEdit.date || '',
        time: eventToEdit.time || '18:00',
        venue: eventToEdit.venue || '',
        host: eventToEdit.host || '',
        description: eventToEdit.description || ''
      });
    } else {
      // Default to next Saturday
      const d = new Date();
      d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
      const defaultDateStr = d.toISOString().split('T')[0];

      setFormData({
        name: '',
        category: 'Marriage',
        date: defaultDateStr,
        time: '19:00',
        venue: '',
        host: '',
        description: ''
      });
    }
    setErrors({});
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Event name is required';
    if (!formData.category) errs.category = 'Please choose a category';
    if (!formData.date) errs.date = 'Event date is required';
    if (!formData.time) errs.time = 'Event time is required';
    if (!formData.venue.trim()) errs.venue = 'Venue location is required';
    if (!formData.host.trim()) errs.host = 'Host name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      id: eventToEdit ? eventToEdit.id : `evt-${Date.now()}`,
      createdAt: eventToEdit?.createdAt || new Date().toISOString()
    };

    onSave(payload);

    if (!isEditing) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {isEditing ? 'Edit Celebration Event' : 'Create New Celebration Event'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Fill in the celebration details to manage schedules and generate custom AI invitation cards.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Category Selector Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Event Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {EVENT_CATEGORIES.map((cat) => {
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base">{cat.emoji}</span>
                    <div className="truncate">
                      <div className="font-semibold">{cat.id}</div>
                      <div className="text-[10px] text-slate-500 truncate">{cat.badge}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.category && <p className="text-xs text-rose-400 mt-1">{errors.category}</p>}
          </div>

          {/* Event Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Event Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rohan & Ananya's Royal Wedding, Diwali Gala..."
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 text-sm transition-colors ${
                errors.name
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 text-sm transition-colors ${
                  errors.date
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors.date && <p className="text-xs text-rose-400 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 text-sm transition-colors ${
                  errors.time
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors.time && <p className="text-xs text-rose-400 mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Venue Location and Host Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                Venue Location *
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. The Leela Palace, Udaipur"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 text-sm transition-colors ${
                  errors.venue
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors.venue && <p className="text-xs text-rose-400 mt-1">{errors.venue}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Host Name *
              </label>
              <input
                type="text"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                placeholder="e.g. The Sharma & Singhania Families"
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 text-sm transition-colors ${
                  errors.host
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors.host && <p className="text-xs text-rose-400 mt-1">{errors.host}</p>}
            </div>
          </div>

          {/* Description & Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Event Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Dress code, celebration highlights, auspicious pheras timing..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-500 to-emerald-600 hover:from-indigo-600 hover:to-emerald-700 text-white shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Celebration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
