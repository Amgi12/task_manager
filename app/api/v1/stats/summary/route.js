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
    // Get total tasks count
    const totalTasks = await prisma.task.count();

    // Get counts by status
    const statusCounts = await prisma.task.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Convert status counts to an object
    const statusMap = statusCounts.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {});

    // Get count of overdue tasks (due_date < current date and status not 'Completed')
    const overdueTasks = await prisma.task.count({
      where: {
        AND: [
          {
            due_date: {
              lt: new Date()
            }
          },
          {
            status: {
              not: 'Completed'
            }
          }
        ]
      }
    });

    return NextResponse.json({
      total_tasks: totalTasks,
      completed: statusMap['Completed'] || 0,
      in_progress: statusMap['In Progress'] || 0,
      not_started: statusMap['Not Started'] || 0,
      overdue: overdueTasks
    });
  } catch (error) {
    console.error('Error generating task summary:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}