# Benchmark de mercado: uso de IA em distribuidoras de energia

> **Documento fictício, preparado para exercício em sala.** As cinco distribuidoras, os
> indicadores e os resultados abaixo foram inventados para o treinamento e não descrevem
> nenhuma empresa real. Os conceitos (DEC, FEC, perdas não técnicas, IASC) seguem a
> terminologia regulatória brasileira, mas os números não vêm de fonte oficial.
> O documento contém, de propósito, inconsistências que um leitor atento deve apontar.

## 1. Escopo

Este relatório compara cinco distribuidoras de porte médio e grande quanto a indicadores de
continuidade, perdas e atendimento, e registra os casos de uso de inteligência artificial que
cada uma tornou públicos. Os indicadores estão na planilha `indicadores-distribuidoras.csv`,
que acompanha este documento. Os casos de uso foram levantados em relatórios anuais, artigos
técnicos e comunicados à imprensa, e a fonte de cada um está indicada ao final da seção.

## 2. Indicadores de desempenho

| Empresa | Ano | DEC (h) | FEC (int.) | Perdas NT (%) | TMA emergencial (min) | IASC | Atendimento digital (%) |
|---|---|---|---|---|---|---|---|
| Distribuidora Alfa | 2025 | 8,9 | 5,1 | 2,4 | 142 | 74,2 | 61 |
| Distribuidora Beta | 2025 | 7,2 | 4,3 | 6,8 | 118 | 71,5 | 68 |
| Distribuidora Gama | 2025 | 12,6 | 6,9 | 4,1 | 165 | 68,9 | 112 |
| Distribuidora Delta | 2024 | 14,1 | 7,8 | 9,3 | 190 | 66,0 | 44 |
| Distribuidora Épsilon | 2025 | 9,8 | 5,6 | 1,9 | 151 | n/d | 57 |

Legenda. DEC é a duração equivalente de interrupção por unidade consumidora, em horas por
ano. FEC é a frequência equivalente de interrupção, em número de interrupções por ano. Perdas
NT são as perdas não técnicas; salvo indicação em contrário na planilha, calculadas sobre o
mercado de baixa tensão. TMA emergencial é o tempo médio de atendimento a ocorrências
emergenciais. IASC é o Índice ANEEL de Satisfação do Consumidor.

A Distribuidora Beta apresenta o melhor desempenho em continuidade do grupo, com o menor DEC e
o menor FEC. A Distribuidora Épsilon apresenta as menores perdas não técnicas, o que a coloca
como referência no tema.

## 3. Casos de uso de IA reportados

### 3.1 Distribuidora Alfa: assistente de atendimento no WhatsApp

Assistente conversacional que recebe pedidos de segunda via, informação de falta de energia e
consulta de protocolo. Segundo o relatório anual de 2025, o assistente resolveu 70% dos
contatos recebidos no canal. O mesmo relatório define contato resolvido como aquele encerrado
sem transferência para atendente humano.

### 3.2 Distribuidora Beta: detecção de irregularidades de medição

Modelo de classificação que prioriza unidades consumidoras para inspeção a partir do histórico
de consumo. Segundo comunicado à imprensa, a iniciativa reduziu as perdas em 38%. O comunicado
não informa o período, a linha de base nem se a redução se refere às perdas totais ou às não
técnicas.

### 3.3 Distribuidora Gama: inspeção de linhas por imagem de drone

Visão computacional aplicada a imagens de drone para identificar isoladores danificados e
vegetação próxima à rede. Em piloto com 40 circuitos, o tempo médio de inspeção por circuito
caiu de 21 para 9 dias. O resultado foi publicado em artigo técnico apresentado em congresso
do setor.

### 3.4 Distribuidora Delta: previsão de carga horária

Modelo de previsão de carga por subestação, com horizonte de 48 horas. O erro médio absoluto
percentual passou de 4,7% no método anterior para 3,1%, medido ao longo de 2024.

### 3.5 Distribuidora Épsilon: consulta a normas para equipes de campo

Assistente interno que responde a perguntas das equipes de campo sobre procedimentos de
segurança, normas técnicas internas e módulos do PRODIST, citando o trecho do documento de
origem. A empresa não publicou indicador de resultado.

### 3.6 Panorama do setor

Levantamento de uma consultoria afirma que 60% das distribuidoras brasileiras já usam IA em
alguma operação. O levantamento não divulga a amostra nem a definição de uso adotada.

### Fontes declaradas

| Caso | Fonte |
|---|---|
| 3.1 Alfa | Relatório anual 2025 |
| 3.2 Beta | Comunicado à imprensa |
| 3.3 Gama | Artigo técnico em congresso |
| 3.4 Delta | Relatório de planejamento 2024 |
| 3.5 Épsilon | Apresentação institucional |
| 3.6 Setor | Pesquisa de consultoria, sem metodologia publicada |

## 4. Conclusão do relatório

As empresas que mais investiram em IA apresentam os melhores indicadores, e a recomendação é
priorizar a detecção de irregularidades, que teve o maior retorno reportado.
