import requests
import os

asyncbot_token = os.environ.get('ASYNC_TOKEN')
testbot_token = os.environ.get('TEST_TOKEN')

bot_tokens = [asyncbot_token, testbot_token]
app_names = ['async/', 'test/']

class Webhook():

    def __init__(self, tokens):
        self.tokens = tokens
        self.bot_urls = [f'https://api.telegram.org/bot{token}' for token in self.tokens]
        self.set_urls = [os.path.join(bot_url, 'setWebhook') for bot_url in self.bot_urls]
        self.delete_urls = [os.path.join(bot_url, 'deleteWebhook') for bot_url in self.bot_urls]
        self.info_urls = [os.path.join(bot_url, 'getWebhookInfo') for bot_url in self.bot_urls]

    def set_webhooks(self):

        if os.environ.get('PRODUCTION') == 'True':
            send_to_url = 'https://telegram-bot-landing.herokuapp.com/'
        else:
            send_to_url = 'https://telegram-bot-landing.herokuapp.com/'

        for set_url in zip(self.set_urls, app_names):
            print(set_url)
            print(send_to_url)
            #request = requests.post(set_url[0], data = {'url': os.path.join(send_to_url, set_url[1])})

    def delete_webhooks(self):

        for delete_url in self.delete_urls:
            request = requests.post(delete_url)
            print(request)

if __name__ == "__main__":
    Webhook(bot_tokens).set_webhooks()