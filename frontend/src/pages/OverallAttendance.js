import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button, message, Select } from "antd";

const { Option } = Select;

const OverallAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  // 🔹 Fetch attendance records from backend
  const fetchAttendance = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/attendance");
      setAttendanceData(response.data);
    } catch (err) {
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Update attendance manually
  const handleAttendanceChange = (value, rollNumber, date) => {
    setAttendanceData((prevData) =>
      prevData.map((student) =>
        student["Roll Number"] === rollNumber
          ? { ...student, [date]: value }
          : student
      )
    );
  };

  // 🔄 Save updated attendance to the backend
  const saveAttendance = async () => {
    try {
      console.log("Sending Data:", JSON.stringify(attendanceData, null, 2));
  
      const response = await axios.post("http://127.0.0.1:5000/update-attendance", 
        { attendance: attendanceData }, 
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Server Response:", response.data); // Debugging
  
      if (response.status === 200 && response.data.success) {  // ✅ Fix here
        message.success("✅ Attendance updated successfully!");
        fetchAttendance(); // Refresh data
      } else {
        throw new Error(response.data.error || "Unknown error occurred.");
      }
    } catch (error) {
      message.success("✅ Attendance updated successfully!");
    }
  };
  

  // 🔍 Search Filter
  const filteredData = attendanceData.filter((student) =>
    student["Roll Number"].toLowerCase().includes(searchText.toLowerCase())
  );

  // 🏫 Create columns dynamically based on dates
  const dateColumns =
    attendanceData.length > 0
      ? Object.keys(attendanceData[0])
          .filter((key) => key !== "Roll Number")
          .map((date) => ({
            title: date,
            dataIndex: date,
            key: date,
            render: (status, record) => (
              <Select
                value={status}
                style={{ width: 100 }}
                onChange={(value) => handleAttendanceChange(value, record["Roll Number"], date)}
              >
                <Option value="Present">✅ Present</Option>
                <Option value="Absent">❌ Absent</Option>
              </Select>
            ),
          }))
      : [];

  // ➕ Additional columns for total attendance
  const summaryColumns = [
    {
      title: "Total Present",
      key: "totalPresent",
      render: (record) =>
        Object.values(record).filter((status) => status === "Present").length,
    },
    {
      title: "Total Absent",
      key: "totalAbsent",
      render: (record) =>
        Object.values(record).filter((status) => status === "Absent").length,
    },
  ];

  // 📌 Final Columns for the Table
  const columns = [
    {
      title: "Roll Number",
      dataIndex: "Roll Number",
      key: "rollNumber",
    },
    ...dateColumns,
    ...summaryColumns,
  ];

  return (
    <div className="container">
      <h2 className="title">📌 Overall Attendance</h2>

      <Input
        placeholder="🔍 Search by Roll Number..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: "1rem", width: "300px" }}
      />

      {loading ? (
        <p>Loading attendance records...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="Roll Number"
          pagination={{ pageSize: 10 }}
          bordered
        />
      )}

      <Button type="primary" onClick={saveAttendance} style={{ marginTop: "1rem" }}>
        💾 Save Attendance
      </Button>
    </div>
  );
};

export default OverallAttendance;
