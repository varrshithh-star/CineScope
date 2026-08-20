import React, { useEffect, useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { MovieApiService } from '../services/movieApi';
import { X, Play, Film, AlertTriangle } from 'lucide-react';

export const TrailerModal: React.FC = () => {
  const { trailerMovie, closeTrailer } = useMovie();
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!trailerMovie) {
      setVideoKey(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(false);

    // If movie already has a trailer_key
    if (trailerMovie.trailer_key) {
      setVideoKey(trailerMovie.trailer_key);
      setLoading(false);
      return;
    }

    // Fetch video from API
    MovieApiService.getMovieVideos(trailerMovie.id)
      .then((videos) => {
        if (!isMounted) return;
        const trailer = videos.find((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) || videos[0];
        if (trailer && trailer.key) {
          setVideoKey(trailer.key);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [trailerMovie]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeTrailer();
      }
    };
    if (trailerMovie) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [trailerMovie, closeTrailer]);

  if (!trailerMovie) return null;

  return (
    <div
      id="trailer-modal-backdrop"
      onClick={closeTrailer}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-xl animate-fade-in"
    >
      <div
        id="trailer-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#080808] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-rose-950/40 flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-zinc-900/70">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-600/20 text-rose-500">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base line-clamp-1 font-serif">
                {trailerMovie.title} — Official Trailer
              </h3>
              <p className="text-xs text-zinc-400">
                HD Cinematic Stream • {trailerMovie.release_date?.substring(0, 4)}
              </p>
            </div>
          </div>

          <button
            id="close-trailer-modal-btn"
            onClick={closeTrailer}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-white/10"
            aria-label="Close trailer modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-zinc-400">
              <Play className="w-10 h-10 animate-bounce text-rose-500" />
              <span className="text-sm font-medium">Connecting to trailer feed...</span>
            </div>
          ) : error || !videoKey ? (
            <div className="flex flex-col items-center gap-3 p-8 text-center text-zinc-400">
              <AlertTriangle className="w-12 h-12 text-amber-500" />
              <h4 className="text-lg font-bold text-white">Trailer Stream Unavailable</h4>
              <p className="text-xs text-zinc-500 max-w-sm">
                The video stream for this title could not be loaded at this time.
              </p>
            </div>
          ) : (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${trailerMovie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
};
