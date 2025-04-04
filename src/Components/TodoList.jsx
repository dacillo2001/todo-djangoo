import { useState, useEffect } from "react";
import "./../../src/index.css"; 

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingTask, setEditingTask] = useState("");
    const [completedTasks, setCompletedTasks] = useState([]);
    const [filter, setFilter] = useState("All");
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const removeTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
        setCompletedTasks(completedTasks.filter((_, i) => i !== index));
    };

    const addTask = () => {
        if (task.trim() === "") return;
        setTasks([...tasks, task]);
        setCompletedTasks([...completedTasks, false]);
        setTask("");
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditingTask(tasks[index]);
    };

    const saveTask = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index] = editingTask;
        setTasks(updatedTasks);
        setEditingIndex(null);
        setEditingTask("");
    };

    const cancelEditing = () => {
        setEditingIndex(null);
        setEditingTask("");
    };

    const toggleCompletion = (index) => {
        const updatedCompletedTasks = [...completedTasks];
        updatedCompletedTasks[index] = !updatedCompletedTasks[index];
        setCompletedTasks(updatedCompletedTasks);
    };

    const filteredTasks = tasks.filter((_, index) => {
        if (filter === "Completed") return completedTasks[index];
        if (filter === "Pending") return !completedTasks[index];
        return true;
    });

    return (
        <div className="container">
            <h2>To-Do List</h2>
            <button onClick={toggleTheme}>
                {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            </button>
            <input
                type="text"
                placeholder="Add a new task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
            <button onClick={addTask}>Add Task</button>
            <div className="filter-buttons">
                <button onClick={() => setFilter("All")} className={filter === "All" ? "active" : ""}>All</button>
                <button onClick={() => setFilter("Completed")} className={filter === "Completed" ? "active" : ""}>Completed</button>
                <button onClick={() => setFilter("Pending")} className={filter === "Pending" ? "active" : ""}>Pending</button>
            </div>
            <ul>
                {filteredTasks.map((t, index) => (
                    <li key={index} className={completedTasks[index] ? "completed" : ""}>
                        <input
                            type="checkbox"
                            checked={completedTasks[index]}
                            onChange={() => toggleCompletion(index)}
                        />
                        {editingIndex === index ? (
                            <>
                                <input
                                    type="text"
                                    value={editingTask}
                                    onChange={(e) => setEditingTask(e.target.value)}
                                />
                                <button onClick={() => saveTask(index)}>Save</button>
                                <button onClick={cancelEditing}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span>{t}</span>
                                <button onClick={() => startEditing(index)}>Edit</button>
                                <button onClick={() => removeTask(index)}>Remove</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}