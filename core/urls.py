from django.urls import path
from rest_framework import routers

from . import views

router = routers.SimpleRouter()

urlpatterns = [
    *router.urls,
    path("ping", views.PingPongView.as_view(), name="ping"),
    path(
        "record/<int:student_id>/", views.RecordView.as_view(), name="record"
    ),
]
