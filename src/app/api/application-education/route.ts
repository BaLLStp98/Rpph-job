import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const { applicationId, level, institution, major, year, gpa } = data;
    
    // Validate required fields
    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: 'Application ID is required' },
        { status: 400 }
      );
    }
    
    // Create education record
    const education = await prisma.applicationEducation.create({
      data: {
        applicationId,
        level: level || null,
        institution: institution || null,
        major: major || null,
        year: year || null,
        gpa: gpa ? parseFloat(gpa.toString()) : null,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Education record created successfully',
      data: education
    });
    
  } catch (error) {
    console.error('Error creating education record:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create education record',
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
    
    const education = await prisma.applicationEducation.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      data: education
    });
    
  } catch (error) {
    console.error('Error fetching education records:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch education records',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
