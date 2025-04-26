import json
import base64
from django.http import JsonResponse
from pywebpush import webpush, WebPushException
from .models import PushSubscription
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt


VAPID_PUBLIC_KEY = "BDvso2i6ozteEOq89h5X6qlHFy2mJfG8MV_3TqTOLuhLhv9Wnnv4bqcXLOwFAGQiBKJTdFGCPj8yNSmlukQa-5g"
VAPID_PRIVATE_KEY = "VwkW8Qre_HfevQ3V9A7n-0HlbHgVjAO9VEedyptHE0A"
VAPID_CLAIMS = {
    "sub": "mailto:chirag@example.com"
}

# taskmanager/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import PushSubscription

# taskmanager/views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import PushSubscription

from datetime import datetime


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
import json


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_subscription(request):
    try:
        data = request.data
        print("Received subscription data:", data)  # Debugging log
        endpoint = data.get("endpoint")
        keys = data.get("keys", {})
        p256dh = keys.get("p256dh")
        auth_key = keys.get("auth")
        task_title = data.get("task_title")
        task_time_date = data.get("task_time_date")

        # Check if all keys exist
        if not p256dh or not auth_key:
            return Response({"error": "Missing p256dh or auth keys"}, status=400)

        PushSubscription.objects.create(
            user=request.user,
            endpoint=endpoint,
            p256dh=p256dh,
            auth=auth_key,
            task_title=task_title,
            task_time_date=task_time_date
        )
        return Response({'message': 'Subscription saved successfully.'}, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=400)



def get_subscription():
    try:
        # Retrieve the first subscription from the database (or choose a more specific query)
        subscription = PushSubscription.objects.first()
        if not subscription:
            raise ValueError("No subscription found")
        return subscription
    except Exception as e:
        raise ValueError(f"Could not retrieve subscription: {str(e)}")

# taskmanager/views.py

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import PushSubscription
import json
from django.contrib.auth.decorators import login_required




from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from pywebpush import webpush, WebPushException
from .models import PushSubscription
import json
import traceback

# views.py
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required  # If this view needs auth
import json
from pywebpush import webpush, WebPushException
from .models import PushSubscription
import traceback

@login_required  #  ✅  Apply login_required if needed
def send_notification(request):
    try:
        user = request.user  #  ✅  Get user from the request
        subscription = PushSubscription.objects.filter(user=user).first()
        print(user)
        if not subscription:
            return JsonResponse({"status": "error", "message": "No subscription found for the user"}, status=404)

        subscription_info = {
            "endpoint": subscription.endpoint,
            "keys": {
                "p256dh": subscription.p256dh,
                "auth": subscription.auth
            }
        }

        payload = json.dumps({"title": subscription.task_title})  #  ✅  Access task_title correctly

        try:
            webpush(
                subscription_info,
                payload,
                vapid_private_key=VAPID_PRIVATE_KEY,
                vapid_claims=VAPID_CLAIMS
            )
            return JsonResponse({"status": "success", "message": "Notification sent"}, status=200)

        except WebPushException as e:
            if e.response and e.response.status_code == 410:
                subscription.delete()
                return JsonResponse({"status": "error", "message": "Subscription expired and removed"}, status=410)
            return JsonResponse({"status": "error", "message": f"WebPush error: {str(e)}"}, status=500)

    except Exception as e:
        trace = traceback.format_exc()
        print(trace)
        return JsonResponse({"status": "error", "exception message": str(e), "traceback": trace}, status=500)
        
from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes



class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-time_date')
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated] 
    
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('-time_date')  

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  

@api_view(['POST'])
@permission_classes([AllowAny])  # 💥 This line is important
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if not username or not password or not email:
        return Response({'error': 'Username, email and password required.'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)



from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.http import JsonResponse

def delete_subscription(request, username, task_title):
    try:
        user = get_object_or_404(User, username=username)
        subscription = PushSubscription.objects.filter(user=user, task_title=task_title).first()
        
        if subscription:
            subscription.delete()
            return JsonResponse({'message': f"Deleted subscription for {username} and task '{task_title}'."})
        else:
            return JsonResponse({'message': f"No subscription found for {username} and task '{task_title}'."})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import PushSubscription

def update_subscription(request, username, old_task_title, new_task_title, new_time_date):
    try:
        user = User.objects.get(username=username)
        
        # Find subscription based on old task title
        subscription = PushSubscription.objects.filter(user=user, task_title=old_task_title).first()
        
        if subscription:
            subscription.task_title = new_task_title 
            subscription.task_time_date = new_time_date
            subscription.save()
            return JsonResponse({
                "message": f"Subscription updated from '{old_task_title}' to '{new_task_title}' for user {username}."
            })
        else:
            return JsonResponse({
                "message": f"No subscription found for {username} and task '{old_task_title}'."
            }, status=404)
    except Exception as e:
        return JsonResponse({
            "error": str(e)
        }, status=500)
