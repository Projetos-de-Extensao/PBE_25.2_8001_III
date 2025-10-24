from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Usuario, Aluno, Professor, Coordenador, VagaMonitoria, Candidatura
from .serializers import (
    UsuarioSerializer, AlunoSerializer, ProfessorSerializer,
    CoordenadorSerializer, VagaMonitoriaSerializer, CandidaturaSerializer
)


def home(request):
    """
    Serve o frontend React como SPA
    """
    return render(request, 'index.html')


@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    """
    Endpoint de login
    POST: { "email": "user@email.com", "senha": "senha123" }
    """
    email = request.data.get('email')
    senha = request.data.get('senha')
    
    if not email or not senha:
        return Response(
            {'erro': 'Email e senha são obrigatórios'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        usuario = Usuario.objects.get(email=email, senha=senha)
        
        # Verificar tipo de usuário
        tipo_usuario = None
        user_data = {'id': usuario.id, 'nome': usuario.nome, 'email': usuario.email}
        
        if hasattr(usuario, 'aluno'):
            tipo_usuario = 'aluno'
            user_data['perfil'] = AlunoSerializer(usuario.aluno).data
        elif hasattr(usuario, 'professor'):
            tipo_usuario = 'professor'
            user_data['perfil'] = ProfessorSerializer(usuario.professor).data
        elif hasattr(usuario, 'coordenador'):
            tipo_usuario = 'coordenador'
            user_data['perfil'] = CoordenadorSerializer(usuario.coordenador).data
        
        return Response({
            'sucesso': True,
            'tipo_usuario': tipo_usuario,
            'usuario': user_data
        })
    except Usuario.DoesNotExist:
        return Response(
            {'erro': 'Credenciais inválidas'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def api_cadastro(request):
    """
    Endpoint de cadastro
    POST: { "nome": "Nome", "email": "email@example.com", "senha": "senha123", 
            "tipo_usuario": "aluno", "matricula": "2025001", "curso": "Eng. Software" }
    """
    nome = request.data.get('nome')
    email = request.data.get('email')
    senha = request.data.get('senha')
    tipo_usuario = request.data.get('tipo_usuario', 'aluno')
    
    if not all([nome, email, senha]):
        return Response(
            {'erro': 'Nome, email e senha são obrigatórios'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar se email já existe
    if Usuario.objects.filter(email=email).exists():
        return Response(
            {'erro': 'Email já cadastrado'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Criar usuário
    usuario = Usuario.objects.create(nome=nome, email=email, senha=senha)
    
    # Criar perfil baseado no tipo
    if tipo_usuario == 'aluno':
        matricula = request.data.get('matricula')
        curso = request.data.get('curso', '')
        
        if not matricula:
            usuario.delete()
            return Response(
                {'erro': 'Matrícula é obrigatória para alunos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        Aluno.objects.create(
            usuario=usuario,
            matricula=matricula,
            curso=curso,
            historico_academico=''
        )
    elif tipo_usuario == 'professor':
        departamento = request.data.get('departamento', '')
        disciplinas = request.data.get('disciplinas', '')
        
        Professor.objects.create(
            usuario=usuario,
            departamento=departamento,
            disciplinas=disciplinas
        )
    elif tipo_usuario == 'coordenador':
        departamento = request.data.get('departamento', '')
        
        Coordenador.objects.create(
            usuario=usuario,
            departamento=departamento
        )
    
    return Response({
        'sucesso': True,
        'mensagem': 'Usuário cadastrado com sucesso',
        'usuario': UsuarioSerializer(usuario).data
    }, status=status.HTTP_201_CREATED)



class UsuarioViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gerenciar usuários.
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class AlunoViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gerenciar alunos.
    """
    queryset = Aluno.objects.all().select_related('usuario')
    serializer_class = AlunoSerializer
    
    @action(detail=False, methods=['get'])
    def por_curso(self, request):
        """Filtra alunos por curso"""
        curso = request.query_params.get('curso', None)
        if curso:
            alunos = self.queryset.filter(curso__icontains=curso)
            serializer = self.get_serializer(alunos, many=True)
            return Response(serializer.data)
        return Response({'erro': 'Parâmetro curso é obrigatório'}, status=400)


class ProfessorViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gerenciar professores.
    """
    queryset = Professor.objects.all().select_related('usuario')
    serializer_class = ProfessorSerializer


class CoordenadorViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gerenciar coordenadores.
    """
    queryset = Coordenador.objects.all().select_related('usuario')
    serializer_class = CoordenadorSerializer


class VagaMonitoriaViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gerenciar vagas de monitoria.
    """
    queryset = VagaMonitoria.objects.all().select_related('professor__usuario')
    serializer_class = VagaMonitoriaSerializer
    
    @action(detail=True, methods=['post'])
    def abrir(self, request, pk=None):
        """Abre uma vaga de monitoria"""
        vaga = self.get_object()
        vaga.criar_vaga()
        return Response({'status': 'Vaga aberta com sucesso'})
    
    @action(detail=False, methods=['get'])
    def abertas(self, request):
        """Lista apenas vagas abertas"""
        vagas_abertas = self.queryset.filter(status='Aberta')
        serializer = self.get_serializer(vagas_abertas, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_disciplina(self, request):
        """Filtra vagas por disciplina"""
        disciplina = request.query_params.get('disciplina', None)
        if disciplina:
            vagas = self.queryset.filter(disciplina__icontains=disciplina)
            serializer = self.get_serializer(vagas, many=True)
            return Response(serializer.data)
        return Response({'erro': 'Parâmetro disciplina é obrigatório'}, status=400)


class CandidaturaViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gerenciar candidaturas.
    """
    queryset = Candidatura.objects.all().select_related('aluno__usuario', 'vaga__professor__usuario')
    serializer_class = CandidaturaSerializer
    
    @action(detail=False, methods=['get'])
    def por_aluno(self, request):
        """Lista candidaturas de um aluno específico"""
        aluno_id = request.query_params.get('aluno_id', None)
        if aluno_id:
            candidaturas = self.queryset.filter(aluno_id=aluno_id)
            serializer = self.get_serializer(candidaturas, many=True)
            return Response(serializer.data)
        return Response({'erro': 'Parâmetro aluno_id é obrigatório'}, status=400)
    
    @action(detail=False, methods=['get'])
    def por_vaga(self, request):
        """Lista candidaturas de uma vaga específica"""
        vaga_id = request.query_params.get('vaga_id', None)
        if vaga_id:
            candidaturas = self.queryset.filter(vaga_id=vaga_id)
            serializer = self.get_serializer(candidaturas, many=True)
            return Response(serializer.data)
        return Response({'erro': 'Parâmetro vaga_id é obrigatório'}, status=400)
    

