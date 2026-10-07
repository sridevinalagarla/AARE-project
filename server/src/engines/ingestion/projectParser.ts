import { ProjectModel, FrameworkType } from '../../types/index.js';
import { FRAMEWORK_ADAPTERS, NormalizedProject } from './adapters/frameworkAdapters.js';
import AdmZip from 'adm-zip';

export class ProjectParser {
  /**
   * Analyzes an uploaded ZIP buffer or repository file tree.
   */
  public static async parseZipBuffer(zipBuffer: Buffer, projectName: string = 'Uploaded Project'): Promise<{ project: ProjectModel; normalized: NormalizedProject }> {
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();

    const fileMap: Record<string, string> = {};
    const filePaths: string[] = [];
    let packageJson: any = null;

    for (const entry of zipEntries) {
      if (!entry.isDirectory && !entry.entryName.includes('node_modules') && !entry.entryName.includes('.git')) {
        const path = entry.entryName;
        filePaths.push(path);
        try {
          const content = entry.getData().toString('utf8');
          fileMap[path] = content;
          if (path.endsWith('package.json')) {
            try {
              packageJson = JSON.parse(content);
            } catch {}
          }
        } catch {}
      }
    }

    return this.normalizeProjectFromFiles(fileMap, filePaths, packageJson, projectName, 'ZIP_UPLOAD');
  }

  /**
   * Analyzes a repository URL (e.g. GitHub).
   */
  public static async parseGitHubRepo(repoUrl: string): Promise<{ project: ProjectModel; normalized: NormalizedProject }> {
    const repoName = repoUrl.split('/').pop()?.replace(/\.git$/, '') || 'GitHub Repository';
    
    // Synthetic project model for GitHub repo analysis in MVP
    const sampleFiles: Record<string, string> = {
      'src/App.tsx': 'import React from "react";\nexport function App() { return <main><h1>Accessibility Portal</h1><img src="logo.png" /><button></button></main>; }',
      'src/components/Header.tsx': 'export const Header = () => <header><a href="/home">Click here</a></header>;',
      'package.json': JSON.stringify({ name: repoName, dependencies: { react: '^18.3.0', 'react-dom': '^18.3.0' } }),
    };

    return this.normalizeProjectFromFiles(sampleFiles, Object.keys(sampleFiles), JSON.parse(sampleFiles['package.json']), repoName, 'GITHUB', repoUrl);
  }

  private static normalizeProjectFromFiles(
    fileMap: Record<string, string>,
    filePaths: string[],
    packageJson: any,
    name: string,
    sourceType: 'URL' | 'GITHUB' | 'ZIP_UPLOAD',
    sourceUrl?: string
  ): { project: ProjectModel; normalized: NormalizedProject } {
    let matchedAdapter = FRAMEWORK_ADAPTERS.find(adapter => adapter.detect(filePaths, packageJson)) || FRAMEWORK_ADAPTERS[FRAMEWORK_ADAPTERS.length - 1];

    const normalized = matchedAdapter.normalize(fileMap);

    const projectId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const packageManager = packageJson ? 'npm' : 'none';

    const project: ProjectModel = {
      projectId,
      name,
      sourceType,
      sourceUrl: sourceUrl || undefined,
      framework: normalized.framework,
      packageManager,
      totalFiles: filePaths.length,
      componentsCount: normalized.components.length,
      routesCount: normalized.routes.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      score: 100,
      violationsCount: 0,
      repairsCount: 0,
      verifiedCount: 0,
      pipelineState: 'DETECT',
    };

    return { project, normalized };
  }
}
