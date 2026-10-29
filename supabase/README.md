# supabase/ — histórico, somente leitura

Os projetos do Supabase que serviam o quiz, o TBL, as enquetes e as provas foram desligados. O banco em uso é o da
plataforma `aulas-projeto` (FastAPI + MongoDB), que serve as páginas deste repositório em `/inteli/<caminho>` e
guarda salas, respostas e relatórios. Os dados já foram migrados para lá.

Os arquivos `*.sql` desta pasta **não são mais aplicados em lugar nenhum**. Ficam aqui porque trazem o conteúdo
das salas (questões de quiz e de TBL, enquetes) e o desenho original das funções, úteis como referência. Não os
edite esperando efeito: mudar um seed aqui não muda a sala.

Para criar ou alterar uma sala, entregue os dados (slug, título, questões) ao mantenedor da plataforma. Ainda não
há comando de carga de sala nova (README do `aulas-projeto`, "Ainda falta: criar sala nova").

As páginas usam o contrato próprio da plataforma (`/_app/aulas.js` e `POST /inteli/api/{fn}`), descrito no
`CLAUDE.md` da raiz.
