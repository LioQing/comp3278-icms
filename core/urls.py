from django.urls import path
from rest_framework import routers

from . import views

models_router = routers.SimpleRouter()
models_router.register("student", views.ModelsStudentViewset)
models_router.register("record", views.ModelsRecordViewset)
models_router.register("course", views.ModelsCourseViewset)
models_router.register("course-hyperlink", views.ModelsCourseHyperlinkViewset)
models_router.register("course-file", views.ModelsCourseFileViewset)
models_router.register("session", views.ModelsSessionViewset)
models_router.register(
    "session-hyperlink", views.ModelsSessionHyperlinkViewset
)
models_router.register("session-file", views.ModelsSessionFileViewset)

urlpatterns = [
    path(
        "login-username/",
        views.ApiLoginUsernameView.as_view(),
        name="login-username",
    ),
    path("login/", views.ApiLoginView.as_view(), name="login"),
    path("timetable/", views.ApiTimetableView.as_view(), name="timetable"),
    path(
        "course/list/", views.ApiCourseListView.as_view(), name="course-list"
    ),
    path(
        "course/current/",
        views.ApiCourseCurrentView.as_view(),
        name="course-current",
    ),
    path(
        "course/details/<int:course_id>/",
        views.ApiCourseDetailsView.as_view(),
        name="course-details",
    ),
    path(
        "session/details/<int:session_id>/",
        views.ApiSessionDetailsView.as_view(),
        name="session-details",
    ),
    path("account/", views.ApiAccountView.as_view(), name="account"),
    path(
        "account/change-password/",
        views.ApiAccountChangePasswordView.as_view(),
        name="account-change-password",
    ),
    path(
        "account/record/",
        views.ApiAccountRecordView.as_view(),
        name="account-record",
    ),
    path(
        "logout/",
        views.ApiLogoutView.as_view(),
        name="logout",
    ),
    path(
        "last-login/",
        views.ApiLastLoginView.as_view(),
        name="last-login",
    ),
    path(
        "setup-face/",
        views.ApiSetupFaceView.as_view(),
        name="setup-face",
    ),
    path(
        "disable-face/",
        views.ApiDisableFaceView.as_view(),
        name="disable-face",
    ),
    path(
        "face-login/",
        views.ApiFaceLoginView.as_view(),
        name="face-login",
    ),
]
