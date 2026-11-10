// Simulação do remo-api para o laboratório da Aula 3 do Módulo 8 de Engenharia de Software.
//
// O modelo reproduz o caminho de leitura da Aula 2 (navegador, proxy nginx opcional,
// PostgREST com pool de conexões e Postgres) por simulação de eventos discretos.
// Cada mecanismo do sistema (timeout, circuit breaker, cache, validador, throttling,
// reinício do contêiner, RLS) é um parâmetro da configuração, e os arquivos que o aluno
// lê na evidência estática são gerados a partir dessa mesma configuração.

// ---------------------------------------------------------------- aleatoriedade com seed
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- fila de prioridade
class Heap {
  constructor() { this.a = []; this.seq = 0; }
  get size() { return this.a.length; }
  push(t, fn) {
    const a = this.a; const n = { t, s: this.seq++, fn }; a.push(n);
    let i = a.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (menor(a[p], a[i])) break; [a[p], a[i]] = [a[i], a[p]]; i = p; }
  }
  peek() { return this.a[0]; }
  pop() {
    const a = this.a; const top = a[0]; const last = a.pop();
    if (a.length) {
      a[0] = last; let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1; let m = i;
        if (l < a.length && menor(a[l], a[m])) m = l;
        if (r < a.length && menor(a[r], a[m])) m = r;
        if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m;
      }
    }
    return top;
  }
}
const menor = (x, y) => x.t < y.t || (x.t === y.t && x.s < y.s);

// ---------------------------------------------------------------- configuração
export const LIGAS = ['serie_a', 'serie_b', 'parazao', 'copa_verde'];
export const TABELAS = ['remo_ligas', 'remo_clubes', 'remo_partidas'];

// Caminhos das 12 leituras de iniciar() em app.js.
export const LEITURAS = LIGAS.flatMap((liga) => [
  `/remo_ligas?id=eq.${liga}`,
  `/remo_clubes?liga=eq.${liga}&order=posicao.asc`,
  `/remo_partidas?liga=eq.${liga}&order=data.desc`,
]);

export function configBase() {
  return {
    app: {
      base: 'direto',                 // 'direto' = PostgREST :3000; 'proxy' = nginx :8080
      timeout: { on: false, ms: 3000 },
      breaker: { on: false, limiar: 5, janela: 10, espera: 15 },
      fallback: false,                // último dado válido no localStorage
      logCircuito: false,             // console.warn quando o circuito abre
    },
    proxy: {
      presente: false,
      cache: { on: false, validade: 5, lock: true, stale: true },
      xcache: false,                  // cabeçalho X-Cache e campo no log de acesso
      readTimeout: 60,                // proxy_read_timeout, em segundos (padrão do nginx)
      validador: false,               // 405 para métodos diferentes de GET, HEAD e OPTIONS
      throttle: { on: false, taxa: 10, burst: 20 },
    },
    compose: { restart: true, healthcheck: true, portaRestPublica: true },
    schema: { rls: true, politicaEscrita: false },
    rest: { pool: 10 },
  };
}

export const clone = (o) => JSON.parse(JSON.stringify(o));

export function presetAtual() { return configBase(); }

export function presetNovo() {
  const c = configBase();
  c.app.base = 'proxy';
  Object.assign(c.proxy, { presente: true, xcache: true, validador: true });
  Object.assign(c.proxy.cache, { on: true, validade: 5, lock: true, stale: true });
  return c;
}

