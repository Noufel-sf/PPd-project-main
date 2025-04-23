from django.urls import path
from .views import jobpost_page, JobPostingAPIView

urlpatterns = [
    path('job-posting/view/', jobpost_page, name='job_posting'),
    path('job-posting/', JobPostingAPIView.as_view(), name='api_job_posting'),
]