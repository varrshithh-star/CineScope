export interface Genre {
  id: number;
  name: string;
  icon?: string;
  gradient?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department?: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path?: string | null;
  origin_country?: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  tagline?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count?: number;
  popularity?: number;
  runtime?: number;
  genres: Genre[] | string[];
  genre_ids?: number[];
  director?: string;
  cast?: CastMember[];
  budget?: number;
  revenue?: number;
  status?: string;
  trailer_key?: string;
  spoken_languages?: string[];
  production_companies?: ProductionCompany[];
}

export interface VideoItem {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
}

export type SortOption = 'popularity.desc' | 'vote_average.desc' | 'release_date.desc' | 'title.asc';

export interface FilterState {
  genreId: number | null;
  year: string;
  minRating: number;
  sortBy: SortOption;
  searchQuery: string;
}

export type ActiveTab = 'home' | 'movies' | 'trending' | 'genres' | 'favorites' | 'watchlist' | 'search';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}
