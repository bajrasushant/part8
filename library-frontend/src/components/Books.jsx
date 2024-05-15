import { useQuery } from "@apollo/client";
import { ALL_BOOKS, BOOK_BY_GENRE } from "../queries";
import { useState } from "react";

const Books = () => {
  const result = useQuery(ALL_BOOKS);
  const [currentGenre, setCurrentGenre] = useState("");
  const booksOnCurrentGenre = useQuery(BOOK_BY_GENRE, {
    variables: { genre: currentGenre },
    skip: !currentGenre,
  });

  if (result.loading) return <div>Fetching data...</div>;
  if (booksOnCurrentGenre.loading) return <div>Fetching data...</div>;

  const books = currentGenre
    ? booksOnCurrentGenre.data.allBooks
    : result.data.allBooks;

  const allGenres = result.data.allBooks.flatMap((book) => book.genres);
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
          {books.map((a) => (
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
