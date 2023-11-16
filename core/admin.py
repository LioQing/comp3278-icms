from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Student

admin.site.register(Student, UserAdmin)
