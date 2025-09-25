# Diagrama de Classes Conceitual

Com base na análise de todos os documentos do projeto da **Plataforma de Gestão de Monitoria IBMEC**, foi elaborado o diagrama de classes conceitual abaixo.

Este diagrama foca nas principais entidades do sistema e em como elas se relacionam, conforme descrito nos documentos de visão, requisitos e brainstorm.

![Diagrama de Classes Conceitual](../plantuml-project/diagrams/diagrama_classes_conceitual.svg)

---

### Descrição Detalhada

#### **Classes e Atributos**

* **Usuario**: Classe base que representa qualquer usuário do sistema.
    * `id`, `nome`, `email`, `senha`
* **Aluno**: Herda de `Usuario` e representa um estudante candidato.
    * `matricula`, `curso`, `historicoAcademico`
* **Coordenador**: Herda de `Usuario` e representa um administrador do setor CASA.
    * `departamento`
* **Vaga**: Representa uma oportunidade de monitoria.
    * `id`, `titulo`, `descricao`, `requisitos`, `status`
* **Candidatura**: Classe que representa a submissão de um aluno a uma vaga.
    * `id`, `dataSubmissao`, `status`
* **Notificacao**: Usada para a comunicação com os usuários.
    * `id`, `mensagem`, `dataEnvio`, `status`

#### **Relacionamentos**

* **Herança**: `Aluno` e `Coordenador` são especializações de `Usuario`.
* **Coordenador e Vaga**: 1 `Coordenador` gerencia (0..*) `Vagas`.
* **Aluno e Candidatura**: 1 `Aluno` realiza (0..*) `Candidaturas`.
* **Vaga e Candidatura**: 1 `Vaga` recebe (0..*) `Candidaturas`.
* **Coordenador e Candidatura**: 1 `Coordenador` analisa (0..*) `Candidaturas`.
* **Usuario e Notificação**: 1 `Usuario` pode receber (0..*) `Notificacoes`.