# 🎯 Face Recognition Attendance System

A full-stack web application that automatically marks attendance using **face recognition**.

---

## 🚀 Features

* 📸 Upload image and detect faces
* 🧠 Face recognition using **InsightFace**
* 📊 Automatic attendance marking in Excel
* 🌐 React frontend + Flask backend
* 📅 Date-wise attendance tracking

---

## 🏗️ Project Structure

```
face-recognition-attendance/
│
├── backend/        # Flask API + Face Recognition
├── frontend/       # React UI
├── requirements.txt
└── README.md
```

---

## ⚙️ Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🧠 Tech Stack

* **Backend:** Flask, InsightFace, OpenCV
* **Frontend:** React.js
* **ML:** InsightFace (Face embeddings)
* **Database:** Pickle (face_db.pkl)
* **Storage:** Excel (attendance.xlsx)

---

## 📷 How It Works

1. Upload image from frontend
2. Backend detects faces using InsightFace
3. Compares embeddings with stored database
4. Marks attendance in Excel file

---

## ⚠️ Notes

* First run downloads InsightFace models automatically
* Use Python 3.10 for best compatibility
* `.venv` and `node_modules` are excluded from repo

---

## 👨‍💻 Author

**Siva Charan**

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!
