import { useState } from "react";
import api from "../services/api";

function TaskCard({ task, onTaskDeleted, onTaskUpdated }) {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/tasks/${task._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onTaskUpdated(response.data.task);

      setIsEditing(false);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to update task"
      );
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/tasks/${task._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onTaskDeleted(task._id);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to delete task"
      );
    }
  };

  if (isEditing) {
    return (
      <div>
        <form onSubmit={handleUpdate}>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />

          <br />
          <br />

          <textarea
            name="description"
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
            Save
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>

        </form>

        <hr />
      </div>
    );
  }

  return (
    <div>
      <h3>{task.title}</h3>

      <p>{task.description}</p>

      <p>Status: {task.status}</p>

      <p>Priority: {task.priority}</p>

      <button onClick={() => setIsEditing(true)}>
        Edit
      </button>

      <button onClick={handleDelete}>
        Delete
      </button>

      <hr />
    </div>
  );
}

export default TaskCard;