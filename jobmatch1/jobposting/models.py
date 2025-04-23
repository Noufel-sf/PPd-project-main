from django.db import models
from django.contrib.auth.models import User

class JobPosting(models.Model):
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_postings')
    title = models.CharField(max_length=100)
    domain = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    salary = models.CharField(max_length=50)
    period = models.CharField(max_length=50)
    requirements = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.posted_by.username}"