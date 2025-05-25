// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AboutUs from "./components/AboutUs"; 
import HomePage from "./components/HomePage";  
import UserDashboard from "./components/UserDashboard";  
import './index.css';

function App() {

  // const [tasks, setTasks] = useState([]);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("access"));
  const [showSignUp, setShowSignUp] = useState(false);

  // const addTaskToList = (newTask) => {
  //   setTasks([...tasks, newTask]);
  // };
  let alarm;

  

  useEffect(() => {
    // Define message handler
    const handleMessage = (event) => {
      console.log("✅ Message from Service Worker:", event.data);
      const words =  event.data.trim().split(" ");  // split by space
      const lastWord = words.pop();   
      console.log(`last word is ${lastWord}`)
      try {
        if(lastWord === "High"){
        const alarm = new Audio('/alarm-clock-90867.mp3'); 
        alarm.play().then(() => {
          console.log("🔊 Alarm is playing...");
        }).catch(err => {
          console.error("❌ Failed to play alarm:", err);
        });
      }
      if(lastWord === "Medium"){
        const alarm = new Audio('/alarm-clock-beep-105903.mp3'); 
        alarm.play().then(() => {
          console.log("🔊 Alarm is playing...");
        }).catch(err => {
          console.error("❌ Failed to play alarm:", err);
        });
      }

        // alert(event.data);
      } catch (err) {
        console.error("❌ Error creating Audio object:", err);
      }
    };

    // Attach the event listener
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        navigator.serviceWorker.addEventListener('message', handleMessage);
      });
    }

    // Cleanup
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(() => {
          navigator.serviceWorker.removeEventListener('message', handleMessage);
        });
      }
    };
  }, []);

  return (
    <Router>
      <div>
        <Navbar loggedIn={loggedIn} /> {/* Pass loggedIn state to Navbar */}
        <Routes>
          <Route path="/about" element={<AboutUs />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn onLogin={() => setLoggedIn(true)} />} />
          <Route path="/signup" element={<SignUp onSignUp={() => setShowSignUp(false)} />} />
          
          {/* User Dashboard Route */}
          <Route
            path="/user-dashboard"
            element={
              loggedIn ? (
                <UserDashboard />
              ) : (
                <SignIn onLogin={() => setLoggedIn(true)} />
              )
            }
          />

          {/* Other routes */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
