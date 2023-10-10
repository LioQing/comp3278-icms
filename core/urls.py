from django.urls import path

from . import views

urlpatterns = [
    path("ping", views.PingPongView.as_view(), name="ping"),
]
