import React, { useState } from "react";
import TaskCard from "./TaskCard";  // Import TaskCard component
import TaskModal from "./TaskModal"; // Import TaskModal component

const UserDashboard = () => {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle success when a task is created
  const handleSuccess = (newTask) => {
    console.log("New task created:", newTask);
    setIsModalOpen(false); // Close the modal after successful task creation
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      {/* Button to open the TaskModal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md mb-4 transition"
      >
        + Add Task
      </button>

      <div className="flex gap-6 flex-wrap justify-start max-w-6xl">
        {/* Render TaskCard Component */}
        <TaskCard />
      </div>

      {/* Conditionally render the TaskModal */}
      {isModalOpen && (
        <TaskModal
          onClose={handleCloseModal} // Close modal when cancelled or task is created
          onSuccess={handleSuccess}  // Pass the success callback
        />
      )}
    </div>
  );
};

export default UserDashboard;
