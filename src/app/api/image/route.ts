import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    
    if (!fileName) {
      return NextResponse.json({ error: 'No file name provided' }, { status: 400 });
    }

    // ป้องกัน path traversal
    const safeName = path.basename(fileName);
    const imagesDir = path.join(process.cwd(), 'public', 'image');

    // สร้างรายการชื่อไฟล์ที่เป็นไปได้สำหรับ fallback
    const requestedExt = path.extname(safeName);
    const baseName = requestedExt ? safeName.slice(0, -requestedExt.length) : safeName;

    const candidateNames: string[] = [];
    // 1) ชื่อเดิม
    candidateNames.push(safeName);
    // 2) ถ้าไม่มีนามสกุล ให้ลองมาตรฐานที่พบบ่อย
    if (!requestedExt) {
      candidateNames.push(`${baseName}.jpg`, `${baseName}.jpeg`, `${baseName}.png`, `${baseName}.gif`, `${baseName}.webp`);
    } else {
      // 3) มีนามสกุลแล้ว แต่หาไม่เจอ -> ลองนามสกุลอื่นของชื่อเดียวกัน
      ['.jpg', '.jpeg', '.png', '.gif', '.webp'].forEach((ext) => {
        if (ext !== requestedExt.toLowerCase()) candidateNames.push(`${baseName}${ext}`);
      });
    }
    // 4) กรณีรูปโปรไฟล์ที่สร้างเป็น profile_temp_<id>.* ให้ลองแมปไป temp ด้วย
    //    เช่น ถ้าร้องขอ profile_123.jpg แต่มีเพียง profile_temp_123.png
    if (baseName.startsWith('profile_')) {
      const idPart = baseName.replace(/^profile_/, '');
      if (idPart) {
        candidateNames.push(`profile_temp_${idPart}.jpg`, `profile_temp_${idPart}.jpeg`, `profile_temp_${idPart}.png`, `profile_temp_${idPart}.gif`, `profile_temp_${idPart}.webp`);
      }
    }

    // อ่านรายการไฟล์ในโฟลเดอร์เพื่อจับคู่
    const files = await readdir(imagesDir).catch(() => [] as string[]);
    const lowerSet = new Set(files.map(f => f.toLowerCase()));

    // หาไฟล์แรกที่มีอยู่จริง (case-insensitive)
    let foundName: string | null = null;
    for (const name of candidateNames) {
      const lower = name.toLowerCase();
      if (lowerSet.has(lower)) {
        foundName = files.find(f => f.toLowerCase() === lower) || null;
        if (foundName) break;
      }
    }

    if (!foundName) {
      return NextResponse.json({ error: 'Image file not found' }, { status: 404 });
    }

    const finalPath = path.join(imagesDir, foundName);
    const imageBuffer = await readFile(finalPath);

    // Content-Type ตามนามสกุลจริงของไฟล์ที่พบ
    const ext = path.extname(foundName).toLowerCase();
    let contentType = 'image/jpeg';
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 