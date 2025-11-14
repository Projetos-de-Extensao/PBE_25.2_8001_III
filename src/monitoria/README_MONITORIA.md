# Guia do Projeto: Sistema de Monitoria (Backend + Docs)

Este guia explica a arquitetura, as pastas, como rodar localmente, dados de teste, autenticação, principais endpoints e fluxos do Sistema de Monitoria. É o ponto de partida para entender e manter o projeto.

## Visão Geral

- Objetivo: gerenciar vagas de monitoria, permitindo que Professores criem/gerenciem vagas e Alunos visualizem, filtrem e se candidatem.
- Perfis: Aluno, Professor e Coordenador (papéis do usuário).
- Backend: Django 5 + Django REST Framework (DRF), autenticação via sessão (cookies).
- Frontend: React + Vite (pasta `frontend/`, build estático servido pelo Django quando houver build).
- Documentação: MkDocs + Material (site publicado no GitHub Pages).
- Banco de dados: SQLite em desenvolvimento (arquivo `db.sqlite3`).

## Estrutura de Pastas (src/monitoria)

```
src/monitoria/
├── manage.py                 # Entrypoint do Django
├── db.sqlite3                # Banco de desenvolvimento
  ├── (scripts de teste removidos)      
├── frontend/                 # (Opcional) App React; build pode ser servido pelo Django
├── staticfiles/              # Pasta de arquivos estáticos coletados (collectstatic)
├── myproject/                # Configurações do projeto Django
│   ├── settings.py           # Apps, DB, DRF, CORS, AUTH_USER_MODEL, static, templates
│   ├── urls.py               # Rotas de nível de projeto
│   └── ...
└── myapp/                    # App principal da Monitoria
    ├── models.py             # Modelos de domínio (Usuario, Aluno, Professor, Curso, Disciplina, Vaga, Candidatura, etc.)
    ├── serializers.py        # Serializers DRF (inclui dados aninhados úteis no frontend)
    ├── views.py              # Views/Endpoints: cadastro, login, vagas, candidaturas
    ├── urls.py               # Rotas da API (registradas pelo router + auth)
    ├── admin.py              # Registro do admin (Usuario com UserAdmin e demais modelos)
    ├── management/commands/seed.py  # Comando para popular dados de teste
    ├── templates/admin/base_site.html # Override do Admin com botão "Voltar" e "Ir para o site"
    ├── migrations/           # Migrations do Django
    ├── login.md              # Especificação inicial de autenticação
    ├── models.md             # Observações/modelagem do domínio
    └── tests.py              # (Opcional) testes unitários do app
```

Arquivos de documentação principais na raiz do repositório:
- `API_BACKEND.md`: documentação detalhada dos endpoints (métodos, payloads e exemplos).
- `docs/`: site do MkDocs (Material). Diagramas e páginas em `docs/Elaboracao/`.

## Como Rodar Localmente

Pré-requisitos: Python 3.10+, pip, virtualenv (recomendado), Node (apenas para o frontend, opcional).

1) Criar e ativar ambiente virtual (recomendado):
- Linux/macOS:
  - `python -m venv .venv`
  - `source .venv/bin/activate`

2) Instalar dependências Python na raiz do repo:
- `pip install -r requirements.txt`
  - Observação: dependências do MkDocs estão comentadas por padrão; se for gerar a documentação local, descomente ou instale: `mkdocs mkdocs-material mkdocs-minify-plugin mkdocs-mermaid2-plugin`.

3) Migrar o banco e criar dados:
- `cd src/monitoria`
- `python manage.py makemigrations && python manage.py migrate`
- Opcional: criar superusuário: `python manage.py createsuperuser`
- Popular dados de teste (recomendado): `python manage.py seed`
  - Cria usuários exemplo (Aluno e Professor), Curso, Disciplina, Vaga e uma Candidatura.

4) Subir o servidor:
- `python manage.py runserver`
- API em `http://127.0.0.1:8000/`
- Admin em `http://127.0.0.1:8000/admin/` (superuser ou admin/admin se já criado no seed/etapas anteriores)

5) Validar rápido a API (opcional):
- `cd src/monitoria`
  (Scripts de teste internos removidos conforme limpeza solicitada)

## Autenticação e Sessão

- Modelo de usuário: `myapp.Usuario` (herda de `AbstractUser`).
- Perfis: `Aluno`, `Professor` e `Coordenador` via relações OneToOne com `Usuario`.
- Autenticação: **Token Authentication** (recomendado para frontend) + `SessionAuthentication` (para admin/navegação web).
- Login: retorna `token` e `tipo_usuario` para uso no frontend.
- Frontend deve enviar: `Authorization: Token <token>` no header de cada requisição.

Principais rotas de autenticação (resumo):
- `POST /api/auth/cadastro/` – cria `Usuario` + perfil (Aluno/Professor) e retorna token
- `POST /api/auth/login/` – autentica, inicia sessão e retorna token + tipo de usuário
- `GET /api/auth/me/` – devolve informações do usuário autenticado (requer token)
- `POST /api/auth/logout/` – encerra sessão e revoga token
- `POST /api/auth/token/` – endpoint alternativo padrão do DRF para obter token

Detalhes completos: ver `API_BACKEND.md` e `FRONTEND_INTEGRATION.md`.

## Vagas e Candidaturas (lógica de filtros e permissões)

