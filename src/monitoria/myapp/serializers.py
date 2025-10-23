from rest_framework import serializers
from .models import Usuario, Aluno, Professor, Coordenador, VagaMonitoria, Candidatura


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'senha']
        extra_kwargs = {'senha': {'write_only': True}}
    
    def create(self, validated_data):
        # Aqui você deveria usar hash de senha (melhor usar User do Django)
        usuario = Usuario.objects.create(**validated_data)
        return usuario


class AlunoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(), source='usuario', write_only=True
    )
    
    class Meta:
        model = Aluno
        fields = ['id', 'usuario', 'usuario_id', 'matricula', 'curso', 'historico_academico']


class ProfessorSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(), source='usuario', write_only=True
    )
    
    class Meta:
        model = Professor
        fields = ['id', 'usuario', 'usuario_id', 'departamento', 'disciplinas']


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
    
    class Meta:
        model = VagaMonitoria
        fields = ['id', 'disciplina', 'descricao', 'requisitos', 'status', 
                  'professor', 'professor_id', 'professor_nome']


class CandidaturaSerializer(serializers.ModelSerializer):
    aluno = AlunoSerializer(read_only=True)
    aluno_id = serializers.PrimaryKeyRelatedField(
        queryset=Aluno.objects.all(), source='aluno', write_only=True
    )
    vaga = VagaMonitoriaSerializer(read_only=True)
    vaga_id = serializers.PrimaryKeyRelatedField(
        queryset=VagaMonitoria.objects.all(), source='vaga', write_only=True
    )
    aluno_nome = serializers.CharField(source='aluno.usuario.nome', read_only=True)
    vaga_disciplina = serializers.CharField(source='vaga.disciplina', read_only=True)
    
    class Meta:
        model = Candidatura
        fields = ['id', 'aluno', 'aluno_id', 'aluno_nome', 'vaga', 
                  'vaga_id', 'vaga_disciplina', 'status']
