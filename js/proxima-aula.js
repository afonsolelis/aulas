/**
 * Destaque da próxima aula nas homes de módulo.
 *
 * Percorre os cards `.lesson-card` da página, lê a data de cada um no padrão
 * `📅 dd/mm/aaaa` (também aceita `📅 Aula 01 · dd/mm/aaaa`) e marca com a classe
 * `proxima-aula` o card cuja data é a primeira igual ou posterior ao dia de
 * hoje. Se houver mais de uma aula nessa data, todas recebem o destaque.
 *
 * A comparação é feita por dia, no fuso do navegador: a aula de hoje continua
 * destacada até o fim do dia, e no dia seguinte o destaque passa para a aula
 * seguinte. Módulo encerrado, sem aula futura, fica sem destaque.
 *
 * O rótulo acompanha o idioma da página (`<html lang="en">` usa inglês).
 * Estilo em css/inteli-ds.css, seção "Próxima aula".
 */
(function () {
  'use strict';

  var DIA_MS = 86400000;
  var RE_DATA = /📅[^\n]*?(\d{2})\/(\d{2})\/(\d{4})/;

  function hojeMeiaNoite() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function dataDoCard(card) {
    var m = RE_DATA.exec(card.textContent || '');
    if (!m) return null;
    var dia = +m[1], mes = +m[2], ano = +m[3];
    var d = new Date(ano, mes - 1, dia);
    if (d.getMonth() !== mes - 1 || d.getDate() !== dia) return null;
    return d;
  }

  function rotulo(diasFaltando, ingles) {
    if (ingles) {
      if (diasFaltando === 0) return 'Next class · today';
      if (diasFaltando === 1) return 'Next class · tomorrow';
      return 'Next class · in ' + diasFaltando + ' days';
    }
    if (diasFaltando === 0) return 'Próxima aula · hoje';
    if (diasFaltando === 1) return 'Próxima aula · amanhã';
    return 'Próxima aula · em ' + diasFaltando + ' dias';
  }

  function destacar() {
    var cards = document.querySelectorAll('.lesson-card');
    if (!cards.length) return;

    var hoje = hojeMeiaNoite();
    var melhor = null;
    var datados = [];

    for (var i = 0; i < cards.length; i++) {
      var d = dataDoCard(cards[i]);
      if (!d) continue;
      datados.push({ card: cards[i], data: d });
      if (d >= hoje && (!melhor || d < melhor)) melhor = d;
    }
    if (!melhor) return;

    var dias = Math.round((melhor - hoje) / DIA_MS);
    var ingles = /^en\b/i.test(document.documentElement.lang || '');
    var texto = rotulo(dias, ingles);

    for (var j = 0; j < datados.length; j++) {
      if (datados[j].data.getTime() !== melhor.getTime()) continue;
      var card = datados[j].card;
      card.classList.add('proxima-aula');
      if (card.querySelector('.proxima-aula-rotulo')) continue;
      var alvo = card.querySelector('.card-body') || card;
      var tag = document.createElement('p');
      tag.className = 'proxima-aula-rotulo';
      tag.textContent = texto;
      alvo.insertBefore(tag, alvo.firstChild);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', destacar);
  } else {
    destacar();
  }
})();
