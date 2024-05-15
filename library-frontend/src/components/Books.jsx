import { useState } from "react";

const Books = ({ books }) => {
  const [currentGenre, setCurrentGenre] = useState("");

  const allGenres = books.flatMap((book) => book.genres);
  const genres = [...new Set(allGenres)];
  return (
    <div>
      <h2>books</h2>

      {currentGenre ? (
        <div>
          in genre <b>{currentGenre}</b>
        </div>
      ) : null}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {currentGenre
            ? books
                .filter((book) => book.genres.includes(currentGenre))
                .map((a) => (
                  <tr key={a.title}>
                    <td>{a.title}</td>
                    <td>{a.author.name}</td>
                    <td>{a.published}</td>
                  </tr>
                ))
            : books.map((a) => (
                <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => {
          return (
            <button key={genre} onClick={() => setCurrentGenre(genre)}>
              {genre}
            </button>
          );
        })}
        <button key="allGenres" onClick={() => setCurrentGenre("")}>
          all genre
        </button>
      </div>
    </div>
  );
};

export default Books;