// ---------------------------------------------------------------- arquivos gerados
// Cada arquivo é uma lista de linhas; a evidência estática cita arquivo e linha.
export function gerarArquivos(cfg) {
  const a = cfg.app, p = cfg.proxy, k = cfg.compose, s = cfg.schema;
  const base = a.base === 'proxy' ? 'http://localhost:8080' : 'http://localhost:3000';

  const app = [
    '// app.js · Remo nos Campeonatos (trecho do caminho de leitura)',
    `const BASE = '${base}';`,
    "const ANON_KEY = 'sb_publishable_9hQ2…';   // chave publicável, visível por desenho",
    "const LIGAS = ['serie_a', 'serie_b', 'parazao', 'copa_verde'];",
    '',
  ];
  if (a.breaker.on) {
    app.push(
      '// Circuit breaker: fechado → aberto → meio-aberto',
      'const circuito = {',
      "  estado: 'fechado',",
      `  limiar: ${a.breaker.limiar},            // falhas para abrir`,
      `  janelaMs: ${a.breaker.janela * 1000},       // janela de contagem`,
      `  esperaMs: ${a.breaker.espera * 1000},       // tempo no estado aberto`,
      '  falhas: [],',
      '  abertoEm: 0,',
      '};',
      '',
      'function registrarFalha() {',
      '  const agora = Date.now();',
      '  circuito.falhas = circuito.falhas.filter((t) => agora - t < circuito.janelaMs);',
      '  circuito.falhas.push(agora);',
      "  if (circuito.estado === 'meio-aberto' || circuito.falhas.length >= circuito.limiar) {",
      "    circuito.estado = 'aberto';",
      '    circuito.abertoEm = agora;',
    );
    if (a.logCircuito) app.push("    console.warn('[circuito] aberto', { falhas: circuito.falhas.length });");
    app.push(
      '  }',
      '}',
      '',
      'function registrarSucesso() {',
      "  circuito.estado = 'fechado';",
      '  circuito.falhas = [];',
      '}',
      '',
    );
  }
  app.push('async function consulta(caminho) {');
  if (a.breaker.on) {
    app.push(
      "  if (circuito.estado === 'aberto') {",
      '    if (Date.now() - circuito.abertoEm < circuito.esperaMs) return alternativa(caminho);',
      "    circuito.estado = 'meio-aberto';    // libera uma chamada de teste",
      '  }',
    );
  }
  app.push('  try {');
  if (a.timeout.on) {
    app.push(
      '    const resp = await fetch(`${BASE}${caminho}`, {',
      '      headers: { apikey: ANON_KEY },',
      `      signal: AbortSignal.timeout(${a.timeout.ms}),`,
      '    });',
    );
  } else {
    app.push('    const resp = await fetch(`${BASE}${caminho}`, { headers: { apikey: ANON_KEY } });');
  }
  app.push("    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);", '    const dados = await resp.json();');
  if (a.fallback) app.push("    localStorage.setItem('ultimo:' + caminho, JSON.stringify(dados));");
  if (a.breaker.on) app.push('    registrarSucesso();');
  app.push('    return dados;', '  } catch (erro) {');
  if (a.breaker.on) app.push('    registrarFalha();');
  if (a.fallback || a.breaker.on) app.push('    return alternativa(caminho, erro);');
  else app.push('    throw erro;                          // a liga fica sem jogos na tela');
  app.push('  }', '}', '');
  if (a.fallback || a.breaker.on) {
    app.push('function alternativa(caminho, erro) {');
    if (a.fallback) {
      app.push(
        "  const salvo = localStorage.getItem('ultimo:' + caminho);",
        '  if (salvo) return { ...JSON.parse(salvo), defasado: true };',
      );
    }
    app.push("  throw erro || new Error('circuito aberto');", '}', '');
  }
  app.push(
    'async function iniciar() {',
    '  // 4 ligas × 3 tabelas = 12 leituras em paralelo a cada visita',
    '  await Promise.all(LIGAS.flatMap((liga) => [',
    '    consulta(`/remo_ligas?id=eq.${liga}`),',
    '    consulta(`/remo_clubes?liga=eq.${liga}&order=posicao.asc`),',
    '    consulta(`/remo_partidas?liga=eq.${liga}&order=data.desc`),',
    '  ]).map((p) => p.then(desenhar).catch(mostrarErro)));',
    '}',
  );

  let nginx = null;
  if (p.presente) {
    nginx = [
      '# laboratorio/nginx.conf · proxy na frente do PostgREST',
      'events {}',
      'http {',
    ];
    if (p.cache.on) {
      nginx.push('  proxy_cache_path /var/cache/nginx keys_zone=leituras:10m max_size=100m;');
    }
    if (p.throttle.on) {
      nginx.push(`  limit_req_zone $binary_remote_addr zone=por_ip:10m rate=${p.throttle.taxa}r/s;`);
    }
    nginx.push(
      p.xcache
        ? "  log_format lab '$remote_addr \"$request\" $status $request_time cache=$upstream_cache_status';"
        : "  log_format lab '$remote_addr \"$request\" $status $request_time';",
      '  access_log /dev/stdout lab;',
      '',
      '  upstream postgrest { server rest:3000; }',
      '',
      '  server {',
      '    listen 8080;',
      '',
      '    location / {',
    );
    if (p.validador) {
      nginx.push(
        '      # Validador interceptador: só leitura passa ao PostgREST',
        '      limit_except GET HEAD OPTIONS { deny all; }',
        '      error_page 403 = @metodo_recusado;',
      );
    }
    if (p.throttle.on) {
      nginx.push(
        `      limit_req zone=por_ip burst=${p.throttle.burst} nodelay;`,
        '      limit_req_status 429;',
      );
    }
    if (p.cache.on) {
      nginx.push(
        '      proxy_cache leituras;',
        `      proxy_cache_valid 200 ${p.cache.validade}s;`,
      );
      if (p.cache.lock) nginx.push('      proxy_cache_lock on;');
      if (p.cache.stale) nginx.push('      proxy_cache_use_stale error timeout updating http_502 http_503 http_504;');
    }
    if (p.xcache) nginx.push('      add_header X-Cache $upstream_cache_status always;');
    if (p.readTimeout !== 60) nginx.push(`      proxy_read_timeout ${p.readTimeout}s;`);
    nginx.push(
      '      proxy_pass http://postgrest;',
      '    }',
    );
    if (p.validador) {
      nginx.push('', '    location @metodo_recusado { return 405; }');
    }
    nginx.push('  }', '}');
  }

  const compose = [
    '# laboratorio/docker-compose.yml',
    'services:',
    '  db:',
    '    image: postgres:16-alpine',
    '    volumes: ["./init:/docker-entrypoint-initdb.d:ro"]',
  ];
  if (k.healthcheck) {
    compose.push(
      '    healthcheck:',
      '      test: ["CMD", "pg_isready", "-U", "postgres"]',
      '      interval: 5s',
      '      retries: 3',
    );
  }
  if (k.restart) compose.push('    restart: on-failure');
  compose.push(
    '',
    '  rest:',
    '    image: postgrest/postgrest:v12.2.3',
    '    environment:',
    '      PGRST_DB_URI: postgres://authenticator:lab@db:5432/postgres',
    '      PGRST_DB_ANON_ROLE: anon',
    `      PGRST_DB_POOL: ${cfg.rest.pool}`,
    '      PGRST_LOG_LEVEL: info',
  );
  if (k.portaRestPublica) compose.push('    ports: ["3000:3000"]');
  if (k.healthcheck) {
    compose.push(
      '    healthcheck:',
      '      test: ["CMD", "wget", "-qO-", "http://localhost:3000/remo_ligas?limit=1"]',
      '      interval: 5s',
      '      retries: 3',
    );
  }
  if (k.restart) compose.push('    restart: on-failure');
  compose.push('    depends_on: { db: { condition: service_healthy } }');
  if (p.presente) {
    compose.push(
      '',
      '  proxy:',
      '    image: nginx:1.27-alpine',
      '    volumes: ["./nginx.conf:/etc/nginx/nginx.conf:ro"]',
      '    ports: ["8080:8080"]',
    );
    if (k.restart) compose.push('    restart: on-failure');
    compose.push('    depends_on: [rest]');
  }
  compose.push(
    '',
    '  k6:',
    '    image: grafana/k6:0.54.0',
    '    profiles: ["carga"]',
    '    volumes: ["./carga:/scripts:ro"]',
  );

  const schema = [
    '-- supabase/schema.sql (trecho de acesso)',
    'create table remo_ligas    (id text primary key, nome text, temporada int);',
    'create table remo_clubes   (id int primary key, liga text, nome text, posicao int, pontos int);',
    'create table remo_partidas (id int primary key, liga text, data timestamptz, mandante text,',
    '                            visitante text, placar_m int, placar_v int);',
    '',
    'grant usage on schema public to anon;',
    'grant select on remo_ligas, remo_clubes, remo_partidas to anon;',
    '',
  ];
  if (s.rls) {
    schema.push(
      'alter table remo_ligas    enable row level security;',
      'alter table remo_clubes   enable row level security;',
      'alter table remo_partidas enable row level security;',
      '',
      'create policy leitura_publica on remo_ligas    for select to anon using (true);',
      'create policy leitura_publica on remo_clubes   for select to anon using (true);',
      'create policy leitura_publica on remo_partidas for select to anon using (true);',
    );
  }
  if (s.politicaEscrita) {
    schema.push(
      '',
      '-- usado pelo sync antigo, que gravava com a chave publicável',
      'grant insert, update, delete on remo_partidas to anon;',
      'create policy sync_escrita on remo_partidas for all to anon using (true) with check (true);',
    );
  }

  const arquivos = { 'app.js': app, 'docker-compose.yml': compose, 'supabase/schema.sql': schema };
  if (nginx) arquivos['laboratorio/nginx.conf'] = nginx;
  return arquivos;
}

