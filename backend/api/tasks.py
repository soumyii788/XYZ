from background_task import background
from django.utils import timezone
from datetime import timedelta
from .models import Case, Reminder

@background(schedule=0)
def send_relentless_reminders():
    """
    Check for pending/non-resolved cases and send reminders if they haven't been updated.
    """
    threshold = timezone.now() - timedelta(hours=24)
    pending_cases = Case.objects.exclude(status='RESOLVED').filter(updated_at__lte=threshold)

    for case in pending_cases:
        # Create a reminder if one doesn't exist for the current 24h block
        last_reminder = case.reminders.last()
        if not last_reminder or last_reminder.created_at < (timezone.now() - timedelta(hours=23)):
            Reminder.objects.create(
                case=case,
                text=f"RELENTLESS REMINDER: Case {case.case_id} has been pending for over 24 hours. Action required."
            )
            # Potentially escalate priority if it's been too long
            if case.priority != 'HIGH':
                case.priority = 'HIGH'
                case.status = 'ESCALATED'
                case.save()
                print(f"Triggered relentless reminder for {case.case_id}")