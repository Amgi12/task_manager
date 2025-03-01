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
    // Get all assigners with their task counts
    const assigners = await prisma.assigner.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        tasks: {
          select: {
            status: true
          }
        }
      }
    });

    // Format the response
    const formattedAssigners = assigners.map(assigner => ({
      assigner_id: assigner.id,
      name: assigner.name,
      email: assigner.email,
      task_count: assigner.tasks.length,
      completed: assigner.tasks.filter(task => task.status === 'Completed').length
    }));

    return NextResponse.json({
      assigners: formattedAssigners
    });
  } catch (error) {
    console.error('Error generating assigner summary:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}