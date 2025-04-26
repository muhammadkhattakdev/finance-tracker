from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    UserDetailView,
    CategoryViewSet,
    ExpenseViewSet,
    # New Plaid views
    CreateLinkTokenView,
    ExchangePublicTokenView,
    PlaidItemViewSet,
    PlaidAccountViewSet,
    sync_transactions_endpoint
)

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'expenses', ExpenseViewSet, basename='expense')
# Add Plaid ViewSets to the router
router.register(r'plaid/items', PlaidItemViewSet, basename='plaid-item')
router.register(r'plaid/accounts', PlaidAccountViewSet, basename='plaid-account')

urlpatterns = [
    # Auth endpoints
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/user/', UserDetailView.as_view(), name='user_detail'),
    
    # Plaid endpoints
    path('plaid/create_link_token/', CreateLinkTokenView.as_view(), name='create-link-token'),
    path('plaid/exchange_public_token/', ExchangePublicTokenView.as_view(), name='exchange-public-token'),
    path('plaid/sync_transactions/', sync_transactions_endpoint, name='sync-transactions'),
    
    # Include router URLs
    path('', include(router.urls)),
]