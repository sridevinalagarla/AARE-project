import { prisma } from '../config/database.js';
import { ProjectModel } from '../types/index.js';
import { DbStore } from '../engines/storage/dbStore.js';

export class ProjectRepository {
  static async findOrCreateByUrl(url: string, name?: string): Promise<any> {
    try {
      let project = await prisma.project.findFirst({
        where: { sourceUrl: url },
      });

      if (!project) {
        project = await prisma.project.create({
          data: {
            name: name || url.replace(/^https?:\/\//, '').split('/')[0],
            sourceType: url.includes('localhost') || url.includes('127.0.0.1') ? 'DEMO' : 'URL',
            sourceUrl: url,
            framework: 'React',
            language: 'TypeScript',
            packageManager: 'npm',
            status: 'READY',
            accessibilityScore: 100,
          },
        });
      }

      // Sync local store as mirror
      DbStore.saveProject({
        projectId: project.id,
        name: project.name,
        sourceType: project.sourceType as any,
        sourceUrl: project.sourceUrl || undefined,
        framework: project.framework as any,
        packageManager: project.packageManager,
        totalFiles: 14,
        componentsCount: 6,
        routesCount: 2,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        score: project.accessibilityScore,
        violationsCount: 0,
        repairsCount: 0,
        verifiedCount: 0,
        pipelineState: 'DETECT',
      });

      return project;
    } catch (error) {
      // Fallback to in-memory store
      return DbStore.findProject(url) || {
        id: `PROJ-${Date.now().toString().slice(-4)}`,
        name: name || url.replace(/^https?:\/\//, '').split('/')[0],
        sourceType: 'URL',
        sourceUrl: url,
        framework: 'React',
        language: 'TypeScript',
        packageManager: 'npm',
        status: 'READY',
        accessibilityScore: 100,
      };
    }
  }

  static async findById(id: string): Promise<any | null> {
    try {
      return await prisma.project.findUnique({
        where: { id },
        include: {
          scans: { orderBy: { createdAt: 'desc' }, take: 5 },
          repairs: { orderBy: { createdAt: 'desc' }, take: 10 },
          certificates: true,
        },
      });
    } catch {
      return DbStore.getProject(id) || null;
    }
  }

  static async getAll(limit: number = 20, offset: number = 0): Promise<any[]> {
    try {
      return await prisma.project.findMany({
        take: limit,
        skip: offset,
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: {
              scans: true,
              repairs: true,
              certificates: true,
            },
          },
        },
      });
    } catch {
      return DbStore.getAllProjects().slice(offset, offset + limit);
    }
  }


  static async updateScore(id: string, score: number): Promise<void> {
    try {
      await prisma.project.update({
        where: { id },
        data: {
          accessibilityScore: score,
          updatedAt: new Date(),
        },
      });
    } catch {
      // Ignore fallback
    }
  }
}
