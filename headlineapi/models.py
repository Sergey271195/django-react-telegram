from django.db import models
from django.contrib import admin 
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class TelegramUserModel(models.Model):

    user_id = models.BigIntegerField(unique = True)
    first_name = models.CharField(max_length = 300, blank = True, null = True)
    date_joined = models.DateField(auto_now_add = True)

    def __str__(self):
        return f'{self.user_id}'


class TelegramBotModel(models.Model):

    bot_id = models.BigIntegerField(unique = True)
    first_name = models.CharField(max_length = 300, blank = True, null = True)
    username = models.CharField(max_length = 300, blank = True, null = True)
    token = models.CharField(max_length = 300, blank = True, null = True)
    date_created = models.DateField(auto_now_add = True)


    def __str__(self):
        return f'{self.bot_id}'


class TextMessageModel(models.Model):
    
    message_id = models.IntegerField()
    telegram_user = models.ForeignKey(TelegramUserModel, on_delete = models.CASCADE)
    telegram_bot = models.ForeignKey(TelegramBotModel, on_delete = models.CASCADE)
    is_bot = models.BooleanField()
    date = models.DateTimeField(auto_now_add = True)
    text = models.CharField(max_length = 5000, blank = True, null = True)

    def __str__(self):
        return f'{self.message_id} - {self.telegram_user} - {self.telegram_bot} - {self.is_bot}'

class BotUserJoint(models.Model):

    bot_owner = models.ForeignKey(User, on_delete = models.CASCADE)
    bot = models.ForeignKey(TelegramBotModel, on_delete = models.CASCADE)

    class Meta:
        unique_together = ['bot_owner', 'bot']

    def __str__(self):
        return f'{self.bot_owner}-{self.bot}'


class BotTelegramUserJoint(models.Model):
    bot_user = models.ForeignKey(TelegramUserModel, on_delete = models.CASCADE)
    bot = models.ForeignKey(TelegramBotModel, on_delete = models.CASCADE)

    class Meta:
        unique_together = ['bot_user', 'bot']

    def __str__(self):
        return f'{self.bot_user}-{self.bot}'

admin.site.register([TelegramUserModel, TelegramBotModel, TextMessageModel, BotUserJoint, BotTelegramUserJoint])