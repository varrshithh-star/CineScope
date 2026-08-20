import { CastMember, FilterState, Genre, Movie, ProductionCompany, VideoItem } from '../types';
import { GENRES_LIST, MOCK_MOVIES } from './mockMovies';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Key retrieval
export function getActiveApiKey(): string {
  // Check local storage override first, then env variable
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('cinescope_tmdb_api_key') : null;
  if (localKey && localKey.trim().length > 5) {
    return localKey.trim();
  }
  const envKey = (import.meta as any).env?.VITE_TMDB_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 5) {
    return envKey.trim();
  }
  return '';
}

export function setActiveApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('cinescope_tmdb_api_key', key.trim());
    } else {
      localStorage.removeItem('cinescope_tmdb_api_key');
    }
  }
}

export function isLiveApiActive(): boolean {
  return getActiveApiKey().length > 0;
}

// Helpers for image paths
export function getPosterUrl(path: string | null | undefined, size: 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null | undefined, size: 'w780' | 'w1280' | 'original' = 'original'): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getProfileUrl(path: string | null | undefined, size: 'w185' | 'w300' | 'original' = 'w300'): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

// Helper to normalize TMDB Movie object
function transformTmdbMovie(raw: any, genresMap: Map<number, string>): Movie {
  const genres: Genre[] = raw.genres
    ? raw.genres
    : (raw.genre_ids || []).map((gid: number) => ({
        id: gid,
        name: genresMap.get(gid) || 'General',
      }));

  return {
    id: raw.id,
    title: raw.title || raw.name || 'Untitled',
    original_title: raw.original_title || raw.original_name,
    tagline: raw.tagline || '',
    overview: raw.overview || 'No overview available.',
    poster_path: raw.poster_path ? getPosterUrl(raw.poster_path, 'w780') : null,
    backdrop_path: raw.backdrop_path ? getBackdropUrl(raw.backdrop_path, 'original') : null,
    release_date: raw.release_date || raw.first_air_date || '2024-01-01',
    vote_average: Number((raw.vote_average || 0).toFixed(1)),
    vote_count: raw.vote_count || 0,
    popularity: raw.popularity || 0,
    runtime: raw.runtime || 120,
    genres,
    genre_ids: raw.genre_ids || (raw.genres ? raw.genres.map((g: any) => g.id) : []),
    director: raw.credits?.crew?.find((c: any) => c.job === 'Director')?.name || raw.director || 'Various',
    cast: raw.credits?.cast ? raw.credits.cast.slice(0, 10).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character || 'Actor',
      profile_path: c.profile_path ? getProfileUrl(c.profile_path, 'w300') : undefined,
    })) : undefined,
    budget: raw.budget || 0,
    revenue: raw.revenue || 0,
    status: raw.status || 'Released',
    trailer_key: raw.videos?.results?.find((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))?.key,
    spoken_languages: raw.spoken_languages?.map((l: any) => l.english_name || l.name) || ['English'],
    production_companies: raw.production_companies?.map((pc: any): ProductionCompany => ({
      id: pc.id,
      name: pc.name,
      logo_path: pc.logo_path ? `${TMDB_IMAGE_BASE}/w185${pc.logo_path}` : null,
      origin_country: pc.origin_country,
    })) || [],
  };
}

