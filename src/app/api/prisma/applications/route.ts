// API route for Prisma applications operations
// GET /api/prisma/applications - Get all applications
// POST /api/prisma/applications - Create new application

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const department = searchParams.get('department')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    
    if (status) {
      where.status = status.toUpperCase()
    }
    
    if (department) {
      where.department = department
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { appliedPosition: { contains: search } }
      ]
    }
    
    // Get total count
    const total = await prisma.applicationForm.count({ where })
    
    // Get applications with pagination
    const applications = await prisma.applicationForm.findMany({
      where,
      skip,
      take: limit,
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true,
        userId: true,
        submittedAt: true,
        status: true,
        prefix: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        department: true,
        appliedPosition: true,
        expectedSalary: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลใบสมัคร' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json()
    
    console.log('📝 Received application data:', JSON.stringify(applicationData, null, 2))
    
    // ไม่ต้อง validation - ให้บันทึกได้ทันที
    console.log('📝 No validation - allowing empty data submission')
    
    // Create application with minimal required data
    console.log('🔄 Creating application in database...')
    const application = await prisma.applicationForm.create({
      data: {
        // Required fields only (allow empty values)
        firstName: applicationData.firstName || 'ไม่ระบุ',
        lastName: applicationData.lastName || 'ไม่ระบุ',
        email: applicationData.email || 'ไม่ระบุ@example.com',
        department: applicationData.department || null,
        departmentId: applicationData.departmentId || null,
        appliedPosition: applicationData.appliedPosition || null,
        status: (applicationData.status || 'PENDING').toUpperCase(),
        submittedAt: new Date(),
        
        // Optional fields with defaults
        userId: applicationData.userId || null,
        prefix: applicationData.prefix || null,
        gender: (applicationData.gender || 'UNKNOWN').toUpperCase(),
        nationality: applicationData.nationality || 'ไทย',
        maritalStatus: (applicationData.maritalStatus || 'UNKNOWN').toUpperCase(),
        currentWork: applicationData.currentWork || false
      }
    })
    
    console.log('✅ Application created successfully:', application.id)
    
    return NextResponse.json({
      success: true,
      message: 'สร้างใบสมัครเรียบร้อยแล้ว',
      data: application
    })
    
  } catch (error) {
    console.error('❌ Error creating application:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการสร้างใบสมัคร',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}