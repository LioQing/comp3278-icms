from drf_extra_fields import fields as extra_fields
from rest_framework import serializers

from . import enums, models


class ModelsStudentsSerializer(serializers.ModelSerializer):
    """Serializer for the Student model"""

    def create(self, validated_data):
        """Hash the password before saving the user"""
        user: models.Student = super().create(validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

    def update(self, instance, validated_data):
        """Hash the password before saving the user"""
        user: models.Student = super().update(instance, validated_data)
        try:
            user.set_password(validated_data["password"])
            user.save()
        except KeyError:
            pass
        return user

    class Meta:
        model = models.Student
        fields = "__all__"


class ModelsRecordsSerializer(serializers.ModelSerializer):
    """Serializer for the Record model"""

    class Meta:
        model = models.Record
        fields = "__all__"


class ModelsCoursesSerializer(serializers.ModelSerializer):
    """Serializer for the Course model"""

    class Meta:
        model = models.Course
        fields = "__all__"


class ModelsCourseHyperlinkSerializer(serializers.ModelSerializer):
    """Serializer for the CourseHyperlink model"""

    class Meta:
        model = models.CourseHyperlink
        fields = "__all__"


class ModelsCourseFileSerializer(serializers.ModelSerializer):
    """Serializer for the CourseFile model"""

    class Meta:
        model = models.CourseFile
        fields = "__all__"


class ModelsSessionsSerializer(serializers.ModelSerializer):
    """Serializer for the Session model"""

    class Meta:
        model = models.Session
        fields = "__all__"


class ModelsSessionHyperlinkSerializer(serializers.ModelSerializer):
    """Serializer for the SessionHyperlink model"""

    class Meta:
        model = models.SessionHyperlink
        fields = "__all__"


class ModelsSessionFileSerializer(serializers.ModelSerializer):
    """Serializer for the SessionFile model"""

    class Meta:
        model = models.SessionFile
        fields = "__all__"


class ApiLoginUsernameSerializer(serializers.Serializer):
    """Serializer for the ApiLoginUsernameView"""

    username = serializers.CharField(
        max_length=255,
        validators=[models.Student.username_validator],
    )


class ApiLoginSerializer(serializers.Serializer):
    """Serializer for the ApiLoginView"""

    username = serializers.CharField(
        max_length=255,
        required=True,
        validators=[models.Student.username_validator],
    )
    password = serializers.CharField(max_length=255, required=True)
    auth_token = serializers.CharField(read_only=True)


class ApiTimetableSerializer(serializers.Serializer):
    """Serializer for the ApiTimetableView"""

    session_id = serializers.IntegerField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    session_type = serializers.ChoiceField(choices=enums.SessionType.choices())
    classroom = serializers.CharField(max_length=255)
    course_id = serializers.IntegerField()
    course_code = serializers.CharField(max_length=255)
    course_name = serializers.CharField(max_length=255)


class ApiCourseListSerializer(serializers.Serializer):
    """Serializer for the ApiCourseListView"""

    id = serializers.IntegerField()
    code = serializers.CharField(max_length=10)
    name = serializers.CharField(max_length=255)


class ApiCourseCurrentInfoSerializer(serializers.Serializer):
    """Serializer for the ApiCourseCurrentView"""

    course = serializers.IntegerField()
    session = serializers.IntegerField()


class ApiCourseCurrentSerializer(serializers.Serializer):
    """Serializer for the ApiCourseCurrentView"""

    current = serializers.ListField(child=ApiCourseCurrentInfoSerializer())
    within_one_hour = serializers.ListField(
        child=ApiCourseCurrentInfoSerializer()
    )


class ApiCourseDetailsHyperlinkSerializer(serializers.ModelSerializer):
    """Serializer for the ApiCourseDetailsView"""

    class Meta:
        model = models.CourseHyperlink
        fields = (
            "id",
            "name",
            "description",
            "order",
            "created_at",
            "last_edit",
            "url",
        )


class ApiCourseDetailsFileSerializer(serializers.ModelSerializer):
    """Serializer for the ApiCourseDetailsView"""

    class Meta:
        model = models.CourseFile
        fields = (
            "id",
            "name",
            "description",
            "order",
            "created_at",
            "last_edit",
            "file",
        )


class ApiCourseDetailsSessionSerializer(serializers.ModelSerializer):
    """Serializer for the ApiCourseDetailsView"""

    class Meta:
        model = models.Session
        fields = ("id", "start_time", "end_time", "type")


class ApiCourseDetailsSerializer(serializers.ModelSerializer):
    """Serializer for the ApiCourseDetailsView"""

    hyperlinks = ApiCourseDetailsHyperlinkSerializer(many=True)
    files = ApiCourseDetailsFileSerializer(many=True)
    sessions = ApiCourseDetailsSessionSerializer(many=True)

    class Meta:
        model = models.Course
        fields = (
            "id",
            "code",
            "year",
            "name",
            "description",
            "hyperlinks",
            "files",
            "sessions",
        )


class ApiSessionDetailsHyperlinkSerializer(serializers.ModelSerializer):
    """Serializer for the ApiSessionDetailsView"""

    class Meta:
        model = models.SessionHyperlink
        fields = (
            "id",
            "name",
            "description",
            "order",
            "created_at",
            "last_edit",
            "url",
        )


class ApiSessionDetailsFileSerializer(serializers.ModelSerializer):
    """Serializer for the ApiSessionDetailsView"""

    class Meta:
        model = models.SessionFile
        fields = (
            "id",
            "name",
            "description",
            "order",
            "created_at",
            "last_edit",
            "file",
        )


class ApiSessionDetailsSerializer(serializers.ModelSerializer):
    """Serializer for the ApiSessionDetailsView"""

    hyperlinks = ApiSessionDetailsHyperlinkSerializer(many=True)
    files = ApiSessionDetailsFileSerializer(many=True)

    class Meta:
        model = models.Session
        fields = (
            "id",
            "start_time",
            "end_time",
            "type",
            "classroom",
            "hyperlinks",
            "files",
        )


class ApiAccountSerializer(serializers.ModelSerializer):
    """Serializer for the ApiAccountView"""

    has_face = serializers.SerializerMethodField("get_has_face")

    def get_has_face(self, student: models.Student) -> bool:
        """Return True if the student has a face login setup"""
        return student.get_face_label() is not None

    class Meta:
        model = models.Student
        fields = (
            "username",
            "id",
            "name",
            "email",
            "has_face",
        )


class ApiAccountChangePasswordSerializer(serializers.Serializer):
    """Serializer for the ApiAccountChangePasswordView"""

    old_password = serializers.CharField(max_length=255, required=True)
    new_password = serializers.CharField(max_length=255, required=True)


class ApiAccountRecordSerializer(serializers.ModelSerializer):
    """Serializer for the ApiAccountRecordView"""

    class Meta:
        model = models.Record
        fields = ("id", "time", "message")


class ApiLogoutSerializer(serializers.Serializer):
    """Serializer for the ApiLogoutView"""

    pass


class ApiLastLoginSerializer(serializers.ModelSerializer):
    """Serializer for the ApiLastLoginView"""

    last_login = serializers.DateTimeField(source="time")

    class Meta:
        model = models.Record
        fields = ("last_login",)


class ApiSetupFaceSerializer(serializers.Serializer):
    """Serializer for the ApiSetupFaceView"""

    images = serializers.ListField(
        child=extra_fields.Base64ImageField(), required=True
    )


class ApiDisableFaceSerializer(serializers.Serializer):
    """Serializer for the ApiDisableFaceView"""

    pass


class ApiFaceLoginSerializer(serializers.Serializer):
    """Serializer for the ApiFaceLoginView"""

    username = serializers.CharField(
        max_length=255,
        required=True,
        validators=[models.Student.username_validator],
    )
    image = extra_fields.Base64ImageField(required=True)
    auth_token = serializers.CharField(read_only=True)


class ApiMailMaterialSerializer(serializers.Serializer):
    """Serializer for the ApiMailMaterialView"""

    owner = serializers.ChoiceField(choices=enums.MaterialOwners.choices())
    owner_id = serializers.IntegerField()
    material = serializers.ChoiceField(choices=enums.MaterialTypes.choices())
    material_id = serializers.IntegerField()


class ApiCourseAvailableSerializer(serializers.ModelSerializer):
    """Serializer for the ApiCoursesAvailableView"""

    class Meta:
        model = models.Course
        fields = ("id", "name", "code", "year")


class ApiCourseEnrollSerializer(serializers.Serializer):
    """Serializer for the ApiCourseEnrollView"""

    ids = serializers.ListField(
        child=serializers.IntegerField(), required=True
    )
    courses = serializers.ListField(
        child=ApiCourseListSerializer(), read_only=True
    )


class ApiRegisterSerializer(serializers.ModelSerializer):
    """Serializer for the ApiRegisterView"""

    auth_token = serializers.CharField(read_only=True)

    class Meta:
        model = models.Student
        fields = ("name", "email", "id", "username", "password", "auth_token")