// Genre Map Cache
let genreMapCache: Map<number, string> | null = null;
export async function getGenresMap(): Promise<Map<number, string>> {
  if (genreMapCache) return genreMapCache;
  const map = new Map<number, string>();
  GENRES_LIST.forEach((g) => map.set(g.id, g.name));

  const apiKey = getActiveApiKey();
  if (apiKey) {
    try {
      const res = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${apiKey}&language=en-US`);
      if (res.ok) {
        const data = await res.json();
        if (data.genres) {
          data.genres.forEach((g: Genre) => map.set(g.id, g.name));
        }
      }
    } catch {
      // ignore
    }
  }
  genreMapCache = map;
  return map;
}

// Service methods
export const MovieApiService = {
  async getGenres(): Promise<Genre[]> {
    const apiKey = getActiveApiKey();
    if (apiKey) {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${apiKey}&language=en-US`);
        if (res.ok) {
          const data = await res.json();
          if (data.genres && data.genres.length > 0) {
            // merge icons
            return data.genres.map((g: any) => {
              const matched = GENRES_LIST.find((mg) => mg.id === g.id || mg.name.toLowerCase() === g.name.toLowerCase());
              return {
                id: g.id,
                name: g.name,
                icon: matched?.icon || '🎬',
                gradient: matched?.gradient || 'from-zinc-600/20 to-neutral-800/20 border-zinc-500/30',
              };
            });
          }
        }
      } catch (err) {
        console.warn('Using local genre list fallback:', err);
      }
    }
    return GENRES_LIST;
  },

  async getTrending(page = 1): Promise<{ results: Movie[]; totalPages: number }> {
    const apiKey = getActiveApiKey();
    const genresMap = await getGenresMap();

    if (apiKey) {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/trending/movie/day?api_key=${apiKey}&page=${page}`);
        if (res.ok) {
          const data = await res.json();
          return {
            results: (data.results || []).map((m: any) => transformTmdbMovie(m, genresMap)),
            totalPages: data.total_pages || 1,
          };
        }
      } catch (err) {
        console.warn('TMDB Trending error, falling back to mock dataset:', err);
      }
    }

    // Mock dataset fallback with sort by popularity
    const sorted = [...MOCK_MOVIES].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    return {
      results: sorted,
      totalPages: 1,
    };
  },

  async getPopular(page = 1): Promise<{ results: Movie[]; totalPages: number }> {
    const apiKey = getActiveApiKey();
    const genresMap = await getGenresMap();

    if (apiKey) {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&page=${page}&language=en-US`);
        if (res.ok) {
          const data = await res.json();
          return {
            results: (data.results || []).map((m: any) => transformTmdbMovie(m, genresMap)),
            totalPages: data.total_pages || 1,
          };
        }
      } catch (err) {
        console.warn('TMDB Popular error, falling back:', err);
      }
    }

    // Mock dataset
    const sorted = [...MOCK_MOVIES].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
    return {
      results: sorted,
      totalPages: 1,
    };
  },

  async getTopRated(page = 1): Promise<{ results: Movie[]; totalPages: number }> {
    const apiKey = getActiveApiKey();
    const genresMap = await getGenresMap();

    if (apiKey) {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${apiKey}&page=${page}&language=en-US`);
        if (res.ok) {
          const data = await res.json();
          return {
            results: (data.results || []).map((m: any) => transformTmdbMovie(m, genresMap)),
            totalPages: data.total_pages || 1,
          };
        }
      } catch (err) {
        console.warn('TMDB TopRated error, falling back:', err);
      }
    }

    // Mock dataset
    const sorted = [...MOCK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
    return {
      results: sorted,
      totalPages: 1,
    };
  },

  async searchMovies(query: string, page = 1): Promise<{ results: Movie[]; totalPages: number }> {
    if (!query.trim()) {
      return { results: [], totalPages: 0 };
    }

    const apiKey = getActiveApiKey();
    const genresMap = await getGenresMap();

    if (apiKey) {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}&include_adult=false&language=en-US`);
        if (res.ok) {
          const data = await res.json();
          return {
            results: (data.results || []).map((m: any) => transformTmdbMovie(m, genresMap)),
            totalPages: data.total_pages || 1,
          };
        }
      } catch (err) {
        console.warn('TMDB Search error, falling back:', err);
      }
    }

    // Mock filter search
    const q = query.toLowerCase().trim();
    const filtered = MOCK_MOVIES.filter((m) => {
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchOverview = m.overview.toLowerCase().includes(q);
      const matchDirector = m.director ? m.director.toLowerCase().includes(q) : false;
      const matchCast = m.cast ? m.cast.some((c) => c.name.toLowerCase().includes(q) || c.character.toLowerCase().includes(q)) : false;
      const matchGenre = Array.isArray(m.genres)
        ? m.genres.some((g) => (typeof g === 'string' ? g.toLowerCase().includes(q) : g.name.toLowerCase().includes(q)))
        : false;
      return matchTitle || matchOverview || matchDirector || matchCast || matchGenre;
    });

    return {
      results: filtered,
      totalPages: 1,
    };
  },

  async getMovieDetails(id: number): Promise<Movie | null> {
    const apiKey = getActiveApiKey();
    const genresMap = await getGenresMap();

    if (apiKey) {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${apiKey}&append_to_response=credits,videos,similar,recommendations&language=en-US`);
        if (res.ok) {
          const data = await res.json();
          return transformTmdbMovie(data, genresMap);
        }
      } catch (err) {
        console.warn('TMDB Details error, checking mock dataset:', err);
      }
    }

    const found = MOCK_MOVIES.find((m) => m.id === id);
    if (found) return found;

    // Fallback if id was from another set
    return MOCK_MOVIES[0];
  },

  async getMovieVideos(id: number): Promise<VideoItem[]> {
    const apiKey = getActiveApiKey();
    if (apiKey) {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/movie/${id}/videos?api_key=${apiKey}&language=en-US`);
        if (res.ok) {
          const data = await res.json();
          return data.results || [];
        }
      } catch (err) {
        console.warn('TMDB Videos error:', err);
      }
    }

    const found = MOCK_MOVIES.find((m) => m.id === id);
    if (found?.trailer_key) {
      return [{
        id: 'mock_trailer',
        key: found.trailer_key,
        name: `${found.title} Official Trailer`,
        site: 'YouTube',
        type: 'Trailer',
        official: true,
      }];
    }
    return [{
      id: 'default_trailer',
      key: 'Way9Dexny3w',
      name: 'Trailer',
      site: 'YouTube',
      type: 'Trailer',
      official: true,
    }];
  },

  async getMovieCredits(id: number): Promise<{ cast: CastMember[]; director: string }> {
    const apiKey = getActiveApiKey();
    if (apiKey) {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/movie/${id}/credits?api_key=${apiKey}&language=en-US`);
        if (res.ok) {
          const data = await res.json();
          const cast: CastMember[] = (data.cast || []).slice(0, 15).map((c: any) => ({
            id: c.id,
            name: c.name,
            character: c.character,
            profile_path: c.profile_path ? getProfileUrl(c.profile_path, 'w300') : undefined,
          }));
          const director = data.crew?.find((c: any) => c.job === 'Director')?.name || 'Various';
          return { cast, director };
        }
      } catch (err) {
        console.warn('TMDB Credits error:', err);
      }
    }

    const found = MOCK_MOVIES.find((m) => m.id === id);
    return {
      cast: found?.cast || [],
      director: found?.director || 'Director',
    };
  },

  async getSimilarMovies(id: number): Promise<Movie[]> {
    const apiKey = getActiveApiKey();
    const genresMap = await getGenresMap();

    if (apiKey) {
      try {
        const res = await fetch(`${TMDB_BASE_URL}/movie/${id}/recommendations?api_key=${apiKey}&language=en-US&page=1`);
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            return data.results.slice(0, 10).map((m: any) => transformTmdbMovie(m, genresMap));
          }
        }
      } catch (err) {
        console.warn('TMDB Recommendations error:', err);
      }
    }

    // Curated similar movies based on genres
    const target = MOCK_MOVIES.find((m) => m.id === id) || MOCK_MOVIES[0];
    const targetGenreIds = target.genre_ids || (target.genres ? target.genres.map((g: any) => g.id) : []);

    const similar = MOCK_MOVIES.filter((m) => m.id !== id && (m.genre_ids || []).some((gid) => targetGenreIds.includes(gid)));
    return (similar.length > 0 ? similar : MOCK_MOVIES.filter((m) => m.id !== id)).slice(0, 8);
  },

  async discoverMovies(filters: FilterState, page = 1): Promise<{ results: Movie[]; totalPages: number }> {
    const apiKey = getActiveApiKey();
    const genresMap = await getGenresMap();

    if (apiKey) {
      try {
        const params = new URLSearchParams({
          api_key: apiKey,
          page: page.toString(),
          sort_by: filters.sortBy || 'popularity.desc',
          language: 'en-US',
          include_adult: 'false',
        });

        if (filters.genreId) {
          params.append('with_genres', filters.genreId.toString());
        }
        if (filters.year && filters.year !== 'all') {
          if (filters.year === 'older') {
            params.append('primary_release_date.lte', '2021-12-31');
          } else {
            params.append('primary_release_year', filters.year);
          }
        }
        if (filters.minRating > 0) {
          params.append('vote_average.gte', filters.minRating.toString());
        }

        const res = await fetch(`${TMDB_BASE_URL}/discover/movie?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          return {
            results: (data.results || []).map((m: any) => transformTmdbMovie(m, genresMap)),
            totalPages: data.total_pages || 1,
          };
        }
      } catch (err) {
        console.warn('TMDB Discover error:', err);
      }
    }

    // Local filter engine
    let list = [...MOCK_MOVIES];

    if (filters.genreId) {
      list = list.filter((m) => {
        if (m.genre_ids && m.genre_ids.includes(filters.genreId!)) return true;
        if (m.genres) {
          return m.genres.some((g) => (typeof g === 'object' ? g.id === filters.genreId : false));
        }
        return false;
      });
    }

    if (filters.year && filters.year !== 'all') {
      if (filters.year === 'older') {
        list = list.filter((m) => {
          const year = parseInt(m.release_date.substring(0, 4), 10);
          return year < 2022;
        });
      } else {
        list = list.filter((m) => m.release_date.startsWith(filters.year));
      }
    }

    if (filters.minRating > 0) {
      list = list.filter((m) => m.vote_average >= filters.minRating);
    }

    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter((m) => m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q));
    }

    // Sorting
    list.sort((a, b) => {
      switch (filters.sortBy) {
        case 'vote_average.desc':
          return b.vote_average - a.vote_average;
        case 'release_date.desc':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        case 'title.asc':
          return a.title.localeCompare(b.title);
        case 'popularity.desc':
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    return {
      results: list,
      totalPages: 1,
    };
  },
};
