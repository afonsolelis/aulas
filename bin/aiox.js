#!/usr/bin/env node
/**
 * AIOX CLI — Wrapper principal
 *
 * Roteia comandos para os módulos corretos do .aiox-core:
 *   aiox doctor [--fix] [--json]
 *   aiox graph --deps [--format=json|html|mermaid]
 *   aiox <outros>  → CLI interno do .aiox-core
 */

const path = require('path');
const projectRoot = path.resolve(__dirname, '..');
const frameworkRoot = path.join(projectRoot, '.aiox-core');

const [,, command, ...args] = process.argv;

async function runDoctor() {
  const doctor = require(path.join(frameworkRoot, 'core', 'doctor', 'index.js'));
  const fix = args.includes('--fix');
  const json = args.includes('--json');
  const dryRun = args.includes('--dry-run');

  const result = await doctor.runDoctorChecks({ fix, json, dryRun, projectRoot });

  if (json) {
    console.log(JSON.stringify(result.data, null, 2));
  } else {
    console.log(result.formatted);
    if (result.data.fixResults) {
      console.log('\nFix results:');
      result.data.fixResults.forEach(f => {
        const icon = f.applied ? '✓' : '✗';
        console.log(`  [${icon}] ${f.check}: ${f.message}`);
      });
    }
  }

  const { fail } = result.data.summary;
  process.exit(fail > 0 ? 1 : 0);
}

async function runGraph() {
  try {
    const graphMod = require(path.join(frameworkRoot, 'core', 'graph-dashboard', 'index.js'));
    if (typeof graphMod.run === 'function') {
      await graphMod.run(args);
    } else {
      console.log('Graph dashboard disponível em .aiox-core/core/graph-dashboard/');
    }
  } catch (e) {
    console.error('Erro no graph dashboard:', e.message);
    process.exit(1);
  }
}

async function runCli() {
  const cliPath = path.join(frameworkRoot, 'cli', 'index.js');
  const { run } = require(cliPath);
  if (typeof run === 'function') {
    await run(process.argv);
  } else {
    // fallback: executa o programa diretamente
    const { createProgram } = require(cliPath);
    if (typeof createProgram === 'function') {
      const program = createProgram();
      await program.parseAsync(process.argv);
    }
  }
}

function getVersion() {
  try {
    return require(path.join(frameworkRoot, 'version.json')).version || '?';
  } catch {
    return '?';
  }
}

(async () => {
  try {
    switch (command) {
      case 'doctor':
        await runDoctor();
        break;
      case 'graph':
        await runGraph();
        break;
      case undefined:
      case '--help':
      case '-h':
        console.log(`
AIOX v${getVersion()} — AI-Orchestrated Development System

Uso: aiox <comando> [opções]

Comandos:
  doctor           Verifica saúde do ambiente AIOX (15 checks)
    --fix          Aplica correções automáticas
    --json         Output em JSON
    --dry-run      Mostra o que seria corrigido sem aplicar

  graph --deps     Visualiza dependências do projeto
    --format       ascii | json | html | mermaid (default: ascii)
    --watch        Modo live com auto-refresh

  workers          Gerencia workers AIOX
  qa               Ferramentas de qualidade
  metrics          Métricas de quality gates
  manifest         Gerencia manifesto de instalação
  config           Configuração do framework

Agentes (via Claude Code):
  @dev @qa @architect @pm @po @sm @analyst @devops @data-engineer

Exemplos:
  aiox doctor
  aiox doctor --fix
  aiox doctor --json
  aiox graph --deps --format=html
`);
        break;
      default:
        await runCli();
    }
  } catch (e) {
    console.error(`Erro: ${e.message}`);
    process.exit(1);
  }
})();
