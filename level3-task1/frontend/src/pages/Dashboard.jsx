
import { useEffect, useState } from "react";
import api from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get("/tasks", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setTasks(response.data.tasks);

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to fetch tasks"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleTaskCreated = (newTask) => {
        setTasks((previousTasks) => [
            newTask,
            ...previousTasks,
        ]);
    };

    const handleTaskDeleted = (taskId) => {
        setTasks((previousTasks) =>
            previousTasks.filter(
                (task) => task._id !== taskId
            )
        );
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks((previousTasks) =>
            previousTasks.map((task) =>
                task._id === updatedTask._id
                    ? updatedTask
                    : task
            )
        );
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div className="dashboard">

            {/* Header */}
            <div className="dashboard-header">

                <h1>
                    Task Manager Dashboard
                </h1>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

            {/* Create Task */}
            <div className="task-form-container">

                <TaskForm
                    onTaskCreated={handleTaskCreated}
                />

            </div>

            {/* Tasks */}
            <h2 className="tasks-heading">
                My Tasks
            </h2>

            {loading && (
                <p>Loading tasks...</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            {!loading &&
                !error &&
                tasks.length === 0 && (
                    <p>No tasks available.</p>
                )}

            {!loading &&
                !error &&
                tasks.length > 0 && (

                    <div>
                        {tasks.map((task) => (

                            <TaskCard
                                key={task._id}
                                task={task}
                                onTaskDeleted={handleTaskDeleted}
                                onTaskUpdated={handleTaskUpdated}
                            />

                        ))}
                    </div>

                )}

        </div>
    );
}

export default Dashboard;

