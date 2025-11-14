# Resumo das Mudanças - Autenticação por Token

## O que foi implementado

✅ **Token Authentication habilitado** no Django REST Framework  
✅ **CORS configurado** para aceitar header `Authorization`  
✅ **Login retorna token** automaticamente (`/api/auth/login/`)  
✅ **Cadastro retorna token** para novo usuário (`/api/auth/cadastro/`)  
✅ **Logout revoga token** do servidor (`/api/auth/logout/`)  
✅ **Endpoint alternativo** para obter token (`/api/auth/token/`)  
✅ **Documentação completa** criada para integração frontend

## Arquivos modificados

### Backend (src/monitoria)

1. **myproject/settings.py**
   - `TokenAuthentication` adicionado como método primário
   - `CORS_ALLOW_HEADERS` configurado para aceitar `Authorization`
   - Ordem: Token primeiro, Session depois (compatibilidade)

2. **myapp/views.py**
   - Import de `Token` do DRF
   - `api_login`: agora gera/retorna token
   - `api_cadastro`: agora gera/retorna token
   - `api_logout`: revoga token antes de encerrar sessão

3. **myapp/urls.py**
   - Já tinha `obtain_auth_token` configurado

### Documentação

4. **FRONTEND_INTEGRATION.md** (novo)
   - Guia completo de integração com React
   - Exemplos com Axios e Fetch API
   - Context de autenticação
   - Rotas protegidas
   - Troubleshooting

5. **API_BACKEND.md** (atualizado)
   - Endpoints de autenticação com token
   - Headers de autorização
   - Nota sobre revogação de token

6. **README_MONITORIA.md** (atualizado)
   - Seção de autenticação atualizada
   - Referência ao FRONTEND_INTEGRATION.md

## Como usar no Frontend

### 1. Login e armazenamento do token

```javascript
const response = await fetch('http://localhost:8000/api/auth/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'joao@ibmec.edu.br',
    senha: 'senha123'
  })
});

const data = await response.json();

// Armazenar token
localStorage.setItem('token', data.token);
localStorage.setItem('tipo_usuario', data.tipo_usuario);
localStorage.setItem('user', JSON.stringify(data.usuario));
```

### 2. Usar token em requisições

```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:8000/api/vagas/', {
  headers: {
    'Authorization': `Token ${token}`
  }
});

const vagas = await response.json();
```

### 3. Logout (revogar token)

```javascript
const token = localStorage.getItem('token');

await fetch('http://localhost:8000/api/auth/logout/', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${token}`
  }
});

// Limpar dados locais
localStorage.removeItem('token');
localStorage.removeItem('user');
localStorage.removeItem('tipo_usuario');
```

## Endpoints de Autenticação

| Endpoint | Método | Descrição | Retorna Token? |
|----------|--------|-----------|----------------|
| `/api/auth/cadastro/` | POST | Criar novo usuário | ✅ Sim |
| `/api/auth/login/` | POST | Fazer login | ✅ Sim |
| `/api/auth/token/` | POST | Obter token (alternativo) | ✅ Sim |
| `/api/auth/me/` | GET | Dados do usuário autenticado | Requer token |
| `/api/auth/logout/` | POST | Logout e revogar token | Requer token |

## Formato do Token

```http
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

**Importante:**
- Palavra `Token` (maiúscula T)
- Espaço
- String do token (40 caracteres hexadecimais)

## Compatibilidade

✅ **Session Authentication** ainda funciona (para admin Django)  
✅ **Token Authentication** é prioritário (para API/frontend)  
✅ **CORS** configurado para ambos  

## Segurança

- Token é gerado automaticamente pelo DRF usando hash criptográfico
- Token é único por usuário
- Token é revogado ao fazer logout
- Token persiste entre sessões (não expira automaticamente)
- Para produção, considere implementar refresh tokens com expiração

## Testes

Execute o script de testes:

```bash
cd src/monitoria
python test_auth_token.py
```

Ou teste manualmente com curl:

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@ibmec.edu.br","senha":"senha123"}'

# Usar o token retornado
curl http://localhost:8000/api/vagas/ \
  -H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
```

## Próximos passos (opcional)

1. ✅ Implementar expiração de token (JWT)
2. ✅ Adicionar refresh token
3. ✅ Implementar rate limiting
4. ✅ Adicionar 2FA (autenticação de dois fatores)
5. ✅ Logging de acessos

## Referências

- **Código completo:** Ver `FRONTEND_INTEGRATION.md`
- **API Endpoints:** Ver `API_BACKEND.md`
- **Guia do projeto:** Ver `src/monitoria/README_MONITORIA.md`
- **DRF Token Auth:** https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication

---

**Data:** 13 de novembro de 2025  
**Versão:** 1.0
