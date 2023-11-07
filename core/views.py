from rest_framework import permissions, response, views


from . import serializers

from .serializers import StudentSerializer

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

    serializer_class= StudentSerializer

    def get(self,request,*args,**kwargs):
        received_username = self.kwargs["username"]
        student_object = Student.objects.filter(username=received_username)
        serializer = StudentSerializer(student_object, many =True)
        return response.Response(serializer.data)

       


        




       
        return JsonResponse(students, safe=False)

