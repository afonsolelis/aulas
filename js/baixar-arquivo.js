/* Baixa, com o nome indicado em data-baixar, um arquivo hospedado em outro domínio.
 *
 * O atributo download só vale para arquivos do mesmo domínio; para os demais, o navegador o
 * ignora e o PDF abre no visualizador em vez de ser salvo. O script busca o arquivo (o
 * servidor precisa responder com Access-Control-Allow-Origin, como o GitHub Pages faz) e o
 * salva. Se a busca falhar, o link abre em nova aba, como faria sem o script.
 *
 * Uso: <a href="https://…/arquivo.pdf" data-baixar="arquivo.pdf" target="_blank" rel="noopener">
 */
(function () {
  document.addEventListener('click', async (evento) => {
    const link = evento.target.closest('a[data-baixar]');
    if (!link) return;
    // Clique com modificador ou com o botão do meio mantém o comportamento do navegador.
    if (evento.defaultPrevented || evento.button !== 0 ||
        evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    evento.preventDefault();

    try {
      const resposta = await fetch(link.href, { mode: 'cors' });
      if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
      const url = URL.createObjectURL(await resposta.blob());
      const temporario = document.createElement('a');
      temporario.href = url;
      temporario.download = link.dataset.baixar || '';
      document.body.appendChild(temporario);
      temporario.click();
      temporario.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (erro) {
      window.open(link.href, '_blank', 'noopener');
    }
  });
})();
