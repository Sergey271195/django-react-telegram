from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template.response import TemplateResponse
from django.views.decorators.csrf import csrf_exempt

from headlineapi.models import TelegramBotModel, TelegramUserModel, TextMessageModel
from customTg import TelegramBot, bot_command_decorator
from botManage import PostgresBot

import json
import asyncio
import websockets
import os


class AsyncioBotView():

    asyncbot_token = os.environ.get('ASYNC_TOKEN')
    tgBot = TelegramBot(asyncbot_token)

    @staticmethod
    @csrf_exempt
    def dispatch(request):
        if request.method == 'GET':
            response = AsyncioBotView.get(request)
            return response

        
        if request.method == 'POST':
            response = AsyncioBotView.post(request)
            return response

    @staticmethod
    def get(request):

        return (HttpResponse('<h2>Async Bot</h2>'))

    @staticmethod
    def post(request):
        print(request.headers)
        request_body = json.loads(request.body)
        db_message = PostgresBot(AsyncioBotView.asyncbot_token).save_message_to_db(request_body)
        print('User message\n', request_body)
        message = request_body.get('message')
        return HttpResponse(200)
