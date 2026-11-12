import { useEffect, useState } from 'react';
import { fetchFromTMDB, fetchTrailer, IMAGE_BASE } from '../api/tmdb';

export default function Row({ title, path, large = false }) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetchFromTMDB(path)
      .then(setMovies)
      .catch((err) => setError(err.message));
  }, [path]);

  async function handleClick(movie) {
    setNotice('');
    const key = await fetchTrailer(movie);
    if (key) setTrailerKey(key);
    else setNotice(`No trailer available for "${movie.title || movie.name}"`);
  }

  const imageKey = large ? 'poster_path' : 'backdrop_path';

  return (
    <section className="row">
      <h2>{title}</h2>
      {error && <p className="row__error">{error}</p>}
      {notice && <p className="row__error">{notice}</p>}
      <div className="row__posters">
        {movies
          .filter((m) => m[imageKey])
          .map((m) => (
            <img
              key={m.id}
              className={`row__poster ${large ? 'row__poster--large' : ''}`}
              src={`${IMAGE_BASE}/w500${m[imageKey]}`}
              alt={m.title || m.name}
              loading="lazy"
              onClick={() => handleClick(m)}
            />
          ))}
      </div>

      {trailerKey && (
        <div className="trailer" onClick={() => setTrailerKey(null)}>
          <div className="trailer__box" onClick={(e) => e.stopPropagation()}>
            <button className="trailer__close" onClick={() => setTrailerKey(null)}>✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}