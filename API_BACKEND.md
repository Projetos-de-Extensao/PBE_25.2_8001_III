# API Backend - Sistema de Monitoria

Documentação completa dos endpoints implementados conforme `login.md`.

## Autenticação

### 1. Cadastro de Usuário
**Endpoint:** `POST /api/auth/cadastro/`

**Body (Aluno):**
```json
{
  "nome": "João Silva",
  "email": "joao@ibmec.edu.br",
  "senha": "senha123",
  "tipo_usuario": "aluno",
  "matricula": "2025001",
  "curso": "Engenharia de Software"
}
```

**Body (Professor):**
```json
{
  "nome": "Ana Silva",
  "email": "ana.silva@ibmec.edu.br",
  "senha": "senha123",
  "tipo_usuario": "professor",
  "departamento": "Engenharia"
}
```

**Resposta (201 Created):**
```json
{
  "sucesso": true,
  "mensagem": "Usuário cadastrado com sucesso",
  "tipo_usuario": "aluno",
  "usuario": {
    "id": 5,
    "nome": "João Silva",
    "email": "joao@ibmec.edu.br"
  }
}
```

---

### 2. Login
**Endpoint:** `POST /api/auth/login/`

**Body:**
```json
{
  "email": "joao@ibmec.edu.br",
  "senha": "senha123"
}
```

**Resposta (200 OK):**
```json
{
  "sucesso": true,
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

**Uso no frontend:**
- Após login bem-sucedido, redirecionar para:
  - `/aluno` se `tipo_usuario === 'aluno'`
  - `/professor` se `tipo_usuario === 'professor'`
  - `/admin` se `tipo_usuario === 'coordenador'`

---

### 3. Verificar Usuário Autenticado
**Endpoint:** `GET /api/auth/me/`

**Headers:** Cookie de sessão (automaticamente enviado após login)

**Resposta (200 OK):**
```json
{
  "id": 5,
  "nome": "João Silva",
  "email": "joao@ibmec.edu.br",
  "tipo_usuario": "aluno",
  "perfil": {
    "id": 1,
    "matricula": "2025001",
    "curso": "Engenharia de Software"
  }
}
```

---

### 4. Logout
**Endpoint:** `POST /api/auth/logout/`

**Resposta (200 OK):**
```json
{
  "sucesso": true,
  "mensagem": "Logout realizado com sucesso"
}
```

---

## Vagas de Monitoria

### 5. Listar Vagas (com filtros inteligentes)
**Endpoint:** `GET /api/vagas/`

**Comportamento automático por tipo de usuário:**
- **Aluno:** Retorna apenas vagas abertas do curso dele
- **Professor:** Retorna apenas vagas das disciplinas que ele leciona
- **Coordenador:** Retorna todas as vagas

**Filtros opcionais (query params):**
- `?nome=Algoritmos` - filtra por nome da disciplina
- `?periodo=2025.1` - filtra por período
- `?tipo=Monitoria` ou `?tipo=TA` - filtra por tipo de vaga

**Exemplo:** `GET /api/vagas/?nome=Algoritmos&tipo=Monitoria`

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "disciplina_nome": "Algoritmos e Estruturas de Dados",
    "curso_nome": "Engenharia de Software",
    "tipo": "Monitoria",
    "descricao": "Apoio em exercícios e plantões",
    "cr_minimo": "7.00",
    "horas": 12,
    "remuneracao": null,
    "status": "Aberta",
    "professor_nome": "Ana Silva",
    "disciplina": { ... },
    "professor": { ... }
  }
]
```

---

### 6. Detalhes de Uma Vaga
**Endpoint:** `GET /api/vagas/{id}/`

**Resposta (200 OK):** mesmo formato do item acima

---

### 7. Criar Vaga (Professor)
**Endpoint:** `POST /api/vagas/`

**Body:**
```json
{
  "disciplina_id": 1,
  "professor_id": 1,
  "tipo": "Monitoria",
  "descricao": "Monitoria de Estruturas de Dados",
  "cr_minimo": 7.5,
  "horas": 16,
  "remuneracao": null,
  "status": "Aberta"
}
```

**Resposta (201 Created):** vaga criada

---

### 8. Editar Vaga (Professor)
**Endpoint:** `PUT /api/vagas/{id}/` ou `PATCH /api/vagas/{id}/`

**Body (PATCH - campos parciais):**
```json
{
  "status": "Fechada",
  "descricao": "Nova descrição da vaga"
}
```

**Resposta (200 OK):** vaga atualizada

---

### 9. Excluir Vaga (Professor)
**Endpoint:** `DELETE /api/vagas/{id}/`

**Resposta (204 No Content)**

