from .serializers import TextMessageSerializer, TelegramBotSerializer, TelegramUserSerializer, BotUserJointSerializer, BotTelegramUserSerializer, UserSerializer
from headlineapi.models import TelegramBotModel, TelegramUserModel, TextMessageModel, BotUserJoint, BotTelegramUserJoint
from customTg import TelegramBot, bot_command_decorator, bot_message_decorator
from botManage import PostgresBot
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

import json

def token_decorator(function_to_decorate):
    def wrapper(request, *args, **kwargs):
        token = request.headers.get('Wwwcustomtoken')
        db_token = Token.objects.all().filter(key = token).first()
        if db_token != None:
            return function_to_decorate(request, *args, **kwargs)
        else:
            return JsonResponse({'status': 400})
        
    return wrapper

def get_user_from_token(token):
    db_token = Token.objects.all().filter(key = token).first()
    if db_token != None:
        user = db_token.user
        return user

class SignupView():

    @staticmethod
    @csrf_exempt
    def post(request):
        request_body = json.loads(request.body)
        serializer = UserSerializer(data = {'username': request_body.get('username'), 'email': request_body.get('email'), 'password': request_body.get('password')})
        if serializer.is_valid():
            new_user = User.objects.create_user(request_body.get('username'), request_body.get('email'), request_body.get('password'))
            token = Token.objects.get(user = new_user)
            userinfo = UserSerializer(new_user).data
            return JsonResponse({'status': 200, 'user_id': userinfo.get('id'), 'username': userinfo.get('username'), 'token': token.key})
        else:
            return JsonResponse({'status': 400, **serializer.errors})           


class TelegramBotApi():

    @staticmethod
    @token_decorator
    def get(request, token):
        queryset = TelegramBotModel.objects.all().filter(bot_id = token)
        serializer = TelegramBotSerializer(queryset, many = True)

        return JsonResponse(serializer.data, safe = False)


class LoginView():

    @staticmethod
    @csrf_exempt
    def post(request):
        if request.method == 'POST':
            data = json.loads(request.body)
            user = authenticate(username = data.get('username'), password = data.get('password'))
            print(user)
            serializer = UserSerializer(user)
            if user is not None:
                token = Token.objects.get(user = user)
                return JsonResponse({'status': 200, 'user_id': serializer.data.get('id'),  **serializer.data, 'token': token.key})
            else:
                return JsonResponse({'status': 400})

class MessageApi():

    @staticmethod
    @csrf_exempt
    @token_decorator
    def dispatch(request, token, user_id):
        if request.method == 'GET':
            return MessageApi.get(request, token, user_id)

        elif request.method == 'POST':
            return MessageApi.post(request, token, user_id)

    @staticmethod
    def get(request, token, user_id):
        queryset = TextMessageModel.objects.all().filter(telegram_bot__bot_id = token, telegram_user__user_id = user_id)
        serializer = TextMessageSerializer(queryset, many = True)

        return JsonResponse({'status': 200, 'data': serializer.data}, safe = False)

    @staticmethod
    def post(request, token, user_id):
        data = json.loads(request.body)
        message = data.get('message')
        bot_token = TelegramBotModel.objects.get(bot_id = token).token
        bot_message = TelegramBot(bot_token).sendMessage(user_id = user_id, text = message)
        PostgresBot(bot_token).save_message_to_db(bot_message)
        return JsonResponse({'status': 'ok'})


class BotUsersApi():

    @staticmethod
    @token_decorator
    def get(request, token):
        queryset = BotTelegramUserJoint.objects.all().filter(bot__bot_id = token)
        serializer = BotTelegramUserSerializer(queryset, many = True)

        return JsonResponse({'status': 200, 'data': serializer.data}, safe = False)


class AdminBotList():

    @staticmethod
    @token_decorator
    def get(request, username):
        username, user_id = username.split('_')
        queryset = BotUserJoint.objects.all().filter(bot_owner__username = username, bot_owner__id = user_id)
        serializer = BotUserJointSerializer(queryset, many = True)
        return JsonResponse({'status': 200, 'data': serializer.data}, safe = False)
