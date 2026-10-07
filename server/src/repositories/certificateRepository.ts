import { prisma } from '../config/database.js';
import { ProofCertificate } from '../types/index.js';
import { DbStore } from '../engines/storage/dbStore.js';

export class CertificateRepository {
  static async createCertificate(
    projectId: string,
    repairId: string,
    cert: ProofCertificate
  ): Promise<any> {
    try {
      const created = await prisma.proofCertificate.create({
        data: {
          certificateId: cert.certificateId,
          projectId,
          repairId,
          ruleId: cert.ruleId,
          wcagCriteria: [cert.wcagCriterion],
          sourceHash: cert.sourceHash,
          patchHash: cert.patchHash,
          contractHash: cert.certificateHash.slice(0, 32),
          testHash: cert.certificateHash.slice(32),
          verificationStatus: 'VALID',
          certificateData: cert as any,
          issuedAt: new Date(cert.provenance.timestamp),
        },
      });

      DbStore.saveCertificate(cert);
      return created;
    } catch {
      DbStore.saveCertificate(cert);
      return cert;
    }
  }

  static async getAll(limit: number = 20, offset: number = 0): Promise<any[]> {
    try {
      const certs = await prisma.proofCertificate.findMany({
        take: limit,
        skip: offset,
        orderBy: { issuedAt: 'desc' },
        include: {
          project: { select: { name: true, sourceUrl: true } },
        },
      });

      if (certs.length === 0) {
        return DbStore.getAllCertificates().slice(offset, offset + limit);
      }

      return certs.map((c) => ({
        ...(c.certificateData as any),
        certificateId: c.certificateId,
        ruleId: c.ruleId,
        wcagCriterion: c.wcagCriteria[0] || '1.1.1',
        projectUrl: c.project?.sourceUrl || (c.certificateData as any)?.projectUrl,
      }));
    } catch {
      return DbStore.getAllCertificates().slice(offset, offset + limit);
    }
  }

  static async getById(certificateId: string): Promise<any | null> {
    try {
      const cert = await prisma.proofCertificate.findUnique({
        where: { certificateId },
        include: {
          project: true,
          repair: {
            include: {
              testRuns: true,
              verificationContract: true,
            },
          },
        },
      });

      if (cert) {
        return {
          ...(cert.certificateData as any),
          certificateId: cert.certificateId,
        };
      }

      return DbStore.getCertificate(certificateId) || null;
    } catch {
      return DbStore.getCertificate(certificateId) || null;
    }
  }
}

