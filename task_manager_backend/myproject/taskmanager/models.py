# models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class PushSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1) 
    endpoint = models.CharField(max_length=500)
    p256dh = models.CharField(max_length=500)
    auth = models.CharField(max_length=500)
    task_title = models.CharField(max_length=500, default="Unknown")
    task_time_date = models.DateTimeField(default=timezone.now) 

    def __str__(self):
        return f"Subscription for {self.user.username} - {self.task_title} - {self.task_title} - {self.task_time_date} - {self.endpoint[:50]}"

from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=500)
    description = models.TextField()
    time_date = models.DateTimeField()
    importance = models.CharField(max_length=10, choices=[("Low", "Low"), ("Medium", "Medium"), ("High", "High")])
    completed = models.BooleanField(default=False)

    def __str__(self):
        return (
            f"Title: {self.title} | "
            f"User: {self.user.username} | "
            f"Description: {self.description} | "
            f"Time: {self.time_date} | "
            f"Importance: {self.importance} | "
            f"Completed: {self.completed}"
        )