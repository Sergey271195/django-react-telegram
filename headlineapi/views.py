from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template.response import TemplateResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator


from headlineapi.models import TelegramBotModel, TelegramUserModel, TextMessageModel, BotUserJoint
from customTg import TelegramBot, bot_command_decorator, bot_message_decorator
from botManage import PostgresBot


import json
import asyncio
import websockets
import datetime
import os


class HeadlineApiView():

    testbot_token = os.environ.get('TEST_TOKEN')
    tgBot = TelegramBot(testbot_token)

    @staticmethod
    @csrf_exempt
    def dispatch(request):
        if request.method == 'GET':
            
            return HeadlineApiView.get(request)

        
        if request.method == 'POST':

            return HeadlineApiView.post(request)
    @staticmethod
    def get(request):

        return (HttpResponse('<h2>Test Bot</h2>'))

    @staticmethod
    def post(request):
        request_body = json.loads(request.body)
        print('User message\n', request_body)
        PostgresBot(HeadlineApiView.testbot_token).save_message_to_db(request_body)
        message = request_body.get('message')
        return HttpResponse(200)