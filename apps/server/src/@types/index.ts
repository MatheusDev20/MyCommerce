export interface LLMProvider {
  create: () => void;
}

export type HttpClient = {
  GET: (details: RequestDetails) => Promise<any>;
};

export type RequestDetails = {
  path: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
};

type SongCompletion = {
  artist: string;
  name: string;
};

type MovieCompletion = {
  title: string;
  director: string;
};

export type CompletionsCategories = {
  music: SongCompletion;
  movies: MovieCompletion;
};

export type RecomendationCompletion<T> = {
  recomendations: T[];
};

export type PromptInput = {
  role: string;
  content: string;
};

export type LoggerFunctions = {
  generatedCompletion: (completion: string) => void;
};

export type AuthProvider = {
  getAuthHeaders: () => Promise<any>;
};

export type Album = {
  album_type: string;
  artists: any[];
  external_urls: string[];
  href: string;
  id: string;
  images: AlbumImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
};
export type AlbumImage = {
  height: number;
  url: string;
  width: number;
};

export type MovieDTO = {
  adult: boolean;
  backdrop_full_url: string;
  genre_ids: any[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_full_url: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type SongDetailsDTO = {
  songName: string;
  spotfy_external_id: string;
  artistName: string;
  album: Album;
};