// Busca no estilo do ripgrep: arquivo:linha:texto.
export function rg(arquivos, padrao, alvo) {
  let re;
  try { re = new RegExp(padrao, 'i'); } catch { re = new RegExp(padrao.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); }
  const saida = [];
  for (const [nome, linhas] of Object.entries(arquivos)) {
    if (alvo && !nome.endsWith(alvo)) continue;
    linhas.forEach((l, i) => { if (re.test(l)) saida.push({ arquivo: nome, linha: i + 1, texto: l }); });
  }
  return saida;
}

// ---------------------------------------------------------------- o sistema
// Tempo de serviço médio de cada leitura no PostgREST, em ms (Série A e B têm 380 partidas).
function servicoBase(caminho, metodo) {
  if (metodo !== 'GET' && metodo !== 'HEAD') return 4;
  if (caminho.startsWith('/remo_ligas')) return 1.2;
  if (caminho.startsWith('/remo_clubes')) return 2.2;
  if (caminho.includes('select=*')) return 55;         // raspagem de toda a tabela, 874 linhas
  if (/serie_[ab]/.test(caminho)) return 26;
  if (caminho.includes('parazao')) return 6;
  return 4;
}

export class Sistema {
  constructor(cfg, opts = {}) {
    this.cfg = clone(cfg);
    this.rand = mulberry32(opts.seed ?? 20261113);
    this.agora = 0;
    this.heap = new Heap();
    this.logs = [];
    this.limiteLog = opts.limiteLog ?? 4000;
    this.porSegundoLog = new Map();
    // PostgREST
    this.rest = { estado: 'up', ocupados: 0, fila: [], pendurados: new Set(), emServico: new Set(), saude: 'healthy', falhasSaude: 0, fator: 1 };
    // proxy
    this.cache = new Map();     // caminho → { em, corpo }
    this.emVoo = new Map();     // caminho → [callbacks à espera do lock]
    this.balde = new Map();     // ip → { excesso, ultimo }
    // métricas
    this.coletor = null;
    if (this.cfg.compose.healthcheck) this.at(5000, () => this.checarSaude());
  }

