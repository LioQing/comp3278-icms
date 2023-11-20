import datetime

from django.apps import apps
from django.contrib.auth.password_validation import validate_password
from django.core.mail import EmailMultiAlternatives
from django.db import connection
from django.db.models.query import RawQuerySet
from django.utils import timezone
from drf_spectacular.utils import (
    OpenApiParameter, extend_schema, extend_schema_view
)
from rest_framework import (
    exceptions, permissions, request, response, views, viewsets
)
from rest_framework.authtoken.models import Token

from . import enums, face_recognition, models, serializers


class ModelsStudentViewset(viewsets.ModelViewSet):
    """Viewset for the Student model"""

    queryset = models.Student.objects.all()
    serializer_class = serializers.ModelsStudentsSerializer
    permission_classes = [permissions.AllowAny]


class ModelsRecordViewset(viewsets.ModelViewSet):
    """Viewset for the Record model"""

    queryset = models.Record.objects.all()
    serializer_class = serializers.ModelsRecordsSerializer
    permission_classes = [permissions.AllowAny]


class ModelsCourseViewset(viewsets.ModelViewSet):
    """Viewset for the Course model"""

    queryset = models.Course.objects.all()
    serializer_class = serializers.ModelsCoursesSerializer
    permission_classes = [permissions.AllowAny]


class ModelsCourseHyperlinkViewset(viewsets.ModelViewSet):
    """Viewset for the CourseHyperlink model"""

    queryset = models.CourseHyperlink.objects.all()
    serializer_class = serializers.ModelsCourseHyperlinkSerializer
    permission_classes = [permissions.AllowAny]


class ModelsCourseFileViewset(viewsets.ModelViewSet):
    """Viewset for the CourseFile model"""

    queryset = models.CourseFile.objects.all()
    serializer_class = serializers.ModelsCourseFileSerializer
    permission_classes = [permissions.AllowAny]


class ModelsSessionViewset(viewsets.ModelViewSet):
    """Viewset for the Session model"""

    queryset = models.Session.objects.all()
    serializer_class = serializers.ModelsSessionsSerializer
    permission_classes = [permissions.AllowAny]


class ModelsSessionHyperlinkViewset(viewsets.ModelViewSet):
    """Viewset for the SessionHyperlink model"""

    queryset = models.SessionHyperlink.objects.all()
    serializer_class = serializers.ModelsSessionHyperlinkSerializer
    permission_classes = [permissions.AllowAny]


class ModelsSessionFileViewset(viewsets.ModelViewSet):
    """Viewset for the SessionFile model"""

    queryset = models.SessionFile.objects.all()
    serializer_class = serializers.ModelsSessionFileSerializer
    permission_classes = [permissions.AllowAny]


class ApiLoginUsernameView(views.APIView):
    """View for checking if username can be used to login"""

    serializer_class = serializers.ApiLoginUsernameSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request: request.Request):
        """Return a response indicating if the username can be used to login"""
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        username: str = serializer.validated_data["username"]

        # Check if the username exists
        users = models.Student.objects.raw(
            """
            SELECT * FROM core_student WHERE username = %s
            """,
            [username],
        )

        if len(users) == 0:
            raise exceptions.AuthenticationFailed("Username does not exist")

        return response.Response({})


class ApiLoginView(views.APIView):
    """View for logging in"""

    serializer_class = serializers.ApiLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request: request.Request):
        """Log in with username and password"""
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        username: str = serializer.validated_data["username"]
        password: str = serializer.validated_data["password"]

        # Check if the username exists
        users: RawQuerySet[models.Student] = models.Student.objects.raw(
            """
            SELECT * FROM core_student WHERE username = %s
            """,
            [username],
        )

        if len(users) == 0:
            raise exceptions.AuthenticationFailed("Username does not exist")

        user = users[0]

        # Check if the password is correct
        if not user.check_password(password):
            raise exceptions.AuthenticationFailed("Incorrect password")

        token = Token.objects.get_or_create(user=user)[0]

        # Update records
        with connection.cursor() as cursor:
            # Student last login
            cursor.execute(
                """
                UPDATE core_student
                SET last_login = %s
                WHERE id = %s
                """,
                [timezone.now(), user.id],
            )

            # Records
            cursor.execute(
                """
                INSERT INTO core_record (time, student_id, message)
                VALUES (%s, %s, 'Log in')
                """,
                [timezone.now(), user.id],
            )

        return response.Response({"auth_token": token.key})


