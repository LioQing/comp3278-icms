from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """User model"""

    class Meta(AbstractUser.Meta):
        swappable = "AUTH_USER_MODEL"


class Student(models.Model):
    student_id = models.BigIntegerField()
    name_on_id_card = models.CharField(max_length=100)
    username = models.CharField(max_length=100)
    email_address = models.CharField(max_length=100)
    password = models.CharField(max_length=100)


class Record(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    record_id = models.SmallIntegerField()
    time = models.DateTimeField(auto_now_add=True, blank=True)
    message = models.CharField(max_length=100)
