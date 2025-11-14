from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from myapp.models import (
    Coordenador, Curso, Professor, Disciplina,
    Aluno, HistoricoAlunoDisciplina, VagaMonitoria, Candidatura
)

class Command(BaseCommand):
    help = "Popula o banco com dados de teste (usuários, curso, disciplina, vaga, candidatura)"

    def handle(self, *args, **options):
        User = get_user_model()

        # Usuários - sempre redefine senha para garantir que está correta
        aluno_user, created = User.objects.get_or_create(
            username='aluno@ibmec.edu.br',
            defaults={
                'email': 'aluno@ibmec.edu.br',
                'first_name': 'Aluno',
                'last_name': 'Teste',
            }
        )
        # Sempre atualiza a senha (mesmo que já exista)
        aluno_user.set_password('senha123')
        aluno_user.save()

        # Admin/Professor
        prof_user, created = User.objects.get_or_create(
            username='admin@ibmec.edu.br',
            defaults={
                'email': 'admin@ibmec.edu.br',
                'first_name': 'Admin',
                'last_name': 'Professor',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        # Sempre atualiza a senha
        prof_user.set_password('admin123')
        prof_user.is_staff = True
        prof_user.is_superuser = True
        prof_user.save()

        # Coordenador (mantém para completude)
        coord_user, created = User.objects.get_or_create(
            username='coord@ibmec.edu.br',
            defaults={
                'email': 'coord@ibmec.edu.br',
                'first_name': 'Coordenador',
                'last_name': 'Teste',
            }
        )
        # Sempre atualiza a senha
        coord_user.set_password('senha123')
        coord_user.save()

        # Coordenador
        coord, _ = Coordenador.objects.get_or_create(usuario=coord_user, defaults={
            'departamento': 'CASA'
        })

        # Curso
        curso, _ = Curso.objects.get_or_create(
            codigo='ESW',
            defaults={
                'nome': 'Engenharia de Software',
                'descricao': 'Curso de ESW'
            }
        )
        curso.coordenadores.add(coord)

        # Professor
        professor, _ = Professor.objects.get_or_create(
            usuario=prof_user,
            defaults={
                'departamento': 'Engenharia'
            }
        )

        # Disciplina
        disciplina, _ = Disciplina.objects.get_or_create(
            codigo='ESW101', nome='Algoritmos e Estruturas de Dados',
            defaults={
                'descricao': 'Estruturas básicas',
                'curso': curso,
                'professor': professor,
                'periodo': '2025.1'
            }
        )
        # Em caso de registros existentes sem curso/professor/periodo (de migrações antigas), saneia
        if disciplina.curso_id is None:
            disciplina.curso = curso
        if disciplina.professor_id is None:
            disciplina.professor = professor
        if not disciplina.periodo:
            disciplina.periodo = '2025.1'
        disciplina.save()

        # Aluno - buscar por matrícula e atualizar usuário se necessário
        aluno, created = Aluno.objects.get_or_create(
            matricula='2025001',
            defaults={
                'usuario': aluno_user,
                'curso': curso.nome,
            }
        )
        if not created:
            aluno.usuario = aluno_user
            aluno.curso = curso.nome
            aluno.save()

        # Histórico do Aluno
        HistoricoAlunoDisciplina.objects.get_or_create(
            aluno=aluno,
            disciplina=disciplina,
            defaults={'cr': 8.50}
        )

        # Vaga de Monitoria
        vaga, _ = VagaMonitoria.objects.get_or_create(
            disciplina=disciplina,
            professor=professor,
            defaults={
                'tipo': 'Monitoria',
                'descricao': 'Apoio em exercícios e plantões',
                'cr_minimo': 7.0,
                'horas': 12,
                'remuneracao': None,
                'status': 'Aberta'
            }
        )

        # Candidatura
        Candidatura.objects.get_or_create(
            aluno=aluno,
            vaga=vaga,
            defaults={'status': 'Pendente'}
        )

        self.stdout.write(self.style.SUCCESS('Dados de teste populados com sucesso.'))
