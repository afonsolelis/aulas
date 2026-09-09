/**
 * Indicador flutuante da semana corrente do ano.
 *
 * Exibe o número da semana em uma bolha fixa na borda direita. Ao receber o
 * cursor, o foco de teclado ou um toque, expande para `Semana x/y`, em que y é
 * a última semana do ano corrente.
 *
 * A contagem segue a ISO 8601: a semana inicia na segunda-feira e a semana 1 é
 * a que contém a primeira quinta-feira de janeiro. Sob essa convenção o ano tem
 * 52 ou 53 semanas, e o valor de y varia conforme o ano.
 *
 * Injetado em todas as páginas por scripts/apply-semana.mjs.
 */
(function () {
  'use strict';

  var DIA_MS = 86400000;

  /** Índice do dia da semana com a segunda-feira em zero, conforme a ISO 8601. */
  function diaIso(data) {
    return (data.getUTCDay() + 6) % 7;
  }

  /**
   * Semana e ano ISO da data informada.
   *
   * O cálculo ocorre em UTC para que a transição de horário de verão não
   * desloque a data em um dia. A quinta-feira da mesma semana identifica o ano
   * ISO, que pode divergir do ano civil na virada.
   */
  function semanaIso(data) {
    var d = new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()));
    d.setUTCDate(d.getUTCDate() - diaIso(d) + 3);
    var ano = d.getUTCFullYear();

    var primeira = new Date(Date.UTC(ano, 0, 4));
    primeira.setUTCDate(primeira.getUTCDate() - diaIso(primeira) + 3);

    return { semana: 1 + Math.round((d - primeira) / (7 * DIA_MS)), ano: ano };
  }

  /**
   * Última semana do ano ISO informado.
   *
   * O ano tem 53 semanas quando 1º de janeiro cai em quinta-feira, ou quando o
   * ano é bissexto e 1º de janeiro cai em quarta-feira. Nos demais casos tem 52.
   */
  function semanasNoAno(ano) {
    var jan1 = new Date(Date.UTC(ano, 0, 1)).getUTCDay();
    var bissexto = (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
    return jan1 === 4 || (bissexto && jan1 === 3) ? 53 : 52;
  }

  function montar() {
    // O script é injetado uma vez por página; o guarda protege a inclusão dupla.
    if (document.querySelector('.semana-badge')) return;

    var iso = semanaIso(new Date());
    var total = semanasNoAno(iso.ano);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'semana-badge';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Semana ' + iso.semana + ' de ' + total + ' do ano de ' + iso.ano);
    btn.innerHTML =
      '<span class="semana-badge__rotulo">Semana</span>' +
      '<span class="semana-badge__n">' + iso.semana + '</span>' +
      '<span class="semana-badge__total">/' + total + '</span>';

    // Alternância por toque, onde não há cursor para acionar :hover.
    btn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      btn.setAttribute('aria-expanded', btn.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    });
    document.addEventListener('click', function () {
      btn.setAttribute('aria-expanded', 'false');
    });

    document.body.appendChild(btn);
  }

  // Exposto para o teste de contagem em tests/semana-ano.spec.ts, que importa
  // este arquivo em Node, onde não existe document.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { semanaIso: semanaIso, semanasNoAno: semanasNoAno };
  }

  if (typeof document === 'undefined') return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', montar);
  } else {
    montar();
  }
})();
