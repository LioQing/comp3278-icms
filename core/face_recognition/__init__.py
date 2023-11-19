import pathlib

import cv2
import numpy as np
from django.db.models.fields.files import ImageFieldFile
from django.db.models.query import QuerySet
from PIL import Image

RECOGNITION_THRESHOLD = 27
TRAINING_FACE_THRESHOLD = 0.5
FILE_DIR = pathlib.Path(__file__).parent.resolve()


def train_model(student_id: int) -> bool:
    """Train the model and save it

    Returns indicate whether the training was successful
    """
    from core.models import Face, FaceLabel

    haarcascade_filename = "haarcascade_frontalface_default.xml"
    face_cascade = cv2.CascadeClassifier(str(FILE_DIR / haarcascade_filename))
    recognizer: cv2.face.LBPHFaceRecognizer = (
        cv2.face.LBPHFaceRecognizer_create()
    )

    current_id = 0
    y_label = []
    x_train = []

    FaceLabel.objects.all().update(label_id=None)

    for face_label in FaceLabel.objects.all():
        face_label.label_id = current_id
        face_label.save()
        current_id += 1

        faces: QuerySet[Face] = face_label.faces.all()
        failed = 0
        for face in faces:
            image: ImageFieldFile = face.image.open()
            pil_image = Image.open(image).convert("L")
            image_array = np.array(pil_image, "uint8")

            # Using multiscle detection
            detected_faces = face_cascade.detectMultiScale(
                image_array, scaleFactor=1.5, minNeighbors=5
            )

            if len(detected_faces) == 0:
                failed += 1
                if (
                    student_id == face_label.student_id
                    and failed > TRAINING_FACE_THRESHOLD * len(faces)
                ):
                    return False

            for x, y, w, h in detected_faces:
                roi = image_array[y : y + h, x : x + w]
                x_train.append(roi)
                y_label.append(face_label.label_id)

    recognizer.train(x_train, np.array(y_label))
    recognizer.save(str(FILE_DIR / "train.yml"))
    return True


def is_correct_face(student_id: int, image_file: ImageFieldFile) -> bool:
    """Return True if the student with the given student_id is in the photo"""
    from core.models import FaceLabel

    image = np.array(Image.open(image_file))
    recognizer: cv2.face.LBPHFaceRecognizer = (
        cv2.face.LBPHFaceRecognizer_create()
    )
    recognizer.read(str(FILE_DIR / "train.yml"))

    face_cascade = cv2.CascadeClassifier(
        str(FILE_DIR / "haarcascade_frontalface_default.xml")
    )

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.5, minNeighbors=5
    )

    for x, y, w, h in faces:
        roit_gray = gray[y : y + h, x : x + w]

        # predict the id and confidence for faces
        id_, conf = recognizer.predict(roit_gray)

        try:
            FaceLabel.objects.get(label_id=id_, student_id=student_id)

            if conf > RECOGNITION_THRESHOLD:
                return True
        except FaceLabel.DoesNotExist:
            pass

    return False
