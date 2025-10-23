# Guia Rápido de Desenvolvimento

## 🚀 Início Rápido

### Iniciar o Servidor (Produção)
```bash
cd src/monitoria
source ../../.venv/bin/activate
python manage.py runserver
```
Acesse: http://127.0.0.1:8000/

### Desenvolvimento Frontend (Hot Reload)
```bash
cd src/monitoria/frontend
npm run dev
```
Acesse: http://localhost:5173/

## 🔨 Comandos Úteis

### Backend (Django)

**Criar novas migrações**
```bash
python manage.py makemigrations
```

**Aplicar migrações**
```bash
python manage.py migrate
```

**Criar superusuário (admin)**
```bash
python manage.py createsuperuser
```

**Acessar shell interativo**
```bash
python manage.py shell
```

**Coletar arquivos estáticos**
```bash
python manage.py collectstatic --noinput
```

### Frontend (React + Vite)

**Instalar dependências**
```bash
npm install
```

**Modo desenvolvimento**
```bash
npm run dev
```

**Build de produção**
```bash
npm run build
```

**Após fazer o build, colete os estáticos**
```bash
cd ../  # voltar para src/monitoria
python manage.py collectstatic --noinput
```

## 📁 Estrutura de Arquivos Importantes

```
src/monitoria/
├── myapp/
│   ├── models.py          # Modelos do banco de dados
│   ├── views.py           # Views e endpoints da API
│   ├── serializers.py     # Serializers do DRF
│   ├── urls.py            # URLs do app
│   └── admin.py           # Configuração do admin
├── myproject/
│   ├── settings.py        # Configurações Django
│   └── urls.py            # URLs principais
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Componente principal React
│   │   ├── main.jsx       # Entry point
│   │   ├── components/    # Componentes React
│   │   └── services/
│   │       └── api.js     # Cliente da API
│   ├── build/             # Build de produção
│   └── vite.config.js     # Config do Vite
└── manage.py
```

## 🔌 API Endpoints

### Autenticação
- `POST /api/auth/login/` - Login
- `POST /api/auth/cadastro/` - Cadastro

### Recursos
- `GET /api/vagas/` - Lista vagas
- `GET /api/vagas/abertas/` - Vagas abertas
- `GET /api/alunos/` - Lista alunos
- `GET /api/candidaturas/` - Lista candidaturas

Navegue em: http://127.0.0.1:8000/api/ para ver todos os endpoints

## 🐛 Troubleshooting

### Porta em uso
```bash
pkill -f "manage.py runserver"
```

### Limpar cache do frontend
```bash
cd frontend
rm -rf .vite node_modules
npm install
```

### Resetar banco de dados
```bash
rm db.sqlite3
python manage.py migrate
```

## 📝 Workflow de Desenvolvimento

1. **Fazer mudanças no frontend:**
   - Edite arquivos em `frontend/src/`
   - Teste com `npm run dev` (hot reload)
   - Quando satisfeito, faça `npm run build`
   - Execute `python manage.py collectstatic --noinput`

2. **Fazer mudanças no backend:**
   - Edite models/views/serializers em `myapp/`
   - Se mudou models: `python manage.py makemigrations && python manage.py migrate`
   - Teste com `python manage.py runserver`

3. **Adicionar nova dependência Python:**
   - `pip install <pacote>`
   - Atualize `requirements.txt` se necessário

4. **Adicionar nova dependência JavaScript:**
   - `cd frontend && npm install <pacote>`
   - Faça rebuild: `npm run build`
