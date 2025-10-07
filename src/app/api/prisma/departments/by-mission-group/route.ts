import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const missionGroupId = searchParams.get('missionGroupId')
    
    if (!missionGroupId) {
      return NextResponse.json(
        { success: false, message: 'missionGroupId is required' },
        { status: 400 }
      )
    }
    
    const departments = await prisma.department.findMany({
      where: {
        missionGroupId: missionGroupId
      },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        status: true
      },
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json({
      success: true,
      data: departments
    })
    
  } catch (error) {
    console.error('Error fetching departments by mission group:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลฝ่ายตามกลุ่มงาน' },
      { status: 500 }
    )
  }
}