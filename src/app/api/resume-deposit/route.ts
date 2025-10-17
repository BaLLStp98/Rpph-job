import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let data: any;
    let profileImageFile: File | null = null;

// console.log(request);

    // ตรวจสอบ Content-Type และประมวลผลข้อมูลตามประเภท
    if (contentType.includes('application/json')) {
      // รับข้อมูลเป็น JSON
      data = await request.json();
    } else if (contentType.includes('multipart/form-data')) {
      // รับข้อมูลเป็น FormData
      const formData = await request.formData();
      const formDataJson = formData.get('formData') as string;
      profileImageFile = formData.get('profileImage') as File | null;
      
      if (!formDataJson) {
        return NextResponse.json(
          { success: false, message: 'ไม่พบข้อมูลฟอร์ม' },
          { status: 400 }
        );
      }
      
      data = JSON.parse(formDataJson);
    } else {
      
      // return NextResponse.json(
      //   { success: false, message: 'Content-Type ไม่ถูกต้อง ต้องเป็น application/json หรือ multipart/form-data' },
      //   { status: 400 }
      // );
    }
    
    // Validate required fields (ยกเว้นกรณี draft เพื่อให้สร้างเรคคอร์ดเริ่มต้นได้)
    const isDraft = String(data?.status || '').toLowerCase() === 'draft';
    if (!isDraft && (!data.firstName || !data.lastName || !data.phone || !data.email)) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' },
        { status: 400 }
      );
    }
    
    // รูปภาพจะจัดการแยกผ่าน profile-image/upload API
    console.log('🔍 API - Profile image will be handled separately via profile-image/upload API');
    
    // Debug logs เพื่อตรวจสอบข้อมูลที่ได้รับ
    console.log('🔍 API - Received education data:', data.education);
    console.log('🔍 API - Received education data length:', data.education?.length || 0);
    console.log('🔍 API - Received work experience data:', data.workExperience);
    console.log('🔍 API - Received work experience data length:', data.workExperience?.length || 0);
    console.log('🔍 API - Received previous government service data:', data.previousGovernmentService);
    console.log('🔍 API - Received previous government service data length:', data.previousGovernmentService?.length || 0);
    
    // Hydrate userId from session/lineId if missing
    let resolvedUserId: string | null = data.userId || null;
    let resolvedLineId: string | null = data.lineId || null;
    try {
      if (!resolvedUserId) {
        const session = await getServerSession(authOptions as any);
        resolvedUserId = (session?.user as any)?.id || null;
        resolvedLineId = (session?.user as any)?.lineId || null;
        console.log('🔍 Session data:', { 
          userId: resolvedUserId, 
          lineId: resolvedLineId,
          user: session?.user 
        });
      }
      if (!resolvedUserId && data.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: data.email },
          select: { id: true, lineId: true }
        });
        resolvedUserId = existingUser?.id || null;
        resolvedLineId = existingUser?.lineId || null;
        console.log('🔍 User from email lookup:', { 
          userId: resolvedUserId, 
          lineId: resolvedLineId 
        });
      }
      
      // Fallback: ถ้ายังไม่มี lineId ให้ลองค้นหาจาก userId
      if (!resolvedLineId && resolvedUserId) {
        const userWithLineId = await prisma.user.findUnique({
          where: { id: resolvedUserId },
          select: { lineId: true }
        });
        resolvedLineId = userWithLineId?.lineId || null;
        console.log('🔍 LineId from userId lookup:', { 
          userId: resolvedUserId, 
          lineId: resolvedLineId 
        });
      }
    } catch (e) {
      console.warn('resume-deposit POST: cannot resolve userId from session/lineId', e);
    }

    // Create resume deposit record
    console.log('🔍 Creating resume deposit with:', { 
      userId: resolvedUserId, 
      lineId: resolvedLineId 
    });
    
    const resumeDeposit = await prisma.resumeDeposit.create({
      data: {
        // 🔒 Security: บันทึก userId และ lineId เพื่อความปลอดภัย
        userId: resolvedUserId,
        lineId: resolvedLineId,
        prefix: data.prefix || '',
        firstName: isDraft ? (data.firstName || 'Draft') : data.firstName,
        lastName: isDraft ? (data.lastName || 'User') : data.lastName,
        idNumber: data.idNumber || '',
        idCardIssuedAt: data.idCardIssuedAt || '',
        idCardIssueDate: data.idCardIssueDate ? new Date(data.idCardIssueDate) : null,
        idCardExpiryDate: data.idCardExpiryDate ? new Date(data.idCardExpiryDate) : null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        age: data.age ? parseInt(data.age) : null,
        race: data.race || '',
        placeOfBirth: data.placeOfBirth || '',
        placeOfBirthProvince: data.placeOfBirthProvince || '',
        gender: data.gender === 'ชาย' ? 'MALE' : data.gender === 'หญิง' ? 'FEMALE' : 'UNKNOWN',
        nationality: data.nationality || 'ไทย',
        religion: data.religion || '',
        maritalStatus: data.maritalStatus === 'โสด' ? 'SINGLE' : 
                      data.maritalStatus === 'สมรส' ? 'MARRIED' : 
                      data.maritalStatus === 'หย่า' ? 'DIVORCED' : 
                      data.maritalStatus === 'หม้าย' ? 'WIDOWED' : 'UNKNOWN',
        address: data.address || '',
        addressAccordingToHouseRegistration: data.addressAccordingToHouseRegistration || '',
        phone: isDraft ? (data.phone || '-') : data.phone,
        email: isDraft ? (data.email || `draft-${Date.now()}@example.com`) : data.email,
        emergencyContact: data.emergencyContact || '',
        emergencyContactFirstName: data.emergencyContactFirstName || '',
        emergencyContactLastName: data.emergencyContactLastName || '',
        emergencyPhone: data.emergencyPhone || '',
        emergencyRelationship: data.emergencyRelationship || '',
        // emergency address
        emergencyAddress: data.emergencyAddress || null,
        // emergency workplace
        emergency_workplace_name: data.emergencyWorkplace?.name || data.emergency_workplace_name || '',
        emergency_workplace_district: data.emergencyWorkplace?.district || data.emergency_workplace_district || '',
        emergency_workplace_province: data.emergencyWorkplace?.province || data.emergency_workplace_province || '',
        emergency_workplace_phone: data.emergencyWorkplace?.phone || data.emergency_workplace_phone || '',
        // registered address
        house_registration_house_number: data.house_registration_house_number || '',
        house_registration_village_number: data.house_registration_village_number || '',
        house_registration_alley: data.house_registration_alley || '',
        house_registration_road: data.house_registration_road || '',
        house_registration_sub_district: data.house_registration_sub_district || '',
        house_registration_district: data.house_registration_district || '',
        house_registration_province: data.house_registration_province || '',
        house_registration_postal_code: data.house_registration_postal_code || '',
        house_registration_phone: data.house_registration_phone || '',
        house_registration_mobile: data.house_registration_mobile || '',
        // current address
        current_address_house_number: data.current_address_house_number || '',
        current_address_village_number: data.current_address_village_number || '',
        current_address_alley: data.current_address_alley || '',
        current_address_road: data.current_address_road || '',
        current_address_sub_district: data.current_address_sub_district || '',
        current_address_district: data.current_address_district || '',
        current_address_province: data.current_address_province || '',
        current_address_postal_code: data.current_address_postal_code || '',
        current_address_phone: data.current_address_phone || '',
        current_address_mobile: data.current_address_mobile || '',
        // emergency address
        emergency_address_house_number: data.emergency_address_house_number || '',
        emergency_address_village_number: data.emergency_address_village_number || '',
        emergency_address_alley: data.emergency_address_alley || '',
        emergency_address_road: data.emergency_address_road || '',
        emergency_address_sub_district: data.emergency_address_sub_district || '',
        emergency_address_district: data.emergency_address_district || '',
        emergency_address_province: data.emergency_address_province || '',
        emergency_address_postal_code: data.emergency_address_postal_code || '',
        emergency_address_phone: data.emergency_address_phone || '',
        // Spouse information
        spouse_first_name: data.spouse_first_name || data.spouseInfo?.firstName || '',
        spouse_last_name: data.spouse_last_name || data.spouseInfo?.lastName || '',
        // Medical rights information
        medical_rights_has_universal_healthcare: data.medical_rights_has_universal_healthcare || data.medicalRights?.hasUniversalHealthcare || false,
        medical_rights_universal_healthcare_hospital: data.medical_rights_universal_healthcare_hospital || data.medicalRights?.universalHealthcareHospital || '',
        medical_rights_has_social_security: data.medical_rights_has_social_security || data.medicalRights?.hasSocialSecurity || false,
        medical_rights_social_security_hospital: data.medical_rights_social_security_hospital || data.medicalRights?.socialSecurityHospital || '',
        medical_rights_dont_want_to_change_hospital: data.medical_rights_dont_want_to_change_hospital || data.medicalRights?.dontWantToChangeHospital || false,
        medical_rights_want_to_change_hospital: data.medical_rights_want_to_change_hospital || data.medicalRights?.wantToChangeHospital || false,
        medical_rights_new_hospital: data.medical_rights_new_hospital || data.medicalRights?.newHospital || '',
        medical_rights_has_civil_servant_rights: data.medical_rights_has_civil_servant_rights || data.medicalRights?.hasCivilServantRights || false,
        medical_rights_other_rights: data.medical_rights_other_rights || data.medicalRights?.otherRights || '',
        // Multiple employers (stored as JSON)
        multiple_employers: data.multiple_employers || (data.multipleEmployers ? JSON.stringify(data.multipleEmployers) : ''),
        // Application information
        applicantSignature: data.applicantSignature || '',
        applicationDate: data.applicationDate ? new Date(data.applicationDate) : null,
        currentWork: data.currentWork || false,
        // Staff information
        staff_position: data.staff_position || data.staffInfo?.position || '',
        staff_department: data.staff_department || data.staffInfo?.department || '',
        staff_start_work: data.staff_start_work || data.staffInfo?.startWork || '',
        skills: data.skills || '',
        languages: data.languages || '',
        computerSkills: data.computerSkills || '',
        certificates: data.certificates || '',
        references: data.references || '',
        expectedPosition: data.expectedPosition || '',
        expectedSalary: data.expectedSalary || '',
        availableDate: data.availableDate ? new Date(data.availableDate) : null,
        department: data.department || '',
        unit: data.unit || '',
        additionalInfo: data.additionalInfo || '',
        profileImageUrl: data.profileImageUrl || null,
        // หมายเหตุ: ไม่มีสถานะ DRAFT ในสคีมา ใช้ PENDING สำหรับ draft
        status: 'PENDING',
        
        // Create related education records
        education: {
          create: (() => {
            const educationData = (data.education || []).filter((edu: any) => {
              const hasData = edu && (edu.level || edu.school || edu.institution);
              console.log('🔍 API - Education filter check:', { edu, hasData });
              return hasData;
            }).map((edu: any) => {
              console.log('🔍 API - Creating education record:', edu);
              return {
                level: edu.level || '',
                school: edu.school || edu.institution || '',
                major: edu.major || '',
                startYear: edu.startYear || '',
                endYear: edu.endYear || edu.year || '',
                gpa: edu.gpa ? parseFloat(edu.gpa) : null
              };
            });
            console.log('🔍 API - Education records to create:', educationData.length);
            return educationData;
          })()
        },
        
        // Create related work experience records
        workExperience: {
          create: (() => {
            const workData = (data.workExperience || []).filter((work: any) => {
              const hasData = work && (work.position || work.company);
              console.log('🔍 API - Work experience filter check:', { work, hasData });
              return hasData;
            }).map((work: any) => {
              console.log('🔍 API - Creating work experience record:', work);
              return {
                position: work.position || '',
                company: work.company || '',
                startDate: work.startDate ? new Date(work.startDate) : null,
                endDate: work.endDate ? new Date(work.endDate) : null,
                isCurrent: !!work.isCurrent,
                description: work.description || work.reason || '',
                salary: work.salary || ''
              };
            });
            console.log('🔍 API - Work experience records to create:', workData.length);
            return workData;
          })()
        },
        
        // Create related previous government service records
        previousGovernmentService: {
          create: (() => {
            console.log('🔍 API - data.previousGovernmentService:', data.previousGovernmentService);
            console.log('🔍 API - data.previousGovernmentService.length:', data.previousGovernmentService?.length || 0);
            const serviceData = (data.previousGovernmentService || []).filter((gov: any) => {
              const hasData = gov && (gov.position || gov.department);
              console.log('🔍 API - Previous government service filter check:', { gov, hasData });
              return hasData;
            }).map((gov: any) => {
              console.log('🔍 API - Creating previous government service record:', gov);
              const serviceData: any = {
                position: gov.position || '',
                department: gov.department || '',
                reason: gov.reason || '',
                date: gov.date || ''
              };
              // เพิ่ม type field เฉพาะเมื่อมี
              if (gov.type) {
                serviceData.type = gov.type;
              }
              return serviceData;
            });
            console.log('🔍 API - Previous government service records to create:', serviceData.length);
            return serviceData;
          })()
        },
        
        // Create related document records
        documents: {
          create: (data.documents || []).filter((doc: any) => doc.documentType && doc.fileName).map((doc: any) => ({
            documentType: doc.documentType || '',
            fileName: doc.fileName || '',
            filePath: doc.filePath || null,
            fileSize: doc.fileSize || null,
            mimeType: doc.mimeType || null
          }))
        }
      },
      include: {
        education: true,
        workExperience: true,
        previousGovernmentService: true,
        documents: true
      }
    });
    
    // ตรวจสอบข้อมูลที่ถูกสร้างขึ้นจริง
    console.log('✅ ResumeDeposit created with ID:', resumeDeposit.id);
    console.log('✅ ResumeDeposit userId:', resumeDeposit.userId);
    console.log('✅ ResumeDeposit lineId:', resumeDeposit.lineId);
    console.log('✅ Education records created:', resumeDeposit.education?.length || 0);
    console.log('✅ Work experience records created:', resumeDeposit.workExperience?.length || 0);
    console.log('✅ Previous government service records created:', resumeDeposit.previousGovernmentService?.length || 0);
    
    return NextResponse.json({
      success: true,
      message: 'ฝากประวัติเรียบร้อยแล้ว',
      data: resumeDeposit
    });
    
  } catch (error) {
    console.error('Error creating resume deposit:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');
    const lineId = searchParams.get('lineId');
    const isAdmin = searchParams.get('admin') === 'true';
    const department = searchParams.get('department') || '';
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    // 🔒 Security: กรองข้อมูลตาม userId และ lineId อย่างเข้มงวด
    if (isAdmin) {
      // ผู้ดูแลสามารถดูทั้งหมดได้ (ยังสามารถกรองเพิ่มด้วย department/status/search ได้ด้านล่าง)
    } else {
      // สำหรับผู้ใช้ทั่วไป: ต้องมีทั้ง userId และ lineId ที่ตรงกัน
      const hasUserId = userId && userId.trim() !== '';
      const hasLineId = lineId && lineId.trim() !== '';
      
      if (hasUserId && hasLineId) {
        // ใช้ AND condition: ต้องตรงทั้ง userId และ lineId
        where.AND = [
          { userId: userId.trim() },
          { lineId: lineId.trim() }
        ];
      } else if (hasLineId) {
        // ถ้ามีแค่ lineId ให้ใช้ lineId เท่านั้น
        where.lineId = lineId.trim();
      } else if (hasUserId) {
        // ถ้ามีแค่ userId ให้ใช้ userId เท่านั้น
        where.userId = userId.trim();
      } else if (department) {
        // Fallback: หากไม่มีตัวระบุผู้ใช้ ให้กรองตามฝ่ายเพื่อการแสดงผลเฉพาะมุมมองฝ่าย
        where.department = department;
      } else {
        // ไม่มีเงื่อนไขระบุตัวตนและไม่ระบุฝ่าย → คืนลิสต์ว่างเพื่อความปลอดภัย
        return NextResponse.json({
          success: true,
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0
          }
        });
      }
    }
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { expectedPosition: { contains: search } }
      ];
    }

    // กรองตามฝ่าย หากมีการส่ง department มา
    if (department) {
      where.department = department;
    }
    
    const [resumeDeposits, total] = await Promise.all([
      prisma.resumeDeposit.findMany({
        where,
        include: {
          education: true,
          workExperience: true,
          previousGovernmentService: true,
          documents: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.resumeDeposit.count({ where })
    ]);
    
    return NextResponse.json({
      success: true,
      data: resumeDeposits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching resume deposits:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
