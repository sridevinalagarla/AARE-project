import { prisma } from '../config/database.js';
import { DbStore } from '../engines/storage/dbStore.js';

export class AuditRepository {
  static async log(
    action: string,
    entityType: string,
    entityId: string,
    metadata?: any,
    projectId?: string,
    userId?: string
  ): Promise<any> {
    try {
      const log = await prisma.auditLog.create({
        data: {
          action,
          entityType,
          entityId,
          metadata,
          projectId,
          userId,
        },
      });

      DbStore.logAudit(action, `${entityType}:${entityId}`, metadata);
      return log;
    } catch {
      DbStore.logAudit(action, `${entityType}:${entityId}`, metadata);
      return null;
    }
  }

  static async getLogs(limit: number = 20, offset: number = 0, projectId?: string): Promise<any[]> {
    try {
      return await prisma.auditLog.findMany({
        where: projectId ? { projectId } : undefined,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return DbStore.getAuditLogs().slice(offset, offset + limit);
    }
  }
}
