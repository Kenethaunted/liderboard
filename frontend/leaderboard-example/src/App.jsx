import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [films, setFilms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/examole.json")
      .then((response) => {
        const formatted = response.data.map(([id, title, year, genreId, duration]) => ({
          id,
          title,
          year,
          genreId,
          duration,
        }));
        setFilms(formatted);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить данные");
      });
  }, []);

  return (

    <div className="app-container">
      <title>Test Table</title>
      <h1 className="app-title">Список фильмов</h1>

      {error && <p className="error">{error}</p>}

      <table className="film-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название фильма</th>
            <th>Год выпуска</th>
            <th>ID жанра</th>
            <th>Продолжительность (мин)</th>
          </tr>
        </thead>
        <tbody>
          {films.length > 0 ? (
            films.map((film) => (
              <tr key={film.id}>
                <td>{film.id}</td>
                <td>{film.title}</td>
                <td>{film.year}</td>
                <td>{film.genreId}</td>
                <td>{film.duration}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="loading" colSpan="5">
                Загрузка данных...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
