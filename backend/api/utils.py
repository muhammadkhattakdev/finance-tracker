from django.core.mail import send_mail
from django.conf import settings
import random
import string
from datetime import timedelta
from django.utils import timezone

def generate_verification_code():
    """Generate a random 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=6))

def send_verification_email(user, code):
    """Send verification email to the user"""
    subject = 'Finance Tracker - Verify Your Email'
    message = f'''Hello {user.first_name},

Thank you for registering with Finance Tracker. To complete your registration, please verify your email address by entering the following code:

{code}

This code will expire in 5 minutes.

If you didn't register with Finance Tracker, please ignore this email.

Best regards,
The Finance Tracker Team
'''
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

def create_verification_code(user):
    """Create a verification code for the user"""
    from .models import EmailVerification
    
    EmailVerification.objects.filter(user=user, is_used=False).update(is_used=True)
    
    code = generate_verification_code()
    expires_at = timezone.now() + timedelta(minutes=5)
    
    verification = EmailVerification.objects.create(
        user=user,
        code=code,
        expires_at=expires_at
    )
    
    send_verification_email(user, code)
    
    return verification