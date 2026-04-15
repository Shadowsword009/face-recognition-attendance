import React, { useState } from "react";
import axios from "axios";

function PostAttendance() {
  const [image, setImage] = useState(null);
  const [recognizedStudents, setRecognizedStudents] = useState([]);

  // Handle file selection
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  // Upload image to backend
  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setRecognizedStudents(response.data.recognized_students || []); // Update state with recognized names
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Post Attendance</h1>

      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
      <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded-md ml-2">
        Upload & Process
      </button>

      {recognizedStudents.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Recognized Students:</h2>
          <ul className="list-disc pl-5">
            {recognizedStudents.map((rollNo, index) => (
              <li key={index} className="text-green-600 font-medium">{rollNo}</li>
            ))}
          </ul>
          <p className="text-gray-600 mt-2">Attendance has been updated successfully!</p>
        </div>
      )}
    </div>
  );
}

export default PostAttendance;
