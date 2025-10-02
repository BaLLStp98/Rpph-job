import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const personalInfoId = searchParams.get('personalInfoId');

    if (!personalInfoId) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุ personalInfoId' },
        { status: 400 }
      );
    }

    // ใช้ DATABASE_URL จาก .env (ให้สอดคล้องกับ Prisma/ระบบ)
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json(
        { success: false, message: 'ไม่ได้ตั้งค่า DATABASE_URL' },
        { status: 500 }
      );
    }

    const connection = await mysql.createConnection(databaseUrl);

    // ดึงรายการเอกสาร โดยอิงตาม schema: application_id, created_at
    const [documentRows] = await connection.execute(
      'SELECT id, application_id, document_type, file_name, file_path, file_size, mime_type, created_at FROM application_documents WHERE application_id = ? ORDER BY created_at DESC',
      [personalInfoId]
    );

    await connection.end();

    const documents = (documentRows as any[]).map(doc => ({
      id: doc.id,
      applicationId: doc.application_id,
      documentType: doc.document_type,
      fileName: doc.file_name,
      filePath: doc.file_path,
      fileSize: doc.file_size,
      mimeType: doc.mime_type,
      createdAt: doc.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: documents
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร' },
      { status: 500 }
    );
  }
} 