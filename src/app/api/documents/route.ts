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

    // สร้าง connection ไปยัง MySQL
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'mydata'
    });

    // ดึงรายการเอกสาร
    const [documentRows] = await connection.execute(
      'SELECT * FROM application_documents WHERE personal_info_id = ? ORDER BY upload_date DESC',
      [personalInfoId]
    );

    await connection.end();

    // จัดรูปแบบข้อมูล
    const documents = (documentRows as any[]).map(doc => ({
      id: doc.id,
      documentType: doc.document_type,
      fileName: doc.file_name,
      filePath: doc.file_path,
      fileSize: doc.file_size,
      uploadDate: doc.upload_date,
      status: doc.status,
      notes: doc.notes
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