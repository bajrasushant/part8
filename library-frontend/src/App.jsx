import { Route, Routes, useNavigate } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import EditBorn from "./components/EditBorn";
import LoginForm from "./components/LoginForm";
import { useState } from "react";
import { useApolloClient } from "@apollo/client";

const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const client = useApolloClient();

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
        <button onClick={() => navigate("/add")}>add book</button>
        <button onClick={() => navigate("/editBorn")}>edit born</button>
        {token === null ? (
          <button onClick={() => navigate("/login")}>login</button>
        ) : (
          <button onClick={() => logout}>logout</button>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Authors />} />

        <Route path="/books" element={<Books />} />

        <Route path="/add" element={<NewBook />} />

        <Route path="/editBorn" element={<EditBorn />} />

        <Route path="/login" element={<LoginForm setToken={setToken} />} />
      </Routes>
    </div>
  );
};

export default App;
