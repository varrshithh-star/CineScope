import React from 'react';
import { useMovie } from '../context/MovieContext';
import { Film, Heart, Github, Twitter, Youtube, Instagram, Shield, Sparkles } from 'lucide-react';
import { ActiveTab } from '../types';

export const Footer: React.FC = () => {
  const { setActiveTab } = useMovie();

  const handleNav = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="cinescope-footer" className="mt-20 border-t border-white/10 bg-[#050505] text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-amber-500 p-0.5 shadow-lg shadow-rose-600/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#050505] rounded-[10px] flex items-center justify-center">
                  <Film className="w-4 h-4 text-rose-500" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-wider text-white font-serif">
                CINE<span className="text-rose-500">SCOPE</span>
              </span>
            </div>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              &ldquo;Search. Discover. Watch. Repeat.&rdquo; The cinematic gateway to blockbuster trailers, cast explorations, top-rated masterworks, and personalized movie collections.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-serif">
              Explore Cinema
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-rose-400 transition-colors text-left"
                >
                  Featured Premiere
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('movies')}
                  className="hover:text-rose-400 transition-colors text-left"
                >
                  Movie Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('trending')}
                  className="hover:text-rose-400 transition-colors text-left"
                >
                  Trending Today
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('genres')}
                  className="hover:text-rose-400 transition-colors text-left"
                >
                  Genre Explorer
                </button>
              </li>
            </ul>
          </div>

          {/* Personal Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-serif">
              My Library
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNav('favorites')}
                  className="hover:text-rose-400 transition-colors text-left"
                >
                  Favorites Vault
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('watchlist')}
                  className="hover:text-rose-400 transition-colors text-left"
                >
                  Watchlist Queue
                </button>
              </li>
              <li>
                <span className="text-xs text-zinc-500 block pt-1">
                  This product uses the TMDB API but is not endorsed or certified by TMDB.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 CineScope. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built with React, TypeScript & Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
