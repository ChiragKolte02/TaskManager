import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");

    fetch("http://127.0.0.1:8000/api/tasks/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const toggleCompletion = (task) => {
    const updatedTask = { ...task, completed: !task.completed };

    fetch(`http://127.0.0.1:8000/api/tasks/${task.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((updated) => {
        const newTasks = tasks.map((t) => (t.id === updated.id ? updated : t));
        setTasks(newTasks);
      })
      .catch((err) => console.error("Error updating:", err));
  };

  const deleteTask = (taskId) => {
    fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        setTasks(tasks.filter((t) => t.id !== taskId));
      })
      .catch((err) => console.error("Error deleting:", err));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Admin Dashboard 🛡️</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Time & Date</th>
              <th className="py-2 px-4">Completed</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id} className="text-center border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{task.id}</td>
                  <td className="py-2 px-4">{task.title}</td>
                  <td className="py-2 px-4">{task.description}</td>
                  <td className="py-2 px-4">{task.time_date}</td>
                  <td className="py-2 px-4">{task.completed ? "✅" : "❌"}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded"
                      onClick={() => toggleCompletion(task)}
                    >
                      {task.completed ? "Mark Incomplete" : "Mark Complete"}
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-10 text-gray-500">
                  No tasks found. 🚀 Add some tasks to manage!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
