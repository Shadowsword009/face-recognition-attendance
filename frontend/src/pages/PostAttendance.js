import React, { useState } from "react";
import axios from "axios";
import "./PostAttendance.css";

const PostAttendance = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [recognizedFaces, setRecognizedFaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage("❌ Please select an image first!");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", image);

    try {
      const uploadResponse = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("File upload failed");
      }

      const recognizeResponse = await fetch("http://127.0.0.1:5000/recognize", {
        method: "POST",
      });

      const data = await recognizeResponse.json();
      setRecognizedFaces(data.recognized_faces || []);
      setMessage("✅ Attendance recorded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("❌ Error processing the image.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowTable = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/attendance");
      console.log("📥 API Response:", response.data);

      const fixedData = Array.isArray(response.data) ? response.data : [];
      setAttendanceData(fixedData);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setMessage("❌ Failed to load attendance data.");
    }
  };

  return (
    <div className="post-attendance-container">
      <h2 className="title">📌 Post Attendance</h2>

      <div className="content-wrapper">
        <div className="left-section">
          <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />

          {preview && <img src={preview} alt="Preview" className="image-preview" />}

          <button className="upload-button" onClick={handleUpload} disabled={loading}>
            {loading ? "⏳ Processing..." : "📷 Upload & Recognize"}
          </button>

          {message && <p className="message">{message}</p>}

          <h3 className="subtitle">📝 Recognized Faces:</h3>
          <ul className="face-list">
            {recognizedFaces.length > 0 ? (
              recognizedFaces.map((face, index) => (
                <li key={index} className="face-item">{face}</li>
              ))
            ) : (
              <p className="no-faces">No faces recognized.</p>
            )}
          </ul>

          <button className="show-table-button" onClick={handleShowTable}>
            📊 Show Table
          </button>
        </div>

        <div className="right-section">
          {showTable && (
            <div className="attendance-table">
              <h3 className="subtitle">📅 Attendance Records</h3>
              <table>
                <thead>
                  <tr>
                    {attendanceData.length > 0 &&
                      Object.keys(attendanceData[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, idx) => (
                        <td key={idx}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostAttendance;
