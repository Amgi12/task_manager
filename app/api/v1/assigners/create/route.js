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

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email } = body;
    
    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Name and email are required fields' },
        { status: 400 }
      );
    }

    // Email format validation
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingAssigner = await prisma.assigner.findUnique({
      where: { email },
    });
    
    if (existingAssigner) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Email already in use' },
        { status: 400 }
      );
    }
    
    // Create new assigner
    const newAssigner = await prisma.assigner.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
      },
    });
    
    // Return success response
    return NextResponse.json(
      {
        assigner_id: newAssigner.id,
        name: newAssigner.name,
        email: newAssigner.email,
        message: 'Assigner created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating assigner:', error);
    
    // More specific error handling
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Conflict', message: 'Email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Server Error', message: 'Failed to create assigner', details: error.message },
      { status: 500 }
    );
  }
} 