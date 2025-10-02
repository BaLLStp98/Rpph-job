import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import { unlink } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentId, applicationId, documentType, fileName } = body || {}

    if (!documentId && !(applicationId && documentType && fileName)) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุ documentId หรือ (applicationId, documentType, fileName)' },
        { status: 400 }
      )
    }

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      return NextResponse.json(
        { success: false, message: 'ไม่ได้ตั้งค่า DATABASE_URL' },
        { status: 500 }
      )
    }

    const conn = await mysql.createConnection(databaseUrl)

    // ค้นหาเอกสารที่จะลบ
    let rows: any[] = []
    if (documentId) {
      const [result] = await conn.execute('SELECT id, file_name FROM application_documents WHERE id = ? LIMIT 1', [documentId])
      rows = result as any[]
    } else {
      const [result] = await conn.execute(
        'SELECT id, file_name FROM application_documents WHERE application_id = ? AND document_type = ? AND file_name = ? LIMIT 1',
        [applicationId, documentType, fileName]
      )
      rows = result as any[]
    }

    if (rows.length === 0) {
      await conn.end()
      return NextResponse.json({ success: false, message: 'ไม่พบเอกสารที่ต้องการลบ' }, { status: 404 })
    }

    const target = rows[0]

    // ลบไฟล์ในดิสก์ (ถ้ามี)
    if (target.file_name) {
      const absPath = path.join(process.cwd(), 'public', 'uploads', 'documents', target.file_name)
      try { await unlink(absPath) } catch (_) { /* ignore if missing */ }
    }

    // ลบระเบียนฐานข้อมูล
    await conn.execute('DELETE FROM application_documents WHERE id = ?', [target.id])
    await conn.end()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { success: false, message: error?.message || 'เกิดข้อผิดพลาดในการลบเอกสาร' },
      { status: 500 }
    )
  }
} 