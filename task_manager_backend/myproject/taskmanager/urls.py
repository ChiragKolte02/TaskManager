from django.urls import path
from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, register_user
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = DefaultRouter()
router.register('tasks', TaskViewSet)

urlpatterns = [
    path("api/save-subscription/", views.save_subscription),
    path('delete-subscription/<str:username>/<str:task_title>/', views.delete_subscription, name='delete_subscription'),
    path(
        'update-subscription/<str:username>/<str:old_task_title>/<str:new_task_title>/<str:new_time_date>/',
        views.update_subscription,
        name='update_subscription'
    ),
    path("api/send-test/", views.send_notification),
    path('api/', include(router.urls)),
    path('api/register/', register_user, name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
