import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, ALL_BOOKS, EDIT_BORN } from "../queries";
import Select from "react-select";

const EditBorn = () => {
  const [name, setName] = useState(null);
  const [newBorn, setNewBorn] = useState("");

  const [editBorn] = useMutation(EDIT_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
  });

  const submit = (event) => {
    event.preventDefault();
    editBorn({ variables: { name: name.value, setBornTo: parseInt(newBorn) } });

    setName("");
    setNewBorn("");
  };

  const res = useQuery(ALL_AUTHORS);
  if (res.loading) return <div> fetching data</div>;

  const authors = res.data.allAuthors;

  const options = authors.map((a) => ({ value: a.name, label: a.name }));

  return (
    <div>
      <h3>set birthyear</h3>
      <form onSubmit={submit}>
        <Select defaultValue={name} onChange={setName} options={options} />
        <div>
          born
          <input
            value={newBorn}
            onChange={({ target }) => setNewBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default EditBorn;
