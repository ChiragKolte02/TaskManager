from django_cron import CronJobBase, Schedule
from taskmanager.utils import notify_users_test  
from datetime import datetime
from django_cron import CronJobBase, Schedule
from django.utils import timezone
from taskmanager.models import Task 
import pytz

class MyCronJob(CronJobBase):
    schedule = Schedule(run_every_mins=0) 
    code = 'mycron.my_cron_job' 
    

    def do(self):
        ist_timezone = pytz.timezone('Asia/Kolkata')
        utc_timezone = pytz.utc
        current_time_utc = timezone.now()
        current_time_ist = current_time_utc.astimezone(ist_timezone)
        current_time_ist = current_time_ist.replace(second=0, microsecond=0)
    
        # Fetch tasks that are due at the current time
        tasks = Task.objects.all()

        # Iterate over tasks and notify the user
        for task in tasks:
            username = task.user.username  # Get the username of the user assigned to the task
            task_title = task.title        # The title of the task
            task_importance = task.importance  # The importance of the task
            
            
            ist = pytz.timezone('Asia/Kolkata')

            # Current time in IST (with seconds)
            current_time_ist = datetime.now(ist).replace(tzinfo=None, second=0, microsecond=0)

            # Task's time (convert if not timezone aware)
            task_time = task.time_date.replace(tzinfo=None, second=0, microsecond=0)
            
            
            with open("cron_log.txt", "a") as f:
                f.write(f"MyCronJob executed at {current_time_ist}\n")
            
            print(f"This is task: {task_title}")
            print(f"This is title: {task_title}")
            print(f"This is time: {current_time_ist.strftime("%Y-%m-%d %H:%M")}")
            print(f"This is task time: {task_time.strftime("%Y-%m-%d %H:%M")}")
            
            print(f"Full Current Time IST (with seconds): {current_time_ist}")
            print(f"Full Task Time IST (with seconds): {task_time}")
            print(f"Comparison result: {current_time_ist == task_time}")
            # Call notify_users_test to send the notification
            print(current_time_ist == task_time)
            if current_time_ist == task_time:
                notify_users_test(task_title, username, task_importance)
                print(f"[CRON] Checked and sent notifications for tasks at {current_time_ist}")
