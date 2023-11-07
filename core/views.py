from rest_framework import permissions, response, views




from . import serializers

from django.http import JsonResponse

from .models import Student


class PingPongView(views.APIView):
    """View for checking if the server is running"""

    serializer_class = serializers.PingPongSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """Return a pong response"""
        serializer = self.serializer_class(data={"ping": "pong"})
        serializer.is_valid(raise_exception=True)

        return response.Response(serializer.data)



class StudentView(views.APIView):

    def get(request):

        received_username=request.GET.get('username','')
        students = list(Student.objects.filter(username=received_username).values())

       
        return JsonResponse(students, safe=False)

