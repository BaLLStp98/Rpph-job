import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const missionGroupId = searchParams.get('missionGroupId')

    if (!missionGroupId) {
      return NextResponse.json({ success: false, message: 'ต้องระบุ missionGroupId' }, { status: 400 })
    }

    // ใช้ raw query เพราะ Prisma schema ยังไม่มีคอลัมน์นี้แบบ typed relation
    const rows: Array<{ id: string; name: string; code: string }> = await prisma.$queryRawUnsafe(
      'SELECT id, name, code FROM departments WHERE mission_group_id = ? ORDER BY name ASC',
      String(missionGroupId)
    )

    return NextResponse.json({ success: true, data: rows })
  } catch (error) {
    console.error('Error fetching departments by mission group:', error)
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงรายชื่อฝ่ายตามกลุ่มงาน' }, { status: 500 })
  }
}


