import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

// Create a single PrismaClient instance and reuse it
const globalForPrisma = globalThis;
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}
const prisma = globalForPrisma.prisma;

// Valid status values
const VALID_STATUSES = ['Not Started', 'In Progress', 'Completed'];

export async function POST(request) {
  try {
    const body = await request.json();
    const { task_name, description, due_date, assigner_id, status } = body;

    // Validation
    if (!task_name || !description || !due_date || !assigner_id || !status) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate status
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Validate due_date format
    const dueDateObj = new Date(due_date);
    if (isNaN(dueDateObj.getTime())) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid due date format' },
        { status: 400 }
      );
    }

    // Check if assigner exists
    const assigner = await prisma.assigner.findUnique({
      where: { id: assigner_id }
    });

    if (!assigner) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid assigner ID' },
        { status: 400 }
      );
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        task_name: task_name.trim(),
        description: description.trim(),
        created_date: new Date(),
        due_date: dueDateObj,
        assigner_id,
        status
      },
      include: {
        assigner: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      task_id: task.id,
      task_name: task.task_name,
      description: task.description,
      created_date: task.created_date.toISOString().split('T')[0],
      due_date: task.due_date.toISOString().split('T')[0],
      assigner_id: task.assigner_id,
      assigner_name: task.assigner.name,
      status: task.status,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to create task' },
      { status: 500 }
    );
  }
} 