# appname/admin.py
from django.contrib import admin
from .models import Task  # Import the model

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'importance', 'completed', 'time_date')
    list_filter = ('completed', 'importance')
    search_fields = ('title', 'description', 'user__username')

# Register the model with the admin site
# admin.site.register(Task)

