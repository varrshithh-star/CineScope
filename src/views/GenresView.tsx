import React, { useEffect, useState } from 'react';
import { Genre, Movie } from '../types';
import { MovieApiService } from '../services/movieApi';
import { GenreExplorer } from '../components/GenreExplorer';
import { MovieGrid } from '../components/MovieGrid';
import { Sparkles, Film } from 'lucide-react';

export const GenresView: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MovieApiService.getGenres().then((res) => {
      setGenres(res);
      if (res.length > 0 && !selectedGenre) {
        setSelectedGenre(res[0]); // default to first genre (Action)
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedGenre) return;

    let isMounted = true;
    setLoading(true);

    MovieApiService.discoverMovies({
      genreId: selectedGenre.id,
      year: 'all',
      minRating: 0,
      sortBy: 'popularity.desc',
      searchQuery: '',
    })
      .then((res) => {
        if (!isMounted) return;
        setMovies(res.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedGenre]);

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-7 h-7 text-purple-400" />
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif">
            Genre Explorer
          </h1>
        </div>
        <p className="text-sm text-neutral-400">
          Select a category below to instantly stream curated titles and blockbusters.
        </p>
      </div>

      {/* Genre Cards Picker */}
      <GenreExplorer
        genres={genres}
        onSelectGenre={(g) => setSelectedGenre(g)}
        selectedGenreId={selectedGenre?.id}
      />

      {/* Movies in Selected Genre */}
      {selectedGenre && (
        <section className="space-y-6 pt-6 border-t border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedGenre.icon || '🎬'}</span>
              <div>
                <h2 className="text-2xl font-black text-white font-serif">
                  {selectedGenre.name} Movies
                </h2>
                <p className="text-xs text-neutral-400">
                  Showing top rated and trending titles in {selectedGenre.name}
                </p>
              </div>
            </div>
          </div>

          <MovieGrid
            movies={movies}
            loading={loading}
            emptyTitle={`No movies found for ${selectedGenre.name}`}
            emptyDescription="Try selecting another category above."
          />
        </section>
      )}
    </div>
  );
};
