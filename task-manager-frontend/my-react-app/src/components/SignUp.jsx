import React, { useState } from "react";

function SignUp({ onSignUp }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Validate email on change
    if (e.target.name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(e.target.value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if email is valid before submitting
    if (emailError || !form.email) {
      setMessage("Please enter a valid email address.");
      return;
    }

    const res = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Registration successful. Please sign in.");
      onSignUp(); // Redirect to login
    } else {
      setMessage(data.error || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
        {message && <p className="mb-2 text-center text-red-500">{message}</p>}

        <input
          className="border p-2 w-full mb-3 rounded"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

        <input
          className="border p-2 w-full mb-1 rounded"
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />
        {emailError && <p className="text-sm text-red-500 mb-2">{emailError}</p>}

        <input
          className="border p-2 w-full mb-3 rounded"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit" className="bg-green-600 text-white p-2 rounded w-full">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
