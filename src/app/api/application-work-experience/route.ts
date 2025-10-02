import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const { applicationId, position, company, startDate, endDate, salary, reason } = data;
    
    // Validate required fields
    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: 'Application ID is required' },
        { status: 400 }
      );
    }
    
    // Create work experience record
    const workExperience = await prisma.applicationWorkExperience.create({
      data: {
        applicationId,
        position: position || null,
        company: company || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        salary: salary || null,
        reason: reason || null,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Work experience record created successfully',
      data: workExperience
    });
    
  } catch (error) {
    console.error('Error creating work experience record:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create work experience record',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    
    let whereClause = {};
    if (applicationId) {
      whereClause = { applicationId };
    }
    
    const workExperience = await prisma.applicationWorkExperience.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      data: workExperience
    });
    
  } catch (error) {
    console.error('Error fetching work experience records:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch work experience records',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
