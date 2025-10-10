from django.contrib import admin

from .models import Produto, Categoria, Pedido, ProdutoDetalhado

# Register your models here.
admin.site.register(Produto)
admin.site.register(Categoria)
admin.site.register(Pedido)
admin.site.register(ProdutoDetalhado)
