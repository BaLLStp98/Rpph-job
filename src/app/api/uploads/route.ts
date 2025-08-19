import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุชื่อไฟล์' },
        { status: 400 }
      );
    }

    // กำหนด path ของโฟลเดอร์ uploads
    const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
    const filePath = path.join(uploadsDir, fileName);
    
    console.log('Debug info:', {
      cwd: process.cwd(),
      uploadsDir,
      filePath,
      fileName,
      exists: await fs.access(uploadsDir).then(() => true).catch(() => false)
    });

    // ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
    try {
      await fs.access(filePath);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบไฟล์' },
        { status: 404 }
      );
    }

    // อ่านไฟล์
    const fileBuffer = await fs.readFile(filePath);
    
    // กำหนด content type ตามนามสกุลไฟล์
    const ext = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.doc') contentType = 'application/msword';
    else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    // ส่งไฟล์กลับ
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('Error serving file:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      cwd: process.cwd(),
      uploadsDir: path.join(process.cwd(), 'data', 'uploads'),
      fileName: fileName
    });
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการเข้าถึงไฟล์' },
      { status: 500 }
    );
  }
} 