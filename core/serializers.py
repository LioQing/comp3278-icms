from rest_framework import serializers
from .models import Student


class PingPongSerializer(serializers.Serializer):
    """Serializer for the PingPongView"""

    ping = serializers.CharField(max_length=4)


class StudentSerializer(serializers.Serializer):

    class Meta:
        model = Student
        fields = "__all__"