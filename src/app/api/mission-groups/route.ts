import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(_request: NextRequest) {
  try {
    // ใช้ raw query เพราะไม่มี Prisma model ของตารางนี้ใน schema ปัจจุบัน
    const groups: Array<{ id: string; name: string; code: string; order?: number; status?: string }> = await prisma.$queryRawUnsafe(
      "SELECT id, name, code, `order`, status FROM mission_groups WHERE status = 'ACTIVE' ORDER BY `order` ASC"
    )

    return NextResponse.json({ success: true, data: groups })
  } catch (error) {
    console.error('Error fetching mission groups:', error)
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่มงาน' }, { status: 500 })
  }
}


