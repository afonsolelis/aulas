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
  const entries = fs.readdirSync(baseDir, { recursive: true, withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => {
      const relative = 'path' in entry && typeof entry.path === 'string'
        ? path.relative(repoRoot, path.join(entry.path, entry.name))
        : path.relative(repoRoot, path.join(baseDir, entry.name));
      return relative.replace(/\\/g, '/');
    })
    .sort();
}

export function extractAnchorHrefs(html: string): string[] {
  return [...html.matchAll(/<a\b[^>]*href=(["'])(.*?)\1/gi)].map((match) => match[2]);
}

export function extractImgTags(html: string): string[] {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
}
