from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout, get_user_model
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
    
    user = authenticate(request, username=email, password=senha)
    if not user:
        return Response({'erro': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

    login(request, user)

    # Verificar tipo de usuário
    tipo_usuario = None
    user_data = {'id': user.id, 'nome': user.nome, 'email': user.email}

    if hasattr(user, 'aluno'):
        tipo_usuario = 'aluno'
        user_data['perfil'] = AlunoSerializer(user.aluno).data
    elif hasattr(user, 'professor'):
        tipo_usuario = 'professor'
        user_data['perfil'] = ProfessorSerializer(user.professor).data
    elif hasattr(user, 'coordenador'):
        tipo_usuario = 'coordenador'
        user_data['perfil'] = CoordenadorSerializer(user.coordenador).data

    return Response({
        'sucesso': True,
        'tipo_usuario': tipo_usuario,
        'usuario': user_data
    })


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
    tipo_usuario = request.data.get('tipo_usuario', 'aluno').lower()
    
    if not all([email, senha, nome]):
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
    
    # Criar usuário (username = email para login por email)
    User = get_user_model()
    usuario = User.objects.create_user(
        username=email,
        email=email,
        password=senha,
        first_name=nome or ''
    )
    
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
            curso=curso
        )
    elif tipo_usuario == 'professor':
        departamento = request.data.get('departamento', '')
        
        Professor.objects.create(
            usuario=usuario,
            departamento=departamento
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
        'tipo_usuario': tipo_usuario,
        'usuario': {'id': usuario.id, 'nome': usuario.nome, 'email': usuario.email}
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_me(request):
    """
    Retorna dados do usuário autenticado
    """
    user = request.user
    tipo_usuario = None
    perfil_data = None

    if hasattr(user, 'aluno'):
        tipo_usuario = 'aluno'
        perfil_data = AlunoSerializer(user.aluno).data
    elif hasattr(user, 'professor'):
        tipo_usuario = 'professor'
        perfil_data = ProfessorSerializer(user.professor).data
    elif hasattr(user, 'coordenador'):
        tipo_usuario = 'coordenador'
        perfil_data = CoordenadorSerializer(user.coordenador).data

    return Response({
        'id': user.id,
        'nome': user.nome,
        'email': user.email,
        'tipo_usuario': tipo_usuario,
        'perfil': perfil_data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_logout(request):
    """
    Endpoint de logout
    """
    logout(request)
    return Response({'sucesso': True, 'mensagem': 'Logout realizado com sucesso'})



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
    queryset = VagaMonitoria.objects.all().select_related('professor__usuario', 'disciplina__curso')
    serializer_class = VagaMonitoriaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtra vagas baseado no tipo de usuário:
        - Aluno: apenas vagas abertas do seu curso
        - Professor: vagas das suas disciplinas
        - Coordenador: todas as vagas
        """
        user = self.request.user
        queryset = self.queryset
        
        if hasattr(user, 'aluno'):
            # Aluno vê apenas vagas abertas do seu curso
            aluno = user.aluno
            queryset = queryset.filter(
                status='Aberta',
                disciplina__curso__nome__icontains=aluno.curso
            )
        elif hasattr(user, 'professor'):
            # Professor vê vagas das suas disciplinas
            professor = user.professor
            queryset = queryset.filter(professor=professor)
        
        # Coordenador vê tudo (sem filtro adicional)
        
        # Aplicar filtros da query string
        nome = self.request.query_params.get('nome')
        periodo = self.request.query_params.get('periodo')
        tipo = self.request.query_params.get('tipo')
        
        if nome:
            queryset = queryset.filter(disciplina__nome__icontains=nome)
        if periodo:
            queryset = queryset.filter(disciplina__periodo__icontains=periodo)
        if tipo:
            queryset = queryset.filter(tipo__iexact=tipo)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def abrir(self, request, pk=None):
        """Abre uma vaga de monitoria"""
        vaga = self.get_object()
        vaga.criar_vaga()
        return Response({'status': 'Vaga aberta com sucesso'})
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def candidaturas(self, request, pk=None):
        """Lista candidaturas de uma vaga específica"""
        vaga = self.get_object()
        candidaturas = Candidatura.objects.filter(vaga=vaga).select_related('aluno__usuario')
        serializer = CandidaturaSerializer(candidaturas, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def abertas(self, request):
        """Lista apenas vagas abertas"""
        vagas_abertas = self.queryset.filter(status='Aberta')
        serializer = self.get_serializer(vagas_abertas, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def por_disciplina(self, request):
        """Filtra vagas por disciplina (por id ou por nome)"""
        disciplina = request.query_params.get('disciplina')
        if not disciplina:
            return Response({'erro': 'Parâmetro disciplina é obrigatório'}, status=400)

        if disciplina.isdigit():
            vagas = self.queryset.filter(disciplina_id=int(disciplina))
        else:
            vagas = self.queryset.filter(disciplina__nome__icontains=disciplina)

        serializer = self.get_serializer(vagas, many=True)
        return Response(serializer.data)


class CandidaturaViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gerenciar candidaturas.
    """
    queryset = Candidatura.objects.all().select_related('aluno__usuario', 'vaga__disciplina', 'vaga__professor__usuario')
    serializer_class = CandidaturaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtra candidaturas baseado no tipo de usuário:
        - Aluno: apenas suas candidaturas
        - Professor: candidaturas das vagas que ele criou
        - Coordenador: todas
        """
        user = self.request.user
        queryset = self.queryset
        
        if hasattr(user, 'aluno'):
            queryset = queryset.filter(aluno=user.aluno)
        elif hasattr(user, 'professor'):
            queryset = queryset.filter(vaga__professor=user.professor)
        
        return queryset
    
    def perform_create(self, serializer):
        """
        Ao criar candidatura, associa automaticamente ao aluno logado
        """
        user = self.request.user
        if hasattr(user, 'aluno'):
            serializer.save(aluno=user.aluno)
        else:
            serializer.save()
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def marcar_entrevista(self, request, pk=None):
        """
        Professor marca entrevista com um candidato
        """
        candidatura = self.get_object()
        
        # Verificar se o usuário é professor da vaga
        if not hasattr(request.user, 'professor') or candidatura.vaga.professor != request.user.professor:
            return Response(
                {'erro': 'Apenas o professor responsável pode marcar entrevistas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        data_entrevista = request.data.get('data_entrevista')
        if not data_entrevista:
            return Response(
                {'erro': 'Data da entrevista é obrigatória'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        candidatura.status = 'Entrevista Marcada'
        candidatura.save()
        
        return Response({
            'sucesso': True,
            'mensagem': 'Entrevista marcada com sucesso',
            'candidatura': CandidaturaSerializer(candidatura).data
        })
    
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

