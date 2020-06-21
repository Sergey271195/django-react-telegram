from django.urls import path
from .views import AsyncioBotView

urlpatterns = [
    path('', AsyncioBotView.dispatch, name = 'async')
]