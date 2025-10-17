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
    const userId = searchParams.get('userId')
    const lineId = searchParams.get('lineId')
    const email = searchParams.get('email')
    const admin = searchParams.get('admin')
    
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
    
    // Filter by user (if not admin)
    if (admin !== 'true') {
      if (userId) {
        where.userId = userId
      } else if (lineId) {
        where.lineId = lineId
      } else if (email) {
        where.email = email
      }
    }
    
    // Get total count
    const total = await prisma.applicationForm.count({ where })
    
    // Get applications with pagination
    const applications = await prisma.applicationForm.findMany({
      where,
      skip,
      take: limit,
      orderBy: { submittedAt: 'desc' },
      include: {
        education: true,
        workExperience: true
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
    
    // Create application with full data
    console.log('🔄 Creating application in database...')
    
    // Extract education and workExperience data for separate handling
    const educationData = applicationData.education || []
    const workExperienceData = applicationData.workExperience || []
    delete applicationData.education
    delete applicationData.workExperience
    
    // Use transaction to create application and related data
    const application = await prisma.$transaction(async (tx) => {
      // Create main application data
      const newApplication = await tx.applicationForm.create({
      data: {
          // Required fields
        firstName: applicationData.firstName || 'ไม่ระบุ',
        lastName: applicationData.lastName || 'ไม่ระบุ',
        email: applicationData.email || 'ไม่ระบุ@example.com',
        department: applicationData.department || null,
        departmentId: applicationData.departmentId || null,
        appliedPosition: applicationData.appliedPosition || null,
        status: (applicationData.status || 'PENDING').toUpperCase(),
        submittedAt: new Date(),
        
          // User identification
        userId: applicationData.userId || null,
          lineId: applicationData.lineId || null,
          resumeId: applicationData.resumeId || null,
          
          // Personal information
        prefix: applicationData.prefix || null,
          idNumber: applicationData.idNumber || null,
          idCardIssuedAt: applicationData.idCardIssuedAt || null,
          idCardIssueDate: applicationData.idCardIssueDate ? new Date(applicationData.idCardIssueDate) : null,
          idCardExpiryDate: applicationData.idCardExpiryDate ? new Date(applicationData.idCardExpiryDate) : null,
          birthDate: applicationData.birthDate ? new Date(applicationData.birthDate) : null,
          age: applicationData.age || null,
          race: applicationData.race || null,
          placeOfBirth: applicationData.placeOfBirth || null,
          placeOfBirthProvince: applicationData.placeOfBirthProvince || null,
        gender: (applicationData.gender || 'UNKNOWN').toUpperCase(),
        nationality: applicationData.nationality || 'ไทย',
          religion: applicationData.religion || null,
        maritalStatus: (applicationData.maritalStatus || 'UNKNOWN').toUpperCase(),
          
          // Address information
          address: applicationData.address || null,
          addressAccordingToHouseRegistration: applicationData.addressAccordingToHouseRegistration || null,
          currentAddress: applicationData.currentAddress || null,
          phone: applicationData.phone || null,
          
          // Emergency contact
          emergencyContact: applicationData.emergencyContact || null,
          emergencyContactFirstName: applicationData.emergencyContactFirstName || null,
          emergencyContactLastName: applicationData.emergencyContactLastName || null,
          emergencyPhone: applicationData.emergencyPhone || null,
          emergencyRelationship: applicationData.emergencyRelationship || null,
          emergencyAddress: applicationData.emergencyAddress || null,
          emergency_workplace_name: applicationData.emergency_workplace_name || null,
          emergency_workplace_district: applicationData.emergency_workplace_district || null,
          emergency_workplace_province: applicationData.emergency_workplace_province || null,
          emergency_workplace_phone: applicationData.emergency_workplace_phone || null,
          
          // Job application details
          appliedPosition: applicationData.appliedPosition || null,
          expectedSalary: applicationData.expectedSalary || null,
          availableDate: applicationData.availableDate ? new Date(applicationData.availableDate) : null,
          currentWork: applicationData.currentWork || false,
          unit: applicationData.unit || null,
          additionalInfo: applicationData.additionalInfo || null,
          
          // Additional information
          skills: applicationData.skills || null,
          languages: applicationData.languages || null,
          computerSkills: applicationData.computerSkills || null,
          certificates: applicationData.certificates || null,
          references: applicationData.references || null,
          profileImageUrl: applicationData.profileImageUrl || null,
          notes: applicationData.notes || null,
          reviewedBy: applicationData.reviewedBy || null,
          reviewedAt: applicationData.reviewedAt ? new Date(applicationData.reviewedAt) : null,
          applicantSignature: applicationData.applicantSignature || null,
          applicationDate: applicationData.applicationDate ? new Date(applicationData.applicationDate) : new Date(),
          
          // Address details
          house_registration_house_number: applicationData.house_registration_house_number || null,
          house_registration_village_number: applicationData.house_registration_village_number || null,
          house_registration_alley: applicationData.house_registration_alley || null,
          house_registration_road: applicationData.house_registration_road || null,
          house_registration_sub_district: applicationData.house_registration_sub_district || null,
          house_registration_district: applicationData.house_registration_district || null,
          house_registration_province: applicationData.house_registration_province || null,
          house_registration_postal_code: applicationData.house_registration_postal_code || null,
          house_registration_phone: applicationData.house_registration_phone || null,
          house_registration_mobile: applicationData.house_registration_mobile || null,
          current_address_house_number: applicationData.current_address_house_number || null,
          current_address_village_number: applicationData.current_address_village_number || null,
          current_address_alley: applicationData.current_address_alley || null,
          current_address_road: applicationData.current_address_road || null,
          current_address_sub_district: applicationData.current_address_sub_district || null,
          current_address_district: applicationData.current_address_district || null,
          current_address_province: applicationData.current_address_province || null,
          current_address_postal_code: applicationData.current_address_postal_code || null,
          current_address_phone: applicationData.current_address_phone || null,
          current_address_mobile: applicationData.current_address_mobile || null,
          emergency_address_house_number: applicationData.emergency_address_house_number || null,
          emergency_address_village_number: applicationData.emergency_address_village_number || null,
          emergency_address_alley: applicationData.emergency_address_alley || null,
          emergency_address_road: applicationData.emergency_address_road || null,
          emergency_address_sub_district: applicationData.emergency_address_sub_district || null,
          emergency_address_district: applicationData.emergency_address_district || null,
          emergency_address_province: applicationData.emergency_address_province || null,
          emergency_address_postal_code: applicationData.emergency_address_postal_code || null,
          emergency_address_phone: applicationData.emergency_address_phone || null,
          
          // Medical rights
          medical_rights_dont_want_to_change_hospital: applicationData.medical_rights_dont_want_to_change_hospital || false,
          medical_rights_has_civil_servant_rights: applicationData.medical_rights_has_civil_servant_rights || false,
          medical_rights_has_social_security: applicationData.medical_rights_has_social_security || false,
          medical_rights_has_universal_healthcare: applicationData.medical_rights_has_universal_healthcare || false,
          medical_rights_new_hospital: applicationData.medical_rights_new_hospital || null,
          medical_rights_other_rights: applicationData.medical_rights_other_rights || null,
          medical_rights_social_security_hospital: applicationData.medical_rights_social_security_hospital || null,
          medical_rights_universal_healthcare_hospital: applicationData.medical_rights_universal_healthcare_hospital || null,
          medical_rights_want_to_change_hospital: applicationData.medical_rights_want_to_change_hospital || false,
          
          // Additional fields
          multiple_employers: applicationData.multiple_employers || null,
          spouse_first_name: applicationData.spouse_first_name || null,
          spouse_last_name: applicationData.spouse_last_name || null,
          staff_department: applicationData.staff_department || null,
          staff_position: applicationData.staff_position || null,
          staff_start_work: applicationData.staff_start_work || null
        }
      })
      
      // Create education records if provided
      if (educationData.length > 0) {
        await tx.applicationEducation.createMany({
          data: educationData.map((edu: any) => ({
            applicationId: newApplication.id,
            level: edu.level || null,
            institution: edu.institution || null,
            major: edu.major || null,
            year: edu.year || null,
            gpa: edu.gpa ? parseFloat(edu.gpa) : null
          }))
        })
      }
      
      // Create work experience records if provided
      if (workExperienceData.length > 0) {
        await tx.applicationWorkExperience.createMany({
          data: workExperienceData.map((work: any) => ({
            applicationId: newApplication.id,
            position: work.position || null,
            company: work.company || null,
            startDate: work.startDate ? new Date(work.startDate) : null,
            endDate: work.endDate ? new Date(work.endDate) : null,
            salary: work.salary || null,
            reason: work.reason || null
          }))
        })
      }
      
      return newApplication
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