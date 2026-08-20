import React, { useEffect, useState } from 'react';
import { Movie } from '../types';
import { MovieApiService } from '../services/movieApi';
import { MovieCard } from '../components/MovieCard';
import { MovieCarousel } from '../components/MovieCarousel';
import { MovieCardSkeleton } from '../components/LoadingSkeleton';
import { Flame, Trophy, TrendingUp } from 'lucide-react';

export const TrendingView: React.FC = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([MovieApiService.getTrending(1), MovieApiService.getTopRated(1)])
      .then(([trendingRes, topRatedRes]) => {
        if (!isMounted) return;
        setTrending(trendingRes.results);
        setTopRated(topRatedRes.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <Flame className="w-7 h-7 text-amber-500 fill-amber-500/20" />
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif">
            Trending & Top Charts
          </h1>
        </div>
        <p className="text-sm text-neutral-400">
          Real-time global cinema viewership rankings and all-time highest rated films.
        </p>
      </div>

      {/* Top 10 Ranked Showcase Carousel */}
      <section className="space-y-4">
        <MovieCarousel
          movies={trending}
          loading={loading}
          showRank={true}
          title="🔥 Top 10 Global Trending Right Now"
          subtitle="Ranked by audience engagement, box office momentum, and streaming velocity."
          icon={<TrendingUp className="w-6 h-6 text-red-500" />}
        />
      </section>

      {/* Top Rated Masterpieces Carousel */}
      <section className="space-y-4">
        <MovieCarousel
          movies={topRated}
          loading={loading}
          showRank={true}
          title="🏆 All-Time Top Rated Masterpieces"
          subtitle="The highest critically rated cinema ever produced."
          icon={<Trophy className="w-6 h-6 text-amber-400" />}
        />
      </section>

      {/* Full Trending Grid with Rank Badges */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-bold text-white font-serif">
            Full Ranked Chart
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {trending.map((movie, idx) => (
              <MovieCard key={movie.id} movie={movie} rank={idx + 1} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
