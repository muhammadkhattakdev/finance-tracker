from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *




User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Skip password validation during login - this only authenticates
        data = super().validate(attrs)
        user_serializer = UserSerializer(self.user)
        data.update(user_serializer.data)
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    firstName = serializers.CharField(source='first_name', required=True)
    lastName = serializers.CharField(source='last_name', required=True)

    class Meta:
        model = User
        fields = ['email', 'firstName', 'lastName', 'password', 'confirm_password']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        
        # Generate a unique username
        username = generate_unique_username(first_name, last_name)
        
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name
        )
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'color']


class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    
    class Meta:
        model = Expense
        fields = [
            'id', 'title', 'amount', 'date', 'category', 'comment',
            'created_at', 'updated_at', 'category_name', 'category_icon', 
            'category_color', 'source'  # Added 'source' here
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)




class PlaidAccountSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = PlaidAccount
        fields = [
            'id', 'account_id', 'name', 'official_name', 'mask', 
            'type', 'type_display', 'subtype', 'balance_available', 
            'balance_current', 'balance_limit', 'is_active'
        ]
        read_only_fields = ['id', 'account_id']

class PlaidItemSerializer(serializers.ModelSerializer):
    accounts = PlaidAccountSerializer(many=True, read_only=True)
    
    class Meta:
        model = PlaidItem
        fields = [
            'id', 'item_id', 'institution_id', 'institution_name',
            'status', 'last_updated', 'created_at', 'accounts'
        ]
        read_only_fields = ['id', 'item_id', 'institution_id', 'institution_name']

class PlaidLinkTokenSerializer(serializers.Serializer):
    link_token = serializers.CharField()

class PlaidPublicTokenSerializer(serializers.Serializer):
    public_token = serializers.CharField()
    institution_id = serializers.CharField()
    institution_name = serializers.CharField()
    accounts = serializers.ListField(child=serializers.JSONField(), required=False)

class PlaidTransactionSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source='account.name', read_only=True)
    
    class Meta:
        model = PlaidTransaction
        fields = [
            'id', 'transaction_id', 'account', 'account_name', 'amount', 
            'date', 'name', 'merchant_name', 'payment_channel', 
            'pending', 'category', 'category_id', 'location',
            'payment_meta', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'transaction_id']



class BudgetSerializer(serializers.ModelSerializer):
    period_display = serializers.CharField(source='get_period_display', read_only=True)
    
    class Meta:
        model = Budget
        fields = ['id', 'period', 'period_display', 'amount', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        # Ensure amount is positive
        if attrs.get('amount', 0) <= 0:
            raise serializers.ValidationError({'amount': 'Budget amount must be greater than zero.'})
        return attrs
    


# Add to serializers.py

class NotificationSerializer(serializers.ModelSerializer):
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = ['id', 'type', 'title', 'message', 'is_read', 'related_data', 
                  'created_at', 'time_ago']
        read_only_fields = ['id', 'created_at', 'time_ago']
    
    def get_time_ago(self, obj):
        """Return a human-readable time difference from now"""
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff < timedelta(minutes=1):
            return 'just now'
        elif diff < timedelta(hours=1):
            minutes = int(diff.total_seconds() / 60)
            return f'{minutes} minute{"s" if minutes != 1 else ""} ago'
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f'{hours} hour{"s" if hours != 1 else ""} ago'
        elif diff < timedelta(days=30):
            days = diff.days
            return f'{days} day{"s" if days != 1 else ""} ago'
        else:
            return obj.created_at.strftime('%b %d, %Y')


