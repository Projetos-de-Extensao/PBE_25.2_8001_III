from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Criar router e registrar viewsets
router = DefaultRouter()
router.register(r'usuarios', views.UsuarioViewSet)
router.register(r'alunos', views.AlunoViewSet)
router.register(r'professores', views.ProfessorViewSet)
router.register(r'coordenadores', views.CoordenadorViewSet)
router.register(r'vagas', views.VagaMonitoriaViewSet)
router.register(r'candidaturas', views.CandidaturaViewSet)

urlpatterns = [
    path('', views.home, name='home'),
    path('api/auth/login/', views.api_login, name='api-login'),
    path('api/auth/cadastro/', views.api_cadastro, name='api-cadastro'),
    path('api/auth/logout/', views.api_logout, name='api-logout'),
    path('api/auth/me/', views.api_me, name='api-me'),
    path('api/', include(router.urls)),
]
