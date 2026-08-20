import React from 'react';
import { MovieProvider, useMovie } from './context/MovieContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { TrailerModal } from './components/TrailerModal';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { HomeView } from './views/HomeView';
import { MoviesView } from './views/MoviesView';
import { TrendingView } from './views/TrendingView';
import { GenresView } from './views/GenresView';
import { FavoritesView } from './views/FavoritesView';
import { WatchlistView } from './views/WatchlistView';
import { SearchView } from './views/SearchView';
import { Film, Home, Flame, Sparkles, Heart, Bookmark, Search } from 'lucide-react';
import { ActiveTab } from './types';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, favorites, watchlist } = useMovie();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'movies':
        return <MoviesView />;
      case 'trending':
        return <TrendingView />;
      case 'genres':
        return <GenresView />;
      case 'favorites':
        return <FavoritesView />;
      case 'watchlist':
        return <WatchlistView />;
      case 'search':
        return <SearchView />;
      case 'home':
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-zinc-100 selection:bg-rose-600 selection:text-white font-sans antialiased">
      {/* Top Navbar */}
      <Navbar />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20 lg:pb-12">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <MovieDetailsModal />
      <TrailerModal />
      <ApiKeyModal />
      <Toast />

      {/* Mobile Bottom Quick Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/90 backdrop-blur-2xl border-t border-white/10 px-2 py-2 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => {
            setActiveTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors ${
            activeTab === 'home' ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('movies');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors ${
            activeTab === 'movies' ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Film className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Movies</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('trending');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors ${
            activeTab === 'trending' ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Trending</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('search');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors ${
            activeTab === 'search' ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Search</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('favorites');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors ${
            activeTab === 'favorites' ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Saved</span>
          {favorites.length > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
          )}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <MovieProvider>
      <MainAppContent />
    </MovieProvider>
  );
}
