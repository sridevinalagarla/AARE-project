import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for PROOF A11Y...');

  // 1. Clean existing records safely
  await prisma.auditLog.deleteMany({});
  await prisma.deployment.deleteMany({});
  await prisma.proofCertificate.deleteMany({});
  await prisma.verificationContract.deleteMany({});
  await prisma.testRun.deleteMany({});
  await prisma.repairAttempt.deleteMany({});
  await prisma.repair.deleteMany({});
  await prisma.violation.deleteMany({});
  await prisma.scan.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Seed Admin / Developer User
  const passwordHash = await bcrypt.hash('ProofA11y@2026', 10);
  const demoUser = await prisma.user.create({
    data: {
      name: 'Lead Accessibility Engineer',
      email: 'engineer@proofa11y.io',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`👤 Created demo user: ${demoUser.email}`);

  // 3. Seed Demo Project (Showcase Storefront)
  const demoProject = await prisma.project.create({
    data: {
      name: 'Nexus Retail Showcase (React)',
      sourceType: 'DEMO',
      sourceUrl: 'http://localhost:3001/demo.html',
      repositoryUrl: 'https://github.com/proof-a11y/nexus-retail-demo',
      framework: 'React',
      language: 'TypeScript',
      packageManager: 'npm',
      status: 'READY',
      accessibilityScore: 61.0,
    },
  });
  console.log(`📦 Created demo project: ${demoProject.name}`);

  // 4. Seed Completed Baseline Scan with 8 WCAG Violations
  const demoScan = await prisma.scan.create({
    data: {
      projectId: demoProject.id,
      url: 'http://localhost:3001/demo.html',
      status: 'COMPLETED',
      score: 61.0,
      totalViolations: 8,
      totalPasses: 24,
      totalIncomplete: 2,
      criticalCount: 2,
      seriousCount: 3,
      moderateCount: 2,
      minorCount: 1,
      duration: 2.34,
      completedAt: new Date(),
    },
  });
  console.log(`🔍 Created demo scan: ${demoScan.id}`);

  // 5. Seed Violations
  const violationsData = [
    {
      ruleId: 'image-alt',
      impact: 'critical',
      wcagCriteria: ['1.1.1'],
      description: 'Ensures <img> elements have alternative text or a role of none or presentation',
      help: 'Images must have alternate text',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/image-alt',
      tags: ['cat.text-alternatives', 'wcag2a', 'wcag111', 'section508'],
      sourceHtml: '<img src="/assets/hero-banner.jpg" class="w-full h-48 object-cover rounded-xl" />',
      target: 'img.w-full',
      affectedNodes: [{
        html: '<img src="/assets/hero-banner.jpg" class="w-full h-48 object-cover rounded-xl" />',
        target: ['img.w-full'],
        failureSummary: 'Fix any of the following: Element does not have an alt attribute; aria-label attribute does not exist or is empty',
      }],
    },
    {
      ruleId: 'button-name',
      impact: 'critical',
      wcagCriteria: ['4.1.2'],
      description: 'Ensures buttons have discernible text',
      help: 'Buttons must have discernible text',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/button-name',
      tags: ['cat.name-role-value', 'wcag2a', 'wcag412', 'section508'],
      sourceHtml: '<button class="p-2 rounded-lg bg-cyan-500 text-white"><svg class="w-5 h-5">...</svg></button>',
      target: 'button.p-2',
      affectedNodes: [{
        html: '<button class="p-2 rounded-lg bg-cyan-500 text-white"><svg class="w-5 h-5">...</svg></button>',
        target: ['button.p-2'],
        failureSummary: 'Fix all of the following: Element is in tab order and does not have accessible text',
      }],
    },
    {
      ruleId: 'label',
      impact: 'serious',
      wcagCriteria: ['1.3.1', '3.3.2', '4.1.2'],
      description: 'Ensures every form element has a label',
      help: 'Form elements must have labels',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/label',
      tags: ['cat.forms', 'wcag2a', 'wcag412', 'wcag131'],
      sourceHtml: '<input type="email" placeholder="Enter your work email" class="input-field" />',
      target: 'input[type="email"]',
      affectedNodes: [{
        html: '<input type="email" placeholder="Enter your work email" class="input-field" />',
        target: ['input[type="email"]'],
        failureSummary: 'Fix any of the following: Form element does not have an implicit (wrapped) <label>; Element does not have an explicit <label>',
      }],
    },
    {
      ruleId: 'color-contrast',
      impact: 'serious',
      wcagCriteria: ['1.4.3'],
      description: 'Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds',
      help: 'Elements must meet minimum color contrast ratio thresholds',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/color-contrast',
      tags: ['cat.color', 'wcag2aa', 'wcag143'],
      sourceHtml: '<span style="color: #94a3b8; background-color: #f1f5f9;">Low contrast subtitle</span>',
      target: 'span.subtitle',
      affectedNodes: [{
        html: '<span style="color: #94a3b8; background-color: #f1f5f9;">Low contrast subtitle</span>',
        target: ['span.subtitle'],
        failureSummary: 'Element has insufficient color contrast of 2.38:1 (foreground color: #94a3b8, background color: #f1f5f9, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1',
      }],
    },
    {
      ruleId: 'html-has-lang',
      impact: 'serious',
      wcagCriteria: ['3.1.1'],
      description: 'Ensures every HTML document has a lang attribute',
      help: '<html> element must have a lang attribute',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/html-has-lang',
      tags: ['cat.language', 'wcag2a', 'wcag311'],
      sourceHtml: '<html class="dark">',
      target: 'html',
      affectedNodes: [{
        html: '<html class="dark">',
        target: ['html'],
        failureSummary: 'Fix any of the following: The <html> element does not have a lang attribute',
      }],
    },
    {
      ruleId: 'heading-order',
      impact: 'moderate',
      wcagCriteria: ['1.3.1'],
      description: 'Ensures the order of headings is semantically correct',
      help: 'Heading levels should only increase by one',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/heading-order',
      tags: ['cat.semantics', 'best-practice'],
      sourceHtml: '<h4 class="font-bold">Features</h4>',
      target: 'h4',
      affectedNodes: [{
        html: '<h4 class="font-bold">Features</h4>',
        target: ['h4'],
        failureSummary: 'Fix any of the following: Heading order invalid',
      }],
    },
    {
      ruleId: 'duplicate-id',
      impact: 'minor',
      wcagCriteria: ['4.1.2'],
      description: 'Ensures every id attribute value is unique',
      help: 'id attribute value must be unique',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/duplicate-id',
      tags: ['cat.parsing', 'wcag2a', 'wcag412'],
      sourceHtml: '<div id="primary-nav">...</div>',
      target: '#primary-nav',
      affectedNodes: [{
        html: '<div id="primary-nav">...</div>',
        target: ['#primary-nav'],
        failureSummary: 'Fix any of the following: Document has multiple elements with the same id attribute: primary-nav',
      }],
    },
  ];

  for (const vData of violationsData) {
    const violation = await prisma.violation.create({
      data: {
        scanId: demoScan.id,
        ruleId: vData.ruleId,
        impact: vData.impact,
        wcagCriteria: vData.wcagCriteria,
        description: vData.description,
        help: vData.help,
        helpUrl: vData.helpUrl,
        tags: vData.tags,
        sourceHtml: vData.sourceHtml,
        target: vData.target,
        affectedNodes: vData.affectedNodes,
        status: 'VERIFIED',
      },
    });

    // 6. Create Verified Repair & Proof Contract for image-alt
    if (vData.ruleId === 'image-alt') {
      const repair = await prisma.repair.create({
        data: {
          projectId: demoProject.id,
          violationId: violation.id,
          ruleId: 'image-alt',
          strategy: 'AST Mutation: Add context-aware alt description',
          status: 'VERIFIED',
          confidence: 99.4,
          risk: 'LOW',
          originalCode: '<img src="/assets/hero-banner.jpg" class="w-full h-48 object-cover rounded-xl" />',
          patchedCode: '<img src="/assets/hero-banner.jpg" alt="Nexus Retail Product Showcase Hero Banner" class="w-full h-48 object-cover rounded-xl" />',
          filePath: 'src/components/HeroBanner.tsx',
          lineStart: 18,
          lineEnd: 18,
          patchHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        },
      });

      // Repair Attempt
      await prisma.repairAttempt.create({
        data: {
          repairId: repair.id,
          attemptNumber: 1,
          agent: 'RepairPlannerAgent',
          inputContext: { component: 'HeroBanner', framework: 'React' },
          generatedPatch: repair.patchedCode,
          result: 'SUCCESS',
        },
      });

      // Test Run
      await prisma.testRun.create({
        data: {
          repairId: repair.id,
          type: 'FULL',
          status: 'PASSED',
          violationsBefore: 1,
          violationsAfter: 0,
          regressionPassed: true,
          accessibilityPassed: true,
          visualDiffPassed: true,
          buildPassed: true,
          testOutput: {
            axeScanPassed: true,
            ruleVerified: 'image-alt',
            durationMs: 420,
          },
        },
      });

      // Verification Contract
      const contract = await prisma.verificationContract.create({
        data: {
          repairId: repair.id,
          ruleId: 'image-alt',
          wcagCriteria: ['1.1.1'],
          precondition: 'Image element <img> does not possess an accessible name (alt="" or aria-label).',
          transformation: 'Inject alt="Nexus Retail Product Showcase Hero Banner" into AST node.',
          postcondition: 'Element has non-empty accessible name and passes axe-core image-alt rule with 0 failures.',
          evidence: {
            axeReScan: 'PASS',
            regressionCount: 0,
          },
          status: 'VALID',
          verifiedAt: new Date(),
        },
      });

      // Proof Certificate
      const certId = 'PA11Y-2026-00001';
      await prisma.proofCertificate.create({
        data: {
          certificateId: certId,
          projectId: demoProject.id,
          repairId: repair.id,
          ruleId: 'image-alt',
          wcagCriteria: ['1.1.1'],
          sourceHash: 'a8f5f167f44f4964e6c998dee827110c',
          patchHash: repair.patchHash,
          contractHash: 'c4ca4238a0b923820dcc509a6f75849b',
          testHash: 'eccbc87e4b5ce2fe28308fd9f2a7baf3',
          verificationStatus: 'VALID',
          certificateData: {
            certificateId: certId,
            ruleId: 'image-alt',
            wcagCriterion: '1.1.1',
            status: 'VALID',
            provenance: {
              issuedBy: 'ProofA11y Formal Verification Kernel v1.0 (Lean Invariant Engine)',
              engineVersion: '1.0.4-verified',
              timestamp: new Date().toISOString(),
            },
          },
        },
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          userId: demoUser.id,
          projectId: demoProject.id,
          action: 'CERTIFICATE_CREATED',
          entityType: 'ProofCertificate',
          entityId: certId,
          metadata: { ruleId: 'image-alt', status: 'VALID' },
        },
      });
    }
  }

  console.log('✨ Database seeding completed successfully with full relational integrity!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
