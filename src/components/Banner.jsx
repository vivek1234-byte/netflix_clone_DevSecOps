import { useEffect, useState } from 'react';
import { fetchFromTMDB, requests, IMAGE_BASE } from '../api/tmdb';

export default function Banner() {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchFromTMDB(requests.originals)
      .then((results) => {
        const withImage = results.filter((r) => r.backdrop_path);
        setMovie(withImage[Math.floor(Math.random() * withImage.length)]);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!movie) return <header className="banner" />;

  const overview =
    movie.overview?.length > 150 ? movie.overview.slice(0, 150) + '…' : movie.overview;

  return (
    <header
      className="banner"
      style={{ backgroundImage: `url(${IMAGE_BASE}/original${movie.backdrop_path})` }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">{movie.title || movie.name}</h1>
        <div className="banner__buttons">
          <button>▶ Play</button>
          <button>+ My List</button>
        </div>
        <p className="banner__description">{overview}</p>
      </div>
      <div className="banner__fade" />
    </header>
  );
}