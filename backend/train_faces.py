import os
import cv2  # Image processing
import numpy as np
import insightface  # Face recognition library
from insightface.app import FaceAnalysis
import pickle  # Saving/loading face embeddings

# ✅ Get the absolute path of the `backend` directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ✅ Define dataset and database paths correctly
DATASET_PATH = os.path.join(BASE_DIR, "dataset")
DATABASE_PATH = os.path.join(BASE_DIR, "face_db.pkl")  # Stores precomputed face embeddings

# ✅ Initialize the face recognition model
app = FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=0, det_size=(640, 640))  # Sets the face resolution

# ✅ Load or initialize the face database
if os.path.exists(DATABASE_PATH):
    with open(DATABASE_PATH, "rb") as f:
        face_db = pickle.load(f)
else:
    face_db = {}

def register_faces():
    """Registers faces from the dataset folder."""
    global face_db

    if not os.path.exists(DATASET_PATH):
        print(f"❌ ERROR: Dataset folder '{DATASET_PATH}' not found!")
        return

    for person_name in os.listdir(DATASET_PATH):
        person_path = os.path.join(DATASET_PATH, person_name)

        if not os.path.isdir(person_path):  # Ignore non-folder files
            continue

        for img_file in os.listdir(person_path):
            img_path = os.path.join(person_path, img_file)
            img = cv2.imread(img_path)

            if img is None:
                print(f"❌ ERROR: Could not read image '{img_path}'")
                continue

            faces = app.get(img)  # Extracts facial features

            if len(faces) == 0:
                print(f"⚠️ No face found in {img_path}. Skipping.")
                continue

            for face in faces:
                if face.embedding is not None:  # Ensure valid embedding exists
                    face_db[person_name] = face.embedding  # Save only the last embedding

    # ✅ Save embeddings to face_db.pkl
    with open(DATABASE_PATH, "wb") as f:
        pickle.dump(face_db, f)
    
    print("✅ All dataset images registered successfully!")

# ✅ Run the training process
register_faces()
