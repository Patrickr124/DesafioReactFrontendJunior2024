import React, { useState, useEffect } from "react";
import axios from "axios";
import "./app.css";

interface ITodo {
  id: number;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [editingTodo, setEditingTodo] = useState<ITodo | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

  const fetchTodos = async () => {
    const response = await axios.get(
      "https://my-json-server.typicode.com/EnkiGroup/DesafioReactFrontendJunior2024/todos"
    );
    setTodos(response.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(event.target.value);
  };

  const handleFormSubmit = (
    event: React.FormEvent,
    todo: ITodo | null,
    setter: React.Dispatch<React.SetStateAction<ITodo[]>>
  ) => {
    event.preventDefault();
    if (todo) {
      setter(
        todos.map((t) => (t.id === todo.id ? { ...t, title: editingText } : t))
      );
    } else {
      const todoToAdd = {
        id: todos.length + 1,
        title: inputValue,
        completed: false,
      };
      setter([todoToAdd, ...todos]);
    }
  };

  const handleTodoToggle = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleTodoRemove = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleTodoEdit = (todo: ITodo) => {
    setEditingTodo(todo);
    setEditingText(todo.title);
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const getVisibleTodos = () => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    }
    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }
    return todos;
  };

  return (
    <section>
      <h1>Todos</h1>
      <div className="box">
        <form
          onSubmit={(event) => handleFormSubmit(event, editingTodo, setTodos)}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="What needs to be done?"
          />
        </form>
        {getVisibleTodos().map((todo) => (
          <div key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleTodoToggle(todo.id)}
            />
            <span onDoubleClick={() => handleTodoEdit(todo)}>{todo.title}</span>
            <button onClick={() => handleTodoRemove(todo.id)}>X</button>
          </div>
        ))}
        <div>
          <span className="item">
            {todos.filter((todo) => !todo.completed).length} items left!
          </span>
          <button className="All" onClick={() => setFilter("all")}>
            All
          </button>
          <button className="Active" onClick={() => setFilter("active")}>
            Active
          </button>
          <button className="Completed" onClick={() => setFilter("completed")}>
            Completed
          </button>
          <button className="Clear" onClick={handleClearCompleted}>
            Clear Completed
          </button>
        </div>
      </div>
    </section>
  );
};

export default App;
