import React from 'react';
import { useMovie } from '../context/MovieContext';
import { MovieGrid } from '../components/MovieGrid';
import { Heart, Film, ArrowRight } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { favorites, setActiveTab } = useMovie();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500/20" />
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif">
            My Favorites
          </h1>
        </div>
        <p className="text-sm text-neutral-400">
          Your personal collection of unforgettable cinematic experiences ({favorites.length} saved).
        </p>
      </div>

      {favorites.length === 0 ? (
        <div
          id="empty-favorites-view"
          className="flex flex-col items-center justify-center p-12 sm:p-16 text-center bg-neutral-900/40 border border-neutral-800/80 rounded-3xl max-w-lg mx-auto my-12 space-y-5 shadow-2xl"
        >
          <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
            <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white font-serif">
              You haven&apos;t saved any movies yet.
            </h3>
            <p className="text-sm text-neutral-400 max-w-sm">
              Click the heart icon on any movie card or detail page to bookmark your favorite films here.
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
        <MovieGrid movies={favorites} />
      )}
    </div>
  );
};
