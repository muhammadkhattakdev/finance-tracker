from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Category, Expense,
    PlaidItem, PlaidAccount, PlaidTransaction,
    Budget, Notification
)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('email',)
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password', 'username')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'is_active', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon', 'color')
    search_fields = ('name',)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'amount', 'date', 'category', 'source', 'created_at')
    list_filter = ('source', 'category', 'date')
    search_fields = ('title', 'user__email')
    ordering = ('-date',)

@admin.register(PlaidItem)
class PlaidItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'institution_name', 'status', 'created_at', 'last_updated')
    search_fields = ('user__email', 'institution_name')
    list_filter = ('status',)
    ordering = ('-created_at',)

@admin.register(PlaidAccount)
class PlaidAccountAdmin(admin.ModelAdmin):
    list_display = ('name', 'plaid_item', 'account_id', 'type', 'subtype', 'is_active')
    search_fields = ('name', 'account_id')
    list_filter = ('type', 'subtype', 'is_active')

@admin.register(PlaidTransaction)
class PlaidTransactionAdmin(admin.ModelAdmin):
    list_display = ('name', 'account', 'amount', 'date', 'pending')
    search_fields = ('name', 'merchant_name', 'account__name')
    list_filter = ('pending', 'payment_channel')
    ordering = ('-date',)

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('user', 'period', 'amount', 'created_at')
    search_fields = ('user__email',)
    list_filter = ('period',)
    ordering = ('-created_at',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'title', 'is_read', 'created_at')
    search_fields = ('title', 'user__email', 'message')
    list_filter = ('type', 'is_read')
    ordering = ('-created_at',)
