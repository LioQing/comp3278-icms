from rest_framework import serializers

from .models import Record, Student


class PingPongSerializer(serializers.Serializer):
    """Serializer for the PingPongView"""

    ping = serializers.CharField(max_length=4)


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = "__all__"
