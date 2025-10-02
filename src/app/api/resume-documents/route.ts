import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resumeDepositId = searchParams.get('resumeDepositId');

    if (!resumeDepositId) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุ resumeDepositId' },
        { status: 400 }
      );
    }

    // ดึงรายการเอกสาร
    const documents = await prisma.resumeDepositDocument.findMany({
      where: { resumeDepositId },
      orderBy: { createdAt: 'desc' }
    });

    const formattedDocuments = documents.map(doc => ({
      id: doc.id,
      resumeDepositId: doc.resumeDepositId,
      documentType: doc.documentType,
      fileName: doc.fileName,
      filePath: doc.filePath,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      createdAt: doc.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedDocuments
    });

  } catch (error) {
    console.error('Error fetching resume documents:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร' },
      { status: 500 }
    );
  }
}
