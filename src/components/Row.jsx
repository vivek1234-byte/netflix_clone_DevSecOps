import { useEffect, useState } from 'react';
import { fetchFromTMDB, IMAGE_BASE } from '../api/tmdb';

export default function Row({ title, path, large = false }) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFromTMDB(path)
      .then(setMovies)
      .catch((err) => setError(err.message));
  }, [path]);

  const imageKey = large ? 'poster_path' : 'backdrop_path';

  return (
    <section className="row">
      <h2>{title}</h2>
      {error && <p className="row__error">{error}</p>}
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
            />
          ))}
      </div>
    </section>
  );
}