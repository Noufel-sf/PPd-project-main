from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import JobPosting
from .serializers import JobPostingSerializer

class JobPostingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = JobPostingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Job posted successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def jobpost_page(request):
    return render(request, "jobposting/jobpost.html")