@extend_schema_view(
    get=extend_schema(
        parameters=[
            OpenApiParameter(
                name="date",
                type={
                    "type": "string",
                    "format": "%Y-%m-%d",
                },
                required=True,
            ),
        ]
    )
)
class ApiTimetableView(views.APIView):
    """View for getting the timetable of the week"""

    serializer_class = serializers.ApiTimetableSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: request.Request):
        """Return a response containing the timetable"""
        user: models.Student = request.user
        date = request.query_params.get("date", None)

        if date is None:
            raise exceptions.ParseError("Missing parameter 'date'")

        # Check if the date is valid
        try:
            date = timezone.make_aware(
                datetime.datetime.strptime(date, "%Y-%m-%d")
            )
        except ValueError:
            raise exceptions.ParseError("Invalid date format")

        # Get the date of the sunday of the week
        sunday = date
        if date.weekday() != 6:
            sunday = date - datetime.timedelta(days=date.weekday() + 1)

        # Get the sessions with their course info for the week
        sessions = models.Session.objects.raw(
            """
            SELECT
                core_session.id,
                core_session.id AS session_id,
                core_session.start_time,
                core_session.end_time,
                core_session.type AS session_type,
                core_session.classroom,
                core_course.id AS course_id,
                core_course.code AS course_code,
                core_course.name AS course_name
            FROM
                core_session
            JOIN
                core_course ON core_session.course_id = core_course.id
            WHERE
                core_course.id IN (
                    SELECT core_course_students.course_id
                    FROM core_course_students
                    WHERE core_course_students.student_id = %s
                )
                AND core_session.start_time >= %s
                AND core_session.start_time < %s
            """,
            [
                user.id,
                sunday,
                sunday + datetime.timedelta(days=7),
            ],
        )

        # Serialize the timetable
        serializer = self.serializer_class(sessions, many=True)

        return response.Response(serializer.data)


@extend_schema_view(
    get=extend_schema(
        parameters=[
            OpenApiParameter(
                name="time",
                type={
                    "type": "string",
                    "format": "%Y-%m-%dT%H:%M:%S",
                },
                required=True,
            ),
        ]
    )
)
class ApiCourseListView(views.APIView):
    """View for getting the list of courses"""

    serializer_class = serializers.ApiCourseListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: request.Request):
        """Return a response containing the list of courses"""
        user: models.Student = request.user
        time = request.query_params.get("time", None)

        if time is None:
            raise exceptions.ParseError("Missing parameter 'time'")

        # Check if the time is valid
        try:
            time = timezone.make_aware(
                datetime.datetime.strptime(time, "%Y-%m-%dT%H:%M:%S")
            )
        except ValueError:
            raise exceptions.ParseError("Invalid time format")

        # Get the courses order by next session start time
        # If session start time is in the past, put it in the end
        courses = models.Course.objects.raw(
            """
            SELECT
                core_course.id,
                core_course.code,
                core_course.name
            FROM
                core_course
            JOIN
                core_session ON core_course.id = core_session.course_id
            WHERE
                core_course.id IN (
                    SELECT core_course_students.course_id
                    FROM core_course_students
                    WHERE core_course_students.student_id = %s
                )
            GROUP BY
                core_course.id
            ORDER BY
                MIN(
                    CASE
                        WHEN core_session.end_time < %s THEN
                            '9999-12-31 23:59:59'
                        ELSE
                            core_session.end_time
                    END
                )
            """,
            [
                user.id,
                time,
            ],
        )

        # Serialize the courses
        serializer = self.serializer_class(courses, many=True)

        return response.Response(serializer.data)


