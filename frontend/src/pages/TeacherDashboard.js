import React from 'react';
import { useNavigate } from 'react-router-dom';

function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Teacher Dashboard</h1>
      <p>Select an option below:</p>
      
      <div className="space-y-4 mt-4">
        <button 
          className="bg-blue-500 text-white p-2 rounded-md w-full"
          onClick={() => navigate('/post-attendance')}
        >
          Post Attendance
        </button>

        <button 
          className="bg-green-500 text-white p-2 rounded-md w-full"
          onClick={() => navigate('/overall-attendance')}
        >
          Overall Attendance
        </button>

        <button 
          className="bg-yellow-500 text-white p-2 rounded-md w-full"
          onClick={() => navigate('/student-details')}
        >
          Student Details
        </button>
      </div>
    </div>
  );
}

export default TeacherDashboard;
