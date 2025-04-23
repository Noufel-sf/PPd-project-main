from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from jobposting.models import JobPosting
from .models import Application
from .serializers import ApplicationSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@login_required
def jobapp_page(request):
    jobs = JobPosting.objects.all()
    return render(request, 'jobapplication/apply.html', {'jobs': jobs})

@csrf_exempt
@login_required
def submit_application(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            serializer = ApplicationSerializer(data={'job': data.get('job_id')}, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({'message': 'Application submitted successfully!'})
            return JsonResponse({'message': next(iter(serializer.errors.values()))}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON data.'}, status=400)
        except JobPosting.DoesNotExist:
            return JsonResponse({'message': 'Job not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=400)
    return JsonResponse({'message': 'Invalid request method.'}, status=405)