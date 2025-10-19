from django.contrib import admin
from .models import Usuario, Aluno, Professor, Coordenador, VagaMonitoria, Candidatura
# Register your models here.

admin.site.register(Usuario)
admin.site.register(Aluno)
admin.site.register(Professor)
admin.site.register(Coordenador)
admin.site.register(VagaMonitoria)
admin.site.register(Candidatura)
