import React, { useState, useEffect } from "react";
import "./TodoList.css";

const TodoInput = ({ onAdd }) => {
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      onAdd(newTodo);
      setNewTodo("");
    }
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={handleAddTodo}>Add Todo</button>
    </div>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [editedTodoId, setEditedTodoId] = useState(null);
  const [editedTodoText, setEditedTodoText] = useState("");
  const [editedTodoStatus, setEditedTodoStatus] = useState(false);

  useEffect(() => {
    // Fetch todos from the API
    fetch("https://dummyjson.com/todos/random")
      .then((res) => res.json())
      .then((data) => {
        const fetchedTodos = Array.isArray(data) ? data : [data];
        setTodos(fetchedTodos);
      })
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  const addTodo = (todoText) => {
    const newTodo = {
      id: Date.now(),
      todo: todoText,
      completed: false,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const updateTodo = () => {
    if (editedTodoId !== null && editedTodoText.trim()) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editedTodoId
            ? {
                ...todo,
                todo: editedTodoText,
                completed: editedTodoStatus,
              }
            : todo
        )
      );
      setEditedTodoId(null);
      setEditedTodoText("");
      setEditedTodoStatus(false);
    }
  };

  const startEditing = (id, text, status) => {
    setEditedTodoId(id);
    setEditedTodoText(text);
    setEditedTodoStatus(status);
  };

  const cancelEditing = () => {
    setEditedTodoId(null);
    setEditedTodoText("");
    setEditedTodoStatus(false);
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const deleteAllTodos = () => {
    setTodos([]);
  };

  return (
    <div className="todo-container">
      <TodoInput onAdd={addTodo} />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <div className="uniqueList">
              {editedTodoId === todo.id ? (
                <div className="innerList">
                  <input
                    type="text"
                    value={editedTodoText}
                    onChange={(e) => setEditedTodoText(e.target.value)}
                  />
                  <label>
                    Completed
                    <input
                      type="checkbox"
                      checked={editedTodoStatus}
                      onChange={(e) => setEditedTodoStatus(e.target.checked)}
                    />
                  </label>
                  <button onClick={updateTodo}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </div>
              ) : (
                <div className="innerList">
                  <span>{todo.todo}</span>
                  <span style={{ color: todo.completed ? "green" : "red" }}>
                    {todo.completed ? "✔ Completed" : "✘ Not Completed"}
                  </span>
                  <button
                    onClick={() =>
                      startEditing(todo.id, todo.todo, todo.completed)
                    }
                  >
                    Update
                  </button>
                  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button onClick={deleteAllTodos}>Delete All</button>
    </div>
  );
};

export default TodoList;
