from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template.response import TemplateResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.utils import timezone

from headlineapi.models import TelegramBotModel, TelegramUserModel, TextMessageModel, BotUserJoint
from customTg import TelegramBot, bot_command_decorator, bot_message_decorator
from botManage import PostgresBot


import json
import asyncio
import websockets
import datetime

from django.shortcuts import render


def index(request):
    return render(request, 'frontend/index.html')

class DetailedBotUserView():
    
    def __init__(self):
        pass

    @method_decorator(login_required)
    def dispatch(self, request, token, user_id):
        user = request.user
        if request.method == 'GET':
            response = self.get(request, token, user_id)
            return response

        
        if request.method == 'POST':
            response = self.post(request, token, user_id)
            return response

    def get(self, request, token, user_id):
        telegram_user = TelegramUserModel.objects.all().filter(user_id = user_id)
        bot = TelegramBotModel.objects.all().filter(bot_id = token)
        if bot.exists() and telegram_user.exists():
            request_bot = bot[0]
            request_user = telegram_user[0]
            text_messages = TextMessageModel.objects.all().filter(telegram_bot = request_bot, telegram_user = request_user).order_by('-message_id')
            return TemplateResponse(request, '_detailed_user_view.html', {'messages': text_messages})
        else:
            return redirect('headline')

    def post(self, request, token, user_id):
        bot_token  = TelegramBotModel.objects.all().filter(bot_id = token)[0].token
        message = request.POST.get('message')
        if message:
            pass
            bot_message = TelegramBot(bot_token).sendMessage(user_id= user_id, text = message)
            PostgresBot(bot_token).save_message_to_db(bot_message)
        return self.get(request, token, user_id)


class DetailedBotView():

    def __init__(self):
        pass

    @method_decorator(login_required)
    def dispatch(self, request, token):
        user = request.user
        if request.method == 'GET':
            response = self.get(request, token)
            return response

        
        if request.method == 'POST':
            response = self.post(request, token)
            return response

    def get_statisics(self, token, users, text_messages):
        all_messages = len(text_messages)
        all_users = len(users)
        today_messages = len(text_messages.filter(date__gte = datetime.datetime(datetime.datetime.today().year, datetime.datetime.today().month, datetime.datetime.today().day)))
        return {'number_of_messages': all_messages, 'number_of_users': all_users, 'today_messages': today_messages}

    def get(self, request, token):
        user = request.user
        bot = TelegramBotModel.objects.all().filter(bot_id = token).exists()
        if bot:
            text_messages = TextMessageModel.objects.all().filter(telegram_bot__bot_id = token)
            users = set(message.telegram_user for message in text_messages)
            statistics = self.get_statisics(token, users, text_messages)
            return TemplateResponse(request, '_detail_view.html', {'users': users, 'bot_token': token, 'statistics': statistics})
        else:
            return redirect('headline')

    def post(self, request, token):

        text_messages = TextMessageModel.objects.all().filter(telegram_bot__bot_id = token)
        users = set(message.telegram_user for message in text_messages)
        bot_token  = TelegramBotModel.objects.all().get(bot_id = token).token
        message = request.POST.get('message')
        if message:
            for user in users:
                bot_message = TelegramBot(bot_token).sendMessage(user_id= user.user_id, text = message)
                PostgresBot(bot_token).save_message_to_db(bot_message)

        return self.get(request, token)



class FrontendMainView():

    def __init__(self):
        pass

   
    @csrf_exempt
    def dispatch(self, request):
        if request.method == 'GET':
            response = self.get(request)
            return response
 
        if request.method == 'POST':
            response = self.post(request)
            return response

    def get(self, request):
        user = request.user
        if user.is_authenticated:
            bot_list = list(joint.bot for joint in BotUserJoint.objects.all().filter(bot_owner = user))
            return (render(request, '_main.html', {'bot_list': bot_list}))
        else:
            return redirect('login')

    def post(self, request):
        
        return self.get(request)