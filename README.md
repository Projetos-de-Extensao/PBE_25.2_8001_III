# Plataforma de Gestão de Monitoria IBMEC (Setor CASA)

**Código da Disciplina**: IBM8936

## 📋 Sobre

Sistema integrado para automatizar e centralizar o processo de seleção de monitores do IBMEC, facilitando o trabalho do setor CASA, reduzindo erros e acelerando o processo seletivo.

## ✨ Funcionalidades Principais

- 👥 Cadastro de usuários (alunos, professores e coordenadores)
- 📝 Submissão e análise de candidaturas para vagas de monitoria
- 📢 Publicação, edição e remoção de vagas
- ✅ Aprovação e rejeição de candidaturas
- 🔔 Sistema de notificações
- 📊 Filtros e visualização de vagas
- 💬 Gestão de perfis de usuários

## 🛠️ Tecnologias

### Backend
- **Django 5.2.7** - Framework web
- **Django REST Framework** - API RESTful
- **SQLite** - Banco de dados
- **Python 3.x** - Linguagem de programação

### Frontend
- **React** - Biblioteca JavaScript
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

## 🚀 Como Executar

### Pré-requisitos

- Python 3.8+
- Node.js 18+ (LTS)
- Git

### Instalação e Execução

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd "PBE_25.2_8001_III"
```

2. **Configure o ambiente virtual Python**
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou
.venv\Scripts\activate  # Windows
```

3. **Instale as dependências do backend**
```bash
pip install -r requirements.txt
```

4. **Configure o banco de dados**
```bash
cd src/monitoria
python manage.py migrate
```

5. **Instale as dependências do frontend**
```bash
cd frontend
npm install
```

6. **Faça o build do frontend**
```bash
npm run build
```

7. **Colete os arquivos estáticos**
```bash
cd ..  # voltar para src/monitoria
python manage.py collectstatic --noinput
```

8. **Inicie o servidor**
```bash
python manage.py runserver
```

9. **Acesse a aplicação**

Abra seu navegador em: **http://127.0.0.1:8000/**

## 🧹 Resetar Dados (Ambiente Limpo)

Para limpar completamente os dados de teste e deixar o sistema vazio (ex: antes de usar em outro contexto), foi criado o comando de gerenciamento `reset_data`.

### Uso Básico
```bash
python manage.py reset_data --yes
```
Isso remove todos os registros (usuários, perfis, vagas, candidaturas, cursos, disciplinas, tokens).

### Criar um Superuser Após Reset
```bash
python manage.py reset_data --yes --create-superuser admin@ibmec.edu.br --password admin123
```
Cria um superuser limpo para acessar o admin.

### Manter Superusers Existentes
```bash
python manage.py reset_data --yes --keep-superuser
```
Remove todos os dados exceto usuários marcados como superuser.

### Reset Profundo (flush)
```bash
python manage.py reset_data --yes --flush
```
Executa `flush` do Django (remove também sessões e dados genéricos de outras apps).

### Segurança
- Sem `--yes` o comando pede confirmação digitando `CONFIRMAR`.
- Recomenda-se fazer backup do banco se quiser preservar algo antes.

### Repopular Após Reset
```bash
python manage.py seed
```
Restaura dados de demonstração (vagas, usuários de teste, etc.).

## 🔧 Desenvolvimento

### Modo de desenvolvimento do frontend (com hot-reload)

Se você precisa fazer alterações no frontend com hot-reload:

```bash
cd src/monitoria/frontend
npm run dev
```

O Vite irá rodar em: **http://localhost:5173/**

Após fazer as alterações, faça o build novamente:

```bash
npm run build
cd ..
python manage.py collectstatic --noinput
```

## 📁 Estrutura do Projeto

```
PBE_25.2_8001_III/
├── src/
│   └── monitoria/              # Projeto Django principal
│       ├── myapp/              # App Django (models, views, serializers)
│       ├── myproject/          # Configurações Django
│       ├── frontend/           # Aplicação React
│       │   ├── src/
│       │   ├── build/          # Build de produção
│       │   └── package.json
│       ├── manage.py
│       └── db.sqlite3
├── docs/                       # Documentação do projeto
├── .venv/                      # Ambiente virtual Python
└── README.md
```

## 🔑 Credenciais de Teste

O sistema vem com alguns usuários de teste:

**Aluno:**
- Email: `aluno@ibmec.edu.br`
- Senha: `senha123`

**Admin/Professor:**
- Email: `admin@ibmec.edu.br`
- Senha: `admin123`

**Coordenador:**
- Email: `coord@ibmec.edu.br`
- Senha: `senha123`

## 📚 API Endpoints

A API REST está disponível em `/api/`:

- `GET /api/vagas/` - Lista todas as vagas
- `GET /api/vagas/abertas/` - Lista vagas abertas
- `POST /api/auth/login/` - Login de usuário
- `POST /api/auth/cadastro/` - Cadastro de usuário
- `GET /api/alunos/` - Lista alunos
- `GET /api/candidaturas/` - Lista candidaturas

Para ver todos os endpoints, acesse: **http://127.0.0.1:8000/api/**

## 👥 Equipe

- Pietro Baldo Albuquerque
- Vitor Alexandre Ribeiro
- Matheus Reis De Carvalho
- Guilherme Reis de Carvalho

## 📄 Licença

Este projeto está sob a licença especificada no arquivo LICENSE.