# Kit de revisão de contratos com agentes

Kit da Prática 1 do treinamento "Sistemas Multiagentes no VS Code" (Rede D'Or São Luiz · Inteli · 24/09/2026). Todo o conteúdo é fictício, inclusive o contrato, as partes, a política e as decisões.

## O que o kit contém

```
revisao-contratos/
├─ AGENTS.md                         regras que valem para todos os agentes
├─ .github/agents/
│  ├─ orquestrador.agent.md          conduz o caso pela tabela de roteamento
│  ├─ extrator.agent.md              contrato → clausulas.md, planilha → precos.md
│  ├─ analista-contrato.agent.md     Analista A: lê cláusula por cláusula
│  ├─ analista-politica.agent.md     Analista B: lê regra por regra
│  ├─ consolidador.agent.md          compara A e B e grava consenso.md
│  ├─ revisor.agent.md               confere a evidência e decide as divergências
│  └─ redator.agent.md               redige o parecer ao Jurídico
├─ .github/skills/                   os seis procedimentos que os agentes executam
├─ conceitos/                        política, decisões anteriores e cláusulas-padrão
├─ modelos/                          cabeçalho de passagem e modelo de estado.md
├─ scripts/ler_precos.py             leitor da planilha (Python 3, só biblioteca padrão)
└─ casos/2026-031/                   o contrato a revisar, a planilha e o estado
```

## Como executar no VS Code

1. Extraia o arquivo e abra a pasta `revisao-contratos` no VS Code, pelo menu Arquivo › Abrir Pasta. Abra a pasta do kit, e não uma pasta acima dela, porque o Copilot procura `.github/agents/` na raiz do que está aberto.
2. Abra o Chat do Copilot e, no seletor de agentes, escolha **Orquestrador de revisão**. Os demais papéis não aparecem no seletor porque só o orquestrador os chama.
3. Envie a mensagem: `Conduza o caso casos/2026-031 até o parecer.`
4. Aprove as ações que o Copilot pedir, lendo cada uma antes. A única execução no terminal é a do script da planilha.
5. Acompanhe `casos/2026-031/estado.md` enquanto o caso avança. Cada decisão do orquestrador ganha uma linha com o motivo.

Se os agentes não aparecerem no seletor, pesquise por "agents" e por "skills" nas configurações do VS Code e confirme que os agentes personalizados e as skills estão habilitados.

## Modo passo a passo

Se a chamada de subagentes não estiver disponível no seu ambiente, execute cada etapa à mão no modo Agent, invocando a skill com barra e indicando o caso:

1. `/extrair-clausulas casos/2026-031` e depois `/ler-planilha-precos casos/2026-031`
2. `/confrontar-politica casos/2026-031 sentido contrato → política, grave achados-a.md`
3. Abra uma conversa nova, para que o segundo analista não veja o primeiro, e envie `/confrontar-politica casos/2026-031 sentido política → contrato, grave achados-b.md`
4. `/consolidar-consenso casos/2026-031`
5. `/conferir-citacao casos/2026-031`
6. `/redigir-parecer casos/2026-031`

Nesse modo, você faz o papel do orquestrador e atualiza o `estado.md` a cada etapa.

## O que conferir ao final

- Quantas cláusulas o Extrator encontrou no corpo e quantas o sumário lista.
- Qual é o valor anual calculado a partir da planilha e qual é o valor da cl. 7.1.
- Quantos itens terminaram em consenso, em divergência e como achado único.
- Quais divergências o Revisor decidiu e com que trecho.
- Três cláusulas escolhidas por você, lidas no contrato original, comparadas com o que o parecer diz delas.

## Para rodar de novo

Apague os arquivos gerados em `casos/2026-031/` (todos, exceto `contrato.md`, `anexo-precos.csv` e `estado.md`) e restaure o `estado.md` a partir de `modelos/estado.md`. Rodar duas vezes e comparar os dois pareceres mostra quanto o resultado varia entre execuções.
