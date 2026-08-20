import React from 'react';
import { CastMember } from '../types';
import { User } from 'lucide-react';

interface CastCarouselProps {
  cast: CastMember[];
}

export const CastCarousel: React.FC<CastCarouselProps> = ({ cast }) => {
  if (!cast || cast.length === 0) {
    return <p className="text-sm text-zinc-500 italic">Cast information unavailable.</p>;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-white font-serif">Top Cast</h3>
      <div
        className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cast.map((actor) => (
          <div
            key={actor.id}
            className="shrink-0 w-28 sm:w-32 flex flex-col items-center text-center group snap-start"
          >
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-zinc-900 border border-white/20 group-hover:border-rose-500/80 shadow-md mb-2 transition-all group-hover:scale-105">
              {actor.profile_path ? (
                <img
                  src={actor.profile_path}
                  alt={actor.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>

            <h4 className="text-xs font-bold text-zinc-200 line-clamp-1 group-hover:text-rose-400 transition-colors">
              {actor.name}
            </h4>
            <p className="text-[11px] text-zinc-400 line-clamp-1">
              as {actor.character || 'Actor'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
