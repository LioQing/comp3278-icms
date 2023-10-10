from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """User model"""

    class Meta(AbstractUser.Meta):
        swappable = "AUTH_USER_MODEL"
