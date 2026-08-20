import React from 'react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './LoadingSkeleton';
import { Film, RefreshCw } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading = false,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  emptyTitle = 'No movies found',
  emptyDescription = 'Try adjusting your filters or searching for another title.',
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div
        id="empty-movie-grid"
        className="flex flex-col items-center justify-center p-12 text-center bg-zinc-900/40 border border-white/10 rounded-2xl max-w-lg mx-auto my-8 space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-zinc-800/80 border border-white/10 flex items-center justify-center text-zinc-400">
          <Film className="w-8 h-8 text-rose-500" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white font-serif">{emptyTitle}</h3>
          <p className="text-sm text-zinc-400 max-w-xs">{emptyDescription}</p>
        </div>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-rose-600/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-white font-semibold text-sm border border-white/10 hover:border-rose-500/50 shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
                <span>Loading more movies...</span>
              </>
            ) : (
              <span>Load More Movies</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