@extend_schema_view(
    get=extend_schema(
        parameters=[
            OpenApiParameter(
                name="time",
                type={
                    "type": "string",
                    "format": "%Y-%m-%dT%H:%M:%S",
                },
                required=True,
            ),
        ]
    )
)
class ApiCourseCurrentView(views.APIView):
    """View for getting the current course"""

    serializer_class = serializers.ApiCourseCurrentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: request.Request):
        """Return a response containing the current course"""
        user: models.Student = request.user
        time = request.query_params.get("time", None)

        if time is None:
            raise exceptions.ParseError("Missing parameter 'time'")

        # Check if the time is valid
        try:
            time = timezone.make_aware(
                datetime.datetime.strptime(time, "%Y-%m-%dT%H:%M:%S")
            )
        except ValueError:
            raise exceptions.ParseError("Invalid time format")

        # Get the current session id and course id
        current = models.Course.objects.raw(
            """
            SELECT
                core_session.id,
                core_course.id AS course_id
            FROM
                core_course
            JOIN
                core_session ON core_course.id = core_session.course_id
            WHERE
                core_course.id IN (
                    SELECT core_course_students.course_id
                    FROM core_course_students
                    WHERE core_course_students.student_id = %s
                )
                AND core_session.start_time <= %s
                AND core_session.end_time > %s
            """,
            [
                user.id,
                time,
                time,
            ],
        )

        within_one_hour = models.Course.objects.raw(
            """
            SELECT
                core_session.id,
                core_course.id AS course_id
            FROM
                core_course
            JOIN
                core_session ON core_course.id = core_session.course_id
            WHERE
                core_course.id IN (
                    SELECT core_course_students.course_id
                    FROM core_course_students
                    WHERE core_course_students.student_id = %s
                )
                AND core_session.start_time > %s
                AND core_session.start_time <= %s
            """,
            [
                user.id,
                time,
                time + datetime.timedelta(hours=1),
            ],
        )

        # Serialize the courses
        serializer = self.serializer_class(
            {
                "current": [
                    {
                        "session": c.id,
                        "course": c.course_id,
                    }
                    for c in current
                ],
                "within_one_hour": [
                    {
                        "session": c.id,
                        "course": c.course_id,
                    }
                    for c in within_one_hour
                ],
            }
        )

        return response.Response(serializer.data)


class ApiCourseDetailsView(views.APIView):
    """View for getting the details of a course"""

    serializer_class = serializers.ApiCourseDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: request.Request, course_id: int):
        """Return a response containing the details of a course"""
        user: models.Student = request.user

        # Get the course
        courses = models.Course.objects.raw(
            """
            SELECT
                core_course.id,
                core_course.code,
                core_course.year,
                core_course.name,
                core_course.description
            FROM
                core_course
            WHERE
                core_course.id IN (
                    SELECT core_course_students.course_id
                    FROM core_course_students
                    WHERE core_course_students.student_id = %s
                )
                AND core_course.id = %s
            """,
            [
                user.id,
                course_id,
            ],
        )

        if len(courses) == 0:
            raise exceptions.NotFound("Course does not exist")

        course: models.Course = courses[0]

        # Get the hyperlinks of the course
        hyperlinks = models.CourseHyperlink.objects.raw(
            """
            SELECT
                core_coursehyperlink.id,
                core_coursehyperlink.name,
                core_coursehyperlink.description,
                core_coursehyperlink.url
            FROM
                core_coursehyperlink
            WHERE
                core_coursehyperlink.course_id = %s
            """,
            [
                course.id,
            ],
        )

        # Get the files of the course
        files = models.CourseFile.objects.raw(
            """
            SELECT
                core_coursefile.id,
                core_coursefile.name,
                core_coursefile.description,
                core_coursefile.file
            FROM
                core_coursefile
            WHERE
                core_coursefile.course_id = %s
            """,
            [
                course.id,
            ],
        )

        # Get the sessions of the course
        sessions = models.Session.objects.raw(
            """
            SELECT
                core_session.id,
                core_session.start_time,
                core_session.end_time,
                core_session.type
            FROM
                core_session
            WHERE
                core_session.course_id = %s
            """,
            [
                course.id,
            ],
        )

        # Serialize the course
        serializer = self.serializer_class(
            {
                "id": course.id,
                "code": course.code,
                "year": course.year,
                "name": course.name,
                "description": course.description,
                "hyperlinks": hyperlinks,
                "files": files,
                "sessions": sessions,
            }
        )

        return response.Response(serializer.data)


