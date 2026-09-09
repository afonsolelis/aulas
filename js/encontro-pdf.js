/**
 * Exportação em PDF das páginas de encontro.
 *
 * O botão `.pdf-export-btn` declara os dados do encontro em atributos `data-*`;
 * este script apenas monta o nome de arquivo padronizado pelo Inteli e aciona a
 * impressão. O nome sugerido pelo navegador ao salvar em PDF é o `document.title`,
 * que é substituído durante a impressão e restaurado em seguida.
 *
 * Páginas de deck são exportadas em A4 paisagem, com um slide por folha. A
 * orientação é declarada em css/encontro.css pela página nomeada `deck`, e
 * reforçada aqui por uma folha injetada no momento da exportação, uma vez que a
 * regra `@page` nomeada não é aplicada por todos os navegadores.
 *
 * Padrão de nome: ANO-MÊS-DIA-Nome-NoSequencial  →  2026-08-06-Afonso-01
 *
 * Atributos lidos do botão:
 *   data-encontro-data     data do encontro em AAAA-MM-DD (vazio: usa a data da exportação)
 *   data-encontro-docente  primeiro nome do docente que ministra o encontro
 *   data-encontro-seq      sequencial do artefato: 01 slides, 02 material, 03 plano
 *
 * Ver .claude/skills/padrao-encontro/SKILL.md
 */
(function () {
  'use strict';

  function hoje() {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  function nomeArquivo(btn) {
    const data = (btn.dataset.encontroData || '').trim() || hoje();
    const docente = (btn.dataset.encontroDocente || 'Afonso').trim();
    const seq = (btn.dataset.encontroSeq || '01').trim();
    return `${data}-${docente}-${seq}`;
  }

  /** A página apresenta um deck de slides, e não texto corrido. */
  function ehDeck() {
    return !!document.querySelector('.slide-container, .lesson-deck, .lesson-slides');
  }

  /**
   * Declara A4 paisagem para a exportação do deck.
   *
   * A folha é injetada em tempo de exportação porque `@page` não aceita
   * seletor: a orientação não pode ser condicionada ao tipo de página apenas
   * por CSS estático. A classe acompanha a folha e ativa as regras de um slide
   * por página definidas em css/encontro.css.
   */
  function orientarPaisagem() {
    document.documentElement.classList.add('print-deck');

    const style = document.createElement('style');
    style.id = 'print-deck-page';
    style.textContent = '@media print { @page { size: A4 landscape; margin: 9mm 10mm; } }';
    document.head.appendChild(style);

    return function () {
      document.documentElement.classList.remove('print-deck');
      style.remove();
    };
  }

  function exportar(btn) {
    const tituloOriginal = document.title;
    document.title = nomeArquivo(btn);
    const desfazerOrientacao = ehDeck() ? orientarPaisagem() : null;

    function restaurar() {
      document.title = tituloOriginal;
      if (desfazerOrientacao) desfazerOrientacao();
      window.removeEventListener('afterprint', restaurar);
    }
    window.addEventListener('afterprint', restaurar);

    window.print();

    // Navegadores que não disparam afterprint mantêm o título trocado; o retorno
    // por temporizador garante a restauração.
    setTimeout(restaurar, 3000);
  }

  document.addEventListener('click', function (ev) {
    const btn = ev.target.closest('.pdf-export-btn');
    if (!btn) return;
    ev.preventDefault();
    exportar(btn);
  });
})();
