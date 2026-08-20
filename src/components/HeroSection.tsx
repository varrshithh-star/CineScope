import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { useMovie } from '../context/MovieContext';
import { Play, Info, Heart, Bookmark, Star, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroSkeleton } from './LoadingSkeleton';

interface HeroSectionProps {
  movies: Movie[];
  loading?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ movies, loading }) => {
  const { openMovieDetails, openTrailer, isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } = useMovie();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const featured = movies.slice(0, 5);
  const currentMovie = featured[currentIndex] || movies[0];

  // Auto slide rotation
  useEffect(() => {
    if (loading || featured.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featured.length, loading, isPaused]);

  if (loading || !currentMovie) {
    return <HeroSkeleton />;
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const releaseYear = currentMovie.release_date
    ? new Date(currentMovie.release_date).getFullYear()
    : '2024';

  const formatRuntime = (mins?: number) => {
    if (!mins) return '2h 15m';
    const hrs = Math.floor(mins / 60);
    const remainder = mins % 60;
    return `${hrs}h ${remainder}m`;
  };

  const genresList = Array.isArray(currentMovie.genres)
    ? currentMovie.genres.map((g) => (typeof g === 'string' ? g : g.name)).slice(0, 3)
    : [];

  return (
    <section
      id="cinescope-hero-section"
      className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[#050505] shadow-2xl border border-white/10 min-h-[500px] md:min-h-[580px] lg:min-h-[640px] flex items-end group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Backdrop Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {currentMovie.backdrop_path ? (
          <img
            src={currentMovie.backdrop_path}
            alt={currentMovie.title}
            className="w-full h-full object-cover object-center filter brightness-90 transform scale-105 transition-transform duration-1000 ease-out group-hover:scale-100"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-[#050505] via-zinc-900 to-rose-950/30" />
        )}

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent lg:w-3/4" />
        <div className="absolute inset-0 bg-black/30 backdrop-brightness-95" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full p-6 sm:p-8 md:p-12 lg:p-16 max-w-4xl space-y-4 md:space-y-6">
        {/* Badges & Meta */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-medium">
          <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold tracking-wider uppercase text-[11px] shadow-md shadow-rose-600/30">
            Featured Spotlight
          </span>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold backdrop-blur-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{currentMovie.vote_average.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-300 bg-zinc-900/70 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>{releaseYear}</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-300 bg-zinc-900/70 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-md">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{formatRuntime(currentMovie.runtime)}</span>
          </div>
          {genresList.map((genre, idx) => (
            <span
              key={idx}
              className="text-zinc-300 bg-white/10 px-2.5 py-1 rounded-md text-xs backdrop-blur-md border border-white/5"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg font-serif">
            {currentMovie.title}
          </h1>
          {currentMovie.tagline && (
            <p className="text-base sm:text-lg text-rose-400 font-serif italic tracking-wide">
              &ldquo;{currentMovie.tagline}&rdquo;
            </p>
          )}
        </div>

        {/* Synopsis */}
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed line-clamp-3 md:line-clamp-4 max-w-2xl text-shadow">
          {currentMovie.overview}
        </p>

        {/* CTA Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Watch Trailer */}
          <button
            id="hero-watch-trailer-btn"
            onClick={() => openTrailer(currentMovie)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-xl shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Watch Trailer</span>
          </button>

          {/* View Details */}
          <button
            id="hero-view-details-btn"
            onClick={() => openMovieDetails(currentMovie.id)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-white font-medium text-sm border border-white/10 hover:border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          >
            <Info className="w-4 h-4 text-zinc-300" />
            <span>View Details</span>
          </button>

          {/* Favorite Toggle */}
          <button
            id="hero-favorite-btn"
            onClick={() => toggleFavorite(currentMovie)}
            className={`p-3 rounded-xl border backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${
              isFavorite(currentMovie.id)
                ? 'bg-rose-600/30 border-rose-500 text-rose-400'
                : 'bg-zinc-900/80 border-white/10 text-zinc-300 hover:text-white'
            }`}
            aria-label="Add to Favorites"
            title="Add to Favorites"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite(currentMovie.id) ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>

          {/* Watchlist Toggle */}
          <button
            id="hero-watchlist-btn"
            onClick={() => toggleWatchlist(currentMovie)}
            className={`p-3 rounded-xl border backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${
              isInWatchlist(currentMovie.id)
                ? 'bg-amber-600/30 border-amber-500 text-amber-400'
                : 'bg-zinc-900/80 border-white/10 text-zinc-300 hover:text-white'
            }`}
            aria-label="Add to Watchlist"
            title="Add to Watchlist"
          >
            <Bookmark
              className={`w-5 h-5 ${
                isInWatchlist(currentMovie.id) ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Carousel Navigation Arrows & Bullets */}
      {featured.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all z-20 opacity-0 group-hover:opacity-100"
            aria-label="Previous featured movie"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all z-20 opacity-0 group-hover:opacity-100"
            aria-label="Next featured movie"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute right-6 bottom-6 z-20 hidden sm:flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {featured.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx ? 'w-6 bg-rose-500' : 'w-2 bg-zinc-600 hover:bg-zinc-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