class ApiSessionDetailsView(views.APIView):
    """View for getting the details of a session"""

    serializer_class = serializers.ApiSessionDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: request.Request, session_id: int):
        """Return a response containing the details of a session"""
        user: models.Student = request.user

        # Get the session
        sessions = models.Session.objects.raw(
            """
            SELECT
                core_session.id,
                core_session.start_time,
                core_session.end_time,
                core_session.type,
                core_session.classroom
            FROM
                core_session
            JOIN
                core_course ON core_session.course_id = core_course.id
            WHERE
                core_course.id IN (
                    SELECT core_course_students.course_id
                    FROM core_course_students
                    WHERE core_course_students.student_id = %s
                )
                AND core_session.id = %s
            """,
            [
                user.id,
                session_id,
            ],
        )

        if len(sessions) == 0:
            raise exceptions.NotFound("Session does not exist")

        session: models.Session = sessions[0]

        # Get the hyperlinks of the session
        hyperlinks = models.SessionHyperlink.objects.raw(
            """
            SELECT
                core_sessionhyperlink.id,
                core_sessionhyperlink.name,
                core_sessionhyperlink.description,
                core_sessionhyperlink.url
            FROM
                core_sessionhyperlink
            WHERE
                core_sessionhyperlink.session_id = %s
            """,
            [
                session.id,
            ],
        )

        # Get the files of the session
        files = models.SessionFile.objects.raw(
            """
            SELECT
                core_sessionfile.id,
                core_sessionfile.name,
                core_sessionfile.description,
                core_sessionfile.file
            FROM
                core_sessionfile
            WHERE
                core_sessionfile.session_id = %s
            """,
            [
                session.id,
            ],
        )

        # Serialize the session
        serializer = self.serializer_class(
            {
                "id": session.id,
                "start_time": session.start_time,
                "end_time": session.end_time,
                "type": session.type,
                "classroom": session.classroom,
                "hyperlinks": hyperlinks,
                "files": files,
            }
        )

        return response.Response(serializer.data)


class ApiAccountView(views.APIView):
    """View for getting the account details"""

    serializer_class = serializers.ApiAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: request.Request):
        """Return a response containing the account details"""
        user: models.Student = request.user

        # Get the account details
        serializer = self.serializer_class(user)

        return response.Response(serializer.data)


