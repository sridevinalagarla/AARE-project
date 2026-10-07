import { prisma } from '../config/database.js';

export class ViolationRepository {
  static async getByScanId(scanId: string): Promise<any[]> {
    try {
      return await prisma.violation.findMany({
        where: { scanId },
        orderBy: { createdAt: 'asc' },
      });
    } catch {
      return [];
    }
  }

  static async findById(id: string): Promise<any | null> {
    try {
      return await prisma.violation.findUnique({
        where: { id },
        include: {
          repairs: {
            include: {
              testRuns: true,
              verificationContract: true,
              proofCertificates: true,
            },
          },
        },
      });
    } catch {
      return null;
    }
  }

  static async updateStatus(id: string, status: any): Promise<void> {
    try {
      await prisma.violation.update({
        where: { id },
        data: { status },
      });
    } catch {
      // Ignore fallback
    }
  }
}
