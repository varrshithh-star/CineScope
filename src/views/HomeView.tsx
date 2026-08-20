import React, { useEffect, useState } from 'react';
import { Movie, Genre } from '../types';
import { MovieApiService } from '../services/movieApi';
import { useMovie } from '../context/MovieContext';
import { HeroSection } from '../components/HeroSection';
import { MovieCarousel } from '../components/MovieCarousel';
import { MovieGrid } from '../components/MovieGrid';
import { GenreExplorer } from '../components/GenreExplorer';
import { Flame, Star, Trophy, Sparkles, Clapperboard, ChevronRight } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setActiveTab, setSelectedGenre } = useMovie();

  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination for popular
  const [popularPage, setPopularPage] = useState(1);
  const [loadingMorePopular, setLoadingMorePopular] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      MovieApiService.getTrending(1),
      MovieApiService.getPopular(1),
      MovieApiService.getTopRated(1),
      MovieApiService.getGenres(),
    ])
      .then(([trendingRes, popularRes, topRatedRes, genresRes]) => {
        if (!isMounted) return;
        setTrendingMovies(trendingRes.results);
        setPopularMovies(popularRes.results);
        setTopRatedMovies(topRatedRes.results);
        setGenres(genresRes);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load home view data:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadMorePopular = async () => {
    setLoadingMorePopular(true);
    const nextPage = popularPage + 1;
    try {
      const res = await MovieApiService.getPopular(nextPage);
      setPopularMovies((prev) => [...prev, ...res.results]);
      setPopularPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMorePopular(false);
    }
  };

  const handleSelectGenre = (genre: Genre) => {
    setSelectedGenre(genre);
    setActiveTab('movies');
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Cinematic Hero Spotlight */}
      <HeroSection movies={trendingMovies} loading={loading} />

      {/* 2. 🔥 Trending Today Carousel */}
      <section id="trending-today-section" className="space-y-4">
        <MovieCarousel
          movies={trendingMovies}
          loading={loading}
          showRank={true}
          title="🔥 Trending Today"
          subtitle="The most-watched releases across all platforms right now."
          icon={<Flame className="w-6 h-6 text-amber-500 fill-amber-500/20" />}
        />
      </section>

      {/* 3. 🎭 Genre Explorer Section */}
      <section id="genre-explorer-section" className="py-2">
        <GenreExplorer
          genres={genres}
          onSelectGenre={handleSelectGenre}
        />
      </section>

      {/* 4. 🏆 Top Rated Masterpieces */}
      <section id="top-rated-section" className="space-y-4">
        <MovieCarousel
          movies={topRatedMovies}
          loading={loading}
          title="🏆 Top Rated Masterpieces"
          subtitle="Acclaimed cinema with world-class critical ratings."
          icon={<Trophy className="w-6 h-6 text-amber-400" />}
        />
      </section>

      {/* 5. ⭐ Popular Movies Grid */}
      <section id="popular-movies-section" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Star className="w-6 h-6 text-red-500 fill-red-500/20" />
              <h2 className="text-2xl font-black text-white tracking-tight font-serif">
                ⭐ Popular Movies
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400">
              Fan favorites and blockbuster hits trending worldwide.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('movies')}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <MovieGrid
          movies={popularMovies}
          loading={loading}
          hasMore={popularMovies.length >= 10}
          onLoadMore={handleLoadMorePopular}
          loadingMore={loadingMorePopular}
        />
      </section>
    </div>
  );
};