class ApiAccountChangePasswordView(views.APIView):
    """View for changing the password"""

    serializer_class = serializers.ApiAccountChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: request.Request):
        """Change the password"""
        user: models.Student = request.user

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_password: str = serializer.validated_data["old_password"]
        new_password: str = serializer.validated_data["new_password"]

        # Check if the old password is correct
        if not user.check_password(old_password):
            raise exceptions.ValidationError(
                {"old_password": ["Incorrect password."]}
            )

        # Validate new password
        try:
            validate_password(new_password)
        except Exception as e:
            raise exceptions.ValidationError({"new_password": e.messages})

        # Change the password
        user.set_password(new_password)
        user.save()

        # Update record
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO core_record (time, student_id, message)
                VALUES (%s, %s, 'Change password')
                """,
                [timezone.now(), user.id],
            )

        return response.Response({})


@extend_schema_view(
    get=extend_schema(
        parameters=[
            OpenApiParameter(
                name="page",
                type=int,
                required=True,
            ),
            OpenApiParameter(
                name="page_size",
                type=int,
            ),
        ]
    )
)
class ApiAccountRecordView(views.APIView):
    """View for getting the account records"""

    serializer_class = serializers.ApiAccountRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: request.Request):
        """Return a response containing the account records"""
        user: models.Student = request.user

        page = request.query_params.get("page", None)
        page_size = request.query_params.get("page_size", 20)

        if page is None:
            raise exceptions.ParseError("Missing parameter 'page'")

        try:
            page = int(page)
        except ValueError:
            raise exceptions.ParseError("Invalid page number")

        if page <= 0:
            raise exceptions.ParseError("Invalid page number")

        if page_size is not None:
            try:
                page_size = int(page_size)
            except ValueError:
                raise exceptions.ParseError("Invalid page size")

            if page_size <= 0:
                raise exceptions.ParseError("Invalid page size")

        # Get the records
        records = models.Record.objects.raw(
            """
            SELECT
                *
            FROM
                core_record
            WHERE
                core_record.student_id = %s
            ORDER BY
                core_record.time DESC
            LIMIT %s
            OFFSET %s
            """,
            [
                user.id,
                page_size,
                (page - 1) * page_size,
            ],
        )

        # Serialize the records
        serializer = self.serializer_class(records, many=True)

        return response.Response(serializer.data)


class ApiLogoutView(views.APIView):
    """View for logging out"""

    serializer_class = serializers.ApiLogoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: request.Request):
        """Log out"""
        user: models.Student = request.user

        # Delete the token
        Token.objects.filter(user=user).delete()

        # Update logout record
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO core_record (time, student_id, message)
                VALUES (%s, %s, 'Log out')
                """,
                [timezone.now(), user.id],
            )

        return response.Response({})


class ApiLastLoginView(views.APIView):
    """View for getting the last login time"""

    serializer_class = serializers.ApiLastLoginSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request: request.Request):
        """Return a response containing the last login time"""
        user: models.Student = request.user

        # Get the last login time
        records = models.Record.objects.raw(
            """
            SELECT
                *
            FROM
                core_record
            WHERE
                core_record.student_id = %s
                AND core_record.message = 'Log in'
            ORDER BY
                core_record.time DESC
            LIMIT 2
            """,
            [
                user.id,
            ],
        )

        if len(records) < 2:
            raise exceptions.NotFound("No login record")

        record: models.Record = records[1]

        # Serialize the record
        serializer = self.serializer_class(record)

        return response.Response(serializer.data)


class ApiSetupFaceView(views.APIView):
    """View for setting up face"""

    serializer_class = serializers.ApiSetupFaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: request.Request):
        """Set up face"""
        user: models.Student = request.user

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        images = serializer.validated_data["images"]

        # Check if the user has already set up face
        face_labels = models.FaceLabel.objects.raw(
            """
            SELECT
                *
            FROM
                core_facelabel
            WHERE
                core_facelabel.student_id = %s
            """,
            [
                user.id,
            ],
        )

        if len(face_labels) != 0:
            raise exceptions.ValidationError(detail="Face already set up")

        # Create face label
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO core_facelabel (student_id)
                VALUES (%s)
                """,
                [user.id],
            )

        face_labels = models.FaceLabel.objects.raw(
            """
            SELECT
                *
            FROM
                core_facelabel
            WHERE
                core_facelabel.student_id = %s
            """,
            [
                user.id,
            ],
        )

        if len(face_labels) == 0:
            raise exceptions.NotFound("Face label not found")

        face_label: models.FaceLabel = face_labels[0]

        # Save images to faces
        for image in images:
            models.Face.objects.create(
                label=face_label,
                image=image,
            )

        # Train model
        try:
            success = face_recognition.train_model(user.id)
        except Exception as e:
            # Delete face label and images
            for face in face_label.faces.all():
                face.delete()
            face_label.delete()
            raise e

        if not success:
            # Delete face label and images
            for face in face_label.faces.all():
                face.delete()
            face_label.delete()

            raise exceptions.ValidationError({"images": ["Face not detected"]})

        # Update record
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO core_record (time, student_id, message)
                VALUES (%s, %s, 'Set up face login')
                """,
                [timezone.now(), user.id],
            )

        return response.Response({})


