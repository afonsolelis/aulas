# Autoestudo: Gerenciamento de Estado Global e Heurísticas de Usabilidade

## Sumário
1. [Contexto e Objetivo](#contexto-e-objetivo)
2. [Perspectiva dos Corpos de Conhecimento](#perspectiva-dos-corpos-de-conhecimento)
3. [As 10 Heurísticas de Nielsen](#as-10-heurísticas-de-nielsen)
4. [Gerenciamento de Estado Global](#gerenciamento-de-estado-global)
5. [Fechamento da RTM — Evidências Completas](#fechamento-da-rtm--evidências-completas)
6. [Consolidação dos RNFs de Usabilidade e Segurança](#consolidação-dos-rnfs-de-usabilidade-e-segurança)
7. [Checklist de Validação](#checklist-de-validação)
8. [Referências](#referências)
9. [Glossário](#glossário)

---

## Contexto e Objetivo

A Aula 9 fecha a visão **Technology** do RM-ODP: a interface deve estar estabilizada, consistente e testada. O artefato da **Sprint 4** exige a RTM completa (`Persona → RF → Endpoint → Teste → Evidência`), o registro dos RNFs introdutórios (tabela de atendimento) e a documentação consolidada.

---

## Perspectiva dos Corpos de Conhecimento

### SWEBOK v3 — Software Quality: Verification and Validation

O SWEBOK distingue:

| Atividade | Pergunta Central | Momento |
|-----------|-----------------|---------|
| **Verificação** | "Estamos construindo o produto corretamente?" | Durante o desenvolvimento |
| **Validação** | "Estamos construindo o produto correto?" | Com o usuário / stakeholder |

No contexto front-end:
- **Verificação:** Testes automatizados Jest, TypeScript sem erros, ESLint limpo
- **Validação:** Telas atendem às personas, heurísticas de usabilidade respeitadas

### ISO 9241-11:2018 — Usabilidade

A ISO 9241-11 define usabilidade em três dimensões mensuráveis:

| Dimensão | Definição | Métrica Exemplo |
|----------|-----------|-----------------|
| **Eficácia** | O usuário consegue completar a tarefa? | Taxa de conclusão (%) |
| **Eficiência** | Com quanto esforço? | Número de cliques para completar o fluxo |
| **Satisfação** | O usuário ficou satisfeito? | Escala de avaliação subjetiva |

---

## As 10 Heurísticas de Nielsen

Jakob Nielsen (1994) definiu 10 princípios de usabilidade para avaliação heurística de interfaces:

### H1 — Visibilidade do Status do Sistema

O sistema deve sempre informar o usuário sobre o que está acontecendo.

```
✅ Spinner durante carregamento + mensagem "Salvando..."
✅ Toast de confirmação após ação bem-sucedida
✅ Barra de progresso em uploads

❌ Botão que trava sem feedback após clique
❌ Formulário que não indica qual campo tem erro
```

### H2 — Correspondência entre Sistema e Mundo Real

Usar linguagem do usuário, não jargão técnico.

```
✅ "Adicionar ao Carrinho" (não "POST /cart/items")
✅ "Valor" em vez de "preco_cents"
✅ "R$ 49,90" em vez de "4990 centavos"
```

### H3 — Controle e Liberdade do Usuário

Saídas claramente marcadas; desfazer e refazer.

```
✅ Confirmação antes de deletar ("Tem certeza? Não é possível desfazer")
✅ Botão "Cancelar" em formulários longos
✅ Navegação de volta sem perder dados preenchidos (auto-save)
```

### H4 — Consistência e Padrões

Mesma ação, mesma aparência, mesmo comportamento.

```
✅ Botão primário sempre azul em toda a aplicação
✅ Erros sempre em vermelho, abaixo do campo
✅ Datas sempre no formato DD/MM/AAAA
```

### H5 — Prevenção de Erros

Design que previne erros antes de acontecerem.

```
✅ Input de data com date picker (não texto livre)
✅ Desabilitar botão "Salvar" enquanto formulário inválido
✅ Confirmação de e-mail (campo duplo para dados críticos)
```

### H6 — Reconhecimento em vez de Lembrança

Minimizar a carga na memória do usuário.

```
✅ Mostrar prévia do arquivo selecionado (não apenas o nome)
✅ Breadcrumb de navegação ("Home > Produtos > Novo")
✅ Tooltip em ícones sem texto
```

### H7 — Flexibilidade e Eficiência de Uso

Atalhos para usuários experientes; padrões para novatos.

```
✅ Atalhos de teclado em ações frequentes (Ctrl+S salva)
✅ Filtros avançados colapsados por padrão
✅ Ordenação clicando no cabeçalho da coluna
```

### H8 — Design Estético e Minimalista

Não incluir informação irrelevante. Cada elemento compete pela atenção.

```
✅ Formulário de cadastro com apenas campos obrigatórios visíveis
✅ Erro específico (não todas as mensagens de validação ao mesmo tempo)
❌ Dashboard com 15 gráficos em uma tela
```

### H9 — Ajudar Usuários a Reconhecer, Diagnosticar e Recuperar de Erros

Mensagens de erro em linguagem simples, indicando o problema e sugerindo solução.

```
✅ "O e-mail informado já está cadastrado. Tente fazer login ou recuperar sua senha."
✅ "O campo 'Nome' é obrigatório." (não "validation_error: name required")
❌ "Error 422: Unprocessable Entity"
```

### H10 — Ajuda e Documentação

Quando necessário, fornecer documentação fácil de buscar.

```
✅ Tooltip contextual em campos complexos
✅ Link "Como funciona?" próximo de funcionalidades não óbvias
✅ Mensagem de vazio com orientação ("Nenhum produto cadastrado. Clique em + para adicionar.")
```

---

## Gerenciamento de Estado Global

### Quando Estado Global é Necessário

| Estado | Local (useState) | Global (Context/Store) |
|--------|-----------------|----------------------|
| Formulário de um componente | ✅ useState | — |
| Usuário autenticado | — | ✅ Context |
| Carrinho de compras | — | ✅ Context ou Zustand |
| Lista de produtos (server state) | — | ✅ React Query/TanStack Query |

### Context API — Para Estado de Aplicação

```typescript
// Contexto de autenticação
interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  );

  async function login(email: string, senha: string) {
    const response = await api.post<{ token: string; usuario: Usuario }>('/auth/login', { email, senha });
    setToken(response.data.token);
    setUsuario(response.data.usuario);
    localStorage.setItem('token', response.data.token);
  }

  function logout() {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
```

### React Query — Para Server State

```typescript
// Busca e cache de dados do servidor
const { data: produtos, isLoading, error } = useQuery({
  queryKey: ['produtos'],
  queryFn: () => api.get<Produto[]>('/produtos').then(r => r.data),
  staleTime: 5 * 60 * 1000, // considera cache fresco por 5 minutos
});

// Mutação com invalidação de cache
const { mutate: criarProduto } = useMutation({
  mutationFn: (dto: CriarProdutoRequest) =>
    api.post<Produto>('/produtos', dto).then(r => r.data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['produtos'] }); // refetch automático
  }
});
```

---

## Fechamento da RTM — Evidências Completas

### Formato da RTM Completa (Sprint 4)

| Persona | Necessidade | RF | Endpoint | Componente/Tela | Teste | Evidência |
|---------|-------------|----|-----------|-----------------  |-------|-----------|
| Mariana (gestora) | Ver estoque crítico | RF08 | `GET /produtos?estoque_critico=true` | `EstoqueDashboard` | `deve destacar produtos com estoque < mínimo` | `npm test -- --testNamePattern="estoque"` |
| João (comprador) | Criar pedido | RF03 | `POST /pedidos` | `PedidoNovo` | `deve retornar 422 com itens vazios` | Screenshot + `npm test` |

### Evidências Aceitas no Artefato

| Tipo de Evidência | Como Gerar | O que Comprova |
|------------------|------------|----------------|
| Saída de `npm test` | `npm test > resultado.txt` | Testes passando |
| `coverage/index.html` | `npm test -- --coverage` | Cobertura de código |
| Screenshot da interface | Captura de tela manual | Comportamento visual |
| Log de requisição | DevTools > Network | Chamada HTTP real funcionando |

---

## Consolidação dos RNFs de Usabilidade e Segurança

| RNF | Eixo | Heurística Nielsen | Decisão Técnica | Evidência |
|-----|------|--------------------|-----------------|-----------|
| Mensagens de erro em linguagem natural | Usabilidade | H9 | Mapeamento de códigos de erro para mensagens PT-BR | Tela de erro do formulário |
| Feedback imediato após ação | Usabilidade | H1 | Toast/Snackbar com duração 3s | Screenshot do toast |
| Dados sensíveis não exibidos em URL | Segurança | — | IDs em body/path, não query string com tokens | Revisão de código |
| Confirmação antes de deleção | Usabilidade | H3 | Modal de confirmação com botão destrutivo | Screenshot do modal |
| Botão salvar desabilitado sem dados | Usabilidade | H5 | `disabled={!formValid}` | Demonstração interativa |

---

## Checklist de Validação

- [ ] As 10 heurísticas de Nielsen foram verificadas nas telas principais?
- [ ] Cada tela tem feedback visual para os estados: idle, loading, success, error?
- [ ] Mensagens de erro usam linguagem natural, não códigos técnicos?
- [ ] Existe confirmação antes de ações destrutivas (delete)?
- [ ] O estado global de autenticação está encapsulado em Context?
- [ ] Server state usa React Query (ou equivalente) com invalidação de cache?
- [ ] A RTM completa tem `Persona → RF → Endpoint → Componente → Teste → Evidência`?
- [ ] A tabela de atendimento de RNFs introdutórios está preenchida com evidências?

---

## Exercício Prático

### Cenário
Você precisa avaliar heuristicamente a tela de **Checkout de Pedido** e implementar estado global para o carrinho.

### Tarefa 1 — Avaliação Heurística
Avalie a tela de checkout usando as 10 heurísticas de Nielsen. Para cada violação encontrada:
- Descreva o problema
- Classifique a severidade (0-4)
- Sugira uma correção

### Tarefa 2 — Context de Carrinho
Implemente `CarrinhoContext` com:
- `adicionarItem(produto, quantidade)`
- `removerItem(produtoId)`
- `atualizarQuantidade(produtoId, quantidade)`
- `total: number`

### Tarefa 3 — RTM Atualizada
Adicione à RTM o rastreio: Persona João → RF03 → `POST /pedidos` → `PedidoNovo` → Teste → Evidência.

---

## Método de Avaliação Heurística (Nielsen)

Para conduzir uma avaliação heurística formal, siga este processo:

### Passo 1 — Preparação
- Selecione 3-5 avaliadores (idealmente não envolvidos no design)
- Forneça lista das 10 heurísticas com descrições
- Defina escopo: quais telas/fluxos avaliar

### Passo 2 — Sessão de Avaliação (2 horas)
1. **Briefing (10 min):** Contexto do sistema, personas, tarefas típicas
2. **Exploração livre (30 min):** Avaliadores navegam sem direção
3. **Avaliação dirigida (60 min):** Avaliadores verificam cada heurística
4. **Consolidação (20 min):** Lista consolidada de problemas

### Passo 3 — Classificação de Severidade

| Severidade | Descrição | Ação |
|------------|-----------|------|
| **0** | Não é problema de usabilidade | Ignorar |
| **1** | Cosmético — não precisa corrigir a menos que sobre tempo | Baixa prioridade |
| **2** | Problema menor — fácil de contornar | Prioridade média |
| **3** | Problema maior — impacta eficiência/satisfação | Alta prioridade |
| **4** | Catástrofe de usabilidade — impede conclusão de tarefa | Corrigir imediatamente |

### Passo 4 — Relatório

Entregável típico:
```
Problema #3 — H5 (Prevenção de Erros)
Severidade: 3 (Alta)
Descrição: Formulário permite submeter CPF inválido sem validação prévia
Tela: Checkout → Dados do Cliente
Recomendação: Adicionar validação em tempo real com máscara e verificação de dígitos
```

---

## Evolução do Conceito: RTM Completa

A RTM atinge seu formato final na Sprint 4:

| Sprint | Formato da RTM |
|--------|----------------|
| Sprint 2 | RN → Tabela → Constraint (banco de dados) |
| Sprint 3 | RF → RN → Endpoint → Teste (backend) |
| **Sprint 4** | **Persona → RF → Endpoint → Componente → Teste → Evidência** |
| Sprint 5 | RTM consolidada com todas as evidências |

Veja [Aula 06](./aula_06_rtm_design_patterns.md) para a evolução anterior da RTM.

---

## Ver Também

| Conceito | Documento Relacionado |
|----------|----------------------|
| Personas e critérios de aceite | [Aula 07 — Front-end I](./aula_07_frontend_personas_contratos.md) |
| Estados de loading/error | [Aula 08 — Integração Assíncrona](./aula_08_async_integracao.md) |
| RTM e Design Patterns | [Aula 06 — RTM](./aula_06_rtm_design_patterns.md) |

---

## Referências

- **Nielsen, J.** (1994) — *Usability Engineering* — Academic Press
- **Nielsen, J.; Molich, R.** (1990) — *Heuristic Evaluation of User Interfaces* — CHI Proceedings
- **ISO 9241-11:2018** — *Ergonomics of Human-System Interaction: Usability definitions and concepts*
- **SWEBOK v3** — *Software Quality: V&V* — IEEE Computer Society
- **TanStack Query Documentation** — *Server State Management*

---

## Glossário

| Termo | Definição |
|-------|-----------|
| **Avaliação Heurística** | Método de inspeção de usabilidade baseado em princípios gerais |
| **Server State** | Dados que pertencem ao servidor e são sincronizados pelo cliente |
| **Client State** | Dados que pertencem exclusivamente ao cliente (UI state) |
| **Context API** | Mecanismo React para compartilhar estado sem prop drilling |
| **staleTime** | Tempo após o qual o cache do React Query é considerado desatualizado |
| **Invalidação de Cache** | Forçar refetch de dados após uma mutação |
| **Toast** | Notificação temporária não-modal exibida na interface |
| **Breadcrumb** | Trilha de navegação mostrando a posição atual na hierarquia |
| **Prop Drilling** | Passar props através de múltiplos níveis de componentes intermediários |
