import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const applicationId = formData.get('applicationId') as string;
    const documentType = formData.get('documentType') as string;
    
    // Validate required fields
    if (!file || !applicationId || !documentType) {
      return NextResponse.json(
        { success: false, message: 'File, applicationId, and documentType are required' },
        { status: 400 }
      );
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'application-documents');
    await mkdir(uploadsDir, { recursive: true });
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `${timestamp}_${applicationId}_${documentType}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Create document record
    const document = await prisma.applicationDocument.create({
      data: {
        applicationId,
        documentType,
        fileName: file.name,
        filePath: `/uploads/application-documents/${fileName}`,
        fileSize: file.size,
        mimeType: file.type,
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        id: document.id,
        fileName: document.fileName,
        filePath: document.filePath,
        documentType: document.documentType
      }
    });
    
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to upload document',
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
    
    const documents = await prisma.applicationDocument.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      data: documents
    });
    
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch documents',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
