from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.utils import timezone
import random
from .models import Case, Message, Shipment, Payment, Reminder, Profile
from .serializers import CaseSerializer, MessageSerializer, ReminderSerializer, UserSerializer, ProfileSerializer
from .ai_service import analyze_email_thread, generate_live_summary
from .tasks import send_relentless_reminders

class CaseViewSet(viewsets.ModelViewSet):
    queryset = Case.objects.all().order_by('-updated_at')
    serializer_class = CaseSerializer

    @action(detail=True, methods=['post'])
    def summarize(self, request, pk=None):
        case = self.get_object()
        messages = case.messages.all()
        if not messages:
            return Response({"error": "No messages to summarize"}, status=status.HTTP_400_BAD_REQUEST)
        
        summary = generate_live_summary(messages)
        case.live_summary = summary
        case.save()
        return Response({"summary": summary})

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class IngestionViewSet(viewsets.ViewSet):
    def create(self, request):
        data = request.data
        subject = data.get('subject', 'No Subject')
        body = data.get('body', '')
        sender = data.get('sender', 'unknown@example.com')
        thread_id = data.get('thread_id', f'thread_{random.randint(1000, 9999)}')
        
        try:
            case = Case.objects.get(messages__thread_id=thread_id)
        except Case.DoesNotExist:
            case_id = f"XYZ-{random.randint(10000, 99999)}"
            case = Case.objects.create(case_id=case_id, status='NEW', priority='MEDIUM')
            Shipment.objects.get_or_create(case=case)
            Payment.objects.get_or_create(case=case)
        
        ai_data = analyze_email_thread(body, subject)
        if ai_data:
            case.status = ai_data.get('context', case.status)
            case.priority = ai_data.get('priority', case.priority)
            case.live_summary = ai_data.get('summary', case.live_summary)
            
            ship_data = ai_data.get('shipment_data', {})
            shipment = case.shipment
            shipment.container_number = ship_data.get('container_number', shipment.container_number)
            shipment.bl_number = ship_data.get('bl_number', shipment.bl_number)
            if ship_data.get('eta'):
                shipment.eta = ship_data.get('eta')
            shipment.save()
            
            pay_data = ai_data.get('payment_data', {})
            payment = case.payment
            payment.invoice_number = pay_data.get('invoice_number', payment.invoice_number)
            payment.amount = pay_data.get('amount', payment.amount)
            payment.is_paid = pay_data.get('is_paid', payment.is_paid)
            if pay_data.get('due_date'):
                payment.due_date = pay_data.get('due_date')
            payment.save()
            
        case.save()

        Message.objects.create(
            case=case, thread_id=thread_id, subject=subject,
            body=body, sender=sender, timestamp=timezone.now()
        )
        
        send_relentless_reminders(repeat=3600, repeat_until=None)
        
        return Response({"status": "Email ingested", "case_id": case.case_id}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', f"{username}@example.com")
    
    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, password=password, email=email)
    return Response({
        "status": "success",
        "user": UserSerializer(user).data,
        "onboarded": False
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    # --- Universal Password Override for MVP Demo ---
    if password == '123456':
        user, created = User.objects.get_or_create(username=username)
        if created:
            user.set_password(password)
            user.email = f"{username}@example.com"
            user.save()
        
        return Response({
            "status": "success",
            "user": UserSerializer(user).data,
            "onboarded": user.profile.onboarded
        })
    # -----------------------------------------------

    user = authenticate(username=username, password=password)
    if user:
        return Response({
            "status": "success",
            "user": UserSerializer(user).data,
            "onboarded": user.profile.onboarded
        })
    
    return Response({"error": "Invalid credentials. Use password '123456' for access."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny]) # Using AllowAny for simple dev mode mock
def onboard_view(request):
    username = request.data.get('username')
    user = User.objects.get(username=username)
    profile = user.profile
    profile.company_name = request.data.get('company_name')
    profile.role = request.data.get('role')
    profile.region = request.data.get('region')
    profile.onboarded = True
    profile.save()
    return Response({"status": "success"})
