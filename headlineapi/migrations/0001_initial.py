# Generated by Django 3.0.7 on 2020-06-16 21:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='TelegramBotModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bot_id', models.BigIntegerField(unique=True)),
                ('first_name', models.CharField(blank=True, max_length=300, null=True)),
                ('username', models.CharField(blank=True, max_length=300, null=True)),
                ('token', models.CharField(blank=True, max_length=300, null=True)),
                ('date_created', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='TelegramUserModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.BigIntegerField(unique=True)),
                ('first_name', models.CharField(blank=True, max_length=300, null=True)),
                ('date_joined', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='TextMessageModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_bot', models.BooleanField()),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('text', models.CharField(blank=True, max_length=5000, null=True)),
                ('telegram_bot', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='headlineapi.TelegramBotModel')),
                ('telegram_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='headlineapi.TelegramUserModel')),
            ],
        ),
    ]
