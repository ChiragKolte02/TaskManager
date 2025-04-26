import React, { useState } from "react";

function SignIn({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("username", form.username)

    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      window.location.reload();
      onLogin();
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-center">Sign In</h2>
        <input
          className="border p-2 w-full mb-3 rounded"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          className="border p-2 w-full mb-3 rounded"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignIn;