  at(t, fn) { this.heap.push(t, fn); }
  depois(ms, fn) { this.heap.push(this.agora + ms, fn); }
  rodarAte(t) {
    while (this.heap.size && this.heap.peek().t <= t) {
      const ev = this.heap.pop(); this.agora = ev.t; ev.fn();
    }
    this.agora = Math.max(this.agora, t);
  }
  exp(media) { return -Math.log(1 - this.rand()) * media; }

  log(componente, texto, especial = false) {
    const seg = Math.floor(this.agora / 1000);
    const chave = componente + ':' + seg;
    const n = (this.porSegundoLog.get(chave) || 0) + 1;
    this.porSegundoLog.set(chave, n);
    if (!especial && n > 4) return;
    if (this.logs.length >= this.limiteLog) {
      if (!especial) return;
      this.logs.splice(Math.floor(this.logs.length / 2), 1);
    }
    this.logs.push({ t: this.agora, componente, texto, especial });
  }

  // ------------------------------------------------ falhas e operação do contêiner
  falharRest(tipo) {
    const r = this.rest;
    if (tipo === 'lento') { r.estado = 'lento'; r.fator = 8; this.log('db', 'checkpoint lento: tempo de consulta multiplicado por 8', true); return; }
    if (tipo === 'travado') { r.estado = 'travado'; this.log('rest', 'pool de conexões preso: requisições aceitas e sem resposta', true); return; }
    // 'parado' (docker compose stop) e 'morre' (processo encerra com erro)
    this.derrubarEmCurso();
    r.estado = 'parado';
    if (tipo === 'morre') {
      this.log('docker', 'container lab-rest-1  died (exit code 1)', true);
      if (this.cfg.compose.restart) {
        this.depois(3000, () => {
          if (r.estado === 'parado') { this.subirRest(); this.log('docker', 'container lab-rest-1  restart (restart: on-failure)', true); }
        });
      }
    } else {
      this.log('docker', 'container lab-rest-1  stopped (docker compose stop rest)', true);
    }
  }
  derrubarEmCurso() {
    const r = this.rest;
    for (const job of [...r.fila, ...r.emServico, ...r.pendurados]) job.fim({ status: 0, erro: 'ECONNRESET' });
    r.fila = []; r.emServico.clear(); r.pendurados.clear(); r.ocupados = 0;
  }
  subirRest() {
    const r = this.rest;
    if (r.estado === 'travado') this.derrubarEmCurso();
    r.estado = 'up'; r.fator = 1; r.falhasSaude = 0; r.saude = 'healthy';
  }
  restaurarRest(motivo) {
    const r = this.rest;
    if (r.estado === 'up') return;
    const antes = r.estado;
    this.subirRest();
    if (antes === 'lento') this.log('db', 'consultas voltam ao tempo normal', true);
    else this.log('docker', `container lab-rest-1  started (${motivo})`, true);
  }
  checarSaude() {
    const r = this.rest;
    if (r.estado === 'parado') { r.falhasSaude = 0; }
    else if (r.estado === 'travado') {
      r.falhasSaude += 1;
      if (r.falhasSaude === 3 && r.saude !== 'unhealthy') {
        r.saude = 'unhealthy';
        this.log('docker', 'container lab-rest-1  health_status: unhealthy (3 falhas seguidas); restart: on-failure só age quando o processo termina', true);
      }
    } else if (r.saude !== 'healthy') { r.saude = 'healthy'; r.falhasSaude = 0; this.log('docker', 'container lab-rest-1  health_status: healthy', true); }
    this.depois(5000, () => this.checarSaude());
  }

  // ------------------------------------------------ PostgREST
  restReceber(req, cb) {
    const r = this.rest;
    const job = { req, settled: false, chegada: this.agora };
    job.fim = (resp) => { if (job.settled) return; job.settled = true; cb(resp); };
    if (r.estado === 'parado') { this.depois(0.4, () => job.fim({ status: 0, erro: 'ECONNREFUSED' })); return; }
    if (r.estado === 'travado') { r.pendurados.add(job); return; }
    r.fila.push(job); this.restDespachar();
  }
  restDespachar() {
    const r = this.rest;
    while (r.ocupados < this.cfg.rest.pool && r.fila.length) {
      const job = r.fila.shift(); r.ocupados += 1; r.emServico.add(job);
      const ms = this.exp(servicoBase(job.req.caminho, job.req.metodo)) * 0.5 + servicoBase(job.req.caminho, job.req.metodo) * 0.5;
      this.depois(ms * r.fator, () => {
        if (!r.emServico.has(job)) return;       // derrubado no meio
        r.emServico.delete(job); r.ocupados -= 1;
        const resp = this.restResponder(job.req);
        if (this.coletor) this.coletor.restAtendeu(job.req, resp);
        this.log('rest', `${job.req.ip} "${job.req.metodo} ${job.req.caminho}" ${resp.status} ${(this.agora - job.chegada).toFixed(0)}ms`, resp.status >= 300 || job.req.metodo !== 'GET');
        job.fim(resp);
        this.restDespachar();
      });
    }
  }
  restResponder(req) {
    if (req.metodo === 'GET' || req.metodo === 'HEAD') return { status: 200 };
    const s = this.cfg.schema;
    if (s.politicaEscrita) return { status: req.metodo === 'POST' ? 201 : 204, escreveu: true };
    return { status: 401, erro: 'permission denied for table remo_partidas' };
  }

