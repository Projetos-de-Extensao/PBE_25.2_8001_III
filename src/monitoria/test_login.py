#!/usr/bin/env python
"""Script de teste de autenticação"""
import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth import authenticate
from myapp.models import Usuario

print("=" * 60)
print("TESTE DE AUTENTICAÇÃO")
print("=" * 60)

# Listar usuários
print("\n1. Usuários no banco:")
usuarios = Usuario.objects.all()[:5]
for u in usuarios:
    print(f"   - Username: {u.username}")
    print(f"     Email: {u.email}")
    print(f"     Tem senha: {u.has_usable_password()}")
    print()

# Testar autenticação
print("\n2. Testando autenticação com aluno@ibmec.edu.br / senha123:")
user = authenticate(username='aluno@ibmec.edu.br', password='senha123')
print(f"   Resultado: {user}")
print(f"   Autenticado: {'✓ SIM' if user else '✗ NÃO'}")

if not user:
    # Verificar detalhes
    u = Usuario.objects.filter(email='aluno@ibmec.edu.br').first()
    if u:
        print(f"\n   Usuário existe no banco:")
        print(f"   - Username: {u.username}")
        print(f"   - Email: {u.email}")
        print(f"   - Is active: {u.is_active}")
        print(f"   - Check password('senha123'): {u.check_password('senha123')}")
    else:
        print("\n   ✗ Usuário não encontrado no banco!")

print("\n3. Testando autenticação com admin@ibmec.edu.br / admin123:")
user2 = authenticate(username='admin@ibmec.edu.br', password='admin123')
print(f"   Resultado: {user2}")
print(f"   Autenticado: {'✓ SIM' if user2 else '✗ NÃO'}")

print("\n" + "=" * 60)
