import React from 'react';

export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="relative flex flex-col rounded-xl overflow-hidden bg-neutral-800/40 border border-neutral-700/30 animate-pulse aspect-[2/3] w-full">
      <div className="w-full h-full bg-gradient-to-b from-neutral-700/30 to-neutral-800/60" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="h-4 bg-neutral-600/50 rounded w-3/4" />
        <div className="flex justify-between items-center">
          <div className="h-3 bg-neutral-600/40 rounded w-1/4" />
          <div className="h-3 bg-amber-500/30 rounded w-1/5" />
        </div>
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative w-full h-[70vh] min-h-[480px] max-h-[680px] bg-neutral-900 animate-pulse overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-neutral-800/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
      <div className="absolute bottom-12 left-6 md:left-12 max-w-2xl space-y-4">
        <div className="h-6 bg-neutral-700/60 rounded w-1/3" />
        <div className="h-10 md:h-14 bg-neutral-700/80 rounded w-4/5" />
        <div className="flex gap-3">
          <div className="h-5 bg-neutral-700/50 rounded w-16" />
          <div className="h-5 bg-neutral-700/50 rounded w-20" />
          <div className="h-5 bg-neutral-700/50 rounded w-24" />
        </div>
        <div className="h-16 bg-neutral-700/40 rounded w-full" />
        <div className="flex gap-4 pt-2">
          <div className="h-12 bg-red-600/40 rounded-xl w-36" />
          <div className="h-12 bg-neutral-700/50 rounded-xl w-32" />
        </div>
      </div>
    </div>
  );
};

export const DetailsSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse p-4 md:p-8 max-w-6xl mx-auto">
      <div className="h-72 md:h-96 bg-neutral-800/60 rounded-2xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="h-96 bg-neutral-800/40 rounded-xl" />
        <div className="md:col-span-2 space-y-4">
          <div className="h-8 bg-neutral-700/60 rounded w-2/3" />
          <div className="h-5 bg-neutral-700/40 rounded w-1/2" />
          <div className="h-24 bg-neutral-700/30 rounded w-full" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="h-16 bg-neutral-800/40 rounded-lg" />
            <div className="h-16 bg-neutral-800/40 rounded-lg" />
            <div className="h-16 bg-neutral-800/40 rounded-lg" />
            <div className="h-16 bg-neutral-800/40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
