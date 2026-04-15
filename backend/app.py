import os
import shutil
import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from insightface.app import FaceAnalysis
from sklearn.metrics.pairwise import cosine_similarity
from PIL import Image

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set Paths
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "upload")
DATABASE_PATH = os.path.join(os.path.dirname(__file__), "face_db.pkl")
EXCEL_PATH = os.path.join(os.path.dirname(__file__), "attendance.xlsx")

# Load Face Recognition Model
face_recognizer = FaceAnalysis(name="buffalo_l")
face_recognizer.prepare(ctx_id=0, det_size=(640, 640))

# Load Face Database
if os.path.exists(DATABASE_PATH):
    with open(DATABASE_PATH, "rb") as f:
        face_db = pickle.load(f)
else:
    face_db = {}

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)


def create_attendance_file():
    """Create an empty attendance Excel file if it doesn't exist."""
    if not os.path.exists(EXCEL_PATH):
        df = pd.DataFrame(columns=["Roll Number"])
        df.to_excel(EXCEL_PATH, index=False, engine="openpyxl")


def update_attendance(recognized_faces):
    """Update attendance Excel file with recognized faces."""
    today = pd.Timestamp.today().strftime("%Y-%m-%d")

    create_attendance_file()  # Ensure file exists
    df = pd.read_excel(EXCEL_PATH, engine="openpyxl")

    # Ensure all recognized faces exist in DataFrame
    for roll in recognized_faces:
        if roll not in df["Roll Number"].values:
            df = pd.concat([df, pd.DataFrame({"Roll Number": [roll]})], ignore_index=True)

    # Ensure today's column exists
    if today not in df.columns:
        df[today] = "Absent"  # Default to "Absent"

    # Mark recognized faces as "Present"
    df.loc[df["Roll Number"].isin(recognized_faces), today] = "Present"

    df.to_excel(EXCEL_PATH, index=False, engine="openpyxl")
    print(f"✅ Attendance updated in {EXCEL_PATH}")


@app.route("/")
def home():
    return "Flask Backend is Running!"


@app.route("/upload", methods=["POST"])
def upload_image():
    """Receives an image from the frontend and saves it."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    image_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(image_path, "wb") as f:
        shutil.copyfileobj(file.stream, f)

    return jsonify({"message": "File uploaded successfully", "image_path": image_path}), 200


@app.route("/recognize", methods=["POST"])
def recognize_faces():
    """Recognizes faces in the latest uploaded image and updates attendance."""
    files = [f for f in os.listdir(UPLOAD_DIR) if f.lower().endswith((".jpg", ".jpeg", ".png"))]

    if not files:
        return jsonify({"error": "No images found"}), 400

    latest_image = max(files, key=lambda f: os.path.getctime(os.path.join(UPLOAD_DIR, f)))
    image_path = os.path.join(UPLOAD_DIR, latest_image)

    try:
        img = Image.open(image_path).convert("RGB")
        img = np.array(img)

        faces = face_recognizer.get(img)
        if len(faces) == 0:
            return jsonify({"message": "No faces detected", "recognized_faces": []}), 200

        recognized_faces = []
        for face in faces:
            if face.embedding is None:
                continue

            embedding = face.embedding.reshape(1, -1)
            best_match = None
            highest_similarity = -1

            for name, db_embedding in face_db.items():
                similarity = cosine_similarity(embedding, db_embedding.reshape(1, -1))[0][0]

                if similarity > highest_similarity:
                    highest_similarity = similarity
                    best_match = name

            if highest_similarity > 0.5:
                recognized_faces.append(best_match)

        update_attendance(recognized_faces)
        return jsonify({"message": "Faces recognized and attendance updated", "recognized_faces": recognized_faces}), 200

    except Exception as e:
        return jsonify({"error": f"Image processing failed: {str(e)}"}), 500


@app.route("/attendance", methods=["GET"])
def get_attendance():
    """Displays the attendance sheet as an HTML table."""
    create_attendance_file()
    df = pd.read_excel(EXCEL_PATH, engine="openpyxl")

    # Convert DataFrame to HTML Table
    attendance_html = df.to_html(classes="table table-bordered", index=False)

    return render_template_string(
        """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Attendance</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        </head>
        <body class="container mt-4">
            <h2 class="mb-4">Attendance Sheet</h2>
            {{ table|safe }}
        </body>
        </html>
        """,
        table=attendance_html,
    )


@app.route("/update-attendance", methods=["POST"])
def manual_update_attendance():
    """Manually update attendance for a given date."""
    data = request.json
    print(f"📥 Received Data: {data}")  # Debugging Log

    if not data or "attendance" not in data:
        print("❌ Invalid request data")
        return jsonify({"error": "Invalid request data"}), 400

    updated_attendance = data["attendance"]
    print(f"📋 Parsed Attendance Data: {updated_attendance}")  # Debugging Log

    create_attendance_file()  # Ensure the attendance file exists
    df = pd.read_excel(EXCEL_PATH, engine="openpyxl")

    for entry in updated_attendance:
        roll = entry.get("Roll Number")
        if not roll:
            print("⚠️ Skipping entry due to missing Roll Number:", entry)
            continue

        for date, status in entry.items():
            if date == "Roll Number":
                continue  # Skip Roll Number key

            # Ensure the student is in the DataFrame
            if roll not in df["Roll Number"].values:
                print(f"➕ Adding new roll number: {roll}")
                df = pd.concat([df, pd.DataFrame({"Roll Number": [roll]})], ignore_index=True)

            # Ensure the column for the date exists
            if date not in df.columns:
                print(f"➕ Adding new date column: {date}")
                df[date] = "Absent"  # Default value

            # Update attendance
            df.loc[df["Roll Number"] == roll, date] = status
            print(f"✅ Updated {roll} attendance for {date} to {status}")

    # Save updated attendance
    df.to_excel(EXCEL_PATH, index=False, engine="openpyxl")
    print("🎉 Attendance successfully updated!")
    return jsonify({"message": "Attendance updated successfully"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
