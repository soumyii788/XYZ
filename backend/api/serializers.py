from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Case, Message, Shipment, Payment, Reminder, Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = '__all__'

class CaseSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    shipment = ShipmentSerializer(read_only=True)
    payment = PaymentSerializer(read_only=True)
    reminders = ReminderSerializer(many=True, read_only=True)

    class Meta:
        model = Case
        fields = '__all__'
