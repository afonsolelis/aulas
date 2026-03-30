import * as path from 'path';
import * as fs from 'fs';
import { pathToFileURL } from 'url';

const repoRoot = path.resolve(__dirname, '..');

export function toFileUrl(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, '');
  return pathToFileURL(path.join(repoRoot, normalized)).href;
}

export function resolveRepoPath(relativePath: string): string {
  return path.join(repoRoot, relativePath.replace(/^\/+/, ''));
}

export function resolveHtmlPath(htmlRelativePath: string, targetPath: string): string {
  return path.resolve(path.dirname(resolveRepoPath(htmlRelativePath)), targetPath);
}

export function readRepoFile(relativePath: string): string {
  return fs.readFileSync(resolveRepoPath(relativePath), 'utf8');
}

export function listHtmlFiles(relativeDir: string): string[] {
  const baseDir = resolveRepoPath(relativeDir);
  const htmlFiles: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    entries.forEach((entry) => {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        return;
      }

      if (entry.isFile() && entry.name.endsWith('.html')) {
        htmlFiles.push(path.relative(repoRoot, fullPath).replace(/\\/g, '/'));
      }
    });
  }

  walk(baseDir);
  return htmlFiles.sort();
}

export function extractAnchorHrefs(html: string): string[] {
  return [...html.matchAll(/<a\b[^>]*href=(["'])(.*?)\1/gi)].map((match) => match[2]);
}

export function extractImgTags(html: string): string[] {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
}
