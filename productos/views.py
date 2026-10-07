from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def index(reques):
    return HttpResponse("Hola mundo")
