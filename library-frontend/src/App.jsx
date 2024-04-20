import { Route, Routes, useNavigate } from "react-router-dom";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import EditBorn from "./components/EditBorn";

const App = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <button onClick={() => navigate("/")}>authors</button>
        <button onClick={() => navigate("/books")}>books</button>
        <button onClick={() => navigate("/add")}>add book</button>
        <button onClick={() => navigate("/editBorn")}>edit born</button>
      </div>

      <Routes>
        <Route path="/" element={<Authors />} />

        <Route path="/books" element={<Books />} />

        <Route path="/add" element={<NewBook />} />

        <Route path="/editBorn" element={<EditBorn />} />
      </Routes>
    </div>
  );
};

export default App;
