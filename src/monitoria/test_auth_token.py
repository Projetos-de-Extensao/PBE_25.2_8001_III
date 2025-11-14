"""
Script de teste rápido para validar autenticação por token
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_login_with_token():
    """Testa login e uso do token"""
    print("\n=== TESTE 1: Login e obtenção de token ===")
    
    # Login
    login_data = {
        "email": "joao@ibmec.edu.br",
        "senha": "senha123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login/", json=login_data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Login bem-sucedido")
        print(f"  Token: {data.get('token', 'N/A')[:20]}...")
        print(f"  Tipo: {data.get('tipo_usuario')}")
        print(f"  Nome: {data.get('usuario', {}).get('nome')}")
        
        token = data.get('token')
        
        # Testar acesso a endpoint protegido com token
        print("\n=== TESTE 2: Acesso a /api/auth/me/ com token ===")
        headers = {
            "Authorization": f"Token {token}"
        }
        
        me_response = requests.get(f"{BASE_URL}/api/auth/me/", headers=headers)
        print(f"Status: {me_response.status_code}")
        
        if me_response.status_code == 200:
            me_data = me_response.json()
            print(f"✓ Acesso autorizado")
            print(f"  Nome: {me_data.get('nome')}")
            print(f"  Email: {me_data.get('email')}")
            print(f"  Tipo: {me_data.get('tipo_usuario')}")
        else:
            print(f"✗ Erro ao acessar /me/: {me_response.text}")
        
        # Testar listagem de vagas com token
        print("\n=== TESTE 3: Listagem de vagas com token ===")
        vagas_response = requests.get(f"{BASE_URL}/api/vagas/", headers=headers)
        print(f"Status: {vagas_response.status_code}")
        
        if vagas_response.status_code == 200:
            vagas = vagas_response.json()
            print(f"✓ {len(vagas.get('results', vagas)) if isinstance(vagas, dict) else len(vagas)} vagas retornadas")
            if vagas:
                primeira_vaga = vagas[0] if isinstance(vagas, list) else vagas.get('results', [{}])[0]
                print(f"  Exemplo: {primeira_vaga.get('disciplina_nome', 'N/A')}")
        else:
            print(f"✗ Erro ao listar vagas: {vagas_response.text}")
        
        # Testar logout (revoga token)
        print("\n=== TESTE 4: Logout (revogação de token) ===")
        logout_response = requests.post(f"{BASE_URL}/api/auth/logout/", headers=headers)
        print(f"Status: {logout_response.status_code}")
        
        if logout_response.status_code == 200:
            print(f"✓ Logout bem-sucedido")
            
            # Tentar usar o token revogado
            print("\n=== TESTE 5: Tentativa de acesso com token revogado ===")
            revoked_response = requests.get(f"{BASE_URL}/api/auth/me/", headers=headers)
            print(f"Status: {revoked_response.status_code}")
            
            if revoked_response.status_code == 401:
                print(f"✓ Token corretamente revogado (401 Unauthorized)")
            else:
                print(f"⚠ Token ainda válido após logout: {revoked_response.status_code}")
        
    else:
        print(f"✗ Erro no login: {response.text}")


def test_cadastro_with_token():
    """Testa cadastro e recebimento de token"""
    print("\n\n=== TESTE 6: Cadastro e obtenção de token ===")
    
    cadastro_data = {
        "nome": "Teste Token User",
        "email": f"teste_token_{requests.utils.default_user_agent().split()[0][:5]}@test.com",
        "senha": "senha123",
        "tipo_usuario": "aluno",
        "matricula": "999999",
        "curso": "Engenharia de Software"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/cadastro/", json=cadastro_data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 201:
        data = response.json()
        print(f"✓ Cadastro bem-sucedido")
        print(f"  Token: {data.get('token', 'N/A')[:20]}...")
        print(f"  Usuário: {data.get('usuario', {}).get('email')}")
    else:
        print(f"✗ Erro no cadastro: {response.text}")


if __name__ == "__main__":
    print("=" * 60)
    print("VALIDAÇÃO DE AUTENTICAÇÃO POR TOKEN")
    print("=" * 60)
    print("\nCertifique-se de que o servidor está rodando em:")
    print(f"  {BASE_URL}")
    print("\nUsuário de teste: joao@ibmec.edu.br / senha123")
    print("(execute 'python manage.py seed' se ainda não tiver dados)")
    
    try:
        test_login_with_token()
        test_cadastro_with_token()
        
        print("\n" + "=" * 60)
        print("TESTES CONCLUÍDOS")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\n✗ Erro: Não foi possível conectar ao servidor.")
        print("  Execute: python manage.py runserver")
    except Exception as e:
        print(f"\n✗ Erro inesperado: {e}")
        import traceback
        traceback.print_exc()
