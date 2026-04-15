import React, { useState } from "react";
import PostAttendance from "./PostAttendance";

const TeacherLogin = () => {
  const [email, setEmail] = useState("teacher@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNewTeacherForm, setShowNewTeacherForm] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "teacher@example.com" && password === "password123") {
      setIsAuthenticated(true);
    } else {
      setError("Invalid email or password");
    }
  };

  const handleNewTeacher = () => {
    setShowNewTeacherForm(true);
  };

  const handleNewTeacherSubmit = (e) => {
    e.preventDefault();
    alert(`New teacher added: ${newTeacher.name}`);
    setShowNewTeacherForm(false);
  };

  if (showNewTeacherForm) {
    return (
      <div className="bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
          <form onSubmit={handleNewTeacherSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={newTeacher.password}
                onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-500 text-white p-2 rounded-md w-full hover:bg-green-600"
            >
              Add Teacher
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4">Teacher Login</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          <button
            onClick={handleNewTeacher}
            className="mt-2 bg-green-500 text-white p-2 rounded-md w-full hover:bg-green-600"
          >
            New Teacher
          </button>
        </div>
      </div>
    );
  }

  return <PostAttendance />;
};

export default TeacherLogin;
