import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
  };

  const bgStyles = {
    success: 'border-emerald-500/40 bg-slate-900/95 shadow-emerald-500/10',
    error: 'border-rose-500/40 bg-slate-900/95 shadow-rose-500/10',
    info: 'border-cyan-500/40 bg-slate-900/95 shadow-cyan-500/10'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${bgStyles[type] || bgStyles.info}`}>
        {icons[type] || icons.info}
        <div className="text-sm font-medium text-slate-100 pr-2">
          {message}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
