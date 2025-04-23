from rest_framework import serializers
from .models import Application
from jobposting.models import JobPosting
from django.contrib.auth.models import User

class ApplicationSerializer(serializers.ModelSerializer):
    job = serializers.IntegerField(write_only=True)  

    class Meta:
        model = Application
        fields = ['job', 'user', 'status', 'applied_at']
        read_only_fields = ['user', 'applied_at', 'status']

    def create(self, validated_data):
        user = self.context['request'].user
        job_id = validated_data.pop('job')  
        job = JobPosting.objects.get(id=job_id)

    
        if Application.objects.filter(user=user, job=job).exists():
            raise serializers.ValidationError({'message': 'You have already applied for this job.'})

        application = Application.objects.create(user=user, job=job)
        return application