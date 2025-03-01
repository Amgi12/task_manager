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
    const tasks = await prisma.task.findMany({
      include: {
        assigner: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        created_date: 'desc'
      }
    });

    const formattedTasks = tasks.map(task => ({
      task_id: task.id,
      task_name: task.task_name,
      description: task.description,
      created_date: task.created_date.toISOString().split('T')[0],
      due_date: task.due_date.toISOString().split('T')[0],
      assigner_id: task.assigner_id,
      assigner_name: task.assigner.name,
      status: task.status
    }));

    return NextResponse.json({ tasks: formattedTasks });
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to retrieve tasks' },
      { status: 500 }
    );
  }
} 