  // ------------------------------------------------ proxy nginx
  proxyReceber(req, cb) {
    const p = this.cfg.proxy;
    const t0 = this.agora;
    const responder = (resp) => {
      const ms = this.agora - t0;
      const cache = p.xcache ? ` cache=${resp.xcache || '-'}` : '';
      const especial = resp.status !== 200 || resp.xcache === 'STALE';
      this.log('proxy', `${req.ip} "${req.metodo} ${req.caminho}" ${resp.status} ${(ms / 1000).toFixed(3)}${cache}`, especial);
      if (this.coletor) this.coletor.proxyRespondeu(req, resp);
      cb({ ...resp, xcache: p.xcache ? resp.xcache : undefined });
    };
    this.depois(0.2 + this.rand() * 0.6, () => {
      if (p.validador && !['GET', 'HEAD', 'OPTIONS'].includes(req.metodo)) { responder({ status: 405 }); return; }
      if (p.throttle.on && !this.permitir(req.ip)) { responder({ status: 429 }); return; }
      if (p.cache.on && req.metodo === 'GET') this.viaCache(req, responder);
      else this.encaminhar(req, (resp) => responder(resp.status === 0 ? { status: 502 } : resp));
    });
  }
  permitir(ip) {
    const t = this.cfg.proxy.throttle;
    const b = this.balde.get(ip) || { excesso: 0, ultimo: this.agora };
    const decorrido = (this.agora - b.ultimo) / 1000;
    b.excesso = Math.max(0, b.excesso - t.taxa * decorrido) + 1;
    b.ultimo = this.agora;
    if (b.excesso > t.burst + 1) { b.excesso -= 1; this.balde.set(ip, b); return false; }
    this.balde.set(ip, b); return true;
  }
  encaminhar(req, cb) {
    const p = this.cfg.proxy;
    let feito = false;
    const fim = (resp) => { if (feito) return; feito = true; cb(resp); };
    this.depois(p.readTimeout * 1000, () => fim({ status: 504 }));
    this.restReceber(req, (resp) => fim(resp.status === 0 ? { status: 502 } : resp));
  }
  viaCache(req, responder) {
    const c = this.cfg.proxy.cache;
    const k = req.caminho;
    const e = this.cache.get(k);
    const fresco = e && this.agora - e.em < c.validade * 1000;
    if (fresco) { this.depois(0.3 + this.rand() * 1.5, () => responder({ status: 200, xcache: 'HIT' })); return; }
    if (this.emVoo.has(k)) {
      if (c.stale && e) { this.depois(0.3 + this.rand(), () => responder({ status: 200, xcache: 'STALE' })); return; }
      if (c.lock) {
        const espera = { feito: false, responder };
        this.emVoo.get(k).push(espera);
        this.depois(5000, () => {               // proxy_cache_lock_timeout
          if (espera.feito) return; espera.feito = true;
          this.encaminhar(req, (resp) => responder({ ...resp, status: resp.status || 502, xcache: 'MISS' }));
        });
        return;
      }
    }
    if (!this.emVoo.has(k)) this.emVoo.set(k, []);
    const status = e ? 'EXPIRED' : 'MISS';
    this.encaminhar(req, (resp) => {
      const esperando = this.emVoo.get(k) || []; this.emVoo.delete(k);
      let final;
      if (resp.status === 200) { this.cache.set(k, { em: this.agora }); final = { status: 200, xcache: status }; }
      else if (c.stale && e) final = { status: 200, xcache: 'STALE' };
      else final = { status: resp.status || 502, xcache: status };
      responder(final);
      for (const w of esperando) {
        if (w.feito) continue; w.feito = true;
        this.depois(0.2 + this.rand() * 0.5, () => w.responder(final.status === 200 && final.xcache !== 'STALE' ? { status: 200, xcache: 'HIT' } : final));
      }
    });
  }

  // ------------------------------------------------ requisição de ponta a ponta
  // alvo: 'proxy' ou 'direto'. Devolve { status, ms, xcache, erro }.
  enviar(req, alvo, cb) {
    const t0 = this.agora;
    const rede = 0.3 + this.rand() * 0.4;
    this.depois(rede, () => {
      const volta = (resp) => this.depois(rede, () => cb({ ...resp, ms: this.agora - t0 }));
      if (alvo === 'proxy') {
        if (!this.cfg.proxy.presente) { volta({ status: 0, erro: 'ECONNREFUSED' }); return; }
        this.proxyReceber(req, volta);
      } else {
        this.restReceber(req, (resp) => volta(resp));
      }
    });
  }
}

