import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from "../queries";

const Recommended = () => {
  const result = useQuery(ME);
  const resultBooks = useQuery(ALL_BOOKS);
  if (result.loading) return <div>fetching...</div>;
  if (resultBooks.loading) return <div>fetching...</div>;

  const loggedInUser = result.data.me;
  const books = resultBooks.data.allBooks;

  return (
    <div>
      <h2>Recommended</h2>
      <p>
        books in your favorite genre <b>{loggedInUser.favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((book) => book.genres.includes(loggedInUser.favoriteGenre))
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
