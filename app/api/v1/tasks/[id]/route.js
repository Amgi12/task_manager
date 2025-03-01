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

// Get task by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid task ID' },
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assigner: {
          select: {
            name: true
          }
        }
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      task_id: task.id,
      task_name: task.task_name,
      description: task.description,
      created_date: task.created_date.toISOString().split('T')[0],
      due_date: task.due_date.toISOString().split('T')[0],
      assigner_id: task.assigner_id,
      assigner_name: task.assigner.name,
      status: task.status
    });
  } catch (error) {
    console.error('Error retrieving task:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to retrieve task' },
      { status: 500 }
    );
  }
}

// Update task
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid task ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { task_name, description, due_date, assigner_id, status } = body;

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

    // Validate fields if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid status value' },
        { status: 400 }
      );
    }

    if (due_date) {
      const dueDateObj = new Date(due_date);
      if (isNaN(dueDateObj.getTime())) {
        return NextResponse.json(
          { error: 'Bad Request', message: 'Invalid due date format' },
          { status: 400 }
        );
      }
    }

    if (assigner_id) {
      const assigner = await prisma.assigner.findUnique({
        where: { id: assigner_id }
      });

      if (!assigner) {
        return NextResponse.json(
          { error: 'Bad Request', message: 'Invalid assigner ID' },
          { status: 400 }
        );
      }
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(task_name && { task_name: task_name.trim() }),
        ...(description && { description: description.trim() }),
        ...(due_date && { due_date: new Date(due_date) }),
        ...(assigner_id && { assigner_id }),
        ...(status && { status })
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
      task_id: updatedTask.id,
      task_name: updatedTask.task_name,
      description: updatedTask.description,
      created_date: updatedTask.created_date.toISOString().split('T')[0],
      due_date: updatedTask.due_date.toISOString().split('T')[0],
      assigner_id: updatedTask.assigner_id,
      assigner_name: updatedTask.assigner.name,
      status: updatedTask.status,
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// Delete task
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid task ID' },
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

    // Delete task
    await prisma.task.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to delete task' },
      { status: 500 }
    );
  }
} 