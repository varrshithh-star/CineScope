import React from 'react';
import { Genre } from '../types';
import { Sparkles, ChevronRight } from 'lucide-react';

interface GenreExplorerProps {
  genres: Genre[];
  onSelectGenre: (genre: Genre) => void;
  selectedGenreId?: number | null;
}

export const GenreExplorer: React.FC<GenreExplorerProps> = ({
  genres,
  onSelectGenre,
  selectedGenreId,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-2xl font-black text-white tracking-tight font-serif">
              Genre Explorer
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Browse through categories and discover films by mood and style.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {genres.map((genre) => {
          const isSelected = selectedGenreId === genre.id;
          return (
            <button
              key={genre.id}
              onClick={() => onSelectGenre(genre)}
              className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 transform hover:-translate-y-1 active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-br from-rose-600 to-rose-900 text-white border-rose-400 shadow-xl shadow-rose-600/30'
                  : 'bg-zinc-900/60 hover:bg-zinc-900 text-zinc-200 border-white/10 hover:border-white/20 shadow-md backdrop-blur-md'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <span className="text-2xl sm:text-3xl filter drop-shadow group-hover:scale-110 transition-transform">
                  {genre.icon || '🎬'}
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-white tracking-wide group-hover:text-rose-400 transition-colors">
                  {genre.name}
                </h3>
                <span className="text-[11px] text-zinc-400 group-hover:text-zinc-300">
                  Explore titles
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
