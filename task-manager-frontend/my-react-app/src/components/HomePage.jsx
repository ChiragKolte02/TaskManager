// HomePage.js
import React from "react";

function HomePage() {
  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to TaskMaster</h1>
      <p className="text-lg text-gray-700 mb-4">
        TaskMaster is a powerful task management tool designed to help you stay organized and focused.
        With a sleek and user-friendly interface, you can manage your tasks, set deadlines, and stay on top of your goals.
      </p>

      <h2 className="text-2xl font-semibold text-blue-500 mb-4">Features</h2>
      <ul className="list-disc pl-8 text-gray-700">
        <li>Task Creation: Easily create and organize your tasks.</li>
        <li>Task Editing: Edit tasks at any time to keep them up-to-date.</li>
        <li>Task Deletion: Remove tasks once they're completed or no longer needed.</li>
        <li>Task Notifications: Receive notifications for upcoming tasks and deadlines.</li>
        <li>Seamless Integration: Access your tasks on both desktop and mobile devices.</li>
      </ul>

      <p className="mt-6 text-lg text-gray-700">
        Start using TaskMaster today and take control of your productivity!
      </p>
    </div>
  );
}

export default HomePage;
