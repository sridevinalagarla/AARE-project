import { prisma } from '../config/database.js';
import { RepairContract } from '../types/index.js';

export class VerificationRepository {
  static async createContract(
    repairId: string,
    contract: RepairContract,
    evidence?: any
  ): Promise<any> {
    try {
      return await prisma.verificationContract.upsert({
        where: { repairId },
        update: {
          precondition: contract.precondition,
          transformation: contract.transformation,
          postcondition: contract.postcondition,
          evidence,
          status: 'VALID',
          verifiedAt: new Date(),
        },
        create: {
          repairId,
          ruleId: contract.ruleId,
          wcagCriteria: [contract.wcagCriterion],
          precondition: contract.precondition,
          transformation: contract.transformation,
          postcondition: contract.postcondition,
          evidence,
          status: 'VALID',
          verifiedAt: new Date(),
        },
      });
    } catch {
      return contract;
    }
  }

  static async getByRepairId(repairId: string): Promise<any | null> {
    try {
      return await prisma.verificationContract.findUnique({
        where: { repairId },
      });
    } catch {
      return null;
    }
  }
}
