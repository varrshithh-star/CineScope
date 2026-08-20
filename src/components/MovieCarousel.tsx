import React, { useRef, useState, useEffect } from 'react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './LoadingSkeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieCarouselProps {
  movies: Movie[];
  loading?: boolean;
  showRank?: boolean;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  movies,
  loading = false,
  showRank = false,
  title,
  subtitle,
  icon,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [movies, loading]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/carousel space-y-4">
      {/* Header */}
      {(title || subtitle) && (
        <div className="flex items-end justify-between px-1">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2.5">
              {icon}
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-serif">
                {title}
              </h2>
            </div>
            {subtitle && <p className="text-xs sm:text-sm text-zinc-400">{subtitle}</p>}
          </div>

          {/* Carousel Arrows */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-lg bg-zinc-900 border border-white/10 text-white transition-all ${
                !canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zinc-800 hover:border-white/20'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-lg bg-zinc-900 border border-white/10 text-white transition-all ${
                !canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zinc-800 hover:border-white/20'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Track */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="shrink-0 w-36 sm:w-44 md:w-52 aspect-[2/3] snap-start"
              >
                <MovieCardSkeleton />
              </div>
            ))
          ) : movies.length > 0 ? (
            movies.map((movie, index) => (
              <div
                key={movie.id}
                className="shrink-0 w-36 sm:w-44 md:w-52 snap-start transition-all"
              >
                <MovieCard
                  movie={movie}
                  rank={showRank ? index + 1 : undefined}
                />
              </div>
            ))
          ) : (
            <div className="py-8 text-neutral-500 text-sm">No items to display.</div>
          )}
        </div>
      </div>
    </div>
  );
};
