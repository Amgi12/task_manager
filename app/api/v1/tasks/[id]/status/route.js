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

export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid task ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Status is required' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id }
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Task not found' },
        { status: 404 }
      );
    }

    // Update task status
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({
      task_id: updatedTask.id,
      status: updatedTask.status,
      message: 'Task status updated successfully'
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to update task status' },
      { status: 500 }
    );
  }
} 