import React from 'react';
import { FilterState, Genre, SortOption } from '../types';
import { Filter, Star, Calendar, SlidersHorizontal, ArrowUpDown, X, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  genres: Genre[];
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResults?: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  genres,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  const years = [
    { label: 'All Years', value: 'all' },
    { label: '2026', value: '2026' },
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: 'Older (<2022)', value: 'older' },
  ];

  const ratings = [
    { label: 'All Ratings', value: 0 },
    { label: '9+ ⭐', value: 9 },
    { label: '8+ ⭐', value: 8 },
    { label: '7+ ⭐', value: 7 },
    { label: '6+ ⭐', value: 6 },
  ];

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Most Popular', value: 'popularity.desc' },
    { label: 'Highest Rated', value: 'vote_average.desc' },
    { label: 'Newest Release', value: 'release_date.desc' },
    { label: 'Title (A-Z)', value: 'title.asc' },
  ];

  const activeFilterCount =
    (filters.genreId ? 1 : 0) +
    (filters.year !== 'all' ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.sortBy !== 'popularity.desc' ? 1 : 0);

  return (
    <div
      id="cinescope-filter-panel"
      className="p-5 md:p-6 bg-zinc-900/70 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl space-y-6"
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-600/10 text-rose-500 border border-rose-500/20">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Filter & Discover</h3>
            {totalResults !== undefined && (
              <p className="text-xs text-zinc-400">{totalResults} titles found</p>
            )}
          </div>
        </div>

        {/* Reset & Active Filter Tag */}
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 font-semibold">
              {activeFilterCount} active
            </span>
          )}
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors border border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Genres Pills */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-rose-500" />
          <span>Genre</span>
        </label>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => onFilterChange({ ...filters, genreId: null })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filters.genreId === null
                ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-white/5'
            }`}
          >
            All Genres
          </button>
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => onFilterChange({ ...filters, genreId: g.id === filters.genreId ? null : g.id })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                filters.genreId === g.id
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20'
                  : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-white/5'
              }`}
            >
              <span>{g.icon || '🎬'}</span>
              <span>{g.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Year, Rating, Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {/* Release Year */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Release Year</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {years.map((y) => (
              <button
                key={y.value}
                onClick={() => onFilterChange({ ...filters, year: y.value })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-center transition-all ${
                  filters.year === y.value
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 border border-white/5'
                }`}
              >
                {y.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Minimum Rating</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ratings.map((r) => (
              <button
                key={r.value}
                onClick={() => onFilterChange({ ...filters, minRating: r.value })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filters.minRating === r.value
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 border border-white/5'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sort By</span>
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as SortOption })}
            className="w-full bg-zinc-800 border border-white/10 text-white text-xs font-medium rounded-lg px-3 py-2.5 focus:outline-none focus:border-rose-500 transition-colors"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
