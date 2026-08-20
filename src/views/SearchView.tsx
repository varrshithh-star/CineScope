import React, { useEffect, useState, useRef } from 'react';
import { Movie } from '../types';
import { MovieApiService } from '../services/movieApi';
import { useMovie } from '../context/MovieContext';
import { MovieGrid } from '../components/MovieGrid';
import { Search, X, Sparkles, AlertCircle, Film, RefreshCw } from 'lucide-react';

export const SearchView: React.FC = () => {
  const { searchQuery, setSearchQuery } = useMovie();
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const quickSuggestions = [
    'Dune',
    'Oppenheimer',
    'Spider-Man',
    'Batman',
    'Avengers',
    'Interstellar',
    'Animation',
    'Horror',
  ];

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    const timer = setTimeout(() => {
      MovieApiService.searchMovies(searchQuery.trim())
        .then((res) => {
          setResults(res.results);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Search Header & Input */}
      <div className="space-y-4 max-w-3xl mx-auto text-center">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif">
            Movie Search
          </h1>
          <p className="text-sm text-neutral-400">
            Search millions of titles, cast members, directors, and genres.
          </p>
        </div>

        {/* Large Search Field */}
        <div className="relative flex items-center w-full">
          <div className="relative flex items-center w-full bg-neutral-900/90 border-2 border-neutral-700 hover:border-red-500/60 focus-within:border-red-500 rounded-2xl shadow-xl shadow-black/40 overflow-hidden transition-all duration-300">
            <div className="pl-4 text-neutral-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search movies, actors, directors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-transparent px-4 py-4 text-base sm:text-lg text-white placeholder-neutral-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="pr-4 text-neutral-400 hover:text-white transition-colors"
                aria-label="Clear search query"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-neutral-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Trending searches:
          </span>
          {quickSuggestions.map((term) => (
            <button
              key={term}
              onClick={() => handleSuggestionClick(term)}
              className={`px-3 py-1 rounded-full border transition-all ${
                searchQuery.toLowerCase() === term.toLowerCase()
                  ? 'bg-red-600 text-white border-red-500 font-bold'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-600 hover:text-white'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {hasSearched ? (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 className="text-lg font-bold text-white font-serif">
              Search Results for &ldquo;<span className="text-red-400">{searchQuery}</span>&rdquo;
            </h2>
            <span className="text-xs text-neutral-400 font-medium">
              {results.length} {results.length === 1 ? 'result' : 'results'} found
            </span>
          </div>

          {results.length === 0 && !loading ? (
            <div
              id="no-search-results"
              className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/40 border border-neutral-800/80 rounded-3xl max-w-lg mx-auto my-8 space-y-4 shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white font-serif">
                  Oops! We couldn&apos;t find that movie.
                </h3>
                <p className="text-sm text-neutral-400 max-w-xs">
                  Try another keyword, check spelling, or browse by genre.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSearchQuery('Marvel')}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl transition-all"
                >
                  Try &quot;Marvel&quot;
                </button>
                <button
                  onClick={() => setSearchQuery('Nolan')}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl transition-all"
                >
                  Try &quot;Nolan&quot;
                </button>
              </div>
            </div>
          ) : (
            <MovieGrid movies={results} loading={loading} />
          )}
        </div>
      ) : (
        /* Empty Search State (Initial) */
        <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500 max-w-md mx-auto my-8 space-y-3">
          <Film className="w-12 h-12 text-neutral-700" />
          <h3 className="text-lg font-semibold text-neutral-300 font-serif">
            Discover Your Next Favorite Film
          </h3>
          <p className="text-xs text-neutral-500">
            Type any film title, star actor, Oscar-winning director, or universe name to begin discovering.
          </p>
        </div>
      )}
    </div>
  );
};
