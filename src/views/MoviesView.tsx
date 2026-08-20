import React, { useEffect, useState } from 'react';
import { FilterState, Genre, Movie } from '../types';
import { MovieApiService } from '../services/movieApi';
import { useMovie } from '../context/MovieContext';
import { FilterPanel } from '../components/FilterPanel';
import { MovieGrid } from '../components/MovieGrid';
import { Clapperboard } from 'lucide-react';

export const MoviesView: React.FC = () => {
  const { selectedGenre, setSelectedGenre } = useMovie();

  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    genreId: selectedGenre ? selectedGenre.id : null,
    year: 'all',
    minRating: 0,
    sortBy: 'popularity.desc',
    searchQuery: '',
  });

  // Sync selectedGenre from context if it changes
  useEffect(() => {
    if (selectedGenre) {
      setFilters((prev) => ({ ...prev, genreId: selectedGenre.id }));
    }
  }, [selectedGenre]);

  // Load genres
  useEffect(() => {
    MovieApiService.getGenres().then((res) => setGenres(res));
  }, []);

  // Fetch movies when filters change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setPage(1);

    MovieApiService.discoverMovies(filters, 1)
      .then((res) => {
        if (!isMounted) return;
        setMovies(res.results);
        setHasMore(res.totalPages > 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    if (newFilters.genreId !== filters.genreId) {
      const g = genres.find((item) => item.id === newFilters.genreId) || null;
      setSelectedGenre(g);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      genreId: null,
      year: 'all',
      minRating: 0,
      sortBy: 'popularity.desc',
      searchQuery: '',
    });
    setSelectedGenre(null);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await MovieApiService.discoverMovies(filters, nextPage);
      setMovies((prev) => [...prev, ...res.results]);
      setPage(nextPage);
      setHasMore(nextPage < res.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <Clapperboard className="w-6 h-6 text-red-500" />
          <h1 className="text-3xl font-black text-white tracking-tight font-serif">
            Movie Discovery Catalog
          </h1>
        </div>
        <p className="text-sm text-neutral-400">
          Filter by genre, year, rating, and sort through cinema archives.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterPanel
        filters={filters}
        genres={genres}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={movies.length}
      />

      {/* Grid */}
      <MovieGrid
        movies={movies}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadingMore={loadingMore}
        emptyTitle="No movies match your filter criteria"
        emptyDescription="Try selecting a different genre, lowering the minimum rating, or resetting filters."
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};
