import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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
    
    // Create resume deposit record
    const resumeDeposit = await prisma.resumeDeposit.create({
      data: {
        
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
        phone: isDraft ? (data.phone || '-') : data.phone,
        email: isDraft ? (data.email || `draft-${Date.now()}@example.com`) : data.email,
        emergencyContact: data.emergencyContact || '',
        emergencyPhone: data.emergencyPhone || '',
        emergencyRelationship: data.emergencyRelationship || '',
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
          create: (data.education || []).filter((edu: any) => edu.level || edu.school || edu.institution).map((edu: any) => ({
            level: edu.level || '',
            school: edu.school || edu.institution || '',
            major: edu.major || '',
            startYear: edu.startYear || '',
            endYear: edu.endYear || edu.year || '',
            gpa: edu.gpa ? parseFloat(edu.gpa) : null
          }))
        },
        
        // Create related work experience records
        workExperience: {
          create: (data.workExperience || []).filter((work: any) => work.position || work.company).map((work: any) => ({
            position: work.position || '',
            company: work.company || '',
            startDate: work.startDate ? new Date(work.startDate) : null,
            endDate: work.endDate ? new Date(work.endDate) : null,
            isCurrent: !!work.isCurrent,
            description: work.description || work.reason || '',
            salary: work.salary || ''
          }))
        },
        
        // Create related previous government service records
        previousGovernmentService: {
          create: (data.previousGovernmentService || []).filter((gov: any) => gov.position || gov.department).map((gov: any) => ({
            position: gov.position || '',
            department: gov.department || '',
            reason: gov.reason || '',
            date: gov.date || ''
          }))
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
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (email) {
      where.email = email;
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
    
    const [resumeDeposits, total] = await Promise.all([
      prisma.resumeDeposit.findMany({
        where,
        include: {
          education: true,
          workExperience: true,
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
  }
}
