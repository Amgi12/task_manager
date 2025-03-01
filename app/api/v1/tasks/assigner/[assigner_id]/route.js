import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

// Create a single PrismaClient instance and reuse it
const globalForPrisma = globalThis;
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}
const prisma = globalForPrisma.prisma;

export async function GET(request, { params }) {
  try {
    const { assigner_id } = await params;
    const assignerId = parseInt(assigner_id);
    
    if (isNaN(assignerId)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid assigner ID' },
        { status: 400 }
      );
    }

    // Check if assigner exists
    const assigner = await prisma.assigner.findUnique({
      where: { id: assignerId }
    });

    if (!assigner) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Assigner not found' },
        { status: 404 }
      );
    }

    // Get tasks by assigner
    const tasks = await prisma.task.findMany({
      where: { assigner_id: assignerId },
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