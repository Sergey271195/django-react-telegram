from django.urls import path, re_path
from .views import HeadlineApiView


urlpatterns= [
    path('', HeadlineApiView.dispatch, name = 'headline'),

]
