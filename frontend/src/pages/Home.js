import React, { useState } from "react";
import PostAttendance from "./PostAttendance";
import "./Home.css";

const Home = () => {
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
``
  const handleNewTeacherSubmit = (e) => {
    e.preventDefault();
    alert(`New teacher added: ${newTeacher.name}`);
    setShowNewTeacherForm(false);
  };

  if (showNewTeacherForm) {
    return (
      <div className="home-container">
        <div className="login-box">
          <h2 className="home-title">Add New Teacher</h2>
          <form onSubmit={handleNewTeacherSubmit} className="login-form">
            <input
              type="text"
              placeholder="Name"
              value={newTeacher.name}
              onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newTeacher.email}
              onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newTeacher.password}
              onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
              required
            />
            <button type="submit">Add Teacher</button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="home-container">
        <div className="login-box">
          <h2 className="home-title">Teacher Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <button onClick={handleNewTeacher} className="new-teacher-button">
            New Teacher
          </button>
        </div>
      </div>
    );
  }

  return <PostAttendance />;
};

export default Home;