- `GET /api/vagas/`
  - Aluno: vê apenas vagas Abertas do seu Curso (filtro automático por perfil + curso)
  - Professor: vê apenas vagas que ele criou
  - Filtros extras por querystring: `?nome=`, `?periodo=`, `?tipo=`
- `POST /api/vagas/` – Professor cria vaga (valida vínculo com Disciplina e propriedade)
- `PUT/PATCH/DELETE /api/vagas/{id}/` – Professor dono da vaga pode editar/excluir
- `GET /api/vagas/{id}/candidaturas/` – Professor vê candidaturas daquela vaga

- `GET /api/candidaturas/`
  - Aluno: vê apenas suas candidaturas
  - Professor: vê candidaturas das suas vagas
- `POST /api/candidaturas/` – Aluno cria candidatura; `aluno_id` inferido do usuário autenticado
- `POST /api/candidaturas/{id}/marcar_entrevista/` – Professor marca entrevista para uma candidatura

## Modelos (resumo do domínio)

- `Usuario (AbstractUser)` – base para autenticação.
- `Aluno` – perfil do aluno (matrícula, curso, histórico, etc.).
- `Professor` – perfil do professor.
- `Coordenador` – perfil do coordenador.
- `Curso` – cursos da instituição; coordenadores relacionados (M:N com Coordenador).
- `Disciplina` – pertence a um Curso e a um Professor; nome pode se repetir em cursos/professores distintos (unique por nome+professor+curso).
- `VagaMonitoria` – associada a uma Disciplina e a um Professor; status (Aberta/Fechada), tipo (Monitoria/TA), CR mínimo, horas, remuneração, descrição.
- `Candidatura` – associada a um Aluno e a uma Vaga; status e data de criação.
- `HistoricoAlunoDisciplina` – CR por disciplina do aluno (unique por aluno+disciplina).

Regras importantes implementadas:
- Vaga só pode ser criada/editada pelo Professor responsável pela Disciplina.
- Aluno só vê vagas do próprio Curso e candidaturas próprias.
- Professor vê apenas suas vagas e candidaturas dessas vagas.

## Admin do Django

- Local: `/admin/`
- `myapp/templates/admin/base_site.html` adiciona botões: "Voltar" (history.back) e "Ir para o site".
- `Usuario` registrado com `UserAdmin` (melhor interface no admin).

## Documentação (MkDocs)

- Site: GitHub Pages do repositório (ver README principal ou link da pipeline)
- Configuração: `mkdocs.yml` na raiz do repositório.
- Páginas relevantes:
  - `docs/Elaboracao/diagrama_de_classes.md`
  - `docs/Elaboracao/casos_de_uso.md`
  - `docs/Elaboracao/diagrama_de_sequencia.md`
- Diagramas (PlantUML) em `docs/Elaboracao/plantuml-project/diagrams/*.puml` e `.svg` gerados.

Para gerar ou atualizar documentação localmente:
- Instalar dependências do MkDocs (ver `requirements.txt` ou instalar diretamente):
  - `pip install mkdocs mkdocs-material mkdocs-minify-plugin mkdocs-mermaid2-plugin`
- Rodar:
  - `mkdocs serve` (live reload)
  - `mkdocs build` (gera `site/`)
  - `mkdocs gh-deploy` (publica no GitHub Pages)

## Fluxos Principais (alto nível)

- Cadastro/Login: cria usuário + perfil e autentica; retorna `tipo_usuario` para redirecionamento.
- Aluno: vê vagas do próprio curso, pode filtrar, ver detalhes e se candidatar; acompanha candidaturas.
- Professor: cria/edita/exclui vagas das suas disciplinas; vê candidaturas das vagas; marca entrevistas.

Diagramas que ilustram os fluxos (ver páginas no MkDocs):
- Diagrama de Classes (conceitual)
- Casos de Uso
- Sequências: Cadastro/Login, Aluno Candidatura, Professor Vagas

## Troubleshooting

- "no such column: myapp_usuario.password":
  - Causa: migrações antigas conflitando com `AbstractUser`.
  - Solução: remover `db.sqlite3` e migrations antigas de `myapp`, recriar migrações e migrar novamente, depois `createsuperuser` e/ou `seed`.
- CSRF em chamadas do frontend:
  - Use `credentials: 'include'` e inclua cabeçalho/cookie CSRF conforme necessário nas requisições POST/PUT/DELETE.
- Permissões negadas ao editar vaga:
  - Verifique se o usuário é o Professor dono da vaga e se a Disciplina pertence a ele.

## Contas de Exemplo (seed)

- Superuser: `admin` / `admin` (se criado manualmente; o comando `seed` cria usuários comuns)
- Aluno: `joao@ibmec.edu.br` / `senha123`
- Professor: `ana.silva@ibmec.edu.br` / `senha123`

## Referências Rápidas

- Endpoints completos: `API_BACKEND.md`
- Configuração DRF/CORS/Auth: `src/monitoria/myproject/settings.py`
- Modelos: `src/monitoria/myapp/models.py`
- Serializers: `src/monitoria/myapp/serializers.py`
- Views/Endpoints: `src/monitoria/myapp/views.py`
- Rotas API: `src/monitoria/myapp/urls.py`
- Seed de dados: `src/monitoria/myapp/management/commands/seed.py`
- Customização do admin: `src/monitoria/myapp/templates/admin/base_site.html`

---

Se precisar de ajuda para integrar o frontend ou expandir o fluxo do Coordenador, há espaço para evoluir a partir desta base (perfis, permissões, filtros e testes já preparados).
