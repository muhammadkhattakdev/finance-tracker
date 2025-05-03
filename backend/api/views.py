from rest_framework import status, generics, permissions, viewsets, filters
import csv
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import *
from .models import *
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Sum
from rest_framework.pagination import PageNumberPagination
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 100


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
    filterset_fields = ['category', 'date', 'source']  
    search_fields = ['title', 'comment']
    ordering_fields = ['date', 'amount', 'title', 'created_at']
    pagination_class = StandardResultsSetPagination  
    
    def get_queryset(self):
        """
        This view returns a list of all expenses for the currently authenticated user.
        """
        return Expense.objects.filter(user=self.request.user)


    def perform_create(self, serializer):
        """
        Create a new expense and check for large expense notifications
        """
        expense = serializer.save(user=self.request.user)
        
        category_name = "Uncategorized"
        if expense.category:
            category_name = expense.category.name
        
        large_expense_threshold = 100.0
        
        if expense.amount >= large_expense_threshold:
            Notification.objects.create(
                user=self.request.user,
                type='system',
                title="Large Expense Added",
                message=f"You've added a large expense of ${expense.amount:.2f} in the {category_name} category.",
                related_data={
                    'expense_id': expense.id,
                    'amount': float(expense.amount),
                    'category': category_name,
                    'date': expense.date.strftime('%Y-%m-%d')
                }
            )
        
        try:
            from django.urls import reverse
            from rest_framework.test import APIRequestFactory
            
            factory = APIRequestFactory()
            request = factory.get(reverse('budget-summary'))
            request.user = self.request.user
            
            from .views import BudgetViewSet
            view = BudgetViewSet.as_view({'get': 'summary'})
            view(request)
        except Exception as e:
            print(f"Error checking budget limits: {str(e)}")

    @action(detail=False, methods=['get'])
    def export(self, request):
        """
        Export expenses as CSV based on filters
        """
        # Get query parameters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        category = request.query_params.get('category')
        source = request.query_params.get('source')
        search = request.query_params.get('search')
        
        if not start_date or not end_date:
            return Response(
                {"error": "Start date and end date are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get filtered queryset
        queryset = self.get_queryset().filter(date__gte=start_date, date__lte=end_date)
        
        # Apply additional filters if provided
        if category:
            queryset = queryset.filter(category=category)
        
        if source:
            queryset = queryset.filter(source=source)
        
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) | 
                models.Q(comment__icontains=search)
            )
        
        # Order by date
        queryset = queryset.order_by('date')
        
        # Create the HttpResponse with CSV content
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="expenses_{start_date}_to_{end_date}.csv"'
        
        # Create CSV writer
        writer = csv.writer(response)
        
        # Write header row
        writer.writerow([
            'ID', 'Title', 'Amount', 'Date', 'Category', 
            'Source', 'Comment', 'Created At'
        ])
        
        # Get category name dictionary for faster lookups
        categories = {
            cat.id: cat.name for cat in Category.objects.all()
        }
        
        # Write data rows
        for expense in queryset:
            category_name = categories.get(expense.category_id, 'Uncategorized') if expense.category_id else 'Uncategorized'
            writer.writerow([
                expense.id,
                expense.title,
                expense.amount,
                expense.date,
                category_name,
                expense.source,
                expense.comment,
                expense.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response





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
            user = request.user
            
            request_user = LinkTokenCreateRequestUser(
                client_user_id=str(user.id)
            )
            
            request_model = LinkTokenCreateRequest(
                user=request_user,
                client_name='Finance Tracker',
                products=[Products('transactions')],
                country_codes=[CountryCode('US')],
                language='en',
                webhook='https://yourwebsite.com/webhook'
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
            
            exchange_request = ItemPublicTokenExchangeRequest(
                public_token=public_token
            )
            exchange_response = plaid_client.item_public_token_exchange(exchange_request)
            access_token = exchange_response['access_token']
            item_id = exchange_response['item_id']
            
            plaid_item, created = PlaidItem.objects.update_or_create(
                user=request.user,
                institution_id=institution_id,
                defaults={
                    'access_token': access_token,
                    'item_id': item_id,
                    'institution_name': institution_name,
                }
            )
            
            accounts_request = AccountsGetRequest(access_token=access_token)
            accounts_response = plaid_client.accounts_get(accounts_request)
            
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
            request = TransactionsSyncRequest(
                access_token=plaid_item.access_token,
                cursor=None
            )
            
            response = plaid_client.transactions_sync(request)
            
            self.process_transactions(response['added'], plaid_item)
            
            # Store cursor for future syncs (in a real implementation)
            # plaid_item.cursor = response['next_cursor']
            # plaid_item.save()
            
        except Exception as e:
            print(f"Error syncing transactions: {str(e)}")
    
    def process_transactions(self, transactions, plaid_item):
        """Process and save transactions to the database"""
        default_category, _ = Category.objects.get_or_create(
            name="Uncategorized",
            defaults={"icon": "📋", "color": "#9E9E9E"}
        )
        
        for transaction in transactions:
            if transaction.get('pending', True):
                continue
            
            try:
                account = PlaidAccount.objects.get(
                    plaid_item=plaid_item,
                    account_id=transaction['account_id']
                )
                
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
            pass
            
        return Response({"success": True, "message": "Transactions synced successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




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
                access_token = item.access_token
                request_obj = TransactionsSyncRequest(
                    access_token=access_token,
                    cursor=""  # Use empty string instead of None
                )
                
                response = plaid_client.transactions_sync(request_obj)
                
                # Convert response to serializable format
                added_transactions = response['added']
                
                default_category, _ = Category.objects.get_or_create(
                    name="Uncategorized",
                    defaults={"icon": "📋", "color": "#9E9E9E"}
                )
                
                for transaction in added_transactions:
                    if transaction.get('pending', True):
                        continue
                    
                    try:
                        account = PlaidAccount.objects.get(
                            plaid_item=item,
                            account_id=transaction['account_id']
                        )
                        
                        # Safely handle location data
                        location_data = {}
                        if 'location' in transaction:
                            try:
                                # Try to convert to dict if it's an object
                                if hasattr(transaction['location'], 'to_dict'):
                                    location_data = transaction['location'].to_dict()
                                elif hasattr(transaction['location'], '__dict__'):
                                    location_data = transaction['location'].__dict__
                                else:
                                    # If it's already a simple type like dict, use it directly
                                    location_data = dict(transaction['location'])
                            except:
                                # If conversion fails, use empty dict
                                location_data = {}
                        
                        # Safely handle payment_meta data
                        payment_meta_data = {}
                        if 'payment_meta' in transaction:
                            try:
                                if hasattr(transaction['payment_meta'], 'to_dict'):
                                    payment_meta_data = transaction['payment_meta'].to_dict()
                                elif hasattr(transaction['payment_meta'], '__dict__'):
                                    payment_meta_data = transaction['payment_meta'].__dict__
                                else:
                                    payment_meta_data = dict(transaction['payment_meta'])
                            except:
                                payment_meta_data = {}
                        
                        category_data = transaction.get('category', [])
                        if not isinstance(category_data, list):
                            try:
                                category_data = list(category_data)
                            except:
                                category_data = []
                        
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
                                'category': category_data,
                                'category_id': transaction.get('category_id'),
                                'location': location_data,
                                'payment_meta': payment_meta_data
                            }
                        )
                        
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
                            
                            plaid_transaction.expense = expense
                            plaid_transaction.save()
                        
                    except PlaidAccount.DoesNotExist:
                        continue
            except Exception as e:
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
        
        user = request.user
        today = timezone.now().date()
        
        budgets = {
            'daily': None,
            'weekly': None,
            'monthly': None
        }
        
        for budget in self.get_queryset():
            budgets[budget.period] = float(budget.amount)
        
        start_of_day = timezone.make_aware(datetime.combine(today, datetime.min.time()))

        start_of_week = today - timedelta(days=today.weekday())
        start_of_week = timezone.make_aware(datetime.combine(start_of_week, datetime.min.time()))

        start_of_month = timezone.make_aware(datetime.combine(today.replace(day=1), datetime.min.time()))

        daily_spending = Expense.objects.filter(
            user=user, date=today
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        weekly_spending = Expense.objects.filter(
            user=user, date__gte=start_of_week.date(), date__lte=today
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        monthly_spending = Expense.objects.filter(
            user=user, date__gte=start_of_month.date(), date__lte=today
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        daily_percentage = (float(daily_spending) / budgets['daily'] * 100) if budgets['daily'] and budgets['daily'] > 0 else 0
        weekly_percentage = (float(weekly_spending) / budgets['weekly'] * 100) if budgets['weekly'] and budgets['weekly'] > 0 else 0
        monthly_percentage = (float(monthly_spending) / budgets['monthly'] * 100) if budgets['monthly'] and budgets['monthly'] > 0 else 0
        
        if budgets['daily'] and budgets['daily'] > 0:
            existing_notification = Notification.objects.filter(
                user=user,
                type__in=['budget_exceed', 'budget_near'],
                created_at__gte=start_of_day,
                related_data__budget_type='daily'
            ).exists()
            
            if not existing_notification and daily_percentage >= 50:
                create_budget_notification(
                    user=user,
                    budget_type='daily',
                    percentage=daily_percentage,
                    current_amount=float(daily_spending),
                    budget_limit=budgets['daily']
                )
        
        if budgets['weekly'] and budgets['weekly'] > 0:
            highest_threshold = None
            if weekly_percentage >= 100:
                highest_threshold = 100
            elif weekly_percentage >= 90:
                highest_threshold = 90
            elif weekly_percentage >= 75:
                highest_threshold = 75
            elif weekly_percentage >= 50:
                highest_threshold = 50
            
            if highest_threshold:
                existing_notification = Notification.objects.filter(
                    user=user,
                    type__in=['budget_exceed', 'budget_near'],
                    created_at__gte=start_of_week,
                    related_data__budget_type='weekly',
                    related_data__threshold=highest_threshold
                ).exists()
                
                if not existing_notification:
                    notification = create_budget_notification(
                        user=user,
                        budget_type='weekly',
                        percentage=weekly_percentage,
                        current_amount=float(weekly_spending),
                        budget_limit=budgets['weekly']
                    )
                    
                    if notification:
                        notification.related_data['threshold'] = highest_threshold
                        notification.save()
        
        if budgets['monthly'] and budgets['monthly'] > 0:
            highest_threshold = None
            if monthly_percentage >= 100:
                highest_threshold = 100
            elif monthly_percentage >= 90:
                highest_threshold = 90
            elif monthly_percentage >= 75:
                highest_threshold = 75
            elif monthly_percentage >= 50:
                highest_threshold = 50
            
            if highest_threshold:
                existing_notification = Notification.objects.filter(
                    user=user,
                    type__in=['budget_exceed', 'budget_near'],
                    created_at__gte=start_of_month,
                    related_data__budget_type='monthly',
                    related_data__threshold=highest_threshold
                ).exists()
                
                if not existing_notification:
                    notification = create_budget_notification(
                        user=user,
                        budget_type='monthly',
                        percentage=monthly_percentage,
                        current_amount=float(monthly_spending),
                        budget_limit=budgets['monthly']
                    )
                    
                    if notification:
                        notification.related_data['threshold'] = highest_threshold
                        notification.save()
        
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




@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def unlink_bank_endpoint(request, pk):
    """Unlink a bank connection"""
    try:
        item = PlaidItem.objects.get(id=pk, user=request.user)
        
        accounts = PlaidAccount.objects.filter(plaid_item=item)
        for account in accounts:
            PlaidTransaction.objects.filter(account=account).delete()
        accounts.delete()
        
        # Delete the item
        item.delete()
        
        return Response({"success": True, "message": "Bank account successfully disconnected"})
    except PlaidItem.DoesNotExist:
        return Response({"error": "Bank connection not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and managing user notifications
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Return notifications for the currently authenticated user
        """
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """
        Mark a notification as read
        """
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'success'})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """
        Mark all notifications as read
        """
        self.get_queryset().update(is_read=True)
        return Response({'status': 'success'})
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """
        Get count of unread notifications
        """
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'count': count})

def create_budget_notification(user, budget_type, percentage, current_amount, budget_limit):
    """
    Create a notification for budget limits
    
    Args:
        user: User object
        budget_type: 'daily', 'weekly', or 'monthly'
        percentage: Current percentage of budget used
        current_amount: Current amount spent
        budget_limit: Budget limit amount
    """
    formatted_amount = f"${current_amount:.2f}"
    formatted_limit = f"${budget_limit:.2f}"
    
    if percentage >= 100:
        notification_type = 'budget_exceed'
        title = f"Budget Alert: {budget_type.capitalize()} budget exceeded"
        message = (f"You've exceeded your {budget_type} budget of {formatted_limit}. "
                   f"Current spending: {formatted_amount} ({percentage:.1f}%).")
    elif percentage >= 90:
        notification_type = 'budget_near'
        title = f"Budget Alert: {budget_type.capitalize()} budget nearly reached"
        message = (f"You've used {percentage:.1f}% of your {budget_type} budget. "
                   f"Current spending: {formatted_amount} of {formatted_limit}.")
    elif percentage >= 75:
        # Warning (75%+)
        notification_type = 'budget_near'
        title = f"Budget Warning: {budget_type.capitalize()} budget at 75%"
        message = (f"You've used {percentage:.1f}% of your {budget_type} budget. "
                   f"Current spending: {formatted_amount} of {formatted_limit}.")
    elif percentage >= 50:
        notification_type = 'budget_near'
        title = f"Budget Update: Halfway through {budget_type} budget"
        message = (f"You've used {percentage:.1f}% of your {budget_type} budget. "
                   f"Current spending: {formatted_amount} of {formatted_limit}.")
    else:
        return None
    
    return Notification.objects.create(
        user=user,
        type=notification_type,
        title=title,
        message=message,
        related_data={
            'budget_type': budget_type,
            'percentage': percentage,
            'current_amount': current_amount,
            'budget_limit': budget_limit
        }
    )
