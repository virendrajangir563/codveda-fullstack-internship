import { useState } from "react";
import api from "../services/api";

function TaskForm({ onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/tasks",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onTaskCreated(response.data.task);

      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
      });

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to create task"
      );
    }
  };

  return (
    <div>
      <h2>Create New Task</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
        />

        <br />
        <br />

        <textarea
          name="description"
          placeholder="Task description"
          value={formData.description}
          onChange={handleChange}
        />

        <br />
        <br />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <br />
        <br />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <br />
        <br />

        <button type="submit">
          Create Task
        </button>

      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default TaskForm;