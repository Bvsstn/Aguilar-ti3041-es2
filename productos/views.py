from django.shortcuts import render
from .models import Producto

def index(request):
    productos = Producto.objects.select_related('categoria').order_by('nombre')
    return render(request, 'productos/index.html', {'productos': productos})