---

### 10. Ver Candidaturas de Uma Vaga (Professor)
**Endpoint:** `GET /api/vagas/{id}/candidaturas/`

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "aluno_nome": "João Silva",
    "vaga_disciplina": "Algoritmos e Estruturas de Dados",
    "status": "Pendente",
    "criado_em": "2025-10-29T22:05:28.659064Z",
    "aluno": { ... },
    "vaga": { ... }
  }
]
```

---

## Candidaturas

### 11. Listar Minhas Candidaturas
**Endpoint:** `GET /api/candidaturas/`

**Comportamento automático:**
- **Aluno:** Retorna apenas as candidaturas dele
- **Professor:** Retorna candidaturas das vagas que ele criou

**Resposta (200 OK):** lista de candidaturas (formato igual ao endpoint 10)

---

### 12. Criar Candidatura (Aluno)
**Endpoint:** `POST /api/candidaturas/`

**Body:**
```json
{
  "vaga_id": 1
}
```

**Nota:** O `aluno_id` é inferido automaticamente do usuário autenticado.

**Resposta (201 Created):**
```json
{
  "id": 2,
  "aluno_nome": "João Silva",
  "vaga_disciplina": "Algoritmos e Estruturas de Dados",
  "status": "Pendente",
  "criado_em": "2025-10-29T23:15:00Z",
  ...
}
```

---

### 13. Marcar Entrevista (Professor)
**Endpoint:** `POST /api/candidaturas/{id}/marcar_entrevista/`

**Body:**
```json
{
  "data_entrevista": "2025-11-05T14:00:00"
}
```

**Resposta (200 OK):**
```json
{
  "sucesso": true,
  "mensagem": "Entrevista marcada com sucesso",
  "candidatura": { ... }
}
```

---

## Fluxos Principais

### Fluxo 1: Cadastro → Login → Dashboard Aluno
1. Aluno acessa `/login`
2. Clica em "Cadastrar"
3. Preenche: nome, email, senha, matrícula, curso
4. `POST /api/auth/cadastro/` com `tipo_usuario: "aluno"`
5. Após cadastro, faz login: `POST /api/auth/login/`
6. Backend retorna `tipo_usuario: "aluno"`
7. Frontend redireciona para `/aluno`
8. `/aluno` carrega vagas: `GET /api/vagas/` (já filtradas por curso)
9. Aluno pode:
   - Filtrar vagas por nome/período/tipo
   - Ver detalhes de uma vaga
   - Aplicar candidatura: `POST /api/candidaturas/` com `vaga_id`

### Fluxo 2: Professor → Gerenciar Vagas
1. Professor faz login: `POST /api/auth/login/`
2. Backend retorna `tipo_usuario: "professor"`
3. Frontend redireciona para `/professor`
4. `/professor` carrega vagas do professor: `GET /api/vagas/` (já filtradas)
5. Professor pode:
   - **Criar vaga:** `POST /api/vagas/`
   - **Editar vaga:** `PATCH /api/vagas/{id}/`
   - **Excluir vaga:** `DELETE /api/vagas/{id}/`
   - **Ver candidaturas:** `GET /api/vagas/{id}/candidaturas/`
   - **Marcar entrevista:** `POST /api/candidaturas/{id}/marcar_entrevista/`

---

## Testes Realizados

✅ Sistema de autenticação (cadastro, login, logout, me)  
✅ Filtros inteligentes por tipo de usuário (aluno vê curso dele, professor vê suas vagas)  
✅ Filtros de busca (nome, período, tipo)  
✅ CRUD completo de vagas  
✅ Criação de candidaturas (aluno_id inferido automaticamente)  
✅ Listagem de candidaturas por vaga  
✅ Marcar entrevista (apenas professor responsável)  

---

## Próximos Passos (Frontend)

1. Criar `LoginPage.jsx` com opção de login/cadastro
2. Criar `CadastroPage.jsx` com formulário completo
3. Criar `AlunoPage.jsx`:
   - Lista de vagas com filtros
   - Botão "Candidatar-se"
   - Modal com detalhes da vaga
4. Criar `ProfessorPage.jsx`:
   - Lista de vagas do professor
   - Botão "Criar Vaga"
   - Botão "Ver Candidaturas"
   - Modal para editar vaga
   - Lista de candidatos com botão "Marcar Entrevista"

---

**Autenticação:** Usando sessões Django (cookie-based). O frontend deve incluir `credentials: 'include'` nas requisições fetch.

**Segurança:** Endpoints protegidos com `IsAuthenticated`. Filtros automáticos impedem alunos de verem vagas de outros cursos e professores de editarem vagas que não criaram.