// ---------------------------------------------------------------- execução de um estímulo
// estimulo = {
//   cliente: 'navegador' | 'k6',   // navegador executa a lógica de app.js; k6 faz HTTP cru
//   alvo: 'app' | 'proxy' | 'direto', // 'app' segue a BASE de app.js
//   rampa: [[durS, alvoVUs], ...], pensar: s entre visitas,
//   falha: { tipo: 'parado'|'morre'|'travado'|'lento', inicio: s, duracao: s } | null,
//   raspagem: { taxa: req/s, inicio, duracao } | null,
//   escrita: { intervalo: s } | null,
//   mesmoIP: bool, seed
// }
export function executar(cfg, est) {
  const sis = new Sistema(cfg, { seed: est.seed ?? 20261113 });
  const C = sis.cfg;
  const duracaoMs = est.rampa.reduce((s, [d]) => s + d, 0) * 1000;
  const alvoReq = est.alvo === 'app' || !est.alvo ? (C.app.base === 'proxy' ? 'proxy' : 'direto') : est.alvo;
  const nav = est.cliente === 'navegador';
  const pensarMs = (est.pensar ?? 1) * 1000;

  // métricas
  const seg = Math.ceil(duracaoMs / 1000) + 1;
  const serie = Array.from({ length: seg }, (_, t) => ({
    t, lat: [], req: 0, falhas: 0, hit: 0, miss: 0, stale: 0, s405: 0, s429: 0, restReq: 0,
    visitas: 0, semJogos: 0, degradadas: 0, abertos: 0, fila: 0, estado: 'up', vus: 0,
  }));
  const bucket = () => serie[Math.min(seg - 1, Math.floor(sis.agora / 1000))];
  const http = [];          // { t, ms, ok }
  const visitas = [];       // { t, ms, exibiu, degradada }
  const rasp = { enviadas: 0, ok: 0, s429: 0, outras: 0 };
  const escr = { enviadas: 0, aceitas: 0, chegaramRest: 0, status: {} };
  const ev = { circuitoAbriu: 0, restAtendeuGet: 0, staleServidos: 0, timeouts: 0 };
  sis.coletor = {
    restAtendeu(req, resp) {
      bucket().restReq += 1;
      if (req.metodo === 'GET') ev.restAtendeuGet += 1;
      if (req.origem === 'atacante') escr.chegaramRest += 1;
    },
    proxyRespondeu(req, resp) {
      const b = bucket();
      if (resp.xcache === 'HIT') b.hit += 1;
      else if (resp.xcache === 'STALE') { b.stale += 1; ev.staleServidos += 1; }
      else if (resp.xcache === 'MISS' || resp.xcache === 'EXPIRED') b.miss += 1;
      if (resp.status === 405) b.s405 += 1;
      if (resp.status === 429) b.s429 += 1;
    },
  };
  // A escrita do atacante e o 405 do validador passam por coletor mesmo sem proxy (direto).

  // ------------------------------------------ visitantes
  const vus = [];
  let proximoId = 1;
  const ipDe = (id) => (est.mesmoIP ? '200.129.10.4' : `177.${(id >> 8) & 255}.${id & 255}.${(id * 7) % 250 + 2}`);
  function novaVU() {
    const vu = { id: proximoId++, parar: false, circuito: { estado: 'fechado', falhas: [], abertoEm: 0, testeEmVoo: false }, local: new Set() };
    vu.ip = ipDe(vu.id);
    vus.push(vu); iteracao(vu);
  }
  function iteracao(vu) {
    if (vu.parar || sis.agora >= duracaoMs) { vu.morta = true; return; }
    const t0 = sis.agora;
    let restantes = LEITURAS.length, exibiu = true, degradada = false;
    for (const caminho of LEITURAS) {
      consulta(vu, caminho, (r) => {
        if (!r.ok) exibiu = false;
        if (r.degradada) degradada = true;
        if (--restantes === 0) {
          const ms = sis.agora - t0;
          visitas.push({ t: sis.agora, ms, exibiu, degradada });
          const b = bucket(); b.visitas += 1; if (!exibiu) b.semJogos += 1; if (degradada) b.degradadas += 1;
          sis.depois(pensarMs * (0.5 + sis.rand()), () => iteracao(vu));
        }
      });
    }
  }
  function registrarHttp(ms, ok) {
    http.push({ t: sis.agora, ms, ok });
    const b = bucket(); b.req += 1; b.lat.push(ms); if (!ok) b.falhas += 1;
  }
  function consulta(vu, caminho, cb) {
    const A = C.app;
    const circ = vu.circuito;
    const usaApp = nav;
    const alternativa = () => {
      if (usaApp && A.fallback && vu.local.has(caminho)) cb({ ok: true, degradada: true });
      else cb({ ok: false });
    };
    if (usaApp && A.breaker.on && circ.estado !== 'fechado') {
      if (circ.estado === 'aberto' && sis.agora - circ.abertoEm < A.breaker.espera * 1000) { sis.depois(0.05, alternativa); return; }
      if (circ.testeEmVoo) { sis.depois(0.05, alternativa); return; }
      circ.estado = 'meio-aberto'; circ.testeEmVoo = true;
    }
    let feito = false;
    const concluir = (resp, abortado) => {
      if (feito) return; feito = true;
      const ok = resp.status >= 200 && resp.status < 400;
      registrarHttp(resp.ms, ok);
      if (usaApp && A.breaker.on) {
        circ.testeEmVoo = false;
        if (ok) { circ.estado = 'fechado'; circ.falhas = []; }
        else {
          circ.falhas = circ.falhas.filter((t) => sis.agora - t < A.breaker.janela * 1000);
          circ.falhas.push(sis.agora);
          if (circ.estado === 'meio-aberto' || circ.falhas.length >= A.breaker.limiar) {
            if (circ.estado !== 'aberto') { ev.circuitoAbriu += 1; if (A.logCircuito) sis.log('navegador', `[circuito] aberto { visitante: ${vu.id}, falhas: ${circ.falhas.length} }`, true); }
            circ.estado = 'aberto'; circ.abertoEm = sis.agora;
          }
        }
      }
      if (abortado) { ev.timeouts += 1; }
      if (ok) {
        if (usaApp && A.fallback) vu.local.add(caminho);
        cb({ ok: true, degradada: resp.xcache === 'STALE' });
      } else alternativa();
    };
    const t0 = sis.agora;
    const lim = usaApp && A.timeout.on ? A.timeout.ms : 60000;   // k6: timeout padrão de 60 s
    sis.depois(lim, () => concluir({ status: 0, ms: sis.agora - t0, erro: 'timeout' }, true));
    sis.enviar({ metodo: 'GET', caminho, ip: vu.ip, origem: 'visitante' }, alvoReq, (resp) => concluir(resp, false));
  }

  // rampa de VUs (ramping-vus do k6, interpolação linear)
  const alvoEm = (ms) => {
    let t = 0, de = 0;
    for (const [d, para] of est.rampa) {
      const dm = d * 1000;
      if (ms <= t + dm) return de + (para - de) * ((ms - t) / dm);
      t += dm; de = para;
    }
    return de;
  };
  function ajustar() {
    const alvo = Math.round(alvoEm(sis.agora));
    const vivas = vus.filter((v) => !v.parar && !v.morta);
    if (vivas.length < alvo) for (let i = vivas.length; i < alvo; i++) novaVU();
    else if (vivas.length > alvo) for (let i = 0; i < vivas.length - alvo; i++) vivas[vivas.length - 1 - i].parar = true;
    const b = bucket();
    b.vus = Math.max(b.vus, alvo);
    if (sis.agora + 100 < duracaoMs) sis.depois(100, ajustar);
  }
  sis.at(0, ajustar);

  // amostragem de estado por segundo
  function amostrar() {
    const b = bucket();
    b.fila = sis.rest.fila.length + sis.rest.pendurados.size;
    b.estado = sis.rest.estado;
    b.abertos = vus.filter((v) => !v.morta && v.circuito.estado !== 'fechado').length;
    if (sis.agora + 1000 <= duracaoMs) sis.depois(1000, amostrar);
  }
  sis.at(500, amostrar);

  // falha injetada
  const F = est.falha;
  if (F) {
    sis.at(F.inicio * 1000, () => sis.falharRest(F.tipo));
    sis.at((F.inicio + F.duracao) * 1000, () => sis.restaurarRest('operador: docker compose start rest'));
  }

  // raspagem aberta (processo de Poisson) a partir de um único IP
  const R = est.raspagem;
  if (R) {
    let n = 0;
    const fimR = (R.inicio + R.duracao) * 1000;
    const disparar = () => {
      if (sis.agora >= fimR) return;
      rasp.enviadas += 1;
      sis.enviar({ metodo: 'GET', caminho: `/remo_partidas?select=*&offset=${(n++ % 50) * 20}`, ip: '45.83.12.9', origem: 'raspador' }, alvoReq, (resp) => {
        if (resp.status === 200) rasp.ok += 1; else if (resp.status === 429) rasp.s429 += 1; else rasp.outras += 1;
      });
      sis.depois(sis.exp(1000 / R.taxa), disparar);
    };
    sis.at(R.inicio * 1000, disparar);
  }

  // escrita com a chave publicável
  const W = est.escrita;
  if (W) {
    let i = 0;
    const tentar = () => {
      if (sis.agora >= duracaoMs) return;
      const metodo = ['POST', 'PATCH', 'DELETE'][i++ % 3];
      const caminho = metodo === 'POST' ? '/remo_partidas' : '/remo_partidas?id=eq.1';
      escr.enviadas += 1;
      sis.enviar({ metodo, caminho, ip: '45.83.12.9', origem: 'atacante' }, alvoReq, (resp) => {
        escr.status[resp.status] = (escr.status[resp.status] || 0) + 1;
        if (resp.status >= 200 && resp.status < 300) escr.aceitas += 1;
        if (resp.status === 405) bucket().s405 += 1;
      });
      sis.depois(W.intervalo * 1000, tentar);
    };
    sis.at(1000, tentar);
  }

  sis.rodarAte(duracaoMs + 65000);   // drena requisições penduradas até o timeout do k6

  // ------------------------------------------ resumo
  const ord = (arr) => arr.slice().sort((a, b) => a - b);
  const pct = (s, p) => (s.length ? s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))] : 0);
  const lat = ord(http.map((h) => h.ms));
  const falhas = http.filter((h) => !h.ok).length;
  const janela = F ? [F.inicio * 1000, (F.inicio + F.duracao) * 1000] : null;
  const naJanela = janela ? http.filter((h) => h.t >= janela[0] && h.t <= janela[1] + 2000) : [];
  const visNaJanela = janela ? visitas.filter((v) => v.t >= janela[0] && v.t <= janela[1] + 2000) : [];
  const exib = ord(visitas.map((v) => v.ms));
  for (const b of serie) { const s = ord(b.lat); b.p95 = pct(s, 95); b.p50 = pct(s, 50); delete b.lat; }

  return {
    duracao: duracaoMs / 1000,
    alvo: alvoReq,
    http: {
      total: http.length, falhas, taxaFalhas: http.length ? falhas / http.length : 0,
      p50: pct(lat, 50), p90: pct(lat, 90), p95: pct(lat, 95), max: lat[lat.length - 1] || 0,
      rps: http.length / (duracaoMs / 1000),
    },
    janela: janela && {
      inicio: F.inicio, duracao: F.duracao, tipo: F.tipo,
      total: naJanela.length, falhas: naJanela.filter((h) => !h.ok).length,
      taxaFalhas: naJanela.length ? naJanela.filter((h) => !h.ok).length / naJanela.length : 0,
      visitas: visNaJanela.length,
      semJogos: visNaJanela.filter((v) => !v.exibiu).length,
    },
    visitas: {
      total: visitas.length,
      exibiram: visitas.filter((v) => v.exibiu).length,
      degradadas: visitas.filter((v) => v.degradada).length,
      p95: pct(exib, 95), p50: pct(exib, 50),
    },
    raspagem: R ? rasp : null,
    escrita: W ? escr : null,
    eventos: ev,
    serie,
    logs: sis.logs,
    restFinal: { estado: sis.rest.estado, saude: sis.rest.saude },
  };
}

