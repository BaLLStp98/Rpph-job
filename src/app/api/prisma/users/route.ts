// API route for Prisma users operations
// GET /api/prisma/users - Get all users
// POST /api/prisma/users - Create new user

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
    const lineId = searchParams.get('lineId')
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    
    if (lineId) {
      where.lineId = lineId
    }
    
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
        { lineDisplayName: { contains: search } }
      ]
    }
    
    // Get total count
    const total = await prisma.user.count({ where })
    
    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        education: true,
        workExperience: true,
        _count: {
          select: {
            applications: true
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    
    // Validate required fields
    if (!userData.firstName || !userData.lastName || !userData.email) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลที่จำเป็น' },
        { status: 400 }
      )
    }
    
    // Handle profile image upload
    let profileImageUrl = null
    if (userData.profileImage) {
      try {
        // Convert base64 to buffer
        const base64Data = userData.profileImage.replace(/^data:image\/[a-z]+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')
        
        // Generate filename
        const timestamp = Date.now()
        const extension = userData.profileImage.includes('data:image/png') ? 'png' : 'jpg'
        const filename = `profile_${timestamp}.${extension}`
        
        // Save to public/image directory
        const fs = require('fs')
        const path = require('path')
        const imagePath = path.join(process.cwd(), 'public', 'image', filename)
        
        // Ensure directory exists
        const imageDir = path.dirname(imagePath)
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true })
        }
        
        fs.writeFileSync(imagePath, buffer)
        profileImageUrl = filename
        
        console.log('Profile image saved:', filename)
      } catch (imageError) {
        console.error('Error saving profile image:', imageError)
        // Continue without image if upload fails
      }
    }
    
    // Create user with nested education and work experience
    const user = await prisma.user.create({
      data: {
        lineId: userData.lineId,
        prefix: userData.prefix,
        firstName: userData.firstName,
        lastName: userData.lastName,
        lineDisplayName: userData.lineDisplayName,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender === 'ชาย' ? 'MALE' : userData.gender === 'หญิง' ? 'FEMALE' : 'UNKNOWN',
        birthDate: userData.birthDate ? new Date(userData.birthDate) : null,
        age: userData.age || null,
        nationality: userData.nationality || 'ไทย',
        religion: userData.religion,
        maritalStatus: userData.maritalStatus === 'โสด' ? 'SINGLE' : 
                      userData.maritalStatus === 'สมรส' ? 'MARRIED' : 
                      userData.maritalStatus === 'หย่า' ? 'DIVORCED' : 
                      userData.maritalStatus === 'หม้าย' ? 'WIDOWED' : 'UNKNOWN',
        // ข้อมูลบัตรประจำตัวประชาชน
        idNumber: userData.idNumber,
        idCardIssuedAt: userData.idCardIssuedAt,
        idCardIssueDate: userData.idCardIssueDate ? new Date(userData.idCardIssueDate) : null,
        idCardExpiryDate: userData.idCardExpiryDate ? new Date(userData.idCardExpiryDate) : null,
        // ข้อมูลส่วนตัวเพิ่มเติม
        race: userData.race,
        placeOfBirth: userData.placeOfBirth,
        placeOfBirthProvince: userData.placeOfBirthProvince,
        // ข้อมูลคู่สมรส
        spouseFirstName: userData.spouseFirstName,
        spouseLastName: userData.spouseLastName,
        // ที่อยู่
        address: userData.address,
        province: userData.province,
        district: userData.district,
        subDistrict: userData.subDistrict,
        postalCode: userData.postalCode,
        // การติดต่อฉุกเฉิน
        emergencyContact: userData.emergencyContact,
        emergencyPhone: userData.emergencyPhone,
        emergencyRelationship: userData.emergencyRelationship,
        // ข้อมูลสถานพยาบาล
        isHospitalStaff: userData.isHospitalStaff || false,
        hospitalDepartment: userData.hospitalDepartment,
        username: userData.username,
        password: userData.password, // In production, hash this password
        profileImageUrl: profileImageUrl,
        status: userData.status || 'PENDING',
        department: userData.department,
        role: userData.role || 'APPLICANT',
        lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : null,
        // Create nested education records
        education: userData.education ? {
          create: userData.education.map((edu: any) => ({
            level: edu.level,
            school: edu.school,
            major: edu.major,
            startYear: edu.startYear,
            endYear: edu.endYear,
            gpa: edu.gpa
          }))
        } : undefined,
        // Create nested work experience records
        workExperience: userData.workExperience ? {
          create: userData.workExperience.map((work: any) => ({
            position: work.position,
            company: work.company,
            startDate: work.startDate ? new Date(work.startDate) : null,
            endDate: work.endDate ? new Date(work.endDate) : null,
            isCurrent: work.isCurrent || false,
            description: work.description,
            salary: work.salary
          }))
        } : undefined
      },
      include: {
        education: true,
        workExperience: true
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'สร้างผู้ใช้เรียบร้อยแล้ว',
      data: user
    })
    
  } catch (error: any) {
    console.error('Error creating user:', error)
    
    // Handle duplicate key errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'อีเมลหรือชื่อผู้ใช้นี้มีอยู่แล้ว' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้' },
      { status: 500 }
    )
  }
}
