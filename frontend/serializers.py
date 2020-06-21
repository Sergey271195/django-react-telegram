from rest_framework import serializers
from headlineapi.models import TextMessageModel, TelegramBotModel, TelegramUserModel, BotUserJoint, BotTelegramUserJoint
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']

class TextMessageSerializer(serializers.ModelSerializer):

    telegram_user = serializers.StringRelatedField()
    telegram_bot = serializers.StringRelatedField()
    bot_name = serializers.CharField(source = 'telegram_bot.first_name')
    username = serializers.CharField(source = 'telegram_user.first_name')

    class Meta:
        model = TextMessageModel
        fields = ['message_id', 'is_bot', 'date', 'text', 'telegram_user', 'telegram_bot', 'bot_name', 'username']
        message_id = serializers.IntegerField()


class TelegramUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = TelegramUserModel
        fields = ['user_id', 'first_name', 'date_joined']


class TelegramBotSerializer(serializers.ModelSerializer):

    class Meta:
        model = TelegramBotModel
        fields = ['bot_id', 'first_name', 'date_created', 'username', 'token']


class BotUserJointSerializer(serializers.ModelSerializer):

    bot_owner = serializers.StringRelatedField()
    bot = serializers.StringRelatedField()
    bot_name = serializers.CharField(source = 'bot.username')

    class Meta:
        model = BotUserJoint
        fields = ['bot_owner', 'bot', 'bot_name']


class BotTelegramUserSerializer(serializers.ModelSerializer):

    bot_user = serializers.StringRelatedField()
    bot = serializers.StringRelatedField()
    username = serializers.CharField(source = 'bot_user.first_name')

    class Meta:
        model = BotTelegramUserJoint
        depth = 1
        fields = ['bot_user', 'bot', 'username']

