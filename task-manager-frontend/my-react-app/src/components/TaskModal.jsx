import React, { useState } from "react";
import { urlBase64ToUint8Array } from "../PushManager";

function TaskModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    time_date: "",
    importance: "Low",
    completed: false,  // Optional, default to false
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


  async function setupPush(title, time, isCompleted) {
    const PUBLIC_VAPID_KEY = "BOg8c9KsyymyvRMTGvPklUqFcCsIGtZKmTHYwQU9Q2htSRQwoWb0DfELP_paPxwapo439XgZfwu5oOdvrloOAAc";
    
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/service-worker.js");
        console.log("✅ Service worker registered");
        console.log(title, time);
  
        // Convert VAPID key to Uint8Array
        const convertedKey = urlBase64ToUint8Array(PUBLIC_VAPID_KEY);
  
        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        });
  
        console.log("✅ Push subscribed:", subscription);
  
        // Prepare subscription data to send
        const subscriptionData = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.getKey('p256dh') ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))) : null,
            auth: subscription.getKey('auth') ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')))) : null,
          },
          task_title: title,
          task_time_date: time, // Make sure the date is already in UTC format
        };
  
        console.log(subscriptionData);
  
        // Send to backend to store subscription
        const response = await fetch("http://localhost:8000/api/save-subscription/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`, // Ensure user is authenticated
          },
          body: JSON.stringify(subscriptionData),
        });
  
        if (!response.ok) {
          throw new Error("Failed to save subscription");
        }
  
        console.log("Subscription saved to backend successfully.");
        window.location.reload()
      } catch (error) {
        console.error("❌ Error in push setup:", error);
      }
    }
  }
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const localDate = new Date(form.time_date); // This is in local timezone (IST if your system is IST)
  
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    ).toISOString(); // Convert to ISO string in UTC
  
    const formWithUTC = { ...form, time_date: utcDate };
  
    fetch("http://127.0.0.1:8000/api/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      body: JSON.stringify(formWithUTC),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create task");
        }
        return response.json();
      })
      .then((data) => {
        onSuccess(data);
        onClose();
      })
      .catch((error) => {
        console.error("Error creating task:", error);
      }).finally(
      );

      setupPush(form.title, form.time_date, form.completed)


  };
  

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 w-96 rounded shadow-lg border-2 border-blue-500">
        <h2 className="font-bold mb-4 text-center text-lg text-blue-600 border-b pb-2">
          Task Details
        </h2>

        <input
          className="border w-full mb-2 p-2 rounded"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          className="border w-full mb-2 p-2 rounded"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          className="border w-full mb-2 p-2 rounded"
          name="time_date"
          type="datetime-local"
          value={form.time_date}
          onChange={handleChange}
        />
        <select
          className="border w-full mb-4 p-2 rounded"
          name="importance"
          value={form.importance}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full mb-2"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          className="text-gray-500 hover:text-gray-800 text-sm block text-center w-full"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default TaskModal;
