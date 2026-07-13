import { PrismaClient } from '@prisma/client';

// Singleton do Prisma Client — evita múltiplas conexões no hot-reload durante dev
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
