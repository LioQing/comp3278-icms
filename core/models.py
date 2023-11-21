import os
from typing import List, Optional

from django.contrib.auth.models import (
    AbstractBaseUser, UnicodeUsernameValidator
)
from django.db import models
from django.db.models.query import QuerySet
from django.dispatch import receiver

from . import enums, managers


class Student(AbstractBaseUser):
    """Student User Model"""

    username_validator = UnicodeUsernameValidator()

    username = models.CharField(
        max_length=255,
        unique=True,
        validators=[username_validator],
    )
    id = models.PositiveBigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField()

    objects = managers.StudentManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "id", "name"]

    def get_face_label(self) -> Optional["FaceLabel"]:
        """Return the face label of the student."""
        if hasattr(self, "face_label"):
            return self.face_label
        return None


class FaceLabel(models.Model):
    """Face Label Model"""

    label_id = models.PositiveIntegerField(null=True, blank=True, unique=True)

    student = models.OneToOneField(
        Student,
        related_name="face_label",
        on_delete=models.CASCADE,
        primary_key=True,
    )


class Face(models.Model):
    """Face Model"""

    def get_image_path(instance: "Face", filename: str):
        """Return the file path."""
        return f"faces/{instance.label.student.id}/{filename}"

    id = models.AutoField(primary_key=True)
    image = models.ImageField(upload_to=get_image_path)

    label = models.ForeignKey(
        FaceLabel, related_name="faces", on_delete=models.CASCADE
    )

    class Meta:
        unique_together = (("label", "id"),)


class Record(models.Model):
    """Record Model"""

    id = models.AutoField(primary_key=True)
    time = models.DateTimeField(auto_now_add=True, blank=True)
    message = models.CharField(max_length=255)

    student = models.ForeignKey(
        Student, related_name="records", on_delete=models.CASCADE
    )

    class Meta:
        unique_together = (("student", "id"),)


class BaseMaterial(models.Model):
    """Base Material Model"""

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    last_edit = models.DateTimeField(auto_now=True, blank=True)

    class Meta:
        abstract = True
        ordering = ("order", "-created_at")


class BaseHyperlinkMaterial(BaseMaterial):
    """Base Hyperlink Material Model"""

    url = models.URLField(max_length=2048)

    class Meta:
        abstract = True


class BaseFileMaterial(BaseMaterial):
    """Base File Material Model"""

    def material_file_path(instance: "BaseFileMaterial", filename: str):
        """Return the default file path."""
        return f"{instance.id}/{filename}"

    def get_file_path(instance: "BaseFileMaterial", filename: str):
        """Return the file path."""
        return instance.material_file_path(filename)

    file = models.FileField(upload_to=get_file_path)

    class Meta:
        abstract = True


class Course(models.Model):
    """Course Model"""

    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=10)
    year = models.PositiveIntegerField()
    name = models.CharField(max_length=255)
    description = models.TextField()

    students = models.ManyToManyField(
        Student, related_name="courses", blank=True
    )

    class Meta:
        unique_together = (("code", "year"),)

    def get_materials(self) -> List[BaseMaterial]:
        """Return the session materials."""
        hyperlinks: QuerySet["CourseHyperlink"] = self.hyperlinks.all()
        files: QuerySet["CourseFile"] = self.files.all()

        # Order the materials by their order field
        # and then by their created_at field (newest first)
        materials = sorted(
            list(hyperlinks) + list(files),
            key=lambda material: (
                material.order,
                -material.created_at.timestamp(),
            ),
        )

        return materials

    def clean(self):
        """Clean up duplicated material order."""
        materials = self.get_materials()

        # Shift the order of the materials if there are duplicates
        for i in range(len(materials) - 1):
            if materials[i].order == materials[i + 1].order:
                materials[i + 1].order += 1
                materials[i + 1].save(cleaning=True)


class CourseHyperlink(BaseHyperlinkMaterial):
    """Course Hyperlink Model"""

    course = models.ForeignKey(
        Course, related_name="hyperlinks", on_delete=models.CASCADE
    )

    class Meta:
        unique_together = (("course", "id"),)

    def clean(self):
        """Clean up duplicated material order."""
        self.course.clean()

    def save(self, cleaning: bool = False, *args, **kwargs):
        """Save the model."""
        if not cleaning:
            self.full_clean()
        return super().save(*args, **kwargs)


