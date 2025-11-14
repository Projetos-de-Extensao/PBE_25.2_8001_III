# Guia de Integração Frontend - Autenticação por Token

Este guia mostra como integrar o frontend React com a API do backend usando autenticação por token.

## Mudanças Implementadas

✅ **Token Authentication habilitado** no Django REST Framework  
✅ **CORS configurado** para aceitar header `Authorization`  
✅ **Login retorna token** automaticamente  
✅ **Cadastro retorna token** para novo usuário  
✅ **Logout revoga token** do servidor  

## Endpoints de Autenticação

### 1. Login (com token)
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "joao@ibmec.edu.br",
  "senha": "senha123"
}
```

**Resposta (200 OK):**
```json
{
  "sucesso": true,
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "tipo_usuario": "aluno",
  "usuario": {
    "id": 5,
    "nome": "João Silva",
    "email": "joao@ibmec.edu.br",
    "perfil": {
      "id": 1,
      "matricula": "2025001",
      "curso": "Engenharia de Software"
    }
  }
}
```

### 2. Cadastro (com token)
```http
POST /api/auth/cadastro/
Content-Type: application/json

{
  "nome": "Maria Santos",
  "email": "maria@ibmec.edu.br",
  "senha": "senha123",
  "tipo_usuario": "aluno",
  "matricula": "2025002",
  "curso": "Engenharia de Software"
}
```

**Resposta (201 Created):**
```json
{
  "sucesso": true,
  "mensagem": "Usuário cadastrado com sucesso",
  "tipo_usuario": "aluno",
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  "usuario": {
    "id": 6,
    "nome": "Maria Santos",
    "email": "maria@ibmec.edu.br"
  }
}
```

### 3. Verificar Usuário Autenticado
```http
GET /api/auth/me/
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

**Resposta (200 OK):**
```json
{
  "id": 5,
  "nome": "João Silva",
  "email": "joao@ibmec.edu.br",
  "tipo_usuario": "aluno",
  "perfil": { ... }
}
```

### 4. Logout (revoga token)
```http
POST /api/auth/logout/
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

**Resposta (200 OK):**
```json
{
  "sucesso": true,
  "mensagem": "Logout realizado com sucesso"
}
```

## Integração no Frontend React

### 1. Configurar Axios (recomendado)

```javascript
// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erro 401 (não autenticado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Funções de Autenticação

```javascript
// src/services/auth.js
import api from '../api/client';

export const authService = {
  // Login
  async login(email, senha) {
    const response = await api.post('/api/auth/login/', { email, senha });
    const { token, usuario, tipo_usuario } = response.data;
    
    // Armazenar token e dados do usuário
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(usuario));
    localStorage.setItem('tipo_usuario', tipo_usuario);
    
    return response.data;
  },

  // Cadastro
  async cadastro(dados) {
    const response = await api.post('/api/auth/cadastro/', dados);
    const { token, usuario, tipo_usuario } = response.data;
    
    // Armazenar token e dados do usuário
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(usuario));
    localStorage.setItem('tipo_usuario', tipo_usuario);
    
    return response.data;
  },

  // Logout
  async logout() {
    try {
      await api.post('/api/auth/logout/');
    } finally {
      // Limpar dados locais mesmo se falhar
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tipo_usuario');
    }
  },

  // Verificar se está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obter usuário atual
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Obter tipo de usuário
  getUserType() {
    return localStorage.getItem('tipo_usuario');
  },
};
```

### 3. Context para Autenticação

