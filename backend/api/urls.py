from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CaseViewSet, 
    MessageViewSet, 
    IngestionViewSet, 
    login_view, 
    register_view, 
    onboard_view,
    send_otp_view,
    update_user_view
)

router = DefaultRouter()
router.register(r'cases', CaseViewSet, basename='case')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
    path('ingest/', IngestionViewSet.as_view({'post': 'create'}), name='ingest'),
    path('auth/send-otp/', send_otp_view, name='send-otp'),
    path('auth/login/', login_view, name='login'),
    path('auth/register/', register_view, name='register'),
    path('auth/update-user/', update_user_view, name='update-user'),
    path('auth/onboard/', onboard_view, name='onboard'),
]
