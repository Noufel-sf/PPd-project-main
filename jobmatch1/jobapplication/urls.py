from django.urls import path
from .views import jobapp_page, submit_application

urlpatterns = [
    path('apply/view/', jobapp_page, name='jobapp_page'),
    path('apply/submit/', submit_application, name='submit_application'),
]