```javascript
// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar dados do usuário ao iniciar
    const storedUser = authService.getCurrentUser();
    const storedTipo = authService.getUserType();
    
    if (storedUser && storedTipo) {
      setUser(storedUser);
      setTipoUsuario(storedTipo);
    }
    
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    const data = await authService.login(email, senha);
    setUser(data.usuario);
    setTipoUsuario(data.tipo_usuario);
    return data;
  };

  const cadastro = async (dados) => {
    const data = await authService.cadastro(dados);
    setUser(data.usuario);
    setTipoUsuario(data.tipo_usuario);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setTipoUsuario(null);
  };

  const value = {
    user,
    tipoUsuario,
    loading,
    isAuthenticated: authService.isAuthenticated(),
    login,
    cadastro,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### 4. Exemplo de Página de Login

```javascript
// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, tipoUsuario } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, senha);
      
      // Redirecionar baseado no tipo de usuário
      if (tipoUsuario === 'aluno') {
        navigate('/aluno');
      } else if (tipoUsuario === 'professor') {
        navigate('/professor');
      } else if (tipoUsuario === 'coordenador') {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
```

### 5. Exemplo de Requisição a Endpoint Protegido

```javascript
// src/services/vagas.js
import api from '../api/client';

export const vagasService = {
  // Listar vagas (filtradas automaticamente pelo backend)
  async listar(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    const response = await api.get(`/api/vagas/${params ? `?${params}` : ''}`);
    return response.data;
  },

  // Criar candidatura
  async candidatar(vagaId) {
    const response = await api.post('/api/candidaturas/', {
      vaga_id: vagaId
    });
    return response.data;
  },

  // Listar minhas candidaturas
  async minhasCandidaturas() {
    const response = await api.get('/api/candidaturas/');
    return response.data;
  },
};
```

### 6. Rota Protegida

```javascript
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedTypes }) {
  const { isAuthenticated, tipoUsuario, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(tipoUsuario)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
```

### 7. Exemplo de Uso das Rotas

```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AlunoPage from './pages/AlunoPage';
import ProfessorPage from './pages/ProfessorPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/aluno"
            element={
              <ProtectedRoute allowedTypes={['aluno']}>
                <AlunoPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/professor"
            element={
              <ProtectedRoute allowedTypes={['professor']}>
                <ProfessorPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

## Alternativa: Fetch API (sem Axios)

```javascript
// src/utils/api.js
const BASE_URL = 'http://localhost:8000';

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Token ${token}`;
  }
  
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  
  return response;
}

// Exemplo de uso
export async function login(email, senha) {
  const response = await fetchWithAuth('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.token);
    return data;
  }
  
  throw new Error(data.erro || 'Erro no login');
}

export async function getVagas(filtros = {}) {
  const params = new URLSearchParams(filtros).toString();
  const response = await fetchWithAuth(`/api/vagas/${params ? `?${params}` : ''}`);
  return response.json();
}
```

## Checklist de Integração

- [ ] Instalar axios: `npm install axios`
- [ ] Criar arquivo `src/api/client.js` com configuração do axios
- [ ] Criar arquivo `src/services/auth.js` com funções de autenticação
- [ ] Criar `AuthContext` para gerenciar estado global de autenticação
- [ ] Implementar `ProtectedRoute` para rotas que exigem login
- [ ] Atualizar variáveis de ambiente com URL do backend
- [ ] Testar login e verificar se token é retornado
- [ ] Testar acesso a endpoints protegidos com o token
- [ ] Testar logout e verificar se token é revogado

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend:

```env
VITE_API_URL=http://localhost:8000
```

E use no código:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

## Troubleshooting

### Erro: "Invalid token"
- Verifique se o token está sendo enviado no header `Authorization: Token <token>`
- Formato correto: `Token` (maiúsculo) seguido de espaço e o token

### Erro CORS
- Certifique-se de que o frontend está rodando em `localhost:5173` ou `localhost:3000`
- Verifique `CORS_ALLOWED_ORIGINS` em `settings.py`

### Token não persiste após refresh
- Certifique-se de que está salvando o token no `localStorage`
- Verifique se o `AuthContext` está carregando do `localStorage` no `useEffect`

### 401 após logout
- Normal! O token foi revogado no servidor
- Redirecione para `/login` quando receber 401

## Próximos Passos

1. Implementar refresh de token (opcional, para tokens de curta duração)
2. Adicionar loading states nas requisições
3. Melhorar tratamento de erros
4. Implementar timeout de sessão
5. Adicionar testes unitários para autenticação

---

**Documentação atualizada em:** 13 de novembro de 2025  
**Versão da API:** 1.0  
**Backend:** Django 5.2 + DRF
