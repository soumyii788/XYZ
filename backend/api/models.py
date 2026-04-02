from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Case(models.Model):
    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('BOOKING_PENDING', 'Booking Pending'),
        ('PAYMENT_PENDING', 'Payment Pending'),
        ('FOLLOW_UP', 'Follow-up Required'),
        ('ESCALATED', 'Escalated'),
        ('RESOLVED', 'Resolved'),
    ]
    PRIORITY_CHOICES = [
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]
    
    case_id = models.CharField(max_length=20, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')
    live_summary = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.case_id} - {self.status}"

class Message(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='messages')
    thread_id = models.CharField(max_length=100)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    sender = models.EmailField()
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"Msg from {self.sender} on {self.case.case_id}"

class Shipment(models.Model):
    case = models.OneToOneField(Case, on_delete=models.CASCADE, related_name='shipment')
    container_number = models.CharField(max_length=50, blank=True, null=True)
    bl_number = models.CharField(max_length=50, blank=True, null=True)
    eta = models.DateTimeField(blank=True, null=True)
    details = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Shipment for {self.case.case_id}"

class Payment(models.Model):
    case = models.OneToOneField(Case, on_delete=models.CASCADE, related_name='payment')
    invoice_number = models.CharField(max_length=50, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    due_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Payment for {self.case.case_id}"

class Reminder(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='reminders')
    text = models.CharField(max_length=255)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reminder for {self.case.case_id}: {self.text}"

class Profile(models.Model):
    ROLE_CHOICES = [
        ('SHIPPER', 'Shipper (Manufacturer/Retailer)'),
        ('FORWARDER', 'Freight Forwarder / Agent'),
        ('CARRIER', 'Shipping Line / Carrier'),
        ('CHB', 'Customs House Broker'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    company_name = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    onboarded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile for {self.user.username}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
