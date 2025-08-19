import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุ documentId' },
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

    // ดึงข้อมูลเอกสารก่อนลบ
    const [documentRows] = await connection.execute(
      'SELECT * FROM application_documents WHERE id = ?',
      [documentId]
    );

    const document = (documentRows as any[])[0];
    if (!document) {
      await connection.end();
      return NextResponse.json(
        { success: false, message: 'ไม่พบเอกสารที่ต้องการลบ' },
        { status: 404 }
      );
    }

    // ลบไฟล์จากระบบ
    try {
      const filePath = path.join(process.cwd(), 'public', document.file_path);
      await unlink(filePath);
    } catch (fileError) {
      console.warn('File not found for deletion:', fileError);
    }

    // ลบข้อมูลจากฐานข้อมูล
    await connection.execute(
      'DELETE FROM application_documents WHERE id = ?',
      [documentId]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: 'ลบเอกสารเรียบร้อยแล้ว'
    });

  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบเอกสาร' },
      { status: 500 }
    );
  }
} 