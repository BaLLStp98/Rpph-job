import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    // Build where clause
    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    const missionGroups = await prisma.missionGroup.findMany({
      where,
      include: {
        departments: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json({
      success: true,
      data: missionGroups
    })
    
  } catch (error) {
    console.error('Error fetching mission groups:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่มงาน' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const missionGroup = await prisma.missionGroup.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status || 'ACTIVE'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: missionGroup
    })
    
  } catch (error) {
    console.error('Error creating mission group:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้างกลุ่มงาน' },
      { status: 500 }
    )
  }
}
