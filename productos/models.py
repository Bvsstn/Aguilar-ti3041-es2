from django.db import models
from django.utils import timezone

# Create your models here.
class Categoria(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    nombre = models.CharField(max_length=255)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    creado_en = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.nombre