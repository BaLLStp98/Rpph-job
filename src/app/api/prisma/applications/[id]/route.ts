// API route for individual application operations
// GET /api/prisma/applications/[id] - Get application by ID
// PUT /api/prisma/applications/[id] - Update application
// DELETE /api/prisma/applications/[id] - Delete application

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const application = await prisma.applicationForm.findUnique({
      where: { id },
      include: {
        user: true,
        education: true,
        workExperience: true,
        documents: true
      }
    })
    
    if (!application) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลใบสมัคร' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: application
    })
    
  } catch (error) {
    console.error('Error fetching application:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลใบสมัคร' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updateData = await request.json()
    
    console.log('🔄 PUT /api/prisma/applications/[id] - Update data received:', {
      id,
      hasEducation: !!updateData.education,
      educationCount: updateData.education?.length || 0,
      hasWorkExperience: !!updateData.workExperience,
      workExperienceCount: updateData.workExperience?.length || 0
    })
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id
    delete updateData.createdAt
    delete updateData.updatedAt
    delete updateData.submittedAt
    
    // Extract education and workExperience data for separate handling
    const educationData = updateData.education
    const workExperienceData = updateData.workExperience
    delete updateData.education
    delete updateData.workExperience
    
    console.log('📚 Education data to update:', educationData)
    console.log('💼 Work experience data to update:', workExperienceData)
    console.log('🔢 Age before conversion:', updateData.age, 'Type:', typeof updateData.age)
    
    // Helpers: sanitize empty strings and convert Thai Buddhist year to Gregorian Date
    const isString = (v: unknown): v is string => typeof v === 'string'
    const sanitizePrimitive = (v: any) => (v === '' ? null : v)
    const toDateFromThai = (input: any): Date | null => {
      if (input === '' || input === null || input === undefined) return null
      if (input instanceof Date) return isNaN(input.getTime()) ? null : input
      if (!isString(input)) {
        const d = new Date(input as any)
        return isNaN(d.getTime()) ? null : d
      }
      // Expect formats like YYYY-MM-DD or YYYY/MM/DD; handle Buddhist year
      const match = input.match(/^(\d{4})[-\/]?(\d{2})[-\/]?(\d{2})/)
      if (match) {
        let year = parseInt(match[1], 10)
        const month = parseInt(match[2], 10) - 1
        const day = parseInt(match[3], 10)
        if (year >= 2400) year -= 543
        const date = new Date(Date.UTC(year, month, day))
        return isNaN(date.getTime()) ? null : date
      }
      const d = new Date(input)
      if (!isNaN(d.getTime())) return d
      return null
    }
    
    if (updateData.idCardIssueDate !== undefined) {
      updateData.idCardIssueDate = toDateFromThai(updateData.idCardIssueDate)
    }
    if (updateData.idCardExpiryDate !== undefined) {
      updateData.idCardExpiryDate = toDateFromThai(updateData.idCardExpiryDate)
    }
    if (updateData.birthDate !== undefined) {
      updateData.birthDate = toDateFromThai(updateData.birthDate)
    }
    if (updateData.availableDate !== undefined) {
      updateData.availableDate = toDateFromThai(updateData.availableDate)
    }
    
    // Convert numeric fields from string to int
    if (updateData.age) {
      updateData.age = parseInt(updateData.age) || null
    }
    
    // Convert other numeric fields if they exist
    if (updateData.expectedSalary && typeof updateData.expectedSalary === 'string') {
      // Keep as string if it contains ranges like "44145-54145"
      // Only convert if it's a pure number
      const salaryNum = parseInt(updateData.expectedSalary)
      if (!isNaN(salaryNum) && salaryNum.toString() === updateData.expectedSalary) {
        updateData.expectedSalary = salaryNum.toString()
      }
    }
    
    // Convert enum values
    if (updateData.gender) {
      updateData.gender = updateData.gender === 'ชาย' ? 'MALE' : 
                         updateData.gender === 'หญิง' ? 'FEMALE' : 'UNKNOWN'
    }
    if (updateData.maritalStatus) {
      updateData.maritalStatus = updateData.maritalStatus === 'โสด' ? 'SINGLE' : 
                                updateData.maritalStatus === 'สมรส' ? 'MARRIED' : 
                                updateData.maritalStatus === 'หย่า' ? 'DIVORCED' : 
                                updateData.maritalStatus === 'หม้าย' ? 'WIDOWED' : 'UNKNOWN'
    }
    if (updateData.status) {
      updateData.status = updateData.status === 'pending' ? 'PENDING' : 
                         updateData.status === 'approved' ? 'APPROVED' : 
                         updateData.status === 'rejected' ? 'REJECTED' : 'PENDING'
    }
    
    // Remove fields that don't exist in Prisma schema
    const fieldsToRemove = [
      'emergencyAddress',
      'emergencyWorkplace', 
      'spouseInfo',
      'registeredAddress',
      'currentAddressDetail',
      'medicalRights',
      'multipleEmployers',
      'staffInfo',
      'documents', // This is handled separately
      // explicitly invalid in schema
      'placeOfBirthProvince',
      'houseRegistrationAddress',
      'division',
      'previousGovernmentService',
      // client-only emergency split fields
      'emergencyContactFirstName',
      'emergencyContactLastName',
      'emergencyContactRelationship',
      'emergencyContactPhone',
    ];
    
    // Keep address fields that exist in Prisma schema
    const addressFieldsToKeep = [
      'house_registration_house_number',
      'house_registration_village_number',
      'house_registration_alley',
      'house_registration_road',
      'house_registration_sub_district',
      'house_registration_district',
      'house_registration_province',
      'house_registration_postal_code',
      'house_registration_phone',
      'house_registration_mobile',
      'current_address_house_number',
      'current_address_village_number',
      'current_address_alley',
      'current_address_road',
      'current_address_sub_district',
      'current_address_district',
      'current_address_province',
      'current_address_postal_code',
      'current_address_phone',
      'current_address_mobile',
      'emergency_address_house_number',
      'emergency_address_village_number',
      'emergency_address_alley',
      'emergency_address_road',
      'emergency_address_sub_district',
      'emergency_address_district',
      'emergency_address_province',
      'emergency_address_postal_code',
      'emergency_address_phone'
    ];
    
    fieldsToRemove.forEach(field => {
      if (updateData[field] !== undefined) {
        console.log(`🗑️ Removing field '${field}' as it doesn't exist in Prisma schema`);
        delete updateData[field];
      }
    });
    
    // Log address fields that are being kept
    addressFieldsToKeep.forEach(field => {
      if (updateData[field] !== undefined) {
        console.log(`✅ Keeping address field '${field}': ${updateData[field]}`);
      }
    });
    
    console.log('🔢 Age after conversion:', updateData.age, 'Type:', typeof updateData.age)
    // Sanitize empty strings to null for nullable columns
    Object.keys(updateData).forEach((key) => {
      const value = (updateData as any)[key]
      if (typeof value === 'string') {
        (updateData as any)[key] = sanitizePrimitive(value)
      }
    })
    console.log('📝 Update data before Prisma update:', JSON.stringify(updateData, null, 2))
    
    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ ID ของใบสมัคร' },
        { status: 400 }
      )
    }
    
    // Use transaction to update application and related data
    const application = await prisma.$transaction(async (tx) => {
      // Update main application data
      const updatedApplication = await tx.applicationForm.update({
        where: { id },
        data: updateData
      })
      
      // Update education data if provided
      if (educationData && Array.isArray(educationData)) {
        console.log('📚 Updating education data:', educationData.length, 'records')
        
        // Delete existing education records
        const deletedEducation = await tx.applicationEducation.deleteMany({
          where: { applicationId: id }
        })
        console.log('🗑️ Deleted existing education records:', deletedEducation.count)
        
        // Create new education records
        if (educationData.length > 0) {
          const newEducation = await tx.applicationEducation.createMany({
            data: educationData.map((edu: any) => ({
              applicationId: id,
              level: edu.level || null,
              institution: edu.institution || edu.school || null,
              major: edu.major || null,
              year: edu.year || edu.graduationYear || null,
              gpa: edu.gpa ? parseFloat(edu.gpa) : null
            }))
          })
          console.log('✅ Created new education records:', newEducation.count)
        }
      }
      
      // Update work experience data if provided
      if (workExperienceData && Array.isArray(workExperienceData)) {
        console.log('💼 Updating work experience data:', workExperienceData.length, 'records')
        
        // Delete existing work experience records
        const deletedWork = await tx.applicationWorkExperience.deleteMany({
          where: { applicationId: id }
        })
        console.log('🗑️ Deleted existing work experience records:', deletedWork.count)
        
        // Create new work experience records
        if (workExperienceData.length > 0) {
          const newWork = await tx.applicationWorkExperience.createMany({
            data: workExperienceData.map((work: any) => ({
              applicationId: id,
              position: work.position || null,
              company: work.company || null,
              startDate: toDateFromThai(work.startDate),
              endDate: toDateFromThai(work.endDate),
              salary: work.salary || null,
              reason: work.reason || null
            }))
          })
          console.log('✅ Created new work experience records:', newWork.count)
        }
      }
      
      // Return updated application with all related data
      return await tx.applicationForm.findUnique({
        where: { id },
        include: {
          user: true,
          education: true,
          workExperience: true,
          documents: true
        }
      })
    })
    
    return NextResponse.json({
      success: true,
      message: 'อัปเดตข้อมูลใบสมัครเรียบร้อยแล้ว',
      data: application
    })
    
  } catch (error) {
    console.error('Error updating application:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลใบสมัคร',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('🗑️ DELETE request received for application ID:', id)
    
    // ลองลบ ถ้าไม่พบให้ตอบ 404 แทน 500
    let result
    try {
      result = await prisma.applicationForm.delete({ where: { id } })
    } catch (e: any) {
      if (e?.code === 'P2025') {
        return NextResponse.json(
          { success: false, message: 'ไม่พบข้อมูลใบสมัครที่ต้องการลบ' },
          { status: 404 }
        )
      }
      throw e
    }
    
    console.log('✅ Application deleted successfully:', result)
    
    return NextResponse.json({
      success: true,
      message: 'ลบข้อมูลใบสมัครเรียบร้อยแล้ว'
    })
    
  } catch (error) {
    console.error('❌ Error deleting application:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบข้อมูลใบสมัคร' },
      { status: 500 }
    )
  }
}
