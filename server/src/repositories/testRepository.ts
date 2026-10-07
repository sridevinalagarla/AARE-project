import { prisma } from '../config/database.js';
import { SandboxTestResult } from '../types/index.js';
import { DbStore } from '../engines/storage/dbStore.js';

export class TestRepository {
  static async createTestRun(repairId: string, testResult: SandboxTestResult): Promise<any> {
    try {
      const testRun = await prisma.testRun.create({
        data: {
          repairId,
          type: 'FULL',
          status: testResult.accessibilityTestsPassed && testResult.regressionTestsPassed ? 'PASSED' : 'FAILED',
          violationsBefore: testResult.violationsBefore,
          violationsAfter: testResult.violationsAfter,
          regressionPassed: testResult.regressionTestsPassed,
          accessibilityPassed: testResult.accessibilityTestsPassed,
          visualDiffPassed: testResult.visualDiffPassed,
          buildPassed: testResult.buildPassed,
          testOutput: {
            axeSummary: testResult.axeSummary,
            logs: testResult.logs,
            durationMs: testResult.durationMs,
          },
          completedAt: new Date(),
        },
      });

      DbStore.saveTestResult(testResult);
      return testRun;
    } catch {
      DbStore.saveTestResult(testResult);
      return testResult;
    }
  }

  static async getLatestByRepairId(repairId: string): Promise<any | null> {
    try {
      return await prisma.testRun.findFirst({
        where: { repairId },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return null;
    }
  }
}
