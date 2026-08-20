import React from 'react';
import { useMovie } from '../context/MovieContext';
import { MovieGrid } from '../components/MovieGrid';
import { Bookmark, Film, ArrowRight } from 'lucide-react';

export const WatchlistView: React.FC = () => {
  const { watchlist, setActiveTab } = useMovie();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <Bookmark className="w-7 h-7 text-amber-400 fill-amber-400/20" />
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif">
            My Watchlist
          </h1>
        </div>
        <p className="text-sm text-neutral-400">
          Movies queued for your upcoming movie nights ({watchlist.length} queued).
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div
          id="empty-watchlist-view"
          className="flex flex-col items-center justify-center p-12 sm:p-16 text-center bg-neutral-900/40 border border-neutral-800/80 rounded-3xl max-w-lg mx-auto my-12 space-y-5 shadow-2xl"
        >
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
            <Bookmark className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white font-serif">
              Your watchlist is empty.
            </h3>
            <p className="text-sm text-neutral-400 max-w-sm">
              Discover blockbusters and press the bookmark icon to save them to your watch queue.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('movies')}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>Explore Movies</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <MovieGrid movies={watchlist} />
      )}
    </div>
  );
};
