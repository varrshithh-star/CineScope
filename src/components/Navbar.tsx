import React, { useEffect, useState, useRef } from 'react';
import { useMovie } from '../context/MovieContext';
import {
  Film,
  Search,
  Heart,
  Bookmark,
  Sun,
  Moon,
  Key,
  Menu,
  X,
  Flame,
  Clapperboard,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { ActiveTab } from '../types';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    favorites,
    watchlist,
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    apiKey,
    setIsApiKeyModalOpen,
  } = useMovie();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        setIsSearchExpanded(true);
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab !== 'search' && tab !== 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('search');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      id="cinescope-navbar"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/60'
          : 'bg-gradient-to-b from-[#050505]/90 via-[#050505]/60 to-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group text-left shrink-0 transition-transform active:scale-95"
            aria-label="CineScope Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-600/20 group-hover:shadow-rose-600/40 transition-all duration-300">
              <div className="w-full h-full bg-[#050505] rounded-[10px] flex items-center justify-center">
                <Film className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-wider text-white font-serif">
                  CINE<span className="text-rose-500">SCOPE</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  PRO
                </span>
              </div>
              <span className="hidden sm:block text-[11px] text-zinc-400 font-medium tracking-tight">
                Search. Discover. Watch.
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            <button
              id="nav-home-btn"
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'home'
                  ? 'text-white bg-white/10 font-semibold shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>
            <button
              id="nav-movies-btn"
              onClick={() => handleNavClick('movies')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'movies'
                  ? 'text-white bg-white/10 font-semibold shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clapperboard className="w-4 h-4 text-rose-400" />
              Movies
            </button>
            <button
              id="nav-trending-btn"
              onClick={() => handleNavClick('trending')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'trending'
                  ? 'text-white bg-white/10 font-semibold shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              Trending
            </button>
            <button
              id="nav-genres-btn"
              onClick={() => handleNavClick('genres')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                activeTab === 'genres'
                  ? 'text-white bg-white/10 font-semibold shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              Genres
            </button>
            <button
              id="nav-favorites-btn"
              onClick={() => handleNavClick('favorites')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors relative ${
                activeTab === 'favorites'
                  ? 'text-white bg-white/10 font-semibold shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="ml-1 text-xs px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-bold">
                  {favorites.length}
                </span>
              )}
            </button>
            <button
              id="nav-watchlist-btn"
              onClick={() => handleNavClick('watchlist')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors relative ${
                activeTab === 'watchlist'
                  ? 'text-white bg-white/10 font-semibold shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>Watchlist</span>
              {watchlist.length > 0 && (
                <span className="ml-1 text-xs px-1.5 py-0.2 rounded-full bg-amber-600 text-white font-bold">
                  {watchlist.length}
                </span>
              )}
            </button>
          </nav>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div
                className={`relative flex items-center rounded-full transition-all duration-300 ${
                  isSearchExpanded
                    ? 'w-48 sm:w-64 md:w-80 bg-zinc-900 border-rose-500/50 shadow-lg shadow-rose-500/10'
                    : 'w-10 sm:w-56 bg-zinc-900/80 border-white/10 hover:border-white/20'
                } border`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchExpanded(true);
                    searchInputRef.current?.focus();
                  }}
                  className="p-2.5 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search movies, actors..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim() && activeTab !== 'search') {
                      setActiveTab('search');
                    }
                  }}
                  onFocus={() => setIsSearchExpanded(true)}
                  onBlur={() => {
                    if (!searchQuery) setIsSearchExpanded(false);
                  }}
                  className={`bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none pr-3 py-2 w-full ${
                    !isSearchExpanded ? 'hidden sm:block' : 'block'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="p-1.5 mr-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {!searchQuery && (
                  <kbd className="hidden md:inline-block mr-2 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/10">
                    /
                  </kbd>
                )}
              </div>
            </form>

            {/* API Key Modal Button */}
            <button
              id="nav-api-btn"
              onClick={() => setIsApiKeyModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-white/10 hover:border-white/20 transition-all"
              title={apiKey ? 'Live TMDB API Active' : 'CineScope Curated Database Mode'}
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {apiKey ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live TMDB
                  </span>
                ) : (
                  'API Setup'
                )}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              id="nav-theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors border border-transparent hover:border-white/10"
              aria-label="Toggle dark/light mode"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="nav-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#050505]/95 border-b border-white/10 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl animate-fade-in">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium ${
              activeTab === 'home' ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <Film className="w-5 h-5" />
            Home
          </button>
          <button
            onClick={() => handleNavClick('movies')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium ${
              activeTab === 'movies' ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <Clapperboard className="w-5 h-5" />
            Movies & Discovery
          </button>
          <button
            onClick={() => handleNavClick('trending')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium ${
              activeTab === 'trending' ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <Flame className="w-5 h-5 text-amber-400" />
            Trending Today
          </button>
          <button
            onClick={() => handleNavClick('genres')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium ${
              activeTab === 'genres' ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            Genre Explorer
          </button>
          <button
            onClick={() => handleNavClick('favorites')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-medium ${
              activeTab === 'favorites' ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-rose-500" />
              Favorites
            </div>
            {favorites.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold">
                {favorites.length}
              </span>
            )}
          </button>
          <button
            onClick={() => handleNavClick('watchlist')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-medium ${
              activeTab === 'watchlist' ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bookmark className="w-5 h-5 text-amber-400" />
              Watchlist
            </div>
            {watchlist.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-600 text-white font-bold">
                {watchlist.length}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
