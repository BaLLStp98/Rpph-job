import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const departmentId = (form.get('departmentId') as string)?.trim()
    const file = form.get('file') as File | null

    if (!departmentId || !file) {
      return NextResponse.json({ success: false, message: 'กรุณาระบุ departmentId และไฟล์' }, { status: 400 })
    }

    const allowed = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'])
    if (!allowed.has(file.type)) {
      return NextResponse.json({ success: false, message: 'รองรับเฉพาะไฟล์ PDF/JPG/PNG/GIF/WEBP' }, { status: 400 })
    }
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, message: 'ไฟล์ต้องมีขนาดไม่เกิน 10MB' }, { status: 400 })
    }

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      return NextResponse.json({ success: false, message: 'ไม่ได้ตั้งค่า DATABASE_URL' }, { status: 500 })
    }
    const conn = await mysql.createConnection(databaseUrl)

    // verify department exists
    const [rows] = await conn.execute('SELECT 1 FROM departments WHERE id = ? LIMIT 1', [departmentId])
    if ((rows as any[]).length === 0) {
      await conn.end()
      return NextResponse.json({ success: false, message: `ไม่พบแผนก: ${departmentId}` }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'departments')
    await mkdir(uploadDir, { recursive: true })

    const ts = Date.now()
    const originalName = ((file as any).name as string | undefined) || 'attachment'
    const safeBase = path.basename(originalName).replace(/[^\w\-\.ก-๙\s]/g, '') || 'attachment'
    // keep ext if present, otherwise infer from mime
    const extFromName = path.extname(safeBase)
    const mimeToExt: Record<string, string> = {
      'application/pdf': '.pdf',
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
    }
    const ext = extFromName || mimeToExt[file.type] || ''
    const finalName = `${ts}_${extFromName ? safeBase : safeBase + ext}`
    const absPath = path.join(uploadDir, finalName)

    const bytes = await file.arrayBuffer()
    await writeFile(absPath, Buffer.from(bytes))

    const filePath = `/uploads/departments/${finalName}`

    // ตาราง department_attachments ตาม Prisma ใช้คอลัมน์ path และ filename เท่านั้น
    await conn.execute(
      'INSERT INTO department_attachments (department_id, path, filename) VALUES (?, ?, ?)',
      [departmentId, filePath, finalName]
    )

    await conn.end()

    return NextResponse.json({ success: true, data: { fileName: finalName, filePath } })
  } catch (error: any) {
    console.error('Error uploading department attachment:', error)
    return NextResponse.json({ success: false, message: error?.message || 'อัปโหลดไฟล์ไม่สำเร็จ' }, { status: 500 })
  }
}
