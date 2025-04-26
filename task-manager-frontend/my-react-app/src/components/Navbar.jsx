import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token); // true if token exists
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    window.location.href = "/"; // redirect to login page
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold">📝 Task Manager</h1>

      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Items */}
      <div className={`md:flex md:items-center ${isOpen ? "block" : "hidden"}`}>
        <ul className="md:flex md:space-x-6 text-sm mt-4 md:mt-0">
          <li><a href="/" className="hover:text-gray-200">Home</a></li>
          <li><a href="/tasks" className="hover:text-gray-200">Tasks</a></li>

          {isLoggedIn ? (
            <li>
              <button onClick={handleSignOut} className="hover:text-gray-200">
                Sign Out
              </button>
            </li>
          ) : (
            <li>
              <a href="/" className="hover:text-gray-200">
                Sign In
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