// ---------------------------------------------------------------- oráculos
export const ORACULOS = {
  desempenho: {
    texto: 'p(95) de http_req_duration < 500 ms e http_req_failed < 1%',
    avaliar: (r) => [
      { nome: 'http_req_duration p(95) < 500 ms', ok: r.http.p95 < 500, valor: fmtMs(r.http.p95) },
      { nome: 'http_req_failed < 1%', ok: r.http.taxaFalhas < 0.01, valor: fmtPct(r.http.taxaFalhas) },
    ],
  },
  disponibilidade: {
    texto: 'durante a falha do PostgREST, menos de 1% das leituras falham e 99% das visitas exibem os jogos',
    avaliar: (r) => r.janela ? [
      { nome: 'leituras com falha durante a falha < 1%', ok: r.janela.taxaFalhas < 0.01, valor: fmtPct(r.janela.taxaFalhas) },
      { nome: 'visitas sem jogos durante a falha < 1%', ok: r.janela.visitas > 0 && r.janela.semJogos / r.janela.visitas < 0.01, valor: r.janela.visitas ? fmtPct(r.janela.semJogos / r.janela.visitas) : 'sem visitas' },
    ] : [
      { nome: 'leituras com falha < 1%', ok: r.http.taxaFalhas < 0.01, valor: fmtPct(r.http.taxaFalhas) },
      { nome: 'visitas sem jogos < 1%', ok: r.visitas.total > 0 && 1 - r.visitas.exibiram / r.visitas.total < 0.01, valor: r.visitas.total ? fmtPct(1 - r.visitas.exibiram / r.visitas.total) : 'sem visitas' },
    ],
  },
  raspagem: {
    texto: 'com um raspador ativo, p(95) dos visitantes < 500 ms e falhas dos visitantes < 1%',
    avaliar: (r) => [
      { nome: 'p(95) dos visitantes < 500 ms', ok: r.http.p95 < 500, valor: fmtMs(r.http.p95) },
      { nome: 'falhas dos visitantes < 1%', ok: r.http.taxaFalhas < 0.01, valor: fmtPct(r.http.taxaFalhas) },
    ],
  },
  escrita: {
    texto: 'nenhuma escrita com a chave publicável é aceita',
    avaliar: (r) => [
      { nome: 'escritas aceitas = 0', ok: r.escrita.aceitas === 0, valor: String(r.escrita.aceitas) },
    ],
  },
};

export function fmtMs(ms) { return ms >= 1000 ? (ms / 1000).toFixed(2).replace('.', ',') + ' s' : (ms < 10 ? ms.toFixed(1).replace('.', ',') : Math.round(ms)) + ' ms'; }
export function fmtPct(x) { return (x * 100).toFixed(2).replace('.', ',') + '%'; }