class CourseFile(BaseFileMaterial):
    """Course File Model"""

    course = models.ForeignKey(
        Course, related_name="files", on_delete=models.CASCADE
    )

    class Meta:
        unique_together = (("course", "id"),)

    def material_file_path(instance: "CourseFile", filename: str):
        """Return the file path."""
        return f"course_files/{instance.course.id}/{filename}"

    def clean(self):
        """Clean up duplicated material order."""
        self.course.clean()

    def save(self, cleaning: bool = False, *args, **kwargs):
        """Save the model."""
        if not cleaning:
            self.full_clean()
        return super().save(*args, **kwargs)


class Session(models.Model):
    """Session Model"""

    id = models.AutoField(primary_key=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    type = models.CharField(max_length=3, choices=enums.SessionType.choices())
    classroom = models.CharField(max_length=255)

    course = models.ForeignKey(
        Course, related_name="sessions", on_delete=models.CASCADE
    )

    class Meta:
        unique_together = (("course", "id"), ("course", "start_time"))

    def get_type(self) -> str:
        """Return the session type as a human readable string."""
        return enums.SessionType(self.type).value

    def get_materials(self) -> List[BaseMaterial]:
        """Return the session materials."""
        hyperlinks: QuerySet["CourseHyperlink"] = self.hyperlinks.all()
        files: QuerySet["CourseFile"] = self.files.all()

        # Order the materials by their order field
        # and then by their created_at field (newest first)
        materials = sorted(
            list(hyperlinks) + list(files),
            key=lambda material: (
                material.order,
                -material.created_at.timestamp(),
            ),
        )

        return materials

    def clean(self):
        """Clean up duplicated material order."""
        materials = self.get_materials()

        # Shift the order of the materials if there are duplicates
        for i in range(len(materials) - 1):
            if materials[i].order == materials[i + 1].order:
                materials[i + 1].order += 1
                materials[i + 1].save(cleaning=True)


class SessionHyperlink(BaseHyperlinkMaterial):
    """Session Hyperlink Model"""

    session = models.ForeignKey(
        Session, related_name="hyperlinks", on_delete=models.CASCADE
    )

    class Meta:
        unique_together = (("session", "id"),)

    def clean(self):
        """Clean up duplicated material order."""
        self.session.clean()

    def save(self, cleaning: bool = False, *args, **kwargs):
        """Save the model."""
        if not cleaning:
            self.full_clean()
        return super().save(*args, **kwargs)


class SessionFile(BaseFileMaterial):
    """Session File Model"""

    session = models.ForeignKey(
        Session, related_name="files", on_delete=models.CASCADE
    )

    class Meta:
        unique_together = (("session", "id"),)

    def material_file_path(instance: "SessionFile", filename: str):
        """Return the file path."""
        return (
            f"session_files/{instance.session.course.id}/"
            f"{instance.session.id}/{filename}"
        )

    def clean(self):
        """Clean up duplicated material order."""
        self.session.clean()

    def save(self, cleaning: bool = False, *args, **kwargs):
        """Save the model."""
        if not cleaning:
            self.full_clean()
        return super().save(*args, **kwargs)


@receiver(models.signals.post_delete, sender=BaseFileMaterial)
def auto_delete_file_material_on_delete(
    sender, instance: BaseFileMaterial, **kwargs
):
    """Deletes file from filesystem when corresponding object is deleted."""
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)


@receiver(models.signals.pre_save, sender=BaseFileMaterial)
def auto_delete_file_material_on_change(
    sender, instance: BaseFileMaterial, **kwargs
):
    """Delete old file from filesystem when it is updated."""
    if not instance.id:
        return False

    try:
        old_file = BaseFileMaterial.objects.get(pk=instance.id).file
    except BaseFileMaterial.DoesNotExist:
        return False

    new_file = instance.file
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)


@receiver(models.signals.post_delete, sender=Face)
def auto_delete_face_on_delete(sender, instance: Face, **kwargs):
    """Deletes file from filesystem when corresponding object is deleted."""
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)


@receiver(models.signals.pre_save, sender=Face)
def auto_delete_face_on_change(sender, instance: Face, **kwargs):
    """Delete old file from filesystem when it is updated."""
    if not instance.id:
        return False

    try:
        old_file = Face.objects.get(pk=instance.id).image
    except Face.DoesNotExist:
        return False

    new_file = instance.image
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)
