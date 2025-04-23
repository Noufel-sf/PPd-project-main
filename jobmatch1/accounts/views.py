from django.contrib.auth.models import User
from .serializers import UserSerializer
from django.shortcuts import render, redirect
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import logout, login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from .models import PasswordResetToken, UserProfile
import secrets
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings

@method_decorator(csrf_exempt, name="dispatch")
class SignupAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)  # Log the user in, setting the session
            refresh = RefreshToken.for_user(user)
            response = Response({
                "message": "User registered successfully!",
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_201_CREATED)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(username=request.data['username'])
            login(request, user)
        return response

def home(request):
    show_complete_profile_button = False
    if request.user.is_authenticated:
        try:
            profile = request.user.profile
            # Check if date_of_birth is None
            if not profile.date_of_birth:
                show_complete_profile_button = True
        except UserProfile.DoesNotExist:
            show_complete_profile_button = True  # Prompt if no profile exists

    return render(request, "accounts/index.html", {
        'show_complete_profile_button': show_complete_profile_button
    })

def signup_page(request):
    return render(request, "accounts/signup.html")

def login_page(request):
    return render(request, "accounts/login.html")

def logout_view(request):
    if request.method == "POST":
        logout(request)
        return redirect('home')
    return redirect('home')

def complete_profile(request):
    if not request.user.is_authenticated:
        return redirect('login_page')

    if request.method == "POST":
        date_of_birth = request.POST.get('date')
        phone_number = request.POST.get('nbr')
        address = request.POST.get('address')

        try:
            profile = request.user.profile
            profile.date_of_birth = date_of_birth
            profile.phone_number = phone_number
            profile.address = address
            profile.save()
            # Redirect based on role
            if profile.role == 'jobseeker':
                return redirect('complete_profile_2')
            return redirect('home')
        except UserProfile.DoesNotExist:
            return redirect('login_page')

    return render(request, 'accounts/complete1.html')

def complete_profile_2(request):
    if not request.user.is_authenticated:
        return redirect('login_page')

    # Ensure only jobseekers access this step
    try:
        profile = request.user.profile
        if profile.role != 'jobseeker':
            return redirect('home')
    except UserProfile.DoesNotExist:
        return redirect('login_page')

    if request.method == "POST":
        experience = request.POST.get('experience')
        skills = request.POST.get('skills')

        # Map form values to model choices
        experience_mapping = {
            'Entry-Level': 'entry_level',
            'Mid-Level': 'mid_level',
            'Expert-Level': 'expert_level'
        }
        experience_value = experience_mapping.get(experience)

        try:
            profile = request.user.profile
            profile.experience = experience_value
            profile.skills = skills
            profile.save()
            return redirect('home')
        except UserProfile.DoesNotExist:
            return redirect('login_page')

    return render(request, 'accounts/complete2.html')

class VerifyTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({"message": "Token is valid"}, status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name="dispatch")
class ResetPasswordRequestView(APIView):
    def get(self, request):
        return render(request, "accounts/reset1.html")

    def post(self, request):
        try:
            email = request.data.get('email')
            if not email:
                return Response(
                    {"error": "Email is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"error": "No user found with this email address"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = secrets.token_urlsafe(32)
            expires_at = timezone.now() + timedelta(hours=1)

            PasswordResetToken.objects.create(
                user=user,
                token=token,
                expires_at=expires_at
            )

            reset_link = f"http://{request.get_host()}/api/reset-password-confirm/{token}/"

            subject = "Password Reset Request - JobMatch"
            message = f"""
            Hello {user.username},

            You have requested to reset your password. Click the link below to reset your password:

            {reset_link}

            This link will expire in 1 hour. If you did not request a password reset, please ignore this email.

            Best regards,
            The JobMatch Team
            """
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [user.email]

            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=recipient_list,
                fail_silently=False,
            )

            return Response(
                {"message": "A password reset link has been sent to your email."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(f"Error in ResetPasswordRequestView: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@method_decorator(csrf_exempt, name="dispatch")
class ResetPasswordConfirmView(APIView):
    def get(self, request, token):
        print(f"GET request for token: {token}")
        try:
            
            print(f"Total PasswordResetToken records: {PasswordResetToken.objects.count()}")
            reset_token = PasswordResetToken.objects.get(token=token)
            print(f"Found token for user: {reset_token.user.email}, expires at: {reset_token.expires_at}")
            if reset_token.is_expired():
                print("Token is expired")
                return Response(
                    {"error": "This password reset link has expired."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except PasswordResetToken.DoesNotExist:
            print("Token not found in database")
            return Response(
                {"error": "Invalid password reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Error in GET method: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred while loading the page."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return render(request, "accounts/reset2.html")

    def post(self, request, token):
        print(f"POST request for token: {token}, data: {request.data}")
        try:
            
            print(f"Total PasswordResetToken records: {PasswordResetToken.objects.count()}")
            try:
                reset_token = PasswordResetToken.objects.get(token=token)
                print(f"Found token for user: {reset_token.user.email}")
            except PasswordResetToken.DoesNotExist:
                print("Token not found in database")
                return Response(
                    {"error": "Invalid password reset link."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if (reset_token.is_expired()):
                print("Token is expired")
                return Response(
                    {"error": "This password reset link has expired."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            
            new_password = request.data.get('password')
            print(f"New password received: {new_password}")
            if not new_password:
                print("No password provided")
                return Response(
                    {"error": "New password is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            
            user = reset_token.user
            print(f"User ID: {user.id}, Email: {user.email}, Username: {user.username}")
            if not User.objects.filter(id=user.id).exists():
                print("User does not exist in database")
                return Response(
                    {"error": "User associated with this token no longer exists."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            
            print(f"Updating password for user: {user.email}")
            user.set_password(new_password)
            print("Password set, saving user...")
            user.save()
            print(f"User password updated, new password hash: {user.password}")

            
            print("Deleting token after use")
            reset_token.delete()
            print(f"Remaining PasswordResetToken records: {PasswordResetToken.objects.count()}")

            print("Password updated successfully")
            return Response(
                {"message": "Your password has been updated successfully."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            import traceback
            print(f"Error in ResetPasswordConfirmView: {str(e)}")
            print("Traceback:")
            print(traceback.format_exc())
            return Response(
                {"error": "An unexpected error occurred. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )