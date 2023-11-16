from django.contrib.auth.models import AbstractUser
from django.db import models


class Student(AbstractUser):
    """User model"""

    student_id = models.BigIntegerField(primary_key=True, unique=True)
    name_on_id_card = models.CharField(max_length=100)

    class Meta(AbstractUser.Meta):
        swappable = "AUTH_USER_MODEL"


class Record(models.Model):
    student_id = models.ForeignKey(Student, on_delete=models.CASCADE)
    record_id = models.SmallIntegerField()
    time = models.DateTimeField(auto_now_add=True, blank=True)
    message = models.CharField(max_length=100)

    class Meta:
        unique_together = (("student", "record_id"),)


class Course(models.Model):
    course_code = models.CharField(max_length=10, primary_key=True)
    course_name = models.CharField(max_length=100)


class TakeCourse(models.Model):
    course_code = models.ForeignKey(Course, on_delete=models.CASCADE)
    student_id = models.ForeignKey(Student, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("course_code", "student_id"),)


class Session(models.Model):
    course_code = models.ForeignKey(Course, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    session_type = models.CharField(max_length=10)
    classroom_address = models.CharField(max_length=100)

    class Meta:
        unique_together = (("course_code", "start_time"),)


class Material(models.Model):
    hyperlink = models.CharField(max_length=100, primary_key=True)
    course_code = models.ForeignKey(Course, on_delete=models.CASCADE)
    material_type = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
