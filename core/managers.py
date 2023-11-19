from django.contrib.auth.models import BaseUserManager


class StudentManager(BaseUserManager):
    """Manager for the Student model"""

    def create_user(self, username, password=None):
        """Create a new user"""
        if not username:
            raise ValueError("Users must have a username")

        user = self.model(username=username)

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, password):
        """Create a new superuser

        Actually the same as normal user since we don't have that
        """
        return self.create_user(username, password)
