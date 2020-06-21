from customTg import TelegramBot
from headlineapi.models import TelegramBotModel, TelegramUserModel, TextMessageModel, BotTelegramUserJoint
from frontend.serializers import TextMessageSerializer

class PostgresBot():

    def __init__(self, token):
        self.token = token
        self.tgBot = TelegramBot(self.token)
        self.return_db_bot()

    def return_db_bot(self):
        bot_info = self.tgBot.getMe()
        status = bot_info.get('ok')
        if status:
            result = bot_info.get('result')
            bot_id = result.get('id')
            exists = TelegramBotModel.objects.all().filter(bot_id = bot_id).exists()
            if exists:
                self.db_bot = TelegramBotModel.objects.all().get(bot_id = bot_id)
                text_messages = TextMessageModel.objects.all().filter(telegram_bot = self.db_bot)
                return self.db_bot
            else:
                first_name = result.get('first_name')
                username = result.get('first_name')
                self.db_bot = TelegramBotModel(bot_id = bot_id, first_name = first_name, username = username, token = self.token)
                self.db_bot.save()
                return self.db_bot

    def return_db_user(self, request_body, user_id):
        exists = TelegramUserModel.objects.filter(user_id = user_id).exists()
        if not exists:
            new_user = TelegramUserModel(user_id = user_id, first_name = request_body['message']['from'].get('first_name'))
            new_user.save()
            bot_user_joint = BotTelegramUserJoint(bot_user = new_user, bot = self.db_bot)
            bot_user_joint.save()
            return new_user
        else:
            telegram_user = TelegramUserModel.objects.all().get(user_id = user_id)
            exists_joint = BotTelegramUserJoint.objects.filter(bot_user = telegram_user, bot = self.db_bot).exists()
            if exists_joint:
                return telegram_user
            else:
                bot_user_joint = BotTelegramUserJoint(bot_user = telegram_user, bot = self.db_bot)
                bot_user_joint.save()
                print(bot_user_joint)
                return telegram_user

    def save_message_to_db(self, request_body):
        message = request_body.get('message')
        result = request_body.get('result')
        status = request_body.get('ok')
        if message:
            telegram_user = self.return_db_user(request_body, message['from'].get('id'))    
            message_id = request_body['message'].get('message_id')
            text = request_body['message'].get('text')
            is_bot = False
        
        elif status:
            message_id = result.get('message_id')
            text = result.get('text')
            telegram_user = TelegramUserModel.objects.all().get(user_id = result['chat'].get('id'))
            is_bot = True

        if message or status:

            exists = TextMessageModel.objects.all().filter(telegram_bot = self.db_bot, message_id = message_id).exists()              
            if not exists:
                text_message = TextMessageModel(message_id = message_id, telegram_user = telegram_user, telegram_bot = self.db_bot, is_bot = is_bot, text = text)
                text_message.save()
                serialized_message = TextMessageSerializer(text_message)
                return serialized_message.data