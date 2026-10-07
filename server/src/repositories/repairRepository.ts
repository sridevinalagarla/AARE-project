import { prisma } from '../config/database.js';
import { RepairPlan, PatchDiff } from '../types/index.js';
import { DbStore } from '../engines/storage/dbStore.js';

export class RepairRepository {
  static async createRepair(
    projectId: string,
    violationId: string,
    plan: RepairPlan,
    patch: PatchDiff
  ): Promise<any> {
    try {
      // Create repair in database
      const repair = await prisma.repair.create({
        data: {
          projectId,
          violationId,
          ruleId: plan.ruleId,
          strategy: plan.strategyName,
          status: 'GENERATED',
          confidence: plan.confidenceScore,
          risk: plan.riskLevel,
          originalCode: patch.originalCode,
          patchedCode: patch.replacementCode,
          filePath: patch.file,
          lineStart: patch.lineStart,
          lineEnd: patch.lineEnd,
          patchHash: patch.patchHash,
        },
      });

      // Record Repair Attempt 1
      await prisma.repairAttempt.create({
        data: {
          repairId: repair.id,
          attemptNumber: 1,
          agent: 'RepairPlannerAgent',
          inputContext: {
            strategy: plan.strategyName,
            targetElement: plan.targetElement,
            confidence: plan.confidenceScore,
          },
          generatedPatch: patch.diffFormatted,
          result: 'SUCCESS',
        },
      });

      // Sync local store
      DbStore.savePatch(patch);

      return repair;
    } catch {
      DbStore.savePatch(patch);
      return {
        id: patch.patchId,
        projectId,
        violationId,
        ruleId: plan.ruleId,
        strategy: plan.strategyName,
        status: 'GENERATED',
      };
    }
  }


  static async updateStatus(repairId: string, status: any): Promise<void> {
    try {
      await prisma.repair.update({
        where: { id: repairId },
        data: { status, updatedAt: new Date() },
      });
    } catch {
      // Ignore
    }
  }

  static async getById(repairId: string): Promise<any | null> {
    try {
      return await prisma.repair.findUnique({
        where: { id: repairId },
        include: {
          attempts: true,
          testRuns: true,
          verificationContract: true,
          proofCertificates: true,
        },
      });
    } catch {
      return null;
    }
  }
}
