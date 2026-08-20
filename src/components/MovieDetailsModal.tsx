import React, { useEffect, useState } from 'react';
import { Movie } from '../types';
import { useMovie } from '../context/MovieContext';
import { MovieApiService } from '../services/movieApi';
import { CastCarousel } from './CastCarousel';
import { MovieCarousel } from './MovieCarousel';
import { DetailsSkeleton } from './LoadingSkeleton';
import {
  X,
  Play,
  Heart,
  Bookmark,
  Star,
  Calendar,
  Clock,
  ArrowLeft,
  DollarSign,
  Globe,
  Award,
  Building,
  Film,
} from 'lucide-react';

export const MovieDetailsModal: React.FC = () => {
  const {
    selectedMovieId,
    closeMovieDetails,
    openTrailer,
    isFavorite,
    isInWatchlist,
    toggleFavorite,
    toggleWatchlist,
  } = useMovie();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedMovieId) {
      setMovie(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    Promise.all([
      MovieApiService.getMovieDetails(selectedMovieId),
      MovieApiService.getSimilarMovies(selectedMovieId),
    ])
      .then(([movieData, similarData]) => {
        if (!isMounted) return;
        setMovie(movieData);
        setSimilarMovies(similarData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching movie details:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedMovieId]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMovieDetails();
      }
    };
    if (selectedMovieId) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [selectedMovieId, closeMovieDetails]);

  if (!selectedMovieId) return null;

  const formatCurrency = (amount?: number) => {
    if (!amount || amount === 0) return 'Undisclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (mins?: number) => {
    if (!mins) return '—';
    const hrs = Math.floor(mins / 60);
    const remainder = mins % 60;
    return `${hrs}h ${remainder}m`;
  };

  return (
    <div
      id="movie-details-modal-backdrop"
      onClick={closeMovieDetails}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex justify-center p-2 sm:p-4 md:p-6 lg:p-10 animate-fade-in"
    >
      <div
        id="movie-details-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#080808] rounded-3xl overflow-hidden border border-white/10 shadow-2xl my-auto text-zinc-100 flex flex-col"
      >
        {/* Close Button Top Right */}
        <button
          id="close-details-btn"
          onClick={closeMovieDetails}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all hover:scale-105"
          aria-label="Close movie details"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !movie ? (
          <DetailsSkeleton />
        ) : (
          <div className="space-y-8 pb-12">
            {/* Top Backdrop Hero Banner */}
            <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-[#050505]">
              {movie.backdrop_path ? (
                <img
                  src={movie.backdrop_path}
                  alt={movie.title}
                  className="w-full h-full object-cover object-top filter brightness-85"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-[#050505] via-zinc-900 to-rose-950/40" />
              )}
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/80 via-transparent to-transparent" />

              {/* Back Button */}
              <button
                onClick={closeMovieDetails}
                className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black text-white text-xs font-semibold border border-white/10 backdrop-blur-md transition-all hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>

            {/* Main Content Info Area (Overlapping Backdrop) */}
            <div className="px-6 sm:px-8 md:px-12 -mt-24 sm:-mt-32 md:-mt-40 relative z-20 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
                {/* Movie Poster */}
                <div className="md:col-span-4 lg:col-span-4 flex flex-col items-center md:items-start">
                  <div className="w-48 sm:w-56 md:w-full max-w-[280px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-zinc-900 relative group">
                    {movie.poster_path ? (
                      <img
                        src={movie.poster_path}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-900 text-zinc-500">
                        <Film className="w-12 h-12 mb-2" />
                        <span className="text-xs">Poster unavailable</span>
                      </div>
                    )}

                    {/* Quick Trailer Floating Button on Poster */}
                    <button
                      onClick={() => openTrailer(movie)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Primary Metadata & Description */}
                <div className="md:col-span-8 lg:col-span-8 space-y-5">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-sm">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                      {movie.vote_count ? (
                        <span className="text-xs text-zinc-400 font-normal ml-1">
                          ({movie.vote_count.toLocaleString()} votes)
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 text-zinc-300 text-xs border border-white/10">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{movie.release_date || 'Release TBA'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 text-zinc-300 text-xs border border-white/10">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight font-serif">
                      {movie.title}
                    </h1>
                    {movie.tagline && (
                      <p className="text-base sm:text-lg text-rose-400 font-serif italic">
                        &ldquo;{movie.tagline}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Genres Tags */}
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(movie.genres) &&
                      movie.genres.map((g, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg bg-zinc-800/80 text-zinc-200 text-xs font-semibold border border-white/5"
                        >
                          {typeof g === 'string' ? g : g.name}
                        </span>
                      ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => openTrailer(movie)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Watch Trailer</span>
                    </button>

                    <button
                      onClick={() => toggleFavorite(movie)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all hover:scale-105 active:scale-95 text-sm font-semibold ${
                        isFavorite(movie.id)
                          ? 'bg-rose-600/20 border-rose-500 text-rose-400'
                          : 'bg-zinc-900 border-white/10 text-zinc-200 hover:text-white'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite(movie.id) ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      <span>{isFavorite(movie.id) ? 'Favorited' : 'Favorite'}</span>
                    </button>

                    <button
                      onClick={() => toggleWatchlist(movie)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all hover:scale-105 active:scale-95 text-sm font-semibold ${
                        isInWatchlist(movie.id)
                          ? 'bg-amber-600/20 border-amber-500 text-amber-400'
                          : 'bg-zinc-900 border-white/10 text-zinc-200 hover:text-white'
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isInWatchlist(movie.id) ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                      <span>{isInWatchlist(movie.id) ? 'In Watchlist' : 'Watchlist'}</span>
                    </button>
                  </div>

                  {/* Overview */}
                  <div className="space-y-2 pt-2">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider font-serif text-xs text-zinc-400">
                      Storyline Overview
                    </h3>
                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                      {movie.overview}
                    </p>
                  </div>

                  {/* Director & Key Crew */}
                  {movie.director && (
                    <div className="flex items-center gap-2 text-sm pt-1">
                      <span className="text-zinc-400 font-medium">Director:</span>
                      <span className="text-white font-bold">{movie.director}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cast Carousel Section */}
              {movie.cast && movie.cast.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                  <CastCarousel cast={movie.cast} />
                </div>
              )}

              {/* Financial & Production Details Grid */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-white font-serif">Film Facts & Data</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Budget</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white">
                      {formatCurrency(movie.budget)}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Box Office Revenue</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white">
                      {formatCurrency(movie.revenue)}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Languages</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white truncate">
                      {movie.spoken_languages && movie.spoken_languages.length > 0
                        ? movie.spoken_languages.join(', ')
                        : 'English'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
                      <Building className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Status</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-white">
                      {movie.status || 'Released'}
                    </p>
                  </div>
                </div>

                {/* Production Companies Badges */}
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xs text-zinc-400 font-medium">Studios:</span>
                    {movie.production_companies.map((co) => (
                      <span
                        key={co.id}
                        className="text-xs px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-white/10"
                      >
                        {co.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommendations Section */}
              {similarMovies.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                  <MovieCarousel
                    movies={similarMovies}
                    title="🎯 You May Also Like"
                    subtitle="Similar recommendations based on storyline and genre."
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
