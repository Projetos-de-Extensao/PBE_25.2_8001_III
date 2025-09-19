---
id: especificacao_de_requisitos
title: Especificação de Requisitos – Plataforma de Gestão de Monitoria IBMEC (Setor CASA)
---

## 1. Introdução

Esta especificação de requisitos descreve as funcionalidades, restrições e requisitos do sistema de gestão de monitoria do IBMEC, conforme identificado nos documentos de visão, brainstorm e casos de uso. O objetivo é automatizar e centralizar o processo de seleção de monitores, reduzindo erros, acelerando o processo e facilitando o trabalho do setor CASA.

---

## 2. Visão Geral do Sistema

O sistema permitirá:
- Cadastro e submissão de candidaturas para vagas de monitoria.
- Gerenciamento e análise das candidaturas pelo setor CASA.
- Comunicação entre candidatos e equipe administrativa.
- Geração de relatórios dinâmicos.
- Integração com o sistema acadêmico do IBMEC.

---

## 3. Requisitos Funcionais

| ID   | Requisito                                                                                   |
|------|--------------------------------------------------------------------------------------------|
| RF01 | O sistema deve permitir o cadastro de usuários (alunos e coordenadores).                   |
| RF02 | O sistema deve permitir que alunos submetam candidaturas para vagas de monitoria.          |
| RF03 | O sistema deve permitir que coordenadores publiquem, editem e removam vagas de monitoria.  |
| RF04 | O sistema deve permitir que coordenadores visualizem, filtrem e analisem candidaturas.     |
| RF05 | O sistema deve permitir a aprovação ou rejeição de candidaturas.                           |
| RF06 | O sistema deve enviar notificações automáticas aos candidatos sobre o status da candidatura.|
| RF07 | O sistema deve gerar relatórios dinâmicos sobre o processo seletivo.                       |
| RF08 | O sistema deve permitir comunicação direta entre coordenadores e candidatos.                |
| RF09 | O sistema deve integrar-se ao sistema acadêmico para validação de dados dos candidatos.     |
| RF10 | O sistema deve ser acessível via desktop e dispositivos móveis.                             |

---

## 4. Requisitos Não Funcionais

| ID   | Requisito                                                                                   |
|------|--------------------------------------------------------------------------------------------|
| RNF01| O sistema deve garantir a segurança e privacidade dos dados dos usuários.                  |
| RNF02| O sistema deve ser responsivo, funcionando em diferentes tamanhos de tela.                 |
| RNF03| O sistema deve ter alta disponibilidade e desempenho adequado para o número de usuários.    |
| RNF04| O sistema deve ser integrado apenas ao processo de seleção, não incluindo gestão de sessões ou avaliação de desempenho dos monitores. |

---

## 5. Restrições

- O sistema não irá gerenciar agendamento de sessões de monitoria ou avaliação de desempenho dos monitores.
- O acesso ao painel administrativo será restrito aos coordenadores do setor CASA.
- A integração será feita apenas com o sistema acadêmico do IBMEC.

---

## 6. Casos de Uso Principais

### 6.1. Publicar Vaga de Monitoria
- **Ator:** Coordenador
- **Descrição:** Permite ao coordenador criar e publicar uma nova vaga de monitoria.

### 6.2. Submeter Candidatura
- **Ator:** Aluno
- **Descrição:** Permite ao aluno se candidatar a uma vaga de monitoria, preenchendo informações pessoais e acadêmicas.

### 6.3. Analisar Candidaturas
- **Ator:** Coordenador
- **Descrição:** Permite ao coordenador visualizar, filtrar, aprovar ou rejeitar candidaturas.

### 6.4. Gerar Relatórios
- **Ator:** Coordenador
- **Descrição:** Permite ao coordenador gerar relatórios sobre o processo seletivo.

### 6.5. Comunicação e Notificações
- **Atores:** Coordenador, Aluno
- **Descrição:** Permite o envio de mensagens e notificações automáticas sobre o status das candidaturas.

---

## 7. Critérios de Aceitação

- O sistema deve permitir que alunos se cadastrem e submetam candidaturas.
- O coordenador deve conseguir publicar vagas, analisar e aprovar/rejeitar candidaturas.
- O sistema deve enviar notificações automáticas aos candidatos.
- O sistema deve gerar relatórios dinâmicos.
- O sistema deve ser integrado ao sistema acadêmico do IBMEC.

---

## 8. Referências

- Documento de Visão
- Brainstorm do Projeto
- Casos de Uso

---

## 9. Versionamento

| Data       | Versão | Descrição                | Autor(es)         |
|------------|--------|--------------------------|-------------------|
| 19/09/2025 | 1.0    | Criação do documento     | Equipe do Projeto |
