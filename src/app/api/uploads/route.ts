import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import { promises as fsp } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const departmentId = formData.get('departmentId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadsDir = path.join(process.cwd(), 'data', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Sanitize filename
    const originalName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const timestamp = Date.now()
    const filename = `${timestamp}_${originalName}`
    const filePath = path.join(uploadsDir, filename)

    fs.writeFileSync(filePath, buffer)

    // Public-ish path (relative within project). Consumers can store this path in JSON.
    const storedPath = path.join('data', 'uploads', filename).replace(/\\/g, '/')

    return NextResponse.json({
      success: true,
      path: storedPath,
      filename,
      departmentId: departmentId || undefined,
      mimeType: file.type,
      size: buffer.length,
    })
  } catch (err) {
    console.error('Upload failed:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

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
      exists: await fsp.access(uploadsDir).then(() => true).catch(() => false)
    });

    // ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
    try {
      await fsp.access(filePath);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบไฟล์' },
        { status: 404 }
      );
    }

    // อ่านไฟล์
    const fileBuffer = await fsp.readFile(filePath);
    
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

  } catch (error: any) {
    console.error('Error serving file:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      cwd: process.cwd(),
      uploadsDir: path.join(process.cwd(), 'data', 'uploads'),
      fileName: undefined
    });
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการเข้าถึงไฟล์' },
      { status: 500 }
    );
  }
} 