import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

// Create a single PrismaClient instance and reuse it
const globalForPrisma = globalThis;
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient();
}
const prisma = globalForPrisma.prisma;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Get assigner by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid assigner ID' },
        { status: 400 }
      );
    }

    const assigner = await prisma.assigner.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!assigner) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Assigner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      assigner_id: assigner.id,
      name: assigner.name,
      email: assigner.email
    });
  } catch (error) {
    console.error('Error retrieving assigner:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to retrieve assigner' },
      { status: 500 }
    );
  }
}

// Update assigner
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid assigner ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email } = body;

    // Validation
    if (!name && !email) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'At least one field (name or email) must be provided' },
        { status: 400 }
      );
    }

    if (email && !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if assigner exists
    const existingAssigner = await prisma.assigner.findUnique({
      where: { id }
    });

    if (!existingAssigner) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Assigner not found' },
        { status: 404 }
      );
    }

    // Check email uniqueness if email is being updated
    if (email && email !== existingAssigner.email) {
      const emailExists = await prisma.assigner.findUnique({
        where: { email }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Conflict', message: 'Email already in use' },
          { status: 409 }
        );
      }
    }

    // Update assigner
    const updatedAssigner = await prisma.assigner.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(email && { email: email.toLowerCase() })
      }
    });

    return NextResponse.json({
      assigner_id: updatedAssigner.id,
      name: updatedAssigner.name,
      email: updatedAssigner.email,
      message: 'Assigner updated successfully'
    });
  } catch (error) {
    console.error('Error updating assigner:', error);
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to update assigner' },
      { status: 500 }
    );
  }
}

// Delete assigner
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid assigner ID' },
        { status: 400 }
      );
    }

    // Check if assigner exists
    const existingAssigner = await prisma.assigner.findUnique({
      where: { id }
    });

    if (!existingAssigner) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Assigner not found' },
        { status: 404 }
      );
    }

    // Delete assigner
    await prisma.assigner.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Assigner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting assigner:', error);
    
    // Handle foreign key constraint violations
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Conflict', message: 'Cannot delete assigner with associated tasks' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to delete assigner' },
      { status: 500 }
    );
  }
} 