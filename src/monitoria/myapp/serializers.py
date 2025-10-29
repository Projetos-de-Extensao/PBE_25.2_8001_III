from rest_framework import serializers
from .models import (
    Usuario, Aluno, Professor, Coordenador, VagaMonitoria, Candidatura,
    Curso, Disciplina, HistoricoAlunoDisciplina
)


class UsuarioSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(read_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'nome']


class AlunoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(), source='usuario', write_only=True
    )
    
    class Meta:
        model = Aluno
        fields = ['id', 'usuario', 'usuario_id', 'matricula', 'curso']


class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = ['id', 'nome', 'codigo', 'descricao']


class DisciplinaSerializer(serializers.ModelSerializer):
    curso = CursoSerializer(read_only=True)
    curso_id = serializers.PrimaryKeyRelatedField(
        queryset=Curso.objects.all(), source='curso', write_only=True
    )
    professor_id = serializers.PrimaryKeyRelatedField(
        queryset=Professor.objects.all(), source='professor', write_only=True
    )

    class Meta:
        model = Disciplina
        fields = ['id', 'nome', 'codigo', 'descricao', 'periodo', 'curso', 'curso_id', 'professor_id']


class ProfessorSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(), source='usuario', write_only=True
    )
    disciplinas = serializers.SerializerMethodField()
    
    class Meta:
        model = Professor
        fields = ['id', 'usuario', 'usuario_id', 'departamento', 'disciplinas']

    def get_disciplinas(self, obj):
        return [d.nome for d in obj.disciplinas.all()]


class CoordenadorSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(), source='usuario', write_only=True
    )
    
    class Meta:
        model = Coordenador
        fields = ['id', 'usuario', 'usuario_id', 'departamento']


class VagaMonitoriaSerializer(serializers.ModelSerializer):
    professor = ProfessorSerializer(read_only=True)
    professor_id = serializers.PrimaryKeyRelatedField(
        queryset=Professor.objects.all(), source='professor', write_only=True
    )
    professor_nome = serializers.CharField(source='professor.usuario.nome', read_only=True)
    disciplina = DisciplinaSerializer(read_only=True)
    disciplina_id = serializers.PrimaryKeyRelatedField(
        queryset=Disciplina.objects.all(), source='disciplina', write_only=True
    )
    disciplina_nome = serializers.CharField(source='disciplina.nome', read_only=True)
    curso_nome = serializers.CharField(source='disciplina.curso.nome', read_only=True)
    
    class Meta:
        model = VagaMonitoria
        fields = ['id', 'disciplina', 'disciplina_id', 'disciplina_nome', 'curso_nome',
                  'tipo', 'descricao', 'cr_minimo', 'horas', 'remuneracao', 'status', 
                  'professor', 'professor_id', 'professor_nome']


class CandidaturaSerializer(serializers.ModelSerializer):
    aluno = AlunoSerializer(read_only=True)
    aluno_id = serializers.PrimaryKeyRelatedField(
        queryset=Aluno.objects.all(), source='aluno', write_only=True, required=False
    )
    vaga = VagaMonitoriaSerializer(read_only=True)
    vaga_id = serializers.PrimaryKeyRelatedField(
        queryset=VagaMonitoria.objects.all(), source='vaga', write_only=True
    )
    aluno_nome = serializers.CharField(source='aluno.usuario.nome', read_only=True)
    vaga_disciplina = serializers.CharField(source='vaga.disciplina.nome', read_only=True)
    
    class Meta:
        model = Candidatura
        fields = ['id', 'aluno', 'aluno_id', 'aluno_nome', 'vaga', 
                  'vaga_id', 'vaga_disciplina', 'status', 'criado_em']