class ApiDisableFaceView(views.APIView):
    """View for disabling face"""

    serializer_class = serializers.ApiDisableFaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: request.Request):
        """Disable face"""
        user: models.Student = request.user

        # Check if the user has already set up face
        face_labels = models.FaceLabel.objects.raw(
            """
            SELECT
                *
            FROM
                core_facelabel
            WHERE
                core_facelabel.student_id = %s
            """,
            [
                user.id,
            ],
        )

        if len(face_labels) == 0:
            raise exceptions.NotFound("Face label not found")

        face_label: models.FaceLabel = face_labels[0]

        with connection.cursor() as cursor:
            # Delete faces
            cursor.execute(
                """
                DELETE FROM core_face
                WHERE label_id = %s
                """,
                [face_label.student.id],
            )

            # Delete face label
            cursor.execute(
                """
                DELETE FROM core_facelabel
                WHERE student_id = %s
                """,
                [face_label.student.id],
            )

            # Update record
            cursor.execute(
                """
                INSERT INTO core_record (time, student_id, message)
                VALUES (%s, %s, 'Disable face login')
                """,
                [timezone.now(), user.id],
            )

        return response.Response({})


class ApiFaceLoginView(views.APIView):
    """View for face login"""

    serializer_class = serializers.ApiFaceLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request: request.Request):
        """Log in with face"""
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"]
        image = serializer.validated_data["image"]

        # Check if the username exists
        users = models.Student.objects.raw(
            """
            SELECT * FROM core_student WHERE username = %s
            """,
            [username],
        )

        if len(users) == 0:
            raise exceptions.AuthenticationFailed("Username does not exist")

        user: models.Student = users[0]

        # Check if the user has set up face
        face_labels = models.FaceLabel.objects.raw(
            """
            SELECT
                *
            FROM
                core_facelabel
            WHERE
                core_facelabel.student_id = %s
            """,
            [
                user.id,
            ],
        )

        if len(face_labels) == 0:
            raise exceptions.AuthenticationFailed("Face not set up")

        # Check if the face is recognized
        if not face_recognition.is_correct_face(user.id, image):
            raise exceptions.AuthenticationFailed("Face is not recognized")

        # Update record
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO core_record (time, student_id, message)
                VALUES (%s, %s, 'Log in with face')
                """,
                [timezone.now(), user.id],
            )

        token = Token.objects.get_or_create(user=user)[0]

        return response.Response({"auth_token": token.key})


class ApiMailMaterialView(views.APIView):
    """View for mailing materials"""

    serializer_class = serializers.ApiMailMaterialSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: request.Request):
        """Mail materials"""
        user: models.Student = request.user

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            owner = enums.MaterialOwners[serializer.validated_data["owner"]]
            material = enums.MaterialTypes[
                serializer.validated_data["material"]
            ]
        except KeyError:
            raise exceptions.ParseError("Invalid owner or material value")

        owner_id: int = serializer.validated_data["owner_id"]
        material_id: int = serializer.validated_data["material_id"]

        owner_table_name = owner.table_name()
        material_table_name = material.table_name(owner)

        # Check if the owner exists
        owners: RawQuerySet[models.Course | models.Session] = (
            apps.get_app_config("core")
            .get_model(owner.value)
            .objects.raw(
                f"""
            SELECT
                *
            FROM
                {owner_table_name}
            WHERE
                {owner_table_name}.id = %s
            """,
                [
                    owner_id,
                ],
            )
        )

        if len(owners) == 0:
            raise exceptions.NotFound(f"{owner.value} does not exist")

        owner_model: models.Course | models.Session = owners[0]

        # Check if the material exists
        materials: RawQuerySet[
            (
                models.CourseFile
                | models.CourseHyperlink
                | models.SessionFile
                | models.SessionHyperlink
            )
        ] = (
            apps.get_app_config("core")
            .get_model(owner.value + material.value)
            .objects.raw(
                f"""
            SELECT
                *
            FROM
                {material_table_name}
            WHERE
                {material_table_name}.id = %s
            """,
                [
                    material_id,
                ],
            )
        )

        if len(materials) == 0:
            raise exceptions.NotFound(f"{material.value} does not exist")

        material_model: (
            models.CourseFile
            | models.CourseHyperlink
            | models.SessionFile
            | models.SessionHyperlink
        ) = materials[0]

        # Check if the user has access to the material
        if owner_table_name == enums.MaterialOwners.COURSE.table_name():
            if owner_model.id not in user.courses.values_list("id", flat=True):
                raise exceptions.PermissionDenied(
                    f"You do not have access to this {owner.value}"
                )
        elif owner_table_name == enums.MaterialOwners.SESSION.table_name():
            # for each user's courses's session, check if id matches
            if owner_model.course.id not in user.courses.values_list(
                "id", flat=True
            ):
                raise exceptions.PermissionDenied(
                    f"You do not have access to this {owner.value}"
                )

        # Send email
        email = EmailMultiAlternatives(
            subject=f"ICMS {owner.value} Material: {material_model.name}",
            body=(
                "This email is auto-generated by Intelligent Course Management"
                " System. Please do not reply.\n\n"
            ),
            to=[user.email],
        )

        if owner == enums.MaterialOwners.COURSE:
            email.body += f"Course: {owner_model.code} {owner_model.name}\n\n"
        elif owner == enums.MaterialOwners.SESSION:
            email.body += (
                f"Course: {owner_model.course.code}\nSession:"
                f" {enums.SessionType[owner_model.type]}"
                f" {owner_model.start_time.strftime('%A %Y-%m-%d %H:%M')} -"
                f" {owner_model.end_time.strftime('%H:%M')}\n\n"
            )

        if material == enums.MaterialTypes.FILE:
            email.body += (
                f"Name: {material_model.name}\nDescription:"
                f" {material_model.description}\n\n"
            )
            email.attach_file(material_model.file.path)
        elif material == enums.MaterialTypes.HYPERLINK:
            link = material_model.url.replace("'", "\\'")
            email.attach_alternative(
                """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>title</title>
                </head>
                <body>
                    <p>
                """
                + (
                    email.body
                    + f"Name: {material_model.name}\nDescription:"
                    f" {material_model.description}\nURL: <a"
                    f" href='{link}'>{material_model.url}</a>\n\n"
                ).replace("\n", "<br />")
                + """
                    </p>
                </body>
                </html>
                """,
                "text/html",
            )
            email.body += (
                f"Name: {material_model.name}\nDescription:"
                f" {material_model.description}\nURL: {material_model.url}\n\n"
            )

        email.send()

        # Update record
        material_info = f"{material_model.name}"
        if owner == enums.MaterialOwners.COURSE:
            material_info = f"{owner_model.code} {material_info}"
        elif owner == enums.MaterialOwners.SESSION:
            material_info = (
                f"{owner_model.course.code} {owner_model.type}"
                f" {owner_model.start_time.strftime('dddd %Y-%m-%d %H:%M')} -"
                f" {owner_model.end_time.strftime('%H:%M')} {material_info}"
            )

        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO core_record (time, student_id, message)
                VALUES (%s, %s, %s)
                """,
                [
                    timezone.now(),
                    user.id,
                    (
                        f"Mail {owner.value} {material.value} material:"
                        f" {material_info}"
                    ),
                ],
            )

        return response.Response({})
