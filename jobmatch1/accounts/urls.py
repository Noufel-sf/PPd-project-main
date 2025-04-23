from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    SignupAPIView, signup_page, login_page, home, logout_view, 
    VerifyTokenView, CustomTokenObtainPairView, ResetPasswordRequestView,
    ResetPasswordConfirmView, complete_profile, complete_profile_2
)

urlpatterns = [
    path("", home, name="home"),
    path("signup/view/", signup_page, name="signup_page"),
    path("signup/", SignupAPIView.as_view(), name="signup"),
    path("complete-profile/", complete_profile, name="complete_profile"),
    path("complete-profile-2/", complete_profile_2, name="complete_profile_2"),
    path("login/view/", login_page, name="login_page"),
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", logout_view, name="logout"),
    path("verify-token/", VerifyTokenView.as_view(), name="verify_token"),
    path("reset-password-request/", ResetPasswordRequestView.as_view(), name="reset_password_request"),
    path("reset-password-confirm/<str:token>/", ResetPasswordConfirmView.as_view(), name="reset_password_confirm"),
]