
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

    /* Edit Mode */
    if (isEditing) {
        return (
            <div className="task-card">

                <form onSubmit={handleUpdate}>

                    <input
                        className="task-input"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />

                    <textarea
                        className="task-textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <select
                        className="task-select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="pending">
                            Pending
                        </option>

                        <option value="in-progress">
                            In Progress
                        </option>

                        <option value="completed">
                            Completed
                        </option>
                    </select>

                    <select
                        className="task-select"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="low">
                            Low
                        </option>

                        <option value="medium">
                            Medium
                        </option>

                        <option value="high">
                            High
                        </option>
                    </select>

                    <button
                        className="save-btn"
                        type="submit"
                    >
                        Save
                    </button>

                    <button
                        className="cancel-btn"
                        type="button"
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </button>

                </form>

            </div>
        );
    }

    /* Normal Mode */
    return (
        <div className="task-card">

            <h3>{task.title}</h3>

            <p className="task-description">
                {task.description}
            </p>

            <div className="task-info">

                <span>
                    Status: <strong>{task.status}</strong>
                </span>

                <span>
                    Priority: <strong>{task.priority}</strong>
                </span>

            </div>

            <div className="task-actions">

                <button
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                >
                    Edit
                </button>

                <button
                    className="delete-btn"
                    onClick={handleDelete}
                >
                    Delete
                </button>

            </div>

        </div>
    );
}

export default TaskCard;

