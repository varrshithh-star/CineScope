import React from 'react';
import { useMovie } from '../context/MovieContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useMovie();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  };

  return (
    <div
      id="cinescope-toast"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-neutral-900/95 dark:bg-neutral-900/95 text-white border border-neutral-700/80 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 max-w-md animate-fade-in"
    >
      {icons[toast.type || 'success']}
      <span className="text-sm font-medium tracking-wide">{toast.message}</span>
    </div>
  );
};
