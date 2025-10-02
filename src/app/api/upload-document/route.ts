import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const filename = formData.get('filename') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!filename) {
      return NextResponse.json(
        { error: 'No filename provided' },
        { status: 400 }
      );
    }

    // สร้างโฟลเดอร์ documents ถ้ายังไม่มี
    const documentsDir = join(process.cwd(), 'public', 'documents');
    await mkdir(documentsDir, { recursive: true });

    // บันทึกไฟล์
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(documentsDir, filename);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      filename: filename
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
