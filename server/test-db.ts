import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing Database Connection with Prisma...');
console.log(`📡 DATABASE_URL from .env: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 'NOT_SET'}`);

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

async function testConnection() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('✅ DATABASE CONNECTION SUCCESSFUL:', result);
  } catch (error: any) {
    console.error('❌ DATABASE CONNECTION FAILED:');
    console.error(`- Error Name: ${error.name}`);
    console.error(`- Error Code: ${error.code}`);
    console.error(`- Error Message: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
