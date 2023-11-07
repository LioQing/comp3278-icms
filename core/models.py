from django.contrib.auth.models import AbstractUser

from django.db import models



class User(AbstractUser):
    """User model"""

    class Meta(AbstractUser.Meta):
        swappable = "AUTH_USER_MODEL"

class Student(models.Model):

    studnet_id = models.BigIntegerField()
    name_on_id_card = models.CharField(max_length=100)
    username = models.CharField(max_length=100)
    email_address = models.CharField(max_length=100)
    password = models.CharField(max_length=100)




    