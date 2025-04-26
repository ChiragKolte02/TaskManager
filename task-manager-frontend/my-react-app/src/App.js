// App.js
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import Footer from "./components/Footer";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import './index.css';
import askForNotificationPermission from "./askForNotificationPermission";

function App() {

  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("access"));
  const [showSignUp, setShowSignUp] = useState(false);

  const addTaskToList = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  useEffect(() => {
    // askForNotificationPermission()
  }, [])


  return (
    <>
    {loggedIn ? (<div>
      <Navbar />
      <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
        <div className="flex gap-6 flex-wrap justify-start max-w-6xl">
          <TaskCard />
          <button
            className="text-4xl text-blue-600 border-2 border-blue-500 rounded-full p-2 hover:bg-blue-100 transition"
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>
      </div>
      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onSuccess={addTaskToList}
        />
      )}
      </div>)
    : (<div>
      <Navbar />
    {showSignUp ? (
    <SignUp onSignUp={() => setShowSignUp(false)} />
  ) : (
    <div>
      <SignIn onLogin={() => setLoggedIn(true)} />
      <p className="text-center mt-4">
        Don't have an account?{" "}
        <button
          className="text-blue-500 underline"
          onClick={() => setShowSignUp(true)}
        >
          Sign Up
        </button>
      </p>
    </div>
  )}</div>)}
      <Footer />
    </>
  );

}

export default App;
