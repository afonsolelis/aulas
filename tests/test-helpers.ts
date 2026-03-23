import * as path from 'path';
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
