const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const requests = {
  trending: '/trending/all/week',
  originals: '/discover/tv?with_networks=213',
  topRated: '/movie/top_rated',
  action: '/discover/movie?with_genres=28',
  comedy: '/discover/movie?with_genres=35',
  horror: '/discover/movie?with_genres=27',
  documentaries: '/discover/movie?with_genres=99',
};

export async function fetchFromTMDB(path) {
  const separator = path.includes('?') ? '&' : '?';
  const res = await fetch(`${BASE_URL}${path}${separator}api_key=${API_KEY}&language=en-US`);
  if (!res.ok) throw new Error(`TMDB request failed (${res.status})`);
  const data = await res.json();
  return data.results;
}