# Guia de Integração Frontend - Sistema de Monitoria

Este documento explica como integrar o frontend (React, Vue, Angular, etc.) com a API do backend Django usando **autenticação por token**.

## Configuração Inicial

### 1. CORS

O backend já está configurado para aceitar requisições dos seguintes origins:
- `http://localhost:5173` (Vite)
- `http://localhost:3000` (React/Next.js)
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`

Se precisar adicionar outras origens, edite `src/monitoria/myproject/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://seu-dominio.com",  # adicione aqui
]
```

### 2. Headers Permitidos

O backend aceita os seguintes headers CORS:
- `Authorization` (para enviar o token)
- `Content-Type`
- `X-CSRFToken`
- Outros headers padrão

## Autenticação por Token

### Fluxo Completo

1. **Cadastro/Login** → Recebe `token`
2. **Armazenar token** → `localStorage` ou `sessionStorage`
3. **Incluir token** → Header `Authorization: Token <token>` em todas as requisições
4. **Logout** → Revogar token no backend e remover do storage

---

## Exemplos de Código

### JavaScript/React - Cadastro

```javascript
async function cadastrarUsuario(dados) {
  try {
    const response = await fetch('http://localhost:8000/api/auth/cadastro/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        tipo_usuario: dados.tipoUsuario, // 'aluno' ou 'professor'
        matricula: dados.matricula,      // obrigatório se aluno
        curso: dados.curso,               // obrigatório se aluno
        departamento: dados.departamento  // obrigatório se professor
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Armazenar token
      localStorage.setItem('token', data.token);
      localStorage.setItem('tipoUsuario', data.tipo_usuario);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Redirecionar baseado no tipo
      if (data.tipo_usuario === 'aluno') {
        window.location.href = '/aluno';
      } else if (data.tipo_usuario === 'professor') {
        window.location.href = '/professor';
      }
    } else {
      console.error('Erro no cadastro:', data.erro);
      return { erro: data.erro };
    }

    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    return { erro: 'Erro de conexão com o servidor' };
  }
}
```

### JavaScript/React - Login

```javascript
async function fazerLogin(email, senha) {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (response.ok) {
      // Armazenar token e dados do usuário
      localStorage.setItem('token', data.token);
      localStorage.setItem('tipoUsuario', data.tipo_usuario);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      return { sucesso: true, ...data };
    } else {
      return { sucesso: false, erro: data.erro };
    }
  } catch (error) {
    console.error('Erro no login:', error);
    return { sucesso: false, erro: 'Erro de conexão' };
  }
}

// Uso
const resultado = await fazerLogin('joao@ibmec.edu.br', 'senha123');
if (resultado.sucesso) {
  // Redirecionar conforme tipo_usuario
  if (resultado.tipo_usuario === 'aluno') {
    navigate('/aluno');
  }
}
```

### JavaScript/React - Requisições Autenticadas

```javascript
// Helper para fazer requisições autenticadas
async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });

  // Se retornar 401, token inválido/expirado
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Sessão expirada');
  }

  return response;
}

// Exemplo de uso: buscar vagas
async function buscarVagas(filtros = {}) {
  const params = new URLSearchParams(filtros).toString();
  const url = `http://localhost:8000/api/vagas/${params ? '?' + params : ''}`;

  const response = await apiRequest(url);
  return await response.json();
}

