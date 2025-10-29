"""
Script de teste para validar endpoints do sistema de login/vagas
Execute com: python manage.py shell < test_endpoints.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth import get_user_model
from myapp.models import Aluno, Professor, Curso, Disciplina, VagaMonitoria, Candidatura

User = get_user_model()

print("\n=== TESTE 1: Verificar usuários de teste do seed ===")
try:
    aluno_user = User.objects.get(username='joao@ibmec.edu.br')
    print(f"✓ Aluno encontrado: {aluno_user.nome}")
    print(f"  - Email: {aluno_user.email}")
    print(f"  - Tem perfil Aluno: {hasattr(aluno_user, 'aluno')}")
    if hasattr(aluno_user, 'aluno'):
        print(f"  - Matrícula: {aluno_user.aluno.matricula}")
        print(f"  - Curso: {aluno_user.aluno.curso}")
except User.DoesNotExist:
    print("✗ Aluno de teste não encontrado (rode o seed primeiro)")

try:
    prof_user = User.objects.get(username='ana.silva@ibmec.edu.br')
    print(f"✓ Professor encontrado: {prof_user.nome}")
    print(f"  - Email: {prof_user.email}")
    print(f"  - Tem perfil Professor: {hasattr(prof_user, 'professor')}")
    if hasattr(prof_user, 'professor'):
        print(f"  - Departamento: {prof_user.professor.departamento}")
except User.DoesNotExist:
    print("✗ Professor de teste não encontrado")

print("\n=== TESTE 2: Verificar vagas ===")
vagas = VagaMonitoria.objects.all()
print(f"Total de vagas: {vagas.count()}")
for vaga in vagas:
    print(f"  - {vaga.disciplina.nome} ({vaga.tipo}) - Status: {vaga.status}")
    print(f"    Professor: {vaga.professor.usuario.nome}")
    print(f"    Curso: {vaga.disciplina.curso.nome if vaga.disciplina.curso else 'N/A'}")

print("\n=== TESTE 3: Filtro de vagas por curso (simulando aluno) ===")
if hasattr(aluno_user, 'aluno'):
    curso_aluno = aluno_user.aluno.curso
    vagas_curso = VagaMonitoria.objects.filter(
        status='Aberta',
        disciplina__curso__nome__icontains=curso_aluno
    )
    print(f"Vagas abertas para o curso '{curso_aluno}': {vagas_curso.count()}")
    for vaga in vagas_curso:
        print(f"  - {vaga.disciplina.nome} ({vaga.tipo})")

print("\n=== TESTE 4: Filtro de vagas por professor ===")
if hasattr(prof_user, 'professor'):
    vagas_prof = VagaMonitoria.objects.filter(professor=prof_user.professor)
    print(f"Vagas do professor {prof_user.nome}: {vagas_prof.count()}")
    for vaga in vagas_prof:
        print(f"  - {vaga.disciplina.nome} ({vaga.tipo}) - {vaga.status}")

print("\n=== TESTE 5: Candidaturas ===")
candidaturas = Candidatura.objects.all()
print(f"Total de candidaturas: {candidaturas.count()}")
for cand in candidaturas:
    print(f"  - {cand.aluno.usuario.nome} → {cand.vaga.disciplina.nome}")
    print(f"    Status: {cand.status}, Criado em: {cand.criado_em}")

print("\n=== TESTE 6: Criar nova candidatura (teste) ===")
try:
    if hasattr(aluno_user, 'aluno') and vagas_curso.exists():
        vaga_teste = vagas_curso.first()
        # Verificar se já existe candidatura
        cand_existente = Candidatura.objects.filter(
            aluno=aluno_user.aluno,
            vaga=vaga_teste
        ).first()
        
        if cand_existente:
            print(f"✓ Candidatura já existe: {cand_existente.id}")
        else:
            nova_cand = Candidatura.objects.create(
                aluno=aluno_user.aluno,
                vaga=vaga_teste,
                status='Pendente'
            )
            print(f"✓ Nova candidatura criada: ID {nova_cand.id}")
except Exception as e:
    print(f"✗ Erro ao criar candidatura: {e}")

print("\n=== RESUMO ===")
print(f"Usuários: {User.objects.count()}")
print(f"Alunos: {Aluno.objects.count()}")
print(f"Professores: {Professor.objects.count()}")
print(f"Cursos: {Curso.objects.count()}")
print(f"Disciplinas: {Disciplina.objects.count()}")
print(f"Vagas: {VagaMonitoria.objects.count()}")
print(f"Candidaturas: {Candidatura.objects.count()}")
print("\n✓ Testes concluídos!")
