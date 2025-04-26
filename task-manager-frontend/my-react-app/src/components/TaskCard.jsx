import React, { useEffect, useState } from "react";

function TaskCard() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [show, setShow] = useState(false);

  // const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const token = localStorage.getItem("access");

    fetch("http://127.0.0.1:8000/api/tasks/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  function handleSaveUpdate() {
    fetch(`http://127.0.0.1:8000/api/tasks/${editingTask.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      body: JSON.stringify(editingTask),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Update failed");
        }
        return response.json();
      })
      .then((updatedTask) => {
        // After updating the task, update the subscription
        const username = localStorage.getItem("username"); // Assuming you stored username in localStorage
        const oldTitle = encodeURIComponent(localStorage.getItem("oldTask"));
        const newTitle = encodeURIComponent(updatedTask.title);
        const newTimeDate = encodeURIComponent(updatedTask.time_date);
  
        fetch(`http://127.0.0.1:8000/update-subscription/${username}/${oldTitle}/${newTitle}/${newTimeDate}/`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Subscription update failed");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Subscription updated:", data);
          })
          .catch((error) => {
            console.error("Error updating subscription:", error);
          });
  
        const updatedTasks = tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
        setTasks(updatedTasks);
        setShow(false);
        setEditingTask(null);
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
      
      
  }

  function handleUpdate(id) {
    const taskToEdit = tasks.find((task) => task.id === id);
    localStorage.setItem("oldTask", taskToEdit.title);
    setEditingTask(taskToEdit);
    setShow(true);
  }

  function toggleCompletion(task) {
    const updatedTask = { ...task, completed: !task.completed };

    fetch(`http://127.0.0.1:8000/api/tasks/${task.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to toggle completion");
        return res.json();
      })
      .then((data) => {
        const newTasks = tasks.map((t) => (t.id === task.id ? data : t));
        setTasks(newTasks);
      })
      .catch((err) => console.error("Error updating task status:", err));
  }

  function handleDelete(id, title) {
    fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Delete failed");
        }
        const username = localStorage.getItem("username")
        // Remove the task from state
        if (username && title) {
          console.log(username, title)
          fetch(`http://127.0.0.1:8000/delete-subscription/${username}/${encodeURIComponent(title)}/`, {
            method: "GET",
          })
            .then((res) => {
              if (!res.ok) throw new Error("Failed to delete subscription");
              return res.json();
            })
            .then((data) => {
              console.log("Subscription delete response:", data);
            })
            .catch((error) => {
              console.error("Error deleting subscription:", error);
            });
        }
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
      {tasks.map((task) => (
        // !task.completed &&
        <div
          className={`shadow-md border rounded-lg mr-8 p-4 w-60 mb-4 ${
            task.completed
              ? "bg-gray-100 border-gray-300"
              : "bg-white border-gray-200"
          }`}
          key={task.id}
        >
          <h3
            className={`font-bold border-b pb-1 mb-2 ${
              task.completed ? "text-gray-500 line-through" : "text-blue-600"
            }`}
          >
            {task.title}
          </h3>
          <p
            className={`text-gray-700 mb-1 ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            <strong>Description:</strong> {task.description}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Time:</strong> {task.time_date}
          </p>
          <p className="text-gray-700 mb-3">
            <strong>Completed:</strong> {task.completed ? "Yes ✅" : "No ❌"}
          </p>

          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-white w-full p-2 rounded mb-2"
            onClick={() => handleUpdate(task.id)}
          >
            Update
          </button>
          <button
            className={`${
              task.completed
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white w-full p-2 rounded mb-2`}
            onClick={() => toggleCompletion(task)}
          >
            {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white w-full p-2 rounded"
            onClick={() => handleDelete(task.id, task.title, task.user)}
          >
            Delete
          </button>
        </div>
      ))}

      {show && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <input
              className="border p-2 w-full mb-2"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
            />
            <textarea
              className="border p-2 w-full mb-2"
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  description: e.target.value,
                })
              }
            />
            <input
              className="border p-2 w-full mb-4"
              type="datetime-local"
              value={editingTask.time_date}
              onChange={(e) =>
                setEditingTask({ ...editingTask, time_date: e.target.value })
              }
            />
            <button
              className="bg-green-500 text-white w-full p-2 rounded mb-2"
              onClick={handleSaveUpdate}
            >
              Save Changes
            </button>
            <button
              className="bg-gray-500 text-white w-full p-2 rounded"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
