from django.urls import path, re_path
from .views import FrontendMainView, DetailedBotView, DetailedBotUserView
from .apiviews import MessageApi, BotUsersApi, AdminBotList, LoginView, TelegramBotApi, TelegramListener
from django.views.generic.base import TemplateView
from django.views.decorators.cache import never_cache


urlpatterns= [

    #API urls

    path('api/login/', LoginView.post, name = 'login_api'),
    path('api/listener/<int:bot_id>/', TelegramListener.dispatch, name = 'listener'),
    path('api/user/<str:username>', AdminBotList.get, name = 'bot_list_api'),
    path('api/bot_info<int:token>/', TelegramBotApi.get, name = 'bot_info_api'),
    path('api/bot<int:token>/', BotUsersApi.get, name = 'bot_users_api'),
    path('api/bot<int:token>/<int:user_id>/', MessageApi.dispatch, name = 'bot_user_messages_api'),
    re_path('.*', never_cache(TemplateView.as_view(template_name = 'index.html'))),
]