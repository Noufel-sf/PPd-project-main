from rest_framework import serializers
from .models import JobPosting

class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = ['title', 'domain', 'location', 'salary', 'period', 'requirements']
        read_only_fields = ['posted_by']

    def save(self, **kwargs):
        # Automatically set the posted_by field to the current user
        self.validated_data['posted_by'] = self.context['request'].user
        return super().save(**kwargs)