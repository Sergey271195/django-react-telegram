from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.template.response import TemplateResponse
from django.shortcuts import redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth import logout, login

@csrf_exempt
def login_view(request):

    if request.method == 'GET':
        print(request.user)
        return TemplateResponse(request, '_login.html', {})

    if request.method == 'POST':
        user = authenticate(username = request.POST.get('username'), password =request.POST.get('password'))
        print(user)
        if user is not None:
            login(request, user)
            return redirect('main')
        else:
            return redirect('login')

def logout_view(request):

    logout(request)
    return redirect('login')


