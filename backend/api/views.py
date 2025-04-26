from rest_framework import status, generics, permissions, viewsets, filters
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    UserSerializer,
    UserUpdateSerializer,
    CategorySerializer,
    ExpenseSerializer
)
from .models import Category, Expense


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():

            print(f"Registration validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = serializer.save()
            user_data = UserSerializer(user).data
            return Response(user_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Exception during user registration: {str(e)}")

            return Response(
                {"detail": "An error occurred during registration. Please try again."},
                status=status.HTTP_400_BAD_REQUEST
            )


class UserDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method == 'PUT' or self.request.method == 'PATCH':
            return UserUpdateSerializer
        return UserSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for viewing categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing expenses.
    """
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'date']
    search_fields = ['title', 'comment']
    ordering_fields = ['date', 'amount', 'title', 'created_at']
    
    def get_queryset(self):
        """
        This view returns a list of all expenses for the currently authenticated user.
        """

        return Expense.objects.filter(user=self.request.user)






# Add this to your existing views.py file

import os
import plaid
import datetime
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from rest_framework import status, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import PlaidItem, PlaidAccount, PlaidTransaction, Expense, Category
from .serializers import (
    PlaidItemSerializer, PlaidAccountSerializer, 
    PlaidLinkTokenSerializer, PlaidPublicTokenSerializer,
    PlaidTransactionSerializer
)

# Initialize Plaid client
configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox,
    api_key={
        'clientId': '680bc2592d01190023379e63',
        'secret': '623153ca55a3983283eccca6b410fd',
    }
)
api_client = plaid.ApiClient(configuration)
plaid_client = plaid_api.PlaidApi(api_client)

class CreateLinkTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            # Create a Link token for the given user
            user = request.user
            
            # Create a link_token using the client
            request_user = LinkTokenCreateRequestUser(
                client_user_id=str(user.id)
            )
            
            request_model = LinkTokenCreateRequest(
                user=request_user,
                client_name='Finance Tracker',
                products=[Products('transactions')],
                country_codes=[CountryCode('US')],
                language='en',
                webhook='https://yourwebsite.com/webhook'  # Optional, for real deployment
            )
            
            response = plaid_client.link_token_create(request_model)
            serializer = PlaidLinkTokenSerializer(data={'link_token': response['link_token']})
            
            if serializer.is_valid():
                return Response(serializer.validated_data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except plaid.ApiException as e:
            return Response(
                {"error": e.body},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ExchangePublicTokenView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            serializer = PlaidPublicTokenSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            public_token = serializer.validated_data.get('public_token')
            institution_id = serializer.validated_data.get('institution_id')
            institution_name = serializer.validated_data.get('institution_name')
            
            # Exchange public token for an access token
            exchange_request = ItemPublicTokenExchangeRequest(
                public_token=public_token
            )
            exchange_response = plaid_client.item_public_token_exchange(exchange_request)
            access_token = exchange_response['access_token']
            item_id = exchange_response['item_id']
            
            # Create or update PlaidItem
            plaid_item, created = PlaidItem.objects.update_or_create(
                user=request.user,
                institution_id=institution_id,
                defaults={
                    'access_token': access_token,
                    'item_id': item_id,
                    'institution_name': institution_name,
                }
            )
            
            # Fetch accounts
            accounts_request = AccountsGetRequest(access_token=access_token)
            accounts_response = plaid_client.accounts_get(accounts_request)
            
            # Save accounts to database
            for account_data in accounts_response['accounts']:
                balances = account_data['balances']
                
                PlaidAccount.objects.update_or_create(
                    plaid_item=plaid_item,
                    account_id=account_data['account_id'],
                    defaults={
                        'name': account_data['name'],
                        'official_name': account_data.get('official_name'),
                        'mask': account_data.get('mask'),
                        'type': account_data['type'],
                        'subtype': account_data.get('subtype'),
                        'balance_available': balances.get('available'),
                        'balance_current': balances.get('current'),
                        'balance_limit': balances.get('limit'),
                    }
                )
            
            # Initial transaction sync
            self.sync_transactions(plaid_item)
            
            return Response({
                'success': True,
                'message': 'Bank account successfully connected',
                'item_id': plaid_item.id
            })
            
        except plaid.ApiException as e:
            return Response(
                {"error": e.body},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def sync_transactions(self, plaid_item):
        """Sync transactions for a specific PlaidItem"""
        try:
            # Get all transactions for the item
            request = TransactionsSyncRequest(
                access_token=plaid_item.access_token,
                cursor=None  # For initial sync, cursor is None
            )
            
            response = plaid_client.transactions_sync(request)
            
            # Process added transactions
            self.process_transactions(response['added'], plaid_item)
            
            # Store cursor for future syncs (in a real implementation)
            # plaid_item.cursor = response['next_cursor']
            # plaid_item.save()
            
        except Exception as e:
            print(f"Error syncing transactions: {str(e)}")
    
    def process_transactions(self, transactions, plaid_item):
        """Process and save transactions to the database"""
        # Get or create a default category for Plaid transactions
        default_category, _ = Category.objects.get_or_create(
            name="Uncategorized",
            defaults={"icon": "📋", "color": "#9E9E9E"}
        )
        
        for transaction in transactions:
            # Skip pending transactions
            if transaction.get('pending', True):
                continue
            
            try:
                # Get account
                account = PlaidAccount.objects.get(
                    plaid_item=plaid_item,
                    account_id=transaction['account_id']
                )
                
                # Create or update transaction
                plaid_transaction, created = PlaidTransaction.objects.update_or_create(
                    transaction_id=transaction['transaction_id'],
                    defaults={
                        'account': account,
                        'amount': transaction['amount'],
                        'date': transaction['date'],
                        'name': transaction['name'],
                        'merchant_name': transaction.get('merchant_name'),
                        'payment_channel': transaction.get('payment_channel', ''),
                        'pending': transaction.get('pending', False),
                        'category': transaction.get('category', []),
                        'category_id': transaction.get('category_id'),
                        'location': transaction.get('location', {}),
                        'payment_meta': transaction.get('payment_meta', {})
                    }
                )
                
                # Create corresponding expense if this is a new transaction
                if created:
                    expense = Expense.objects.create(
                        user=plaid_item.user,
                        title=transaction['name'],
                        amount=abs(transaction['amount']),  # Plaid uses negative for expenses
                        date=transaction['date'],
                        category=default_category,
                        comment=f"Imported from {account.name}",
                        source='plaid'
                    )
                    
                    # Link expense to transaction
                    plaid_transaction.expense = expense
                    plaid_transaction.save()
                
            except PlaidAccount.DoesNotExist:
                print(f"Account not found: {transaction['account_id']}")
            except Exception as e:
                print(f"Error processing transaction: {str(e)}")

class PlaidItemViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PlaidItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PlaidItem.objects.filter(user=self.request.user)

class PlaidAccountViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PlaidAccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PlaidAccount.objects.filter(plaid_item__user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def sync_transactions_endpoint(request):
    """Manually trigger transaction sync for all connected accounts"""
    try:
        items = PlaidItem.objects.filter(user=request.user)
        print('Here are some items', items)
        if not items:
            return Response({"error": "No connected bank accounts found"}, status=status.HTTP_404_NOT_FOUND)
        
        for item in items:
            # Implementation similar to sync_transactions method in ExchangePublicTokenView
            pass
            
        return Response({"success": True, "message": "Transactions synced successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Add to your views.py file

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Budget, Expense
from .serializers import BudgetSerializer
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Sum
from django.db import transaction
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def sync_transactions_endpoint(request):
    """Manually trigger transaction sync for all connected accounts"""
    try:
        items = PlaidItem.objects.filter(user=request.user)
        if not items:
            return Response({"error": "No connected bank accounts found"}, status=status.HTTP_404_NOT_FOUND)
        
        for item in items:
            try:
                # Implementation of sync_transactions
                access_token = item.access_token
                request_obj = TransactionsSyncRequest(
                    access_token=access_token,
                    cursor=None  # For a fresh sync, you might want to implement cursor storage
                )
                
                response = plaid_client.transactions_sync(request_obj)
                
                # Process the added transactions (similar to ExchangePublicTokenView)
                added_transactions = response['added']
                default_category, _ = Category.objects.get_or_create(
                    name="Uncategorized",
                    defaults={"icon": "📋", "color": "#9E9E9E"}
                )
                
                for transaction in added_transactions:
                    # Skip pending transactions
                    if transaction.get('pending', True):
                        continue
                    
                    try:
                        # Get account
                        account = PlaidAccount.objects.get(
                            plaid_item=item,
                            account_id=transaction['account_id']
                        )
                        
                        # Create or update transaction
                        plaid_transaction, created = PlaidTransaction.objects.update_or_create(
                            transaction_id=transaction['transaction_id'],
                            defaults={
                                'account': account,
                                'amount': transaction['amount'],
                                'date': transaction['date'],
                                'name': transaction['name'],
                                'merchant_name': transaction.get('merchant_name'),
                                'payment_channel': transaction.get('payment_channel', ''),
                                'pending': transaction.get('pending', False),
                                'category': transaction.get('category', []),
                                'category_id': transaction.get('category_id'),
                                'location': transaction.get('location', {}),
                                'payment_meta': transaction.get('payment_meta', {})
                            }
                        )
                        
                        # Create corresponding expense if this is a new transaction
                        if created:
                            expense = Expense.objects.create(
                                user=item.user,
                                title=transaction['name'],
                                amount=abs(transaction['amount']),
                                date=transaction['date'],
                                category=default_category,
                                comment=f"Imported from {account.name}",
                                source='plaid'
                            )
                            
                            # Link expense to transaction
                            plaid_transaction.expense = expense
                            plaid_transaction.save()
                        
                    except PlaidAccount.DoesNotExist:
                        continue
            except Exception as e:
                # Log the error but continue with other items
                print(f"Error syncing transactions for item {item.id}: {str(e)}")
                continue
            
        return Response({"success": True, "message": "Transactions synced successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BudgetViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing user budgets
    """
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Return budgets for the currently authenticated user
        """
        return Budget.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """
        Create a new budget or update existing one
        """
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Get budget summary including current spending against budgets
        """
        from datetime import datetime, timedelta
        from django.utils import timezone
        from django.db.models import Sum
        
        user = request.user
        today = timezone.now().date()
        
        # Get budget limits
        budgets = {
            'daily': None,
            'weekly': None,
            'monthly': None
        }
        
        for budget in self.get_queryset():
            budgets[budget.period] = float(budget.amount)
        
        # Calculate periods
        start_of_day = timezone.make_aware(datetime.combine(today, datetime.min.time()))
        
        # Calculate start of week (Monday as the first day of the week)
        start_of_week = today - timedelta(days=today.weekday())
        start_of_week = timezone.make_aware(datetime.combine(start_of_week, datetime.min.time()))
        
        # Calculate start of month
        start_of_month = timezone.make_aware(datetime.combine(today.replace(day=1), datetime.min.time()))
        
        # Get spending for each period
        daily_spending = Expense.objects.filter(
            user=user, date=today
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        weekly_spending = Expense.objects.filter(
            user=user, date__gte=start_of_week.date(), date__lte=today
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        monthly_spending = Expense.objects.filter(
            user=user, date__gte=start_of_month.date(), date__lte=today
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Calculate percentages (avoid division by zero)
        daily_percentage = (float(daily_spending) / budgets['daily'] * 100) if budgets['daily'] and budgets['daily'] > 0 else 0
        weekly_percentage = (float(weekly_spending) / budgets['weekly'] * 100) if budgets['weekly'] and budgets['weekly'] > 0 else 0
        monthly_percentage = (float(monthly_spending) / budgets['monthly'] * 100) if budgets['monthly'] and budgets['monthly'] > 0 else 0
        
        # Prepare category breakdown for the current month
        category_breakdown = []
        
        category_totals = Expense.objects.filter(
            user=user, date__gte=start_of_month.date(), date__lte=today
        ).values('category').annotate(total=Sum('amount'))
        
        for item in category_totals:
            if item['category'] is not None:
                try:
                    category = Category.objects.get(id=item['category'])
                    category_breakdown.append({
                        'category_id': category.id,
                        'name': category.name,
                        'icon': category.icon,
                        'color': category.color,
                        'amount': float(item['total']),
                        'percentage': float(item['total']) / float(monthly_spending) * 100 if monthly_spending and monthly_spending > 0 else 0
                    })
                except Category.DoesNotExist:
                    pass
        
        return Response({
            'budgets': {
                'daily': budgets['daily'],
                'weekly': budgets['weekly'],
                'monthly': budgets['monthly']
            },
            'spending': {
                'daily': float(daily_spending),
                'weekly': float(weekly_spending),
                'monthly': float(monthly_spending)
            },
            'percentages': {
                'daily': daily_percentage,
                'weekly': weekly_percentage,
                'monthly': monthly_percentage
            },
            'category_breakdown': category_breakdown
        })
        
    @action(detail=False, methods=['post'])
    def set_budgets(self, request):
        """
        Set all budget periods at once
        """
        from django.db import transaction
        
        data = request.data
        user = request.user
        
        required_periods = ['daily', 'weekly', 'monthly']
        for period in required_periods:
            if period not in data:
                return Response(
                    {f"{period}": ["This field is required."]},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        with transaction.atomic():
            for period in required_periods:
                amount = data.get(period)
                try:
                    amount = float(amount)
                    if amount <= 0:
                        return Response(
                            {period: ["Budget amount must be greater than zero."]},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except (ValueError, TypeError):
                    return Response(
                        {period: ["Must be a valid number."]},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                budget, created = Budget.objects.update_or_create(
                    user=user,
                    period=period,
                    defaults={'amount': amount}
                )
        
        return Response({
            'message': 'All budgets updated successfully',
            'budgets': {
                'daily': float(data.get('daily')),
                'weekly': float(data.get('weekly')),
                'monthly': float(data.get('monthly'))
            }
        })