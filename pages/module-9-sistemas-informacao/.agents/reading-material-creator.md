# Skill: Criador de Material de Leitura (Textbook Style)

Esta skill é especializada na criação de materiais didáticos de leitura profunda (estilo livro/textbook) para o Inteli (Instituto de Tecnologia e Liderança).

## Objetivos
- Criar documentos HTML5 autossuficientes e visualmente atraentes.
- Garantir uma experiência de leitura focada e profissional.
- Diferenciar claramente material de leitura (estilo livro) de material de aula (estilo slides).

## Padrões Visuais (CSS)
Sempre utilize a seguinte paleta de cores e tipografia:
- **Cores Primárias:** `--primary-color: #2e2640;` (Roxo escuro), `--secondary-color: #89cea5;` (Verde água).
- **Acento:** `--accent-color: #d97757;` (Terracota).
- **Tipografia:** 'Merriweather' para títulos e corpo, 'Fira Code' para blocos de código.
- **Layout:** Largura máxima de conteúdo de `850px` para legibilidade.

## Estrutura do Documento
Todo material deve conter:
1.  **Capa (Header):** Com gradiente linear `(135deg, #2e2640 0%, #151122 100%)`, badge do módulo e botões de navegação.
2.  **Índice (TOC):** Navegação interna funcional com links para os IDs das seções.
3.  **Seções de Conteúdo:**
    - `<h2>` com borda inferior verde água.
    - `<h3>` para subseções.
    - Blocos de código (`.code-block`) com sintaxe highlighting manual simples.
    - Callouts (`.callout-info`, `.callout-warning`, `.callout-success`) para destaques e notas importantes.
4.  **Tabelas:** Estilizadas com bordas leves e cabeçalhos cinza claro.
5.  **Conclusão:** Um card final (`.chapter-card`) com fundo leve para reflexão e exercícios.
6.  **Rodapé:** Identificação padrão: `&copy; 2026 Inteli • Instituto de Tecnologia e Liderança`.

## Tom de Voz
- Técnico, porém acessível.
- Senior Software Engineer falando com alunos de graduação.
- Foco em "porquês" (decisões arquiteturais) e não apenas "comos" (sintaxe).

## Exemplo de Rodapé Obrigatório
```html
<footer class="text-center text-muted mt-5 pb-4 border-top pt-4">
  <p>Este material compõe o acervo acadêmico oficial para a disciplina de Sistemas de Informação.</p>
  <p>&copy; 2026 Inteli • Instituto de Tecnologia e Liderança</p>
</footer>
```
