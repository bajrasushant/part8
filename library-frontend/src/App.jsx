import { Route, Routes, useNavigate } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import EditBorn from "./components/EditBorn";
import LoginForm from "./components/LoginForm";
import { useEffect, useState } from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import Recommended from "./components/Recommended";
import { ALL_BOOKS } from "./queries";

const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const storedToken = localStorage.getItem("library-user-token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const bookData= useQuery(ALL_BOOKS);
  if(bookData.loading) return <div>loading...</div>
  const books = bookData.data.allBooks;
  
  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.restore();
  };

  return (
    <div>
      <div>
        <button onClick={() => navigate("/")}>authors</button>
        <button onClick={() => navigate("/books")}>books</button>
        {token ? (
          <>
            <button onClick={() => navigate("/add")}>add book</button>
            <button onClick={() => navigate("/editBorn")}>edit born</button>
            <button onClick={() => navigate("/recommend")}>recommend</button>
          </>
        ) : null}
        {!token ? (
          <button onClick={() => navigate("/login")}>login</button>
        ) : (
          <button onClick={() => logout()}>logout</button>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Authors />} />

        <Route path="/books" element={<Books books={books}/>} />

        <Route path="/add" element={<NewBook />} />

        <Route path="/editBorn" element={<EditBorn />} />

        <Route path="/recommend" element={<Recommended books={books}/>} />

        <Route path="/login" element={<LoginForm setToken={setToken} />} />
      </Routes>
    </div>
  );
};

export default App;
