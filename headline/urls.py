from django.contrib import admin
from django.urls import path, include
from .webhooks import Webhook
import os

asyncbot_token = os.environ.get('ASYNC_TOKEN')
testbot_token = os.environ.get('TEST_TOKEN')

bot_tokens = [asyncbot_token, testbot_token]

#Webhook(bot_tokens).set_webhooks()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('test/', include('headlineapi.urls')),
    path('async/', include('asynciobot.urls')),
    path('', include('frontend.urls')),
]
