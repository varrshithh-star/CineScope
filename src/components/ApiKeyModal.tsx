import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { Key, X, CheckCircle, ExternalLink, ShieldCheck, Database, Sparkles } from 'lucide-react';

export const ApiKeyModal: React.FC = () => {
  const { apiKey, updateApiKey, isApiKeyModalOpen, setIsApiKeyModalOpen } = useMovie();
  const [inputKey, setInputKey] = useState(apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);

  if (!isApiKeyModalOpen) return null;

  const handleSave = () => {
    updateApiKey(inputKey);
    setIsApiKeyModalOpen(false);
  };

  const handleUseCuratedMode = () => {
    setInputKey('');
    updateApiKey('');
    setIsApiKeyModalOpen(false);
  };

  const handleTestConnection = async () => {
    if (!inputKey.trim()) {
      setTestResult('failed');
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/authentication?api_key=${inputKey.trim()}`
      );
      if (res.ok) {
        setTestResult('success');
      } else {
        setTestResult('failed');
      }
    } catch {
      setTestResult('failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div
      id="api-key-modal-backdrop"
      onClick={() => setIsApiKeyModalOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
    >
      <div
        id="api-key-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#080808] rounded-2xl border border-white/10 shadow-2xl p-6 space-y-6 text-zinc-100"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-serif">Data Source & API Setup</h3>
              <p className="text-xs text-zinc-400">Configure TMDB API or use Curated Mode</p>
            </div>
          </div>
          <button
            onClick={() => setIsApiKeyModalOpen(false)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-2 text-xs text-zinc-300">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Database className="w-4 h-4" />
            <span>Dual-Engine Architecture</span>
          </div>
          <p className="leading-relaxed text-zinc-400">
            CineScope comes pre-loaded with a high-definition curated database of blockbusters, ratings, cast, and working trailers. Adding your own free TMDB API key unlocks live worldwide search and 800,000+ titles.
          </p>
        </div>

        {/* Key Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
            <span>TMDB API Key (v3 auth)</span>
            <a
              href="https://www.themoviedb.org/settings/api"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 normal-case underline"
            >
              <span>Get a free API key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </label>
          <input
            type="text"
            placeholder="e.g. 3a1b2c3d4e5f6g7h8i9j..."
            value={inputKey}
            onChange={(e) => {
              setInputKey(e.target.value);
              setTestResult(null);
            }}
            className="w-full bg-zinc-900 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 font-mono transition-colors"
          />
        </div>

        {/* Connection Test Result */}
        {testResult === 'success' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Connection verified! Live TMDB streaming is active.</span>
          </div>
        )}
        {testResult === 'failed' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/60 border border-rose-600/40 text-rose-300 text-xs">
            <X className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Invalid API key or network error. Please verify and retry.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleUseCuratedMode}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-white/10 transition-colors"
          >
            Use Curated Mode
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {inputKey && (
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-white/10 transition-colors"
              >
                {testing ? 'Verifying...' : 'Test Key'}
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20 transition-all"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
