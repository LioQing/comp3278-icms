from rest_framework import permissions, response, views

from . import serializers
from .models import Record, Student
from .serializers import RecordSerializer


class PingPongView(views.APIView):
    """View for checking if the server is running"""

    serializer_class = serializers.PingPongSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Return a pong response"""
        serializer = self.serializer_class(data={"ping": "pong"})
        serializer.is_valid(raise_exception=True)

        return response.Response(serializer.data)


class RecordView(views.APIView):
    serializer_class = serializers.RecordSerializer

    def get(self, request, *args, **kwargs):
        """Get list of records from a student"""
        received_student_id = self.kwargs["student_id"]
        record_object = Record.objects.filter(
            student__student_id=received_student_id
        )
        serializer = RecordSerializer(record_object, many=True)
        return response.Response(serializer.data)

    def post(self, request, *args, **kwargs):
        """Post a record to a student"""
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        Record.objects.create(
            student=Student.objects.get(student_id=self.kwargs["student_id"]),
            record_id=serializer.validated_data["record_id"],
            message=serializer.validated_data["message"],
        )
        return response.Response(serializer.data)
