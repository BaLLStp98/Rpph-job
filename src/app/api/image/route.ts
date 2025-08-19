import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    
    if (!fileName) {
      return NextResponse.json({ error: 'No file name provided' }, { status: 400 });
    }

    // ตรวจสอบว่าไฟล์อยู่ใน public/image folder
    const imagePath = path.join(process.cwd(), 'public', 'image', fileName);
    
    try {
      const fs = require('fs');
      if (!fs.existsSync(imagePath)) {
        return NextResponse.json({ error: 'Image file not found' }, { status: 404 });
      }
      
      const imageBuffer = await readFile(imagePath);
      
      // ตรวจสอบนามสกุลไฟล์เพื่อกำหนด Content-Type
      const ext = path.extname(fileName).toLowerCase();
      let contentType = 'image/jpeg'; // default
      
      if (ext === '.png') contentType = 'image/png';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.webp') contentType = 'image/webp';
      
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    } catch (error) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 