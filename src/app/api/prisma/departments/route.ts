// API route for Prisma departments operations
// GET /api/prisma/departments - Get all departments
// POST /api/prisma/departments - Create new department

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { manager: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        include: {
          attachments: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.department.count({ where })
    ])

    // Attach mission group info (mission_group_id and name) via raw query
    if (departments.length > 0) {
      try {
        const idsQuoted = departments.map((d: any) => `'${d.id}'`).join(',')
        const rows: Array<{ id: string; mission_group_id: string | null; mission_group_name: string | null }> = await prisma.$queryRawUnsafe(
          `SELECT d.id, d.mission_group_id, mg.name AS mission_group_name
           FROM departments d
           LEFT JOIN mission_groups mg ON mg.id = d.mission_group_id
           WHERE d.id IN (${idsQuoted})`
        )
        const map = new Map(rows.map(r => [r.id, r]))
        ;(departments as any[]).forEach((d: any) => {
          const r = map.get(d.id)
          d.missionGroupId = r?.mission_group_id || null
          d.missionGroupName = r?.mission_group_name || null
        })
      } catch (e) {
        console.error('Failed to enrich departments with mission group info:', e)
      }
    }
    
    return NextResponse.json({
      success: true,
      data: departments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแผนก' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Convert date strings to Date objects
    const convertDate = (dateStr: string) => {
      if (!dateStr) return null
      return new Date(dateStr)
    }
    
    // Convert status and gender
    const convertStatus = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'active': return 'ACTIVE'
        case 'inactive': return 'INACTIVE'
        case 'pending': return 'PENDING'
        default: return 'ACTIVE'
      }
    }
    
    const convertGender = (gender: string) => {
      switch (gender?.toLowerCase()) {
        case 'male': return 'MALE'
        case 'female': return 'FEMALE'
        case 'any': return 'UNKNOWN'
        default: return 'UNKNOWN'
      }
    }
    
    const departmentData: any = {
      name: data.name,
      code: data.code,
      description: data.description,
      manager: data.manager,
      managerEmail: data.managerEmail,
      managerPhone: data.managerPhone,
      location: data.location,
      employeeCount: parseInt(data.employeeCount) || 0,
      status: convertStatus(data.status),
      salary: data.salary,
      applicationStartDate: convertDate(data.applicationStartDate),
      applicationEndDate: convertDate(data.applicationEndDate),
      education: data.education,
      gender: convertGender(data.gender),
      positions: data.positions
    }

    // ถ้ารับ missionGroupId มา ให้เขียนลงคอลัมน์เดิม mission_group_id ผ่าน raw SQL หลังสร้างแล้ว
    
    const department = await prisma.department.create({
      data: departmentData,
      include: {
        attachments: true
      }
    })

    if (data.missionGroupId) {
      try {
        await prisma.$executeRawUnsafe(
          'UPDATE departments SET mission_group_id = ? WHERE id = ?',
          String(data.missionGroupId),
          department.id
        )
      } catch (e) {
        console.error('Failed to set mission_group_id:', e)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'สร้างแผนกเรียบร้อยแล้ว',
      data: department
    })
    
  } catch (error) {
    console.error('Error creating department:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้างแผนก' },
      { status: 500 }
    )
  }
}
