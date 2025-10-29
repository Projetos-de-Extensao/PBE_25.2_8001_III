from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Aluno, Professor, Coordenador, VagaMonitoria, Candidatura, Disciplina
# Register your models here.

# Usa o UserAdmin para o modelo customizado de usuário baseado em AbstractUser
admin.site.register(Usuario, UserAdmin)
admin.site.register(Aluno)
admin.site.register(Professor)
admin.site.register(Coordenador)
admin.site.register(VagaMonitoria)
admin.site.register(Candidatura)
admin.site.register(Disciplina)