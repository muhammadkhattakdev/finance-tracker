# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the user from the scope
        self.user = self.scope["user"]
        
        if not self.user.is_authenticated:
            # Reject connection if user isn't authenticated
            await self.close()
            return
        
        # Create a user-specific group
        self.group_name = f"user_{self.user.id}"
        
        # Join the group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        # Accept the connection
        await self.accept()
        
        # Send a connection confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to notification service'
        }))
    
    async def disconnect(self, close_code):
        # Leave the group when disconnecting
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        # Handle incoming messages (like acknowledgments)
        data = json.loads(text_data)
        message_type = data.get('type', '')
        
        if message_type == 'mark_as_read':
            # Handle marking notifications as read (if needed)
            notification_id = data.get('notification_id')
            if notification_id:
                success = await self.mark_notification_as_read(notification_id)
                await self.send(text_data=json.dumps({
                    'type': 'notification_marked_read',
                    'notification_id': notification_id,
                    'success': success
                }))
    
    async def notification_message(self, event):
        """
        Handler for notification messages sent to the group
        """
        # Send notification to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification': event['message']['notification']
        }))
    
    @database_sync_to_async
    def mark_notification_as_read(self, notification_id):
        """
        Mark a notification as read
        """
        from .models import Notification
        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=self.user
            )
            notification.is_read = True
            notification.save()
            return True
        except Notification.DoesNotExist:
            return False