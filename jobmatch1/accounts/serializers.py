from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, write_only=True)
    sex = serializers.ChoiceField(choices=UserProfile.SEX_CHOICES, write_only=True)  

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'role', 'sex']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_email(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        role = validated_data.pop('role')  
        sex = validated_data.pop('sex') 
        user = User.objects.create_user(
            username=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        UserProfile.objects.create(user=user, role=role, sex=sex)
        return user