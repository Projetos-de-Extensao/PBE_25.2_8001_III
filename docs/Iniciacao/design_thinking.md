---
id: dt
title: Design Thinking - Plataforma de Gestão de Monitoria IBMEC
---

## **Design Thinking**

### **1. Capa**

- **Título do Projeto**: Plataforma de Gestão de Monitoria IBMEC
- **Nome da Equipe**: Equipe do Projeto
- **Data**: 25 de setembro de 2025
- **Organização**: IBMEC (Setor CASA)

---

### **2. Introdução**

- **Contexto do Projeto**: O setor CASA (Coordenação de Apoio ao Sucesso Acadêmico) do IBMEC realiza o processo de análise de candidaturas para monitoria de forma manual. Este método é ineficiente, descentralizado e resulta em sobrecarga de trabalho para a equipe, demora na avaliação, e potencial para erros humanos.
- **Objetivo**: O objetivo principal é desenvolver uma plataforma digital para automatizar e centralizar o processo de análise e seleção das candidaturas de monitoria. A ferramenta busca acelerar a seleção, reduzir erros, centralizar as informações e melhorar a comunicação e a transparência para os candidatos.
- **Público-Alvo**: Os principais usuários são os Coordenadores e administradores do setor CASA, responsáveis pela gestão do processo, e os Alunos candidatos às vagas de monitoria. A equipe de TI do IBMEC também é envolvida para a integração com sistemas existentes.
- **Escopo**: O sistema será focado exclusivamente na análise e gestão das candidaturas. Funcionalidades como agendamento de sessões de monitoria ou avaliação de desempenho dos monitores selecionados não fazem parte do escopo deste projeto.

---

### **3. Fases do Design Thinking**

#### **3.1. Empatia**

- **Pesquisa**: A compreensão do problema foi alcançada através de discussões em equipe (Brainstorm) e análise do processo atual do setor CASA. Foram levantados os principais desafios enfrentados pelos administradores e pelos alunos.
- **Insights**:
    - **Dores do Usuário (CASA)**: O processo manual gera um alto volume de trabalho, atrasos, risco de erros e dificulta a organização e análise dos dados dos candidatos.
    - **Dores do Usuário (Alunos)**: Os candidatos enfrentam atrasos, incertezas e falta de transparência sobre o status de suas candidaturas.
    - **Necessidade Central**: Existe uma necessidade clara de uma solução automatizada para tornar o processo mais ágil, confiável e eficiente para todos os envolvidos.
- **Personas**:
    - **Coordenadores/Administradores do CASA**: Usuários que gerenciam todo o processo. Precisam publicar vagas, analisar candidaturas aplicando filtros (curso, notas), aprovar/rejeitar candidatos e gerar relatórios para tomada de decisão.
    - **Alunos Candidatos**: Estudantes que se inscrevem nas vagas. Precisam submeter suas informações (dados pessoais, histórico acadêmico) e acompanhar o status de sua candidatura de forma transparente.

#### **3.2. Definição**

- **Problema Central**: Como podemos otimizar o processo de seleção de monitores para o setor CASA, reduzindo o trabalho manual, os erros e a demora, ao mesmo tempo em que melhoramos a experiência dos alunos candidatos?
- **Pontos de Vista (POV)**:
    - O **coordenador do CASA** precisa de uma forma de **centralizar e filtrar as candidaturas** para **acelerar a seleção e reduzir erros manuais**.
    - O **aluno candidato** precisa de um meio de **acompanhar o status de sua aplicação** para **reduzir a incerteza e ter mais transparência no processo**.

#### **3.3. Ideação**

- **Brainstorming**: Durante a sessão de brainstorm, a equipe gerou diversas ideias para funcionalidades essenciais. As principais foram:
    - Cadastro e submissão de candidaturas pelos alunos.
    - Painel administrativo para análise, aprovação e rejeição.
    - Geração de relatórios dinâmicos e envio de notificações automáticas.
    - Integração com sistemas acadêmicos para validar dados dos alunos.
- **Seleção de Ideias**: As ideias foram selecionadas com base em sua capacidade de resolver diretamente os problemas identificados na fase de empatia, focando na automação, centralização e comunicação.
- **Ideias Selecionadas**: As ideias selecionadas foram formalizadas como requisitos funcionais do sistema.
    - **RF01-RF03**: Permitir o cadastro de usuários e a gestão de vagas e candidaturas.
    - **RF04-RF05**: Permitir a análise (com filtros) e a aprovação/rejeição de candidaturas.
    - **RF06, RF08**: Enviar notificações automáticas e permitir comunicação direta.
    - **RF07**: Gerar relatórios dinâmicos.
    - **RF09**: Integrar com o sistema acadêmico do IBMEC.

#### **3.4. Prototipagem**

- **Descrição do Protótipo**: O protótipo será uma plataforma web responsiva, acessível via desktop e dispositivos móveis. Ele simulará os fluxos principais dos usuários:
    - **Fluxo do Aluno**: Cadastro, submissão de candidatura e visualização do status.
    - **Fluxo do Coordenador**: Publicação de vaga, visualização da lista de candidatos, aplicação de filtros e aprovação/rejeição de uma candidatura.
- **Materiais Utilizados**: Ferramentas de design de interface (UI/UX) para criar wireframes e protótipos navegáveis, seguidas pelo desenvolvimento de um MVP (Produto Mínimo Viável) com as tecnologias web definidas para o projeto.
- **Testes Realizados**: O protótipo será testado para validar a usabilidade e a eficácia na resolução dos problemas centrais, seguindo os principais casos de uso definidos.

#### **3.5. Teste**

- **Feedback dos Usuários**: O plano é apresentar o protótipo a usuários reais (coordenadores do CASA e alunos) para coletar feedback sobre a clareza, facilidade de uso e se a solução atende às suas necessidades.
- **Ajustes Realizados**: Com base no feedback, serão realizados ajustes na interface, nos fluxos de navegação e nas funcionalidades antes da implementação final.
- **Resultados Finais**: A solução final será uma plataforma web que atenda a todos os critérios de aceitação, como permitir que alunos submetam candidaturas, que coordenadores gerenciem o processo de ponta a ponta e que o sistema envie notificações e gere relatórios de forma automatizada.

---

### **4. Conclusão**

- **Resultados Obtidos**: Através do processo de Design Thinking, foi possível alinhar a equipe, definir claramente o problema a ser resolvido e elicitar os requisitos essenciais para a plataforma, garantindo que a solução proposta esteja centrada nas necessidades dos seus usuários.
- **Próximos Passos**: O planejamento do projeto segue as seguintes etapas:
    - **Curto prazo**: Desenvolvimento e testes de um MVP.
    - **Médio prazo**: Implantação de um projeto piloto com algumas disciplinas.
    - **Longo prazo**: Expansão da plataforma para todas as monitorias da instituição.
- **Aprendizados**: A aplicação do processo reforçou a importância de entender profundamente as dores dos usuários antes de projetar uma solução. Ficou evidente que a automação de tarefas manuais e a centralização da informação são cruciais para a eficiência operacional do setor CASA e para a satisfação dos alunos.

---

### **5. Anexos**

- Documento de Visão
- Mapa Mental do Projeto
- Documento de Brainstorm
- Especificação de Requisitos (Funcionais e Não Funcionais)
- Diagrama de Casos de Uso