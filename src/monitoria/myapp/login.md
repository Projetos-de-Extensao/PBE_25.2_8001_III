## Fluxo de Autenticação (URL: `/login`)

* O usuário poderá escolher entre duas opções:
    1.  Login
    2.  Cadastro

### 1. Cadastro (Feito pelo Usuário)

* O usuário deverá preencher todas as informações (semelhante ao cadastro de usuários do admin):
    * E-mail institucional (será o login)
    * Matrícula
    * Senha
    * Selecionar tipo: Professor ou Aluno
    * *Outras informações (histórico, disciplinas, etc.)*
* Após o cadastro, o usuário é adicionado ao banco de dados.

### 2. Login

* O usuário realiza o login com suas credenciais (e-mail institucional e senha).
* As credenciais são validadas.
* Após o login, o usuário é redirecionado para a URL correspondente ao seu tipo:
    * `/aluno`
    * `/admin`
    * `/professor`

---

## Área do Aluno (`/aluno`)

* **Visualização:** Serão exibidas as vagas disponíveis, **somente do curso dele**.
* **Filtros:** Opção de filtro de vagas por:
    * Nome
    * Período
    * Tipo (Monitoria/TA)
* **Ações:**
    * Aplicar candidatura.
    * Ver detalhes da vaga.

---

## Área do Professor (`/professor`)

* **Visualização:** Serão exibidas as vagas das disciplinas que ele leciona.
* **Ações:**
    * **Criar** vaga.
    * **Excluir** vaga.
    * **Editar** vaga (mudando status, descrição, etc.).
    * **Ver candidaturas**.
    * Marcar entrevista com alguns candidatos.