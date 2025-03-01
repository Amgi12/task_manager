import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

// Create a single PrismaClient instance and reuse it
const globalForPrisma = globalThis;
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}
const prisma = globalForPrisma.prisma;

export async function GET() {
  try {
    const assigners = await prisma.assigner.findMany({
      orderBy: {
        id: 'asc'
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    return NextResponse.json({
      assigners: assigners.map(assigner => ({
        assigner_id: assigner.id,
        name: assigner.name,
        email: assigner.email
      }))
    });
  } catch (error) {
    console.error('Error retrieving assigners:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to retrieve assigners' },
      { status: 500 }
    );
  }
} 