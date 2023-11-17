import os
import numpy as np
from PIL import Image
import cv2
import pickle

def train_model():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    image_dir = os.path.join(BASE_DIR, "data")
    face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    current_id = 0
    label_ids = {}
    y_label = []
    x_train = []
    for root, dirs, files in os.walk(image_dir):
        for file in files:
            if file.endswith("png") or file.endswith("jpg"):
                path = os.path.join(root, file)
                label = os.path.basename(root).replace("", "").upper()  # name
                if label in label_ids:
                    pass
                else:
                    label_ids[label] = current_id
                    current_id += 1
                id_ = label_ids[label]
                print(label_ids)

                pil_image = Image.open(path).convert("L")
                image_array = np.array(pil_image, "uint8")
                print(image_array)
                # Using multiscle detection
                faces = face_cascade.detectMultiScale(image_array, scaleFactor=1.5, minNeighbors=5)

                for (x, y, w, h) in faces:
                    roi = image_array[y:y+h, x:x+w]
                    x_train.append(roi)
                    y_label.append(id_)

    with open("labels.pickle", "wb") as f:
        pickle.dump(label_ids, f)
    recognizer.train(x_train, np.array(y_label))
    recognizer.save("train.yml")


def isCorrectFace(student_id, image): #needa convert image into ndarray first (image here is a ndarray)
    recognizer = cv2.face.LBPHFaceRecognizer_create() 
    recognizer.read("train.yml")

    labels = {"student_id": 1}
    with open("labels.pickle", "rb") as f:
        labels = pickle.load(f)
        labels = {v: k for k, v in labels.items()} #username and id mapping
    
    face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

    faces = face_cascade.detectMultiScale(image, scaleFactor=1.5, minNeighbors=5)

    isInThePhoto = False

    for (x, y, w, h) in faces:
        print(x, w, y, h)
        roi_color = image[y:y + h, x:x + w]
        # predict the id and confidence for faces
        id_, conf = recognizer.predict(roi_color)
        if str(student_id) == labels[id_] and conf>27:
            isInThePhoto = True
            break
        else:
            continue

    return isInThePhoto

        


    

