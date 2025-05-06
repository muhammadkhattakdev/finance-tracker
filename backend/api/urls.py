from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import * 


router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'plaid/items', PlaidItemViewSet, basename='plaid-item')
router.register(r'plaid/accounts', PlaidAccountViewSet, basename='plaid-account')
router.register(r'budgets', BudgetViewSet, basename='budget')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    
    # Auth endpoints
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/user/', UserDetailView.as_view(), name='user_detail'),
    path('auth/verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('auth/resend-verification/', ResendVerificationView.as_view(), name='resend-verification'),
    
    # Plaid endpoints
    path('plaid/create_link_token/', CreateLinkTokenView.as_view(), name='create-link-token'),
    path('plaid/exchange_public_token/', ExchangePublicTokenView.as_view(), name='exchange-public-token'),
    path('plaid/sync_transactions/', sync_transactions_endpoint, name='sync-transactions'),
    path('plaid/items/<int:pk>/unlink/', unlink_bank_endpoint, name='unlink-bank'),

    # Include router URLs
    path('', include(router.urls)),
]