# utils.py
import json
from pywebpush import webpush, WebPushException
from django.shortcuts import get_object_or_404
from .models import PushSubscription

# VAPID_PUBLIC_KEY = "BDvso2i6ozteEOq89h5X6qlHFy2mJfG8MV_3TqTOLuhLhv9Wnnv4bqcXLOwFAGQiBKJTdFGCPj8yNSmlukQa-5g"
# VAPID_PRIVATE_KEY = "VwkW8Qre_HfevQ3V9A7n-0HlbHgVjAO9VEedyptHE0A"
# VAPID_CLAIMS = {
#     "sub": "mailto:chirag@example.com"
# }
    

VAPID_PUBLIC_KEY = "BOg8c9KsyymyvRMTGvPklUqFcCsIGtZKmTHYwQU9Q2htSRQwoWb0DfELP_paPxwapo439XgZfwu5oOdvrloOAAc"
VAPID_PRIVATE_KEY = "_50FIqLT1eDUrdCjzgO9D4gzyH8QCIjkjuL4ttxosac"
VAPID_CLAIMS = {
    "sub": "mailto:chirag@example.com"
}

def notify_users_test(task_title, username, task_importance):
    try:
        # Assuming you have the PushSubscription model already set up
        subscriptions = PushSubscription.objects.filter(user__username=username)
        task_title = task_title[:150]  # Truncate to 150 characters, if necessary
        task_importance = task_importance[:150]  # Truncate task importance description
        unique_subscriptions = set()
        for sub in subscriptions:
            if sub.endpoint not in unique_subscriptions:
                unique_subscriptions.add(sub.endpoint)
                subscription_info = {
                    'endpoint': sub.endpoint,
                    'keys': {
                        'p256dh': sub.p256dh,
                        'auth': sub.auth,
                    }
                }
                
                # Prepare the payload (data) to send to the user
                payload = {
                    'title': f"Task: {task_title}",
                    'body': f"Hello {username}, You have a task to do!! Task importance is {task_importance}",
                }
                # Send the push notification using the webpush function

                webpush(
                    subscription_info=subscription_info,
                    data=json.dumps(payload),
                    vapid_private_key=VAPID_PRIVATE_KEY,
                    vapid_claims=VAPID_CLAIMS
                )

                print(f"Notification sent to {username} for task: {task_title} with importance: {task_importance}")
    
    except Exception as e:
        print(f"Error sending notification for task: {task_title} - {str(e)}")
