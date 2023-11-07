from django.urls import path


from . import views

urlpatterns = [
    path("ping", views.PingPongView.as_view(), name="ping"),
    path("students/<str:username>/", views.StudentView.as_view(), name = "students"),
]
