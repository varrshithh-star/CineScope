import React, { useState } from 'react';
import { Movie } from '../types';
import { useMovie } from '../context/MovieContext';
import { Star, Heart, Bookmark, Play, Info, Film } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  rank?: number;
  priority?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, rank }) => {
  const { openMovieDetails, openTrailer, isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } = useMovie();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '—';
  const favorite = isFavorite(movie.id);
  const inWatchlist = isInWatchlist(movie.id);

  const primaryGenre = Array.isArray(movie.genres) && movie.genres.length > 0
    ? typeof movie.genres[0] === 'string'
      ? movie.genres[0]
      : movie.genres[0].name
    : 'Cinema';

  return (
    <div
      id={`movie-card-${movie.id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-zinc-900/70 border border-white/10 hover:border-rose-500/50 shadow-md hover:shadow-2xl hover:shadow-rose-950/20 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer select-none"
      onClick={() => openMovieDetails(movie.id)}
    >
      {/* Poster Media Box */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#050505]">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-zinc-900/60 animate-pulse flex items-center justify-center">
            <Film className="w-8 h-8 text-zinc-600 animate-spin" />
          </div>
        )}

        {movie.poster_path && !imageError ? (
          <img
            src={movie.poster_path}
            alt={movie.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Fallback Poster */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-zinc-900 via-[#050505] to-zinc-900 text-zinc-400">
            <Film className="w-10 h-10 mb-2 text-zinc-600" />
            <span className="text-xs font-semibold text-zinc-300 line-clamp-2">{movie.title}</span>
            <span className="text-[10px] text-zinc-500 mt-1">Poster unavailable</span>
          </div>
        )}

        {/* Rank Number Badge (e.g. for Trending #1...#10) */}
        {rank !== undefined && (
          <div className="absolute top-2 left-2 z-10 flex items-center justify-center w-8 h-8 rounded-lg bg-rose-600/90 text-white font-extrabold text-sm shadow-lg border border-rose-400/40 backdrop-blur-md">
            #{rank}
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 text-amber-300 font-bold text-xs border border-amber-400/30 backdrop-blur-md">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'NR'}</span>
        </div>

        {/* Hover Overlay with Quick Actions & Overview */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 z-20">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 mb-1">
            {primaryGenre}
          </span>
          <h4 className="text-white font-bold text-sm line-clamp-1 mb-1.5 font-serif">{movie.title}</h4>
          <p className="text-zinc-300 text-xs line-clamp-3 leading-relaxed mb-3">
            {movie.overview || 'Click for full cast, trailer and detailed movie overview.'}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openTrailer(movie);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-colors"
              title="Watch Trailer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Trailer</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openMovieDetails(movie.id);
              }}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs border border-white/10 transition-colors"
              title="View Details"
            >
              <Info className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(movie);
              }}
              className={`p-1.5 rounded-lg border transition-colors ${
                favorite
                  ? 'bg-rose-600/30 border-rose-500 text-rose-400'
                  : 'bg-zinc-800/90 border-white/10 text-zinc-300 hover:text-white'
              }`}
              title="Toggle Favorite"
            >
              <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchlist(movie);
              }}
              className={`p-1.5 rounded-lg border transition-colors ${
                inWatchlist
                  ? 'bg-amber-600/30 border-amber-500 text-amber-400'
                  : 'bg-zinc-800/90 border-white/10 text-zinc-300 hover:text-white'
              }`}
              title="Toggle Watchlist"
            >
              <Bookmark className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Card Bottom Meta (Always Visible) */}
      <div className="p-3 bg-zinc-950/90 border-t border-white/5 flex flex-col justify-between flex-1">
        <h3 className="font-semibold text-sm text-zinc-100 group-hover:text-rose-400 transition-colors line-clamp-1">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-zinc-400 mt-1.5">
          <span>{releaseYear}</span>
          <span className="truncate max-w-[90px] text-[11px] text-zinc-400">{primaryGenre}</span>
        </div>
      </div>
    </div>
  );
};
