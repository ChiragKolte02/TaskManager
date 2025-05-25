import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar({ loggedIn }) {  // Access loggedIn prop
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token); // true if token exists
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("oldTask");
    setIsLoggedIn(false);
    window.location.href = "/"; // redirect to home page
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="text-2xl font-bold tracking-wide">📝 Task Master</div>
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <ul
        className={`${
          isOpen ? "flex" : "hidden"
        } absolute top-16 right-6 flex-col bg-blue-600 rounded-lg shadow-md md:static md:flex md:flex-row md:space-x-8 md:items-center text-base`}
      >
        <li>
          <Link
            to="/"
            className="block px-4 py-2 hover:bg-blue-700 rounded-md transition duration-200"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="block px-4 py-2 hover:bg-blue-700 rounded-md transition duration-200"
          >
            About Us
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link
                to="/user-dashboard"
                className="block px-4 py-2 hover:bg-blue-700 rounded-md transition duration-200"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 hover:bg-blue-700 rounded-md transition duration-200"
              >
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              to="/signin"
              className="block px-4 py-2 hover:bg-blue-700 rounded-md transition duration-200"
            >
              Sign In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
