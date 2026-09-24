# Molde para o seu fluxo multiagente

Molde da Prática 2 do treinamento "Sistemas Multiagentes no VS Code" (Rede D'Or São Luiz · Inteli · 24/09/2026). Ele traz o mesmo desenho do kit de revisão de contratos, com os campos entre colchetes a preencher para o processo do seu projeto.

## Conteúdo

```
meu-fluxo/
├─ PROMPT-DE-ARRANQUE.md             texto para colar no Chat e começar pela entrevista
├─ AGENTS.md                         regras gerais, a preencher
├─ .github/agents/
│  ├─ orquestrador.agent.md          tabela de roteamento, a preencher
│  └─ modelo-papel.agent.md          copie uma vez por papel
├─ .github/skills/
│  ├─ modelo-skill/SKILL.md          copie uma vez por procedimento
│  ├─ consolidar-consenso/SKILL.md   reaproveitada do kit de contratos
│  └─ conferir-citacao/SKILL.md      reaproveitada do kit de contratos
├─ conceitos/regras.md               regras citáveis por endereço, a preencher
├─ modelos/                          cabeçalho de passagem e estado.md
├─ casos/                            um caso por pasta, com dados fictícios
└─ exemplos/                         oito fluxos completos para usar como ponto de partida
```

## Exemplos

| Arquivo | Fluxo | Saída |
|---------|-------|-------|
| `01-glosas-excel.md` | Consolidação mensal de glosas por convênio | Planilha `.xlsx` |
| `02-giro-leitos-pptx.md` | Apresentação mensal do giro de leitos | Apresentação `.pptx` |
| `03-apresentacao-html.md` | Resumo da reunião de diretoria | Arquivo `.html` único |
| `04-auditoria-conta.md` | Auditoria de conta contra a tabela de conceitos | Achados e planilha de itens |
| `05-motivos-atraso-consenso.md` | Classificação de motivos de atraso com dois classificadores | Planilha e resumo |
| `06-notas-fiscais-pdf.md` | Conferência de nota fiscal contra pedido de compra | Planilha e fila de pendências |
| `07-lote-automatizado.md` | Triagem em lote de pendências de autorização | Fila e minutas |
| `08-recurso-glosa-docx.md` | Minuta de recurso de glosa | Documento `.docx` |

## Roteiro sugerido

1. Abra a pasta `meu-fluxo` no VS Code e leia o exemplo mais próximo do seu processo.
2. Cole o `PROMPT-DE-ARRANQUE.md` no Chat, no modo Agent, e responda à entrevista.
3. Aprove a tabela de etapas antes de o Copilot criar os arquivos.
4. Leia cada arquivo gerado e confira se todo papel tem "O que lhe é vedado" e se todo critério de aceite é verificável.
5. Crie um caso de teste com dados fictícios e execute só a primeira etapa. Acrescente a etapa seguinte quando a primeira passar no critério de aceite.

Saídas em Excel, PowerPoint e Word dependem de bibliotecas Python (`openpyxl`, `python-pptx`, `python-docx`). Se elas não estiverem disponíveis no seu ambiente, gere CSV ou HTML e registre a limitação no estado do caso.
