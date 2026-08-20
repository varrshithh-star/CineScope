import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActiveTab, Genre, Movie, ToastMessage } from '../types';
import { getActiveApiKey, setActiveApiKey as setStoredApiKey } from '../services/movieApi';

interface MovieContextType {
  favorites: Movie[];
  watchlist: Movie[];
  isFavorite: (id: number) => boolean;
  isInWatchlist: (id: number) => boolean;
  toggleFavorite: (movie: Movie) => void;
  toggleWatchlist: (movie: Movie) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  selectedMovieId: number | null;
  openMovieDetails: (id: number) => void;
  closeMovieDetails: () => void;
  trailerMovie: Movie | null;
  openTrailer: (movie: Movie) => void;
  closeTrailer: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre: Genre | null;
  setSelectedGenre: (genre: Genre | null) => void;
  apiKey: string;
  updateApiKey: (key: string) => void;
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  isApiKeyModalOpen: boolean;
  setIsApiKeyModalOpen: (open: boolean) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence states
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('cinescope_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('cinescope_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('cinescope_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [apiKey, setApiKey] = useState<string>(() => getActiveApiKey());
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem('cinescope_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Sync watchlist
  useEffect(() => {
    try {
      localStorage.setItem('cinescope_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error(e);
    }
  }, [watchlist]);

  // Sync theme
  useEffect(() => {
    try {
      localStorage.setItem('cinescope_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // URL state synchronization on mount & popstate
  useEffect(() => {
    const handleUrlState = () => {
      const params = new URLSearchParams(window.location.search);
      const movieParam = params.get('movie');
      const qParam = params.get('q');
      const tabParam = params.get('tab') as ActiveTab;

      if (movieParam) {
        setSelectedMovieId(parseInt(movieParam, 10));
      }
      if (qParam) {
        setSearchQuery(qParam);
        setActiveTab('search');
      } else if (tabParam && ['home', 'movies', 'trending', 'genres', 'favorites', 'watchlist', 'search'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    };

    handleUrlState();
    window.addEventListener('popstate', handleUrlState);
    return () => window.removeEventListener('popstate', handleUrlState);
  }, []);

  // Update URL on tab or movie change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedMovieId) {
      params.set('movie', selectedMovieId.toString());
    } else {
      params.delete('movie');
    }

    if (activeTab === 'search' && searchQuery) {
      params.set('q', searchQuery);
      params.delete('tab');
    } else {
      params.delete('q');
      if (activeTab !== 'home') {
        params.set('tab', activeTab);
      } else {
        params.delete('tab');
      }
    }

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab, searchQuery, selectedMovieId]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3200);
  };

  const isFavorite = (id: number) => favorites.some((m) => m.id === id);
  const isInWatchlist = (id: number) => watchlist.some((m) => m.id === id);

  const toggleFavorite = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      setFavorites((prev) => prev.filter((m) => m.id !== movie.id));
      showToast(`Removed "${movie.title}" from Favorites`, 'info');
    } else {
      setFavorites((prev) => [movie, ...prev]);
      showToast(`Added "${movie.title}" to Favorites ❤️`, 'success');
    }
  };

  const toggleWatchlist = (movie: Movie) => {
    if (isInWatchlist(movie.id)) {
      setWatchlist((prev) => prev.filter((m) => m.id !== movie.id));
      showToast(`Removed "${movie.title}" from Watchlist`, 'info');
    } else {
      setWatchlist((prev) => [movie, ...prev]);
      showToast(`Added "${movie.title}" to Watchlist 📑`, 'success');
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const openMovieDetails = (id: number) => {
    setSelectedMovieId(id);
  };

  const closeMovieDetails = () => {
    setSelectedMovieId(null);
  };

  const openTrailer = (movie: Movie) => {
    setTrailerMovie(movie);
  };

  const closeTrailer = () => {
    setTrailerMovie(null);
  };

  const updateApiKey = (key: string) => {
    setStoredApiKey(key);
    setApiKey(key);
    showToast(key ? 'TMDB API key updated successfully!' : 'Using CineScope Curated Database mode', 'info');
  };

  return (
    <MovieContext.Provider
      value={{
        favorites,
        watchlist,
        isFavorite,
        isInWatchlist,
        toggleFavorite,
        toggleWatchlist,
        theme,
        toggleTheme,
        selectedMovieId,
        openMovieDetails,
        closeMovieDetails,
        trailerMovie,
        openTrailer,
        closeTrailer,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        apiKey,
        updateApiKey,
        toast,
        showToast,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovie must be used within a MovieProvider');
  }
  return context;
};
