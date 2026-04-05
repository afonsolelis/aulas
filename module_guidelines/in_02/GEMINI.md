# GEMINI.md - Contexto do Projeto IN02

## Visão Geral do Diretório
Este repositório contém o material didático, trilhas de autoestudo e templates de artefatos para a disciplina de **Refatoração e Arquitetura de Software (IN02)**. O foco central do curso é a aplicação do framework **RM-ODP** (Reference Model of Open Distributed Processing) e a gestão de **Requisitos Não Funcionais (RNF)** baseada nos 8 eixos da norma ISO/IEC 25010 (SWEBOK).

O projeto é estruturado para guiar o desenvolvimento de um software ao longo de 5 sprints, cobrindo desde a modelagem de negócios até a resiliência de redes e autenticação.

## Estrutura de Pastas e Arquivos Chave

### 1. `aulas/`
Contém os roteiros das 11 aulas do curso. Cada arquivo (ex: `aula_01.md`) define:
- **Visão RM-ODP:** Qual perspectiva do modelo está sendo trabalhada (Enterprise, Information, Computational, Engineering, Technological).
- **Metas e Checklists:** O que deve ser alcançado na aula.
- **Autoestudo:** Referências acadêmicas e técnicas profundas.
- **Template de Documentação:** Estrutura para o aluno documentar o progresso.

### 2. `autoestudos/`
Materiais de aprofundamento técnico e acadêmico. 
- `indice.md`: Mapa de dependências entre os temas e ordem recomendada de leitura.
- Arquivos individuais (ex: `aula_01_rnf_8_eixos.md`) que exploram conceitos como Métricas SRE, Modelagem Relacional, TDD, Design Patterns e Resiliência.

### 3. `artefatos/`
Templates e critérios de aceitação para as entregas de cada sprint.
- `sprint_01_artefato.md` a `sprint_05_artefato.md`: Definem o que deve ser entregue (ex: Minimundo, Diagramas UML, RTM, Suítes de Teste).

### 4. Arquivos de Configuração e Guia
- `refactor.txt`: Resumo prático completo do curso, incluindo a matriz de rastreabilidade RM-ODP e os critérios de avaliação das atividades ponderadas.
- `aulas/gemini.md`: Define uma "Skill de Pesquisa Acadêmica" para interações com IA, exigindo rigor científico e referências seminais.

## Metodologia e Convenções

### Os 8 Eixos de RNF (SWEBOK/ISO 25010)
Toda análise técnica e documentação neste projeto deve considerar os seguintes eixos:
1. **Usabilidade (USAB):** Facilidade de uso e satisfação.
2. **Confiabilidade (CONF):** Disponibilidade e tolerância a falhas.
3. **Desempenho (DES):** Tempo de resposta e latência.
4. **Suportabilidade (SUP):** Manutenibilidade e testabilidade.
5. **Segurança (SEG):** Integridade e autenticação.
6. **Capacidade (CAP):** Limites de dados e processamento.
7. **Restrições de Design (REST):** Padrões e stack tecnológica.
8. **Organizacionais (ORG):** Processos e políticas.

### Rastreabilidade (RTM)
O projeto enfatiza a **Matriz de Rastreabilidade de Requisitos (RTM)**, conectando:
`Persona -> Necessidade -> RF -> RN -> Endpoint -> Tela -> Teste -> Evidência`

## Uso e Instruções
Este diretório deve ser utilizado para:
1. **Seguir a Trilha de Aprendizado:** Consultar `aulas/` e `autoestudos/` sequencialmente.
2. **Gerar Documentação:** Utilizar os templates em `artefatos/` para descrever o desenvolvimento do sistema.
3. **Validar Arquitetura:** Garantir que as 5 visões do RM-ODP sejam contempladas na modelagem do projeto.
