import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./TodoList.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [updateTask, setUpdateTask] = useState({
    id: null,
    title: "",
    status: false,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=2"
      );
      const data = await response.json();
      setTasks(data.map((task) => ({ ...task, id: uuidv4(), status: false })));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTask,
            completed: false,
          }),
        }
      );
      const data = await response.json();
      setTasks([...tasks, { ...data, id: uuidv4(), status: false }]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: "DELETE",
      });
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTask = async () => {
    try {
      await fetch(
        `https://jsonplaceholder.typicode.com/todos/${updateTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateTask),
        }
      );
      const updatedTasks = tasks.map((task) =>
        task.id === updateTask.id
          ? { ...task, title: updateTask.title, status: updateTask.status }
          : task
      );
      setTasks(updatedTasks);
      setUpdateTask({ id: null, title: "", status: false });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleSetUpdateTask = (task) => {
    setUpdateTask({ id: task.id, title: task.title, status: task.status });
  };

  return (
    <div className="task-container">
      <div className="input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="task-input"
          placeholder="Add Your Task..."
        />
        <button onClick={handleAddTask} className="add-button">
          Add Task
        </button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            {updateTask.id === task.id ? (
              <>
                <input
                  type="text"
                  value={updateTask.title}
                  onChange={(e) =>
                    setUpdateTask({ ...updateTask, title: e.target.value })
                  }
                  className="update-input"
                />
                <input
                  type="checkbox"
                  checked={updateTask.status}
                  onChange={() =>
                    setUpdateTask({ ...updateTask, status: !updateTask.status })
                  }
                  className="status-checkbox"
                />
                <button onClick={handleUpdateTask} className="update-button">
                  Update
                </button>
              </>
            ) : (
              <>
                <div className="stylesForList">
                  <span className="taskTitle">{task.title}</span>
                  <span
                    className={`status-indicator ${
                      task.status ? "completed" : "incomplete"
                    }`}
                    style={{ color: task.status ? "green" : "red" }}
                  >
                    {task.status ? "✔ Completed" : "✘ Not Completed"}
                  </span>
                  <div className="task-actions">
                    <button
                      onClick={() => handleSetUpdateTask(task)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
