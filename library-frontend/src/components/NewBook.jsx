import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, BOOK_BY_GENRE } from "../queries";
import { updateCache } from "../App";

const NewBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [addNewBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      console.log(messages);
    },
    update: (cache, response) => {
      // update all books
      // cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
      //   return {
      //     allBooks: allBooks.concat(response.data.addBook),
      //   };
      // });
      const newBook = response.data.addBook;
      updateCache(cache, { query: ALL_BOOKS }, (data) => {
        if (data.allBooks.some((book) => book.id === newBook.id)) {
          return data;
        }
        return {
          allBooks: data.allBooks.concat(newBook),
        };
      });

      // author update
      const data = cache.readQuery({ query: ALL_AUTHORS });
      const authorExists = data.allAuthors.some(
        (author) => author.name === newBook.author.name,
      );

      if (authorExists) {
        updateCache(cache, { query: ALL_AUTHORS }, (data) => {
          return {
            allAuthors: data.allAuthors.map((author) =>
              author.name === newBook.author.name
                ? { ...author, bookCount: author.bookCount + 1 }
                : author,
            ),
          };
        });
        // updateCache(
        //   cache,
        //   { query: ALL_AUTHORS },
        //   response.data.addBook.author.name,
        // );
      } else {
        updateCache(cache, { query: ALL_AUTHORS }, (data) => {
          return {
            allAuthor: data.allAuthors.concat(newBook.author),
          };
        });
      }

      // updating genres

      newBook.genres.forEach((genre) => {
        // cache.updateQuery(
        //   { query: BOOK_BY_GENRE, variables: { genre: genre } },
        //   ({ allBooks }) => {
        //     return {
        //       allBooks: allBooks.concat(response.data.addBook),
        //     };
        //   },
        // ),
        //   updateCache(cache,
        //     { query: BOOK_BY_GENRE, variables: { genre: genre } }, response.data.addBook)
        //
        updateCache(
          cache,
          { query: BOOK_BY_GENRE, variables: { genre } },
          (data) => {
            return {
              allBooks: data.allBooks.concat(newBook),
            };
          },
        );
      });
    },
    // refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
  });

  const submit = async (event) => {
    event.preventDefault();

    await addNewBook({
      variables: {
        title: title.length > 5 ? title : undefined,
        author,
        published: parseInt(published),
        genres,
      },
    });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
