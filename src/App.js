import Navbar from "./components/Navbar";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, settodo] = useState("");
  const [todos, settodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);

  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) {
      const savedTodos = JSON.parse(todoString);
      settodos(savedTodos);
    }
  }, []);

  const saveToLS = (updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleChange = (e) => {
    settodo(e.target.value);
  };

  const addTodo = () => {
    if (todo.trim() === "") return; // Prevent adding empty todos
    const newTodo = { id: uuidv4(), todo: todo.trim(), isCompleted: false };
    settodos([...todos, newTodo]);
    settodo("");
    saveToLS([...todos, newTodo]);
  };

  const handleEdit = (id) => {
    const todoToEdit = todos.find(item => item.id === id);
    if (todoToEdit) {
      settodo(todoToEdit.todo);
      const newTodos = todos.filter(item => item.id !== id);
      settodos(newTodos);
      saveToLS(newTodos);
    }
  };

  const handleDelete = (id) => {
    const newTodos = todos.filter(item => item.id !== id);
    settodos(newTodos);
    saveToLS(newTodos);
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const updatedTodos = todos.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    settodos(updatedTodos);
    saveToLS(updatedTodos);
  };

  const handleChangeCheck = () => {
    setShowFinished(!showFinished);
  };

  return (
    <>
      <Navbar />
      <div className="xl:container bg-violet-100 xl:mx-auto min-h-[80vh] p-3 xl:w-[35%] my-6 rounded-2xl w-full">
        <h1 className="font-bold text-center text-3xl">
          iTask - Manage your todos at one place
        </h1>
        <div className="addtodo my-4">
          <h2 className="text-2xl font-bold">Add a Todo</h2>
          <div className="input flex my-4">
            <input
              type="text"
              value={todo}
              className="w-[100%] rounded-3xl px-5 py-1"
              onChange={handleChange}
            />
            <button
              className="bg-violet-800 mx-2 rounded-full hover:bg-violet-950 p-4 py-2 text-sm font-bold text-white disabled:bg-violet-500"
              onClick={addTodo}
              disabled={todo.trim().length <= 3}
            >
              Save
            </button>
          </div>
          <div className="check flex gap-3 mt-8 mb-5">
            <input
              type="checkbox"
              id="show"
              className=""
              checked={showFinished}
              onChange={handleChangeCheck}
            />
            <label htmlFor="show">Show finished</label>
          </div>
          <div className="h-[1px] bg-black opacity-25 w-[90%] mx-auto my-2"></div>
        </div>
        <h2 className="text-2xl font-bold">Your todos</h2>
        {todos.length === 0 && <div className="m-2">No Todos to display</div>}
        {todos.map((item) => {
          return (
            (showFinished || !item.isCompleted) && (
              <div key={item.id} className="mytodos flex justify-between my-2 items-center">
                <div className="box flex-grow flex items-center overflow-hidden">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={item.isCompleted}
                    name={item.id}
                    onChange={handleCheckbox}
                  />
                  <div className={`break-words whitespace-normal ${item.isCompleted ? "line-through" : ""} flex-wrap break-all`}>
                    {item.todo}
                  </div>
                </div>
                <div className="options flex gap-3 h-full items-center">
                  <button
                    className="rounded-full bg-violet-800 text-white px-3 py-1 text-sm font-bold"
                    onClick={() => handleEdit(item.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="rounded-full bg-violet-800 text-white px-3 py-1 text-sm font-bold"
                    onClick={() => handleDelete(item.id)}
                  >
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            )
          );
        })}
      </div>
    </>
  );
}

export default App;
