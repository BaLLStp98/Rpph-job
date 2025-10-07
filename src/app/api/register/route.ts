import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json()
    
    // Debug log เพื่อตรวจสอบข้อมูลที่ได้รับ
    console.log('📝 Received education data:', applicationData.education);
    console.log('💼 Received work experience data:', applicationData.workExperience);
    console.log('🏛️ Received previous government service data:', applicationData.previousGovernmentService);
    
    // Create resume deposit in database
    const resumeDeposit = await prisma.resumeDeposit.create({
      data: {
        firstName: applicationData.firstName || '',
        lastName: applicationData.lastName || '',
        email: applicationData.email || '',
        phone: applicationData.phone || '',
        idNumber: applicationData.idNumber || null,
        prefix: applicationData.prefix || null,
        gender: applicationData.gender || 'UNKNOWN',
        maritalStatus: applicationData.maritalStatus || 'UNKNOWN',
        birthDate: applicationData.birthDate ? new Date(applicationData.birthDate) : null,
        idCardIssueDate: applicationData.idCardIssueDate ? new Date(applicationData.idCardIssueDate) : null,
        idCardExpiryDate: applicationData.idCardExpiryDate ? new Date(applicationData.idCardExpiryDate) : null,
        availableDate: applicationData.availableDate ? new Date(applicationData.availableDate) : null,
        expectedSalary: applicationData.expectedSalary || null,
        department: applicationData.department || null,
        expectedPosition: applicationData.appliedPosition || null,
        currentAddress: applicationData.currentAddress || null,
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
        addressAccordingToHouseRegistration: applicationData.addressAccordingToHouseRegistration || null,
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
        emergencyContact: applicationData.emergencyContact || null,
        emergencyPhone: applicationData.emergencyPhone || null,
        emergencyRelationship: applicationData.emergencyRelationship || null,
        emergency_address_house_number: applicationData.emergency_address_house_number || null,
        emergency_address_village_number: applicationData.emergency_address_village_number || null,
        emergency_address_alley: applicationData.emergency_address_alley || null,
        emergency_address_road: applicationData.emergency_address_road || null,
        emergency_address_sub_district: applicationData.emergency_address_sub_district || null,
        emergency_address_district: applicationData.emergency_address_district || null,
        emergency_address_province: applicationData.emergency_address_province || null,
        emergency_address_postal_code: applicationData.emergency_address_postal_code || null,
        emergency_address_phone: applicationData.emergency_address_phone || null,
        spouseFirstName: applicationData.spouseFirstName || null,
        spouseLastName: applicationData.spouseLastName || null,
        skills: applicationData.skills || null,
        languages: applicationData.languages || null,
        computerSkills: applicationData.computerSkills || null,
        certificates: applicationData.certificates || null,
        references: applicationData.references || null,
        profileImage: applicationData.profileImage || null,
        status: 'PENDING',
        // ข้อมูลการศึกษา
        education: {
          create: (applicationData.education || []).filter((e: any) => e && (e.level || e.institution)).map((e: any) => {
            console.log('📝 Creating education record:', e);
            return {
              level: e.level || '',
              school: e.institution || '',
              major: e.major || null,
              startYear: e.year || null,
              endYear: e.year || null,
              gpa: e.gpa ? parseFloat(e.gpa) : null
            };
          })
        },
        // ข้อมูลประสบการณ์ทำงาน
        workExperience: {
          create: (applicationData.workExperience || []).filter((w: any) => w && (w.position || w.company)).map((w: any) => {
            console.log('💼 Creating work experience record:', w);
            return {
              position: w.position || '',
              company: w.company || '',
              startDate: w.startDate ? new Date(w.startDate) : null,
              endDate: w.endDate ? new Date(w.endDate) : null,
              salary: w.salary || null,
              description: w.reason || null,
              isCurrent: w.endDate === null || w.endDate === '' || w.endDate === 'ปัจจุบัน'
            };
          })
        },
        // ข้อมูลการรับราชการก่อนหน้า
        previousGovernmentService: {
          create: (applicationData.previousGovernmentService || []).filter((g: any) => g && (g.position || g.department)).map((g: any) => {
            console.log('🏛️ Creating previous government service record:', g);
            const serviceData: any = {
              position: g.position || '',
              department: g.department || '',
              reason: g.reason || '',
              date: g.date || ''
            };
            // เพิ่ม type field เฉพาะเมื่อมี
            if (g.type) {
              serviceData.type = g.type;
            }
            return serviceData;
          })
        }
      }
    })

    // ตรวจสอบข้อมูลที่ถูกสร้างขึ้นจริง
    const createdResumeDeposit = await prisma.resumeDeposit.findUnique({
      where: { id: resumeDeposit.id },
      include: {
        education: true,
        workExperience: true,
        previousGovernmentService: true
      }
    });

    console.log('✅ Created resume deposit with education records:', createdResumeDeposit?.education?.length || 0);
    console.log('✅ Created resume deposit with work experience records:', createdResumeDeposit?.workExperience?.length || 0);
    console.log('✅ Created resume deposit with previous government service records:', createdResumeDeposit?.previousGovernmentService?.length || 0);

    return NextResponse.json({
      success: true,
      message: 'Resume deposit created successfully',
      data: createdResumeDeposit
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit resume deposit',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    
    let whereClause = {}
    if (department) {
      whereClause = {
        OR: [
          { department: { contains: department } }
        ]
      }
    }
    
    const resumeDeposits = await prisma.resumeDeposit.findMany({
      where: whereClause,
      include: {
        education: true,
        workExperience: true,
        documents: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({
      success: true,
      data: resumeDeposits
    })
    
  } catch (error) {
    console.error('Error fetching resume deposits:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch resume deposits',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 