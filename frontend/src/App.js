import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentSignUp from './pages/StudentSignUp';
import StudentLogin from './pages/StudentLogin';
import TeacherLogin from './pages/TeacherLogin';
import Home from './pages/Home';
import TeacherDashboard from './pages/TeacherDashboard';
import PostAttendance from './pages/PostAttendance';
import OverallAttendance from './pages/OverallAttendance';
import StudentDetails from './pages/StudentDetails';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<StudentSignUp />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/post-attendance" element={<PostAttendance />} />
        <Route path="/overall-attendance" element={<OverallAttendance />} />
        <Route path="/student-details" element={<StudentDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