// Exemplo de uso: criar candidatura
async function candidatarVaga(vagaId) {
  const response = await apiRequest('http://localhost:8000/api/candidaturas/', {
    method: 'POST',
    body: JSON.stringify({ vaga_id: vagaId })
  });

  return await response.json();
}
```

### JavaScript/React - Logout

```javascript
async function fazerLogout() {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      await fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        }
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  // Limpar storage independente do resultado
  localStorage.clear();
  window.location.href = '/login';
}
```

### React Hook Customizado

```javascript
// useAuth.js
import { useState, useEffect } from 'react';

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const tokenArmazenado = localStorage.getItem('token');
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (tokenArmazenado && usuarioArmazenado) {
      setToken(tokenArmazenado);
      setUsuario(JSON.parse(usuarioArmazenado));
    }

    setCarregando(false);
  }, []);

  const login = async (email, senha) => {
    const response = await fetch('http://localhost:8000/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      setToken(data.token);
      setUsuario(data.usuario);
      return { sucesso: true, ...data };
    }

    return { sucesso: false, erro: data.erro };
  };

  const logout = async () => {
    if (token) {
      await fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` }
      });
    }

    localStorage.clear();
    setToken(null);
    setUsuario(null);
  };

  return { usuario, token, carregando, login, logout, autenticado: !!token };
}

// Uso no componente
function MeuComponente() {
  const { usuario, token, autenticado, login, logout } = useAuth();

  if (!autenticado) {
    return <LoginPage onLogin={login} />;
  }

  return <Dashboard usuario={usuario} onLogout={logout} />;
}
```

### Axios (alternativa ao fetch)

```javascript
import axios from 'axios';

// Configurar instância do axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para incluir token automaticamente
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para tratar erros 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Uso
async function buscarVagas() {
  const response = await api.get('/vagas/');
  return response.data;
}

async function fazerLogin(email, senha) {
  const response = await api.post('/auth/login/', { email, senha });
  localStorage.setItem('token', response.data.token);
  return response.data;
}
```

---

## Endpoints Principais

### Autenticação
- `POST /api/auth/cadastro/` - Cadastrar novo usuário (retorna token)
- `POST /api/auth/login/` - Fazer login (retorna token)
- `GET /api/auth/me/` - Obter dados do usuário autenticado
- `POST /api/auth/logout/` - Fazer logout e revogar token
- `POST /api/auth/token/` - Obter token (endpoint padrão DRF)

### Vagas
- `GET /api/vagas/` - Listar vagas (filtradas automaticamente por perfil)
- `GET /api/vagas/{id}/` - Detalhes de uma vaga
- `POST /api/vagas/` - Criar vaga (professor)
- `PATCH /api/vagas/{id}/` - Editar vaga (professor)
- `DELETE /api/vagas/{id}/` - Excluir vaga (professor)
- `GET /api/vagas/{id}/candidaturas/` - Listar candidaturas de uma vaga (professor)

### Candidaturas
- `GET /api/candidaturas/` - Listar candidaturas (filtradas por perfil)
- `POST /api/candidaturas/` - Criar candidatura (aluno)
- `POST /api/candidaturas/{id}/marcar_entrevista/` - Marcar entrevista (professor)

Documentação completa em `API_BACKEND.md`.

---

## Variáveis de Ambiente

Recomenda-se usar variáveis de ambiente para a URL da API:

**.env (desenvolvimento)**
```
VITE_API_URL=http://localhost:8000
# ou para Create React App:
REACT_APP_API_URL=http://localhost:8000
```

**.env.production**
```
VITE_API_URL=https://api.seudominio.com
```

**Uso no código:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// ou para CRA:
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

---

## Estrutura Recomendada

```
frontend/
├── src/
│   ├── services/
│   │   └── api.js              # Configuração axios/fetch + helpers
│   ├── hooks/
│   │   └── useAuth.js          # Hook de autenticação
│   ├── contexts/
│   │   └── AuthContext.jsx     # Context API para auth
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── CadastroPage.jsx
│   │   ├── AlunoPage.jsx
│   │   └── ProfessorPage.jsx
│   └── components/
│       ├── PrivateRoute.jsx    # Proteção de rotas
│       └── ...
```

---

## Checklist de Integração

- [ ] Configurar URL base da API (variável de ambiente)
- [ ] Implementar funções de login/cadastro
- [ ] Armazenar token no localStorage
- [ ] Criar helper para requisições autenticadas
- [ ] Incluir `Authorization: Token <token>` em todas as chamadas
- [ ] Tratar erro 401 (redirecionar para login)
- [ ] Implementar logout (revogar token + limpar storage)
- [ ] Redirecionar baseado em `tipo_usuario` após login
- [ ] Testar fluxos: cadastro → login → listagem → candidatura

---

## Troubleshooting

**Erro de CORS:**
- Verifique se o origin do frontend está em `CORS_ALLOWED_ORIGINS` no backend.
- Certifique-se de incluir o header `Content-Type: application/json`.

**Token não funciona (401):**
- Verifique se está enviando `Authorization: Token <token>` (com "Token" escrito).
- Confirme que o token foi armazenado corretamente.
- Teste se o token não foi revogado/expirado.

**Dados não aparecem:**
- Verifique filtros automáticos (aluno só vê vagas do próprio curso).
- Cheque se o perfil do usuário foi criado corretamente.

---

Para dúvidas ou problemas, consulte `README_MONITORIA.md` e `API_BACKEND.md`.
