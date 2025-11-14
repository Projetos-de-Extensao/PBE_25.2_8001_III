#!/usr/bin/env python
"""Teste de login via API"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

print("=" * 60)
print("TESTE DE LOGIN VIA API")
print("=" * 60)

# Teste 1: Login com aluno
print("\n1. Login como ALUNO (aluno@ibmec.edu.br / senha123):")
try:
    response = requests.post(
        f"{BASE_URL}/api/auth/login/",
        json={"email": "aluno@ibmec.edu.br", "senha": "senha123"},
        timeout=5
    )
    
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ Login bem-sucedido!")
        print(f"   - Token: {data.get('token', '')[:30]}...")
        print(f"   - Tipo: {data.get('tipo_usuario')}")
        print(f"   - Nome: {data.get('usuario', {}).get('nome')}")
        
        # Testar token
        print("\n2. Testando token em /api/auth/me/:")
        me_response = requests.get(
            f"{BASE_URL}/api/auth/me/",
            headers={"Authorization": f"Token {data.get('token')}"},
            timeout=5
        )
        print(f"   Status: {me_response.status_code}")
        
        if me_response.status_code == 200:
            me_data = me_response.json()
            print(f"   ✓ Token válido!")
            print(f"   - Nome: {me_data.get('nome')}")
            print(f"   - Email: {me_data.get('email')}")
        else:
            print(f"   ✗ Erro: {me_response.text}")
    else:
        print(f"   ✗ Erro no login: {response.text}")

except requests.exceptions.ConnectionError:
    print("   ✗ Servidor não está rodando!")
    print("   Execute: python manage.py runserver")
except Exception as e:
    print(f"   ✗ Erro: {e}")

# Teste 2: Login com professor/admin
print("\n3. Login como ADMIN/PROFESSOR (admin@ibmec.edu.br / admin123):")
try:
    response = requests.post(
        f"{BASE_URL}/api/auth/login/",
        json={"email": "admin@ibmec.edu.br", "senha": "admin123"},
        timeout=5
    )
    
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ Login bem-sucedido!")
        print(f"   - Token: {data.get('token', '')[:30]}...")
        print(f"   - Tipo: {data.get('tipo_usuario')}")
        print(f"   - Nome: {data.get('usuario', {}).get('nome')}")
    else:
        print(f"   ✗ Erro: {response.text}")

except requests.exceptions.ConnectionError:
    print("   ✗ Servidor não está rodando!")
except Exception as e:
    print(f"   ✗ Erro: {e}")

# Teste 3: Credenciais inválidas
print("\n4. Teste com senha errada:")
try:
    response = requests.post(
        f"{BASE_URL}/api/auth/login/",
        json={"email": "aluno@ibmec.edu.br", "senha": "senhaerrada"},
        timeout=5
    )
    
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 401:
        print(f"   ✓ Corretamente rejeitado (401)")
        print(f"   - Mensagem: {response.json().get('erro')}")
    else:
        print(f"   ⚠ Resposta inesperada: {response.status_code}")

except requests.exceptions.ConnectionError:
    print("   ✗ Servidor não está rodando!")
except Exception as e:
    print(f"   ✗ Erro: {e}")

print("\n" + "=" * 60)
print("FIM DOS TESTES")
print("=" * 60)
