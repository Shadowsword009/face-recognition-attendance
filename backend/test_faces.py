import os
import cv2
import pickle
import numpy as np
from insightface.app import FaceAnalysis
from sklearn.metrics.pairwise import cosine_similarity
import matplotlib.pyplot as plt

# Set Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend directory
UPLOAD_DIR = os.path.join(BASE_DIR, "upload")          # Uploaded images
DATABASE_PATH = os.path.join(BASE_DIR, "face_db.pkl")  # Face database
OUTPUT_PATH = os.path.join(UPLOAD_DIR, "recognized_faces.jpg")  # Output image

# Load face recognition model
app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=0, det_size=(640, 640))

# Load face database
if os.path.exists(DATABASE_PATH):
    with open(DATABASE_PATH, "rb") as f:
        face_db = pickle.load(f)
else:
    face_db = {}

def get_latest_uploaded_image():
    """Fetch the latest uploaded image from the 'upload' folder."""
    files = [f for f in os.listdir(UPLOAD_DIR) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
    if not files:
        print("❌ No image files found in upload directory.")
        return None
    return max(files, key=lambda f: os.path.getctime(os.path.join(UPLOAD_DIR, f)))  # Get the latest file

def recognize_faces(image_name):
    """Recognize faces in an uploaded image and save output."""
    image_path = os.path.join(UPLOAD_DIR, image_name)

    if not os.path.exists(image_path):
        print(f"❌ Image '{image_name}' not found in {UPLOAD_DIR}.")
        return

    img = cv2.imread(image_path)
    faces = app.get(img)

    if len(faces) == 0:
        print("❌ No faces detected.")
        return

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

        label = best_match if highest_similarity > 0.5 else "Unknown"
        recognized_faces.append(label)

        # Draw bounding box
        x1, y1, x2, y2 = map(int, face.bbox)
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # Save output image
    cv2.imwrite(OUTPUT_PATH, img)
    print(f"✅ Processed image saved as {OUTPUT_PATH}")

    # Display image
    plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    plt.axis("off")
    plt.show()

    return recognized_faces

if __name__ == "__main__":
    latest_image = get_latest_uploaded_image()
    
    if latest_image:
        print(f"📸 Using latest uploaded image: {latest_image}")
        recognized_faces = recognize_faces(latest_image)

        if recognized_faces:
            print("🎯 Recognized Faces:", recognized_faces)
        else:
            print("❌ No known faces recognized.")
    else:
        print("⚠️ No images found in upload directory.")
