from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import uuid
from django.contrib.auth import get_user_model
from django.utils import timezone



def generate_unique_username(first_name, last_name):
    """Generate a unique username from first and last name"""
    if first_name and last_name:
        base_username = (first_name[0] + last_name).lower()
    elif first_name:
        base_username = first_name.lower()
    elif last_name:
        base_username = last_name.lower()
    else:
        base_username = "user"
    
    base_username = ''.join(e for e in base_username if e.isalnum())
    
    unique_id = uuid.uuid4().hex[:6]
    return f"{base_username}_{unique_id}"



class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        
        extra_fields.setdefault('username', None)
        
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('username', f"admin_{uuid.uuid4().hex[:6]}")

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=False, blank=True, null=True)
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_user_set',
        blank=True,
        help_text='The groups this user belongs to.'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_user_set',
        blank=True,
        help_text='Specific permissions for this user.'
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = UserManager()

    def __str__(self):
        return self.email


class Category(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=100, blank=True, null=True) 
    color = models.CharField(max_length=20, blank=True, null=True) 
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name


class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='expenses')
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    SOURCE_CHOICES = (
        ('manual', 'Manual'),
        ('plaid', 'Plaid')
    )
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES, default='manual')
    
    class Meta:
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.title} - ${self.amount}"


class PlaidItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='plaid_items')
    item_id = models.CharField(max_length=255, unique=True)
    access_token = models.CharField(max_length=255)
    institution_id = models.CharField(max_length=100)
    institution_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='good')
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.institution_name}"

    class Meta:
        ordering = ['-created_at']

class PlaidAccount(models.Model):
    ACCOUNT_TYPES = (
        ('depository', 'Depository'),
        ('credit', 'Credit'),
        ('loan', 'Loan'),
        ('investment', 'Investment'),
        ('other', 'Other'),
    )
    
    plaid_item = models.ForeignKey(PlaidItem, on_delete=models.CASCADE, related_name='accounts')
    account_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    official_name = models.CharField(max_length=255, null=True, blank=True)
    mask = models.CharField(max_length=4, null=True, blank=True)
    type = models.CharField(max_length=50, choices=ACCOUNT_TYPES)
    subtype = models.CharField(max_length=50, null=True, blank=True)
    balance_available = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    balance_current = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    balance_limit = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} ({self.mask})"
    
    class Meta:
        unique_together = ('plaid_item', 'account_id')

class PlaidTransaction(models.Model):
    account = models.ForeignKey(PlaidAccount, on_delete=models.CASCADE, related_name='transactions')
    transaction_id = models.CharField(max_length=255, unique=True)
    expense = models.OneToOneField('Expense', on_delete=models.SET_NULL, null=True, blank=True, related_name='plaid_transaction')
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    date = models.DateField()
    name = models.CharField(max_length=255)
    merchant_name = models.CharField(max_length=255, null=True, blank=True)
    payment_channel = models.CharField(max_length=50)
    pending = models.BooleanField(default=False)
    category = models.CharField(max_length=255, null=True, blank=True)
    category_id = models.CharField(max_length=50, null=True, blank=True)
    location = models.JSONField(null=True, blank=True)
    payment_meta = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - ${self.amount}"
    
    class Meta:
        ordering = ['-date']


class Budget(models.Model):
    PERIOD_CHOICES = (
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets')
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'period')
        
    def __str__(self):
        return f"{self.user.email} - {self.get_period_display()} Budget: ${self.amount}"



class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('budget_exceed', 'Budget Exceeded'),
        ('budget_near', 'Budget Nearly Exceeded'),
        ('weekly_summary', 'Weekly Summary'),
        ('system', 'System Notification'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=100)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_data = models.JSONField(null=True, blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.email}"

class EmailVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_codes')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Verification code for {self.user.email}"
    
    @property
    def is_expired(self):
        return timezone.now() > self.expires_at