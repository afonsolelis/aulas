# Skill: Criador de Slides (Presentation Style)

Esta skill é especializada na criação e manipulação de slides de aula para o Inteli (Instituto de Tecnologia e Liderança), seguindo o padrão visual de "Sistemas de Informação".

## Objetivos
- Criar apresentações interativas em HTML/CSS/JS puro.
- Garantir consistência visual com a marca Inteli.
- Facilitar a transição entre material de leitura e slides.

## Estrutura Técnica
- **Motor de Navegação:** Sistema customizado baseado em classes `.slide` e `.active`.
- **Controles:** Navegação por setas, barra de espaço e botões no rodapé.
- **Layout:** Flexbox e Grid para responsividade e organização de conteúdo.

## Padrões Visuais (CSS)
- **Cores:** `--inteli-purple: #2e2640;`, `--inteli-blue: #89cea5;`.
- **Tipografia:** `Manrope` para textos gerais, `Space Mono` para código.
- **Componentes de Destaque:**
    - `.glass-card`: Usado no slide de capa para efeito de desfoque.
    - `.topic-tag`: Tags coloridas para os tópicos da aula.
    - `.code-block`: Fundo escuro com borda lateral azul.
    - `.uml-diagram`: Container para SVGs de diagramas UML.

## Guia de Criação de Slides
1.  **Slide de Capa (Slide 0):** Deve conter o logo do Inteli, subtítulo da aula, título principal, badges de tópicos e informações do professor.
2.  **Slide de Agenda:** Lista os principais pontos que serão abordados.
3.  **Slides de Conteúdo:**
    - Use `.two-columns` para comparar conceitos ou mostrar código ao lado de texto.
    - Use `.box` para reflexões, dicas ou "pulos do gato".
    - Mantenha o texto conciso; slides são suportes visuais, não o material de leitura completo.
4.  **Diagramas:** Prefira SVGs inline dentro de `.uml-diagram` para garantir nitidez e escalabilidade.
5.  **Slide de Encerramento:** Focado em dúvidas e anúncio do tema da próxima aula.

## Rodapé Obrigatório
O rodapé deve conter links de navegação para o índice do módulo e para o material de leitura correspondente (`lesson-X-material.html`).

## Exemplo de Estrutura de Slide
```html
<div class="slide">
    <div class="slide-header">
        <div class="slide-title">Título do Tópico</div>
        <div class="slide-subtitle">Contextualização rápida</div>
    </div>
    <div class="slide-content">
        <div class="two-columns">
            <div>
                <h3>Conceito A</h3>
                <ul>
                    <li>Ponto importante 1</li>
                </ul>
            </div>
            <div>
                <div class="code-block">
// Exemplo de código
public class Exemplo { }
                </div>
            </div>
        </div>
    </div>
</div>
```
