import { FrameworkType } from '../../../types/index.js';

export interface NormalizedComponent {
  name: string;
  filePath: string;
  sourceCode: string;
  elements: Array<{
    tag: string;
    line: number;
    attributes: Record<string, string>;
    rawHtml: string;
  }>;
}

export interface NormalizedProject {
  framework: FrameworkType;
  packageManager: string;
  components: NormalizedComponent[];
  routes: string[];
  totalLinesOfCode: number;
}

export interface FrameworkAdapter {
  name: FrameworkType;
  detect: (files: string[], packageJson?: any) => boolean;
  normalize: (files: Record<string, string>) => NormalizedProject;
}

export class HTMLAdapter implements FrameworkAdapter {
  name: FrameworkType = 'HTML';

  detect(files: string[], packageJson?: any): boolean {
    return files.some(f => f.endsWith('.html') || f.endsWith('.htm'));
  }

  normalize(files: Record<string, string>): NormalizedProject {
    const components: NormalizedComponent[] = [];
    let totalLines = 0;

    for (const [filePath, content] of Object.entries(files)) {
      if (filePath.endsWith('.html') || filePath.endsWith('.htm')) {
        totalLines += content.split('\n').length;
        components.push({
          name: filePath.split('/').pop()?.replace(/\.html$/, '') || 'HTMLPage',
          filePath,
          sourceCode: content,
          elements: this.extractHtmlElements(content),
        });
      }
    }

    return {
      framework: 'HTML',
      packageManager: 'none',
      components,
      routes: ['/'],
      totalLinesOfCode: totalLines,
    };
  }

  private extractHtmlElements(html: string) {
    const regex = /<([a-z0-9-]+)([^>]*)>/gi;
    const elements: NormalizedComponent['elements'] = [];
    let match;
    let line = 1;

    while ((match = regex.exec(html)) !== null) {
      const tag = match[1];
      const attrString = match[2];
      const attributes: Record<string, string> = {};
      const attrRegex = /([a-z0-9-]+)(?:=["']([^"']*)["'])?/gi;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(attrString)) !== null) {
        attributes[attrMatch[1]] = attrMatch[2] || '';
      }
      elements.push({
        tag,
        line,
        attributes,
        rawHtml: match[0],
      });
    }
    return elements;
  }
}

export class ReactAdapter implements FrameworkAdapter {
  name: FrameworkType = 'React';

  detect(files: string[], packageJson?: any): boolean {
    const deps = packageJson ? { ...packageJson.dependencies, ...packageJson.devDependencies } : {};
    return !!deps['react'] || files.some(f => f.endsWith('.jsx') || f.endsWith('.tsx'));
  }

  normalize(files: Record<string, string>): NormalizedProject {
    const components: NormalizedComponent[] = [];
    let totalLines = 0;
    const routes: string[] = ['/'];

    for (const [filePath, content] of Object.entries(files)) {
      if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.ts')) {
        totalLines += content.split('\n').length;
        const name = filePath.split('/').pop()?.replace(/\.(jsx|tsx|js|ts)$/, '') || 'Component';
        if (filePath.toLowerCase().includes('page') || filePath.toLowerCase().includes('route')) {
          routes.push(`/${name.toLowerCase()}`);
        }
        components.push({
          name,
          filePath,
          sourceCode: content,
          elements: [],
        });
      }
    }

    return {
      framework: 'React',
      packageManager: 'npm',
      components,
      routes: Array.from(new Set(routes)),
      totalLinesOfCode: totalLines,
    };
  }
}

export class NextAdapter implements FrameworkAdapter {
  name: FrameworkType = 'Next.js';
  detect(files: string[], packageJson?: any): boolean {
    const deps = packageJson ? { ...packageJson.dependencies, ...packageJson.devDependencies } : {};
    return !!deps['next'] || files.some(f => f.includes('pages/') || f.includes('app/'));
  }
  normalize(files: Record<string, string>): NormalizedProject {
    const reactAdapter = new ReactAdapter();
    const normalized = reactAdapter.normalize(files);
    normalized.framework = 'Next.js';
    return normalized;
  }
}

export class VueAdapter implements FrameworkAdapter {
  name: FrameworkType = 'Vue';
  detect(files: string[], packageJson?: any): boolean {
    const deps = packageJson ? { ...packageJson.dependencies, ...packageJson.devDependencies } : {};
    return !!deps['vue'] || files.some(f => f.endsWith('.vue'));
  }
  normalize(files: Record<string, string>): NormalizedProject {
    return {
      framework: 'Vue',
      packageManager: 'npm',
      components: Object.keys(files).map(f => ({ name: f, filePath: f, sourceCode: files[f], elements: [] })),
      routes: ['/'],
      totalLinesOfCode: 100,
    };
  }
}

export class AngularAdapter implements FrameworkAdapter {
  name: FrameworkType = 'Angular';
  detect(files: string[], packageJson?: any): boolean {
    const deps = packageJson ? { ...packageJson.dependencies, ...packageJson.devDependencies } : {};
    return !!deps['@angular/core'] || files.some(f => f.includes('.component.ts'));
  }
  normalize(files: Record<string, string>): NormalizedProject {
    return {
      framework: 'Angular',
      packageManager: 'npm',
      components: Object.keys(files).map(f => ({ name: f, filePath: f, sourceCode: files[f], elements: [] })),
      routes: ['/'],
      totalLinesOfCode: 100,
    };
  }
}

export class SvelteAdapter implements FrameworkAdapter {
  name: FrameworkType = 'Svelte';
  detect(files: string[], packageJson?: any): boolean {
    const deps = packageJson ? { ...packageJson.dependencies, ...packageJson.devDependencies } : {};
    return !!deps['svelte'] || files.some(f => f.endsWith('.svelte'));
  }
  normalize(files: Record<string, string>): NormalizedProject {
    return {
      framework: 'Svelte',
      packageManager: 'npm',
      components: Object.keys(files).map(f => ({ name: f, filePath: f, sourceCode: files[f], elements: [] })),
      routes: ['/'],
      totalLinesOfCode: 100,
    };
  }
}

export const FRAMEWORK_ADAPTERS: FrameworkAdapter[] = [
  new NextAdapter(),
  new ReactAdapter(),
  new VueAdapter(),
  new AngularAdapter(),
  new SvelteAdapter(),
  new HTMLAdapter(),
];
