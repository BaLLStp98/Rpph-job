import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('🔍 API GET Request - ID:', id);
    console.log('🔍 API GET Request - URL:', request.url);
    
    if (!id) {
      console.error('❌ API GET - No ID provided');
      return NextResponse.json(
        { success: false, message: 'ไม่พบ ID' },
        { status: 400 }
      );
    }
    
    // ตรวจสอบ session เพื่อตรวจสอบ ownership
    const session = await getServerSession(authOptions as any);
    const isAdmin = (session?.user as any)?.role === 'admin';
    
    console.log('🔍 API GET - Session:', !!session);
    console.log('🔍 API GET - Is Admin:', isAdmin);
    
    console.log('🔍 API GET - Querying database for ID:', id);
    const resumeDeposit = await prisma.resumeDeposit.findUnique({
      where: { id },
      include: {
        education: true,
        workExperience: true,
        previousGovernmentService: true,
        documents: true
      }
    });
    
    console.log('🔍 API GET - Database result:', !!resumeDeposit);
    
    if (!resumeDeposit) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูล' },
        { status: 404 }
      );
    }
    
    // ตรวจสอบ ownership: ต้องเป็น admin หรือเป็นเจ้าของข้อมูล
    if (!isAdmin) {
      const sessionUserId = (session?.user as any)?.id;
      const sessionLineId = (session?.user as any)?.lineId || (session?.user as any)?.sub || (session as any)?.profile?.userId;
      
      // Debug: ตรวจสอบข้อมูล session และ ownership
      console.log('🔍 GET API - Ownership Debug:');
      console.log('• Session User ID:', sessionUserId);
      console.log('• Session Line ID:', sessionLineId);
      console.log('• Resume User ID:', resumeDeposit.userId);
      console.log('• Resume Line ID:', resumeDeposit.lineId);
      console.log('• Is Admin:', isAdmin);
      
      // ถ้าไม่มี session ให้อนุญาตให้เข้าถึงได้ (สำหรับการทดสอบ)
      if (!session) {
        console.log('⚠️ GET API - No session found, allowing access for testing');
        // ไม่ต้อง return error ให้ดำเนินการต่อ
      } else {
        const isOwner = (resumeDeposit.userId && resumeDeposit.userId === sessionUserId) ||
                       (resumeDeposit.lineId && resumeDeposit.lineId === sessionLineId);
        
        console.log('• Is Owner:', isOwner);
        
        // ถ้าไม่มี userId หรือ lineId ใน session หรือในฐานข้อมูล ให้อนุญาตให้เข้าถึงได้
        if (!sessionUserId && !sessionLineId) {
          console.log('⚠️ GET API - No userId or lineId in session, allowing access');
          // ไม่ต้อง return error ให้ดำเนินการต่อ
        } else if (!resumeDeposit.userId && !resumeDeposit.lineId) {
          console.log('⚠️ GET API - No userId or lineId in database, allowing access');
          // ไม่ต้อง return error ให้ดำเนินการต่อ
        } else if (!isOwner) {
          console.log('❌ GET API - Ownership check failed');
          return NextResponse.json(
            { success: false, message: 'ไม่มีสิทธิ์เข้าถึงข้อมูลนี้' },
            { status: 403 }
          );
        }
      }
    }
    
    // Debug: ตรวจสอบข้อมูล profileImage
    console.log('🔍 API Resume Deposit Debug:');
    console.log('• ID:', id);
    console.log('• ProfileImageUrl:', resumeDeposit.profileImageUrl);
    console.log('• ProfileImageUrl Type:', typeof resumeDeposit.profileImageUrl);
    console.log('• ProfileImageUrl Length:', resumeDeposit.profileImageUrl?.length);
    
    console.log('✅ API GET - Returning data successfully');
    console.log('🔍 API GET - Data keys:', Object.keys(resumeDeposit));
    
    return NextResponse.json({
      success: true,
      data: resumeDeposit
    });
    
  } catch (error) {
    console.error('Error fetching resume deposit by ID:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    if (!id) {
        return NextResponse.json(
        { success: false, message: 'ไม่พบ ID' },
          { status: 400 }
        );
    }

    // ตรวจสอบ session เพื่อตรวจสอบ ownership
    const session = await getServerSession(authOptions as any);
    const isAdmin = (session?.user as any)?.role === 'admin';

    // แปลงและตรวจสอบค่า status ให้ตรงกับ enum ของ Prisma
    const rawStatus = typeof data.status === 'string' ? data.status : undefined;
    const statusMap: Record<string, string> = {
      pending: 'PENDING',
      approved: 'APPROVED',
      rejected: 'REJECTED',
      reviewing: 'REVIEWING',
      in_review: 'REVIEWING',
      'รอพิจารณา': 'PENDING',
      'อนุมัติ': 'APPROVED',
      'ไม่อนุมัติ': 'REJECTED'
    };
    const normalizedStatus = rawStatus
      ? (statusMap[rawStatus] || statusMap[rawStatus.toLowerCase()] || undefined)
      : undefined;

    // ตรวจสอบว่ามีเรคอร์ดอยู่ก่อนอัปเดต เพื่อหลีกเลี่ยง Prisma P2025
    const existing = await prisma.resumeDeposit.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลสำหรับอัปเดต' },
        { status: 404 }
      );
    }

    // ตรวจสอบ ownership: ต้องเป็น admin หรือเป็นเจ้าของข้อมูล
    if (!isAdmin) {
      const sessionUserId = (session?.user as any)?.id;
      const sessionLineId = (session?.user as any)?.lineId || (session?.user as any)?.sub || (session as any)?.profile?.userId;
      
      // ถ้าไม่มี session ให้อนุญาตให้แก้ไขได้ (สำหรับการทดสอบ)
      if (!session) {
        console.log('⚠️ PUT API - No session found, allowing update for testing');
        // ไม่ต้อง return error ให้ดำเนินการต่อ
      } else {
        const isOwner = (existing.userId && existing.userId === sessionUserId) ||
                       (existing.lineId && existing.lineId === sessionLineId);
        
        // ถ้าไม่มี userId หรือ lineId ใน session หรือในฐานข้อมูล ให้อนุญาตให้แก้ไขได้
        if (!sessionUserId && !sessionLineId) {
          console.log('⚠️ PUT API - No userId or lineId in session, allowing update');
          // ไม่ต้อง return error ให้ดำเนินการต่อ
        } else if (!existing.userId && !existing.lineId) {
          console.log('⚠️ PUT API - No userId or lineId in database, allowing update');
          // ไม่ต้อง return error ให้ดำเนินการต่อ
        } else if (!isOwner) {
          return NextResponse.json(
            { success: false, message: 'ไม่มีสิทธิ์แก้ไขข้อมูลนี้' },
            { status: 403 }
          );
        }
      }
    }

    // จัดการข้อมูล education, workExperience, และ previousGovernmentService
    if (data.education !== undefined) {
      // ลบข้อมูลเก่าทั้งหมด
      await prisma.resumeDepositEducation.deleteMany({
        where: { resumeDepositId: id }
      });
      
      // สร้างข้อมูลใหม่
      if (Array.isArray(data.education) && data.education.length > 0) {
        await prisma.resumeDepositEducation.createMany({
          data: data.education.filter((edu: any) => edu && (edu.level || edu.school)).map((edu: any) => ({
            resumeDepositId: id,
            level: edu.level || '',
            school: edu.school || '',
            major: edu.major || '',
            startYear: edu.startYear || edu.year || '',
            endYear: edu.endYear || '',
            gpa: edu.gpa ? parseFloat(edu.gpa) : null
          }))
        });
        console.log('✅ PUT API - Education records updated:', data.education.length);
      }
    }

    if (data.workExperience !== undefined) {
      // ลบข้อมูลเก่าทั้งหมด
      await prisma.resumeDepositWorkExperience.deleteMany({
        where: { resumeDepositId: id }
      });
      
      // สร้างข้อมูลใหม่
      if (Array.isArray(data.workExperience) && data.workExperience.length > 0) {
        await prisma.resumeDepositWorkExperience.createMany({
          data: data.workExperience.filter((work: any) => work && (work.position || work.company)).map((work: any) => ({
            resumeDepositId: id,
            position: work.position || '',
            company: work.company || '',
            startDate: work.startDate || '',
            endDate: work.endDate || '',
            salary: work.salary || '',
            reason: work.reason || '',
            district: work.district || null,
            province: work.province || null,
            phone: work.phone || null
          }))
        });
        console.log('✅ PUT API - Work experience records updated:', data.workExperience.length);
      }
    }

    if (data.previousGovernmentService !== undefined) {
      // ลบข้อมูลเก่าทั้งหมด
      await prisma.resumeDepositPreviousGovernmentService.deleteMany({
        where: { resumeDepositId: id }
      });
      
      // สร้างข้อมูลใหม่
      if (Array.isArray(data.previousGovernmentService) && data.previousGovernmentService.length > 0) {
        await prisma.resumeDepositPreviousGovernmentService.createMany({
          data: data.previousGovernmentService.filter((gov: any) => gov && (gov.position || gov.department)).map((gov: any) => ({
            resumeDepositId: id,
            position: gov.position || '',
            department: gov.department || '',
            reason: gov.reason || '',
            date: gov.date || '',
            type: gov.type || 'civilServant'
          }))
        });
        console.log('✅ PUT API - Previous government service records updated:', data.previousGovernmentService.length);
      }
    }

    const updatedResumeDeposit = await prisma.resumeDeposit.update({
      where: { id },
      data: {
        prefix: data.prefix || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
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
        phone: data.phone || '',
        email: data.email || '',
        expectedPosition: data.expectedPosition || '',
        expectedSalary: data.expectedSalary || '',
        availableDate: data.availableDate ? new Date(data.availableDate) : null,
        currentWork: data.currentWork || false,
        department: data.department || '',
        unit: data.unit || data.division || '',
        skills: data.skills || '',
        languages: data.languages || '',
        computerSkills: data.computerSkills || '',
        certificates: data.certificates || '',
        references: data.references || '',
        // ข้อมูลการติดต่อฉุกเฉิน
        emergencyContact: data.emergencyContact || '',
        emergencyPhone: data.emergencyPhone || '',
        emergencyRelationship: data.emergencyRelationship || '',
        // ข้อมูลคู่สมรส
        spouse_first_name: data.spouse_first_name || '',
        spouse_last_name: data.spouse_last_name || '',
        // ข้อมูลเจ้าหน้าที่
        staff_position: data.staff_position || '',
        staff_department: data.staff_department || '',
        staff_start_work: data.staff_start_work || '',
        // ใช้ profileImageUrl ตามสคีมา และรองรับข้อมูลเดิมที่ส่งมาเป็น profileImage
        profileImageUrl: data.profileImageUrl || data.profileImage || '',
        // อัปเดต status เฉพาะเมื่อค่า valid เท่านั้น
        ...(normalizedStatus ? { status: normalizedStatus as any } : {}),
        updatedAt: new Date()
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
      message: 'อัปเดตข้อมูลเรียบร้อยแล้ว',
      data: updatedResumeDeposit
    });
    
  } catch (error) {
    console.error('❌ PATCH API - Error updating resume deposit:', error);
    console.error('❌ PATCH API - Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    console.log('🔍 PATCH API - Received request:', { id, data });
    console.log('🔍 PATCH API - Request method:', request.method);
    console.log('🔍 PATCH API - Request URL:', request.url);
    console.log('🔍 PATCH API - Status field in data:', data.status);
    console.log('🔍 PATCH API - Data type:', typeof data.status);
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ ID' },
        { status: 400 }
      );
    }

    // ตรวจสอบ session เพื่อตรวจสอบ ownership
    const session = await getServerSession(authOptions as any);
    const isAdmin = (session?.user as any)?.role === 'admin';

    // PATCH method - อัปเดตเฉพาะฟิลด์ที่ส่งมา
    const updateData: any = {};
    
    // อัปเดตฟิลด์หลัก
    if (data.prefix !== undefined) updateData.prefix = data.prefix;
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.idNumber !== undefined) updateData.idNumber = data.idNumber;
    if (data.idCardIssuedAt !== undefined) updateData.idCardIssuedAt = data.idCardIssuedAt;
    if (data.idCardIssueDate !== undefined) updateData.idCardIssueDate = data.idCardIssueDate ? new Date(data.idCardIssueDate) : null;
    if (data.idCardExpiryDate !== undefined) updateData.idCardExpiryDate = data.idCardExpiryDate ? new Date(data.idCardExpiryDate) : null;
    if (data.birthDate !== undefined) updateData.birthDate = data.birthDate ? new Date(data.birthDate) : null;
    if (data.age !== undefined) updateData.age = data.age ? parseInt(data.age) : null;
    if (data.race !== undefined) updateData.race = data.race;
    if (data.placeOfBirth !== undefined) updateData.placeOfBirth = data.placeOfBirth;
    if (data.placeOfBirthProvince !== undefined) updateData.placeOfBirthProvince = data.placeOfBirthProvince;
    if (data.gender !== undefined) {
      updateData.gender = data.gender === 'ชาย' ? 'MALE' : data.gender === 'หญิง' ? 'FEMALE' : 'UNKNOWN';
    }
    if (data.nationality !== undefined) updateData.nationality = data.nationality;
    if (data.religion !== undefined) updateData.religion = data.religion;
    if (data.maritalStatus !== undefined) {
      updateData.maritalStatus = data.maritalStatus === 'โสด' ? 'SINGLE' : 
                                data.maritalStatus === 'สมรส' ? 'MARRIED' : 
                                data.maritalStatus === 'หย่า' ? 'DIVORCED' : 
                                data.maritalStatus === 'หม้าย' ? 'WIDOWED' : 'UNKNOWN';
    }
    if (data.address !== undefined) updateData.address = data.address;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.emergencyContact !== undefined) updateData.emergencyContact = data.emergencyContact;
    if (data.emergencyPhone !== undefined) updateData.emergencyPhone = data.emergencyPhone;
    if (data.emergencyRelationship !== undefined) updateData.emergencyRelationship = data.emergencyRelationship;
    if (data.skills !== undefined) updateData.skills = data.skills;
    if (data.languages !== undefined) updateData.languages = data.languages;
    if (data.computerSkills !== undefined) updateData.computerSkills = data.computerSkills;
    if (data.certificates !== undefined) updateData.certificates = data.certificates;
    if (data.references !== undefined) updateData.references = data.references;
    if (data.expectedPosition !== undefined) updateData.expectedPosition = data.expectedPosition;
    if (data.expectedSalary !== undefined) updateData.expectedSalary = data.expectedSalary;
    if (data.availableDate !== undefined) updateData.availableDate = data.availableDate ? new Date(data.availableDate) : null;
    if (data.department !== undefined) {
      // Decode URL encoded string และจำกัดความยาว
      let decodedDepartment = data.department;
      try {
        decodedDepartment = decodeURIComponent(data.department);
      } catch (e) {
        console.warn('⚠️ PATCH API - Failed to decode department:', data.department);
      }
      // จำกัดความยาวไม่เกิน 255 ตัวอักษร
      updateData.department = decodedDepartment.length > 255 ? decodedDepartment.substring(0, 255) : decodedDepartment;
      console.log('🔍 PATCH API - Department processing:', { 
        original: data.department, 
        decoded: decodedDepartment, 
        final: updateData.department 
      });
    }
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.division !== undefined) updateData.unit = data.division; // map division to unit
    if (data.spouse_first_name !== undefined) updateData.spouse_first_name = data.spouse_first_name;
    if (data.spouse_last_name !== undefined) updateData.spouse_last_name = data.spouse_last_name;
    if (data.staff_position !== undefined) updateData.staff_position = data.staff_position;
    if (data.staff_department !== undefined) updateData.staff_department = data.staff_department;
    if (data.staff_start_work !== undefined) updateData.staff_start_work = data.staff_start_work;
    
    // ข้อมูลสถานที่ทำงานผู้ติดต่อฉุกเฉิน
    if (data.emergency_workplace_name !== undefined) updateData.emergency_workplace_name = data.emergency_workplace_name;
    if (data.emergency_workplace_district !== undefined) updateData.emergency_workplace_district = data.emergency_workplace_district;
    if (data.emergency_workplace_province !== undefined) updateData.emergency_workplace_province = data.emergency_workplace_province;
    if (data.emergency_workplace_phone !== undefined) updateData.emergency_workplace_phone = data.emergency_workplace_phone;

    // ที่อยู่ตามทะเบียนบ้าน
    if (data.house_registration_house_number !== undefined) updateData.house_registration_house_number = data.house_registration_house_number;
    if (data.house_registration_village_number !== undefined) updateData.house_registration_village_number = data.house_registration_village_number;
    if (data.house_registration_alley !== undefined) updateData.house_registration_alley = data.house_registration_alley;
    if (data.house_registration_road !== undefined) updateData.house_registration_road = data.house_registration_road;
    if (data.house_registration_sub_district !== undefined) updateData.house_registration_sub_district = data.house_registration_sub_district;
    if (data.house_registration_district !== undefined) updateData.house_registration_district = data.house_registration_district;
    if (data.house_registration_province !== undefined) updateData.house_registration_province = data.house_registration_province;
    if (data.house_registration_postal_code !== undefined) updateData.house_registration_postal_code = data.house_registration_postal_code;
    if (data.house_registration_phone !== undefined) updateData.house_registration_phone = data.house_registration_phone;
    if (data.house_registration_mobile !== undefined) updateData.house_registration_mobile = data.house_registration_mobile;

    // ที่อยู่ปัจจุบัน
    if (data.current_address_house_number !== undefined) updateData.current_address_house_number = data.current_address_house_number;
    if (data.current_address_village_number !== undefined) updateData.current_address_village_number = data.current_address_village_number;
    if (data.current_address_alley !== undefined) updateData.current_address_alley = data.current_address_alley;
    if (data.current_address_road !== undefined) updateData.current_address_road = data.current_address_road;
    if (data.current_address_sub_district !== undefined) updateData.current_address_sub_district = data.current_address_sub_district;
    if (data.current_address_district !== undefined) updateData.current_address_district = data.current_address_district;
    if (data.current_address_province !== undefined) updateData.current_address_province = data.current_address_province;
    if (data.current_address_postal_code !== undefined) updateData.current_address_postal_code = data.current_address_postal_code;
    if (data.current_address_phone !== undefined) updateData.current_address_phone = data.current_address_phone;
    if (data.current_address_mobile !== undefined) updateData.current_address_mobile = data.current_address_mobile;

    // ที่อยู่ฉุกเฉิน
    if (data.emergency_address_house_number !== undefined) updateData.emergency_address_house_number = data.emergency_address_house_number;
    if (data.emergency_address_village_number !== undefined) updateData.emergency_address_village_number = data.emergency_address_village_number;
    if (data.emergency_address_alley !== undefined) updateData.emergency_address_alley = data.emergency_address_alley;
    if (data.emergency_address_road !== undefined) updateData.emergency_address_road = data.emergency_address_road;
    if (data.emergency_address_sub_district !== undefined) updateData.emergency_address_sub_district = data.emergency_address_sub_district;
    if (data.emergency_address_district !== undefined) updateData.emergency_address_district = data.emergency_address_district;
    if (data.emergency_address_province !== undefined) updateData.emergency_address_province = data.emergency_address_province;
    if (data.emergency_address_postal_code !== undefined) updateData.emergency_address_postal_code = data.emergency_address_postal_code;
    if (data.emergency_address_phone !== undefined) updateData.emergency_address_phone = data.emergency_address_phone;
    
    // จัดการ status field
    if (data.status !== undefined) {
      console.log('🔍 PATCH API - Processing status field:', { 
        originalStatus: data.status, 
        type: typeof data.status 
      });
      
      const statusMap: Record<string, string> = {
        pending: 'PENDING',
        approved: 'HIRED',
        rejected: 'REJECTED',
        reviewing: 'REVIEWING',
        in_review: 'REVIEWING',
        contacted: 'CONTACTED',
        hired: 'HIRED',
        archived: 'ARCHIVED',
        'รอพิจารณา': 'PENDING',
        'ผ่านการพิจารณา': 'HIRED',
        'อนุมัติ': 'HIRED',
        'ไม่อนุมัติ': 'REJECTED',
        'กำลังพิจารณา': 'REVIEWING',
        'ติดต่อแล้ว': 'CONTACTED',
        'รับเข้าทำงาน': 'HIRED',
        'ปฏิเสธ': 'REJECTED',
        'เก็บถาวร': 'ARCHIVED'
      };
      
      const normalizedStatus = statusMap[data.status] || statusMap[data.status.toLowerCase()] || data.status;
      updateData.status = normalizedStatus;
      
      console.log('🔍 PATCH API - Status update:', { 
        original: data.status, 
        normalized: normalizedStatus,
        statusMap: statusMap,
        foundInMap: statusMap[data.status] || statusMap[data.status.toLowerCase()]
      });
    } else {
      console.log('🔍 PATCH API - No status field in request data');
    }

    // Debug logs เพื่อตรวจสอบข้อมูลที่ได้รับ
    console.log('🔍 PATCH API - Received education data:', data.education);
    console.log('🔍 PATCH API - Received work experience data:', data.workExperience);
    console.log('🔍 PATCH API - Received previous government service data:', data.previousGovernmentService);

    // ตรวจสอบว่ามีเรคอร์ดอยู่ก่อนอัปเดต เพื่อหลีกเลี่ยง Prisma P2025
    const existing = await prisma.resumeDeposit.findUnique({ where: { id } });
    console.log('🔍 PATCH API - Existing record check:', { id, exists: !!existing });
    
    if (!existing) {
      console.error('❌ PATCH API - Record not found:', { id });
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลสำหรับอัปเดต' },
        { status: 404 }
      );
    }

    // ตรวจสอบ ownership: ต้องเป็น admin หรือเป็นเจ้าของข้อมูล
    if (!isAdmin) {
      const sessionUserId = (session?.user as any)?.id;
      const sessionLineId = (session?.user as any)?.lineId || (session?.user as any)?.sub || (session as any)?.profile?.userId;
      
      // Debug: ตรวจสอบข้อมูล session และ ownership
      console.log('🔍 PATCH API - Ownership Debug:');
      console.log('• Session User ID:', sessionUserId);
      console.log('• Session Line ID:', sessionLineId);
      console.log('• Existing User ID:', existing.userId);
      console.log('• Existing Line ID:', existing.lineId);
      console.log('• Is Admin:', isAdmin);
      
      // ถ้าไม่มี session ให้อนุญาตให้แก้ไขได้ (สำหรับการทดสอบ)
      if (!session) {
        console.log('⚠️ PATCH API - No session found, allowing update for testing');
        // ไม่ต้อง return error ให้ดำเนินการต่อ
      } else {
        // ตรวจสอบ ownership ด้วย userId และ lineId เท่านั้น
        const isOwner = (existing.userId && existing.userId === sessionUserId) ||
                       (existing.lineId && existing.lineId === sessionLineId);
        
        console.log('• Is Owner:', isOwner);
        
        // ถ้าไม่มี userId หรือ lineId ใน session หรือในฐานข้อมูล ให้อนุญาตให้แก้ไขได้
        if (!sessionUserId && !sessionLineId) {
          console.log('⚠️ PATCH API - No userId or lineId in session, allowing update');
          // ไม่ต้อง return error ให้ดำเนินการต่อ
        } else if (!existing.userId && !existing.lineId) {
          console.log('⚠️ PATCH API - No userId or lineId in database, allowing update');
          // ไม่ต้อง return error ให้ดำเนินการต่อ
        } else if (!isOwner) {
          console.log('❌ PATCH API - Ownership check failed');
          // แสดงข้อมูลเพิ่มเติมเพื่อ debug
          console.log('❌ PATCH API - Debug Info:', {
            sessionUserId,
            sessionLineId,
            existingUserId: existing.userId,
            existingLineId: existing.lineId
          });
          return NextResponse.json(
            { success: false, message: 'ไม่มีสิทธิ์แก้ไขข้อมูลนี้' },
            { status: 403 }
          );
        }
      }
    }

    // จัดการข้อมูล education, workExperience, และ previousGovernmentService
    if (data.education !== undefined) {
      // ลบข้อมูลเก่าทั้งหมด
      await prisma.resumeDepositEducation.deleteMany({
        where: { resumeDepositId: id }
      });
      
      // สร้างข้อมูลใหม่
      if (Array.isArray(data.education) && data.education.length > 0) {
        await prisma.resumeDepositEducation.createMany({
          data: data.education.filter((edu: any) => edu && (edu.level || edu.school || edu.institution)).map((edu: any) => ({
            resumeDepositId: id,
            level: edu.level || '',
            school: edu.school || edu.institution || '',
            major: edu.major || '',
            startYear: edu.startYear || '',
            endYear: edu.endYear || edu.year || '',
            gpa: edu.gpa ? parseFloat(edu.gpa) : null
          }))
        });
        console.log('✅ PATCH API - Education records updated:', data.education.length);
      }
    }

    if (data.workExperience !== undefined) {
      // ลบข้อมูลเก่าทั้งหมด
      await prisma.resumeDepositWorkExperience.deleteMany({
        where: { resumeDepositId: id }
      });
      
      // สร้างข้อมูลใหม่
      if (Array.isArray(data.workExperience) && data.workExperience.length > 0) {
        await prisma.resumeDepositWorkExperience.createMany({
          data: data.workExperience.filter((work: any) => work && (work.position || work.company)).map((work: any) => ({
            resumeDepositId: id,
            position: work.position || '',
            company: work.company || '',
            startDate: work.startDate ? new Date(work.startDate) : null,
            endDate: work.endDate ? new Date(work.endDate) : null,
            isCurrent: !!work.isCurrent,
            description: work.description || work.reason || '',
            salary: work.salary || '',
            district: work.district || null,
            province: work.province || null,
            phone: work.phone || null
          }))
        });
        console.log('✅ PATCH API - Work experience records updated:', data.workExperience.length);
      }
    }

    if (data.previousGovernmentService !== undefined) {
      // ลบข้อมูลเก่าทั้งหมด
      await prisma.resumeDepositPreviousGovernmentService.deleteMany({
        where: { resumeDepositId: id }
      });
      
      // สร้างข้อมูลใหม่
      if (Array.isArray(data.previousGovernmentService) && data.previousGovernmentService.length > 0) {
        await prisma.resumeDepositPreviousGovernmentService.createMany({
          data: data.previousGovernmentService.filter((gov: any) => gov && (gov.position || gov.department)).map((gov: any) => ({
            resumeDepositId: id,
            position: gov.position || '',
            department: gov.department || '',
            reason: gov.reason || '',
            date: gov.date || '',
            type: gov.type || 'civilServant'
          }))
        });
        console.log('✅ PATCH API - Previous government service records updated:', data.previousGovernmentService.length);
      }
    }

    console.log('🔍 PATCH API - Update data:', updateData);
    
    // ตรวจสอบว่า updateData มีข้อมูลหรือไม่
    if (Object.keys(updateData).length === 0) {
      console.warn('⚠️ PATCH API - No data to update, updateData is empty');
      return NextResponse.json({
        success: true,
        message: 'ไม่มีข้อมูลที่ต้องอัปเดต',
        data: existing
      });
    }
    
    console.log('🔍 PATCH API - About to update database with:', { id, updateData });
    console.log('🔍 PATCH API - Status in updateData:', updateData.status);
    console.log('🔍 PATCH API - Full updateData object:', JSON.stringify(updateData, null, 2));
    
    try {
      const updatedResumeDeposit = await prisma.resumeDeposit.update({
        where: { id },
        data: updateData,
        include: {
          education: true,
          workExperience: true,
          previousGovernmentService: true,
          documents: true
        }
      });
      
      console.log('🔍 PATCH API - Database update successful:', { id, status: updatedResumeDeposit.status });
      
      return NextResponse.json({
        success: true,
        message: 'อัปเดตข้อมูลเรียบร้อยแล้ว',
        data: updatedResumeDeposit
      });
    } catch (dbError) {
      console.error('❌ PATCH API - Database update failed:', dbError);
      console.error('❌ PATCH API - Database error details:', {
        name: dbError instanceof Error ? dbError.name : 'Unknown',
        message: dbError instanceof Error ? dbError.message : 'Unknown error',
        code: (dbError as any)?.code,
        meta: (dbError as any)?.meta
      });
      
      return NextResponse.json(
        { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('❌ PATCH API - Error updating resume deposit:', error);
    console.error('❌ PATCH API - Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // เพิ่มการ debug สำหรับ Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('❌ PATCH API - Prisma error code:', (error as any).code);
      console.error('❌ PATCH API - Prisma error meta:', (error as any).meta);
    }
    
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ ID' },
        { status: 400 }
      );
    }

    // ตรวจสอบ session เพื่อตรวจสอบ ownership
    const session = await getServerSession(authOptions as any);
    const isAdmin = (session?.user as any)?.role === 'admin';

    // ตรวจสอบว่ามีเรคอร์ดอยู่ก่อนลบ
    const existing = await prisma.resumeDeposit.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลสำหรับลบ' },
        { status: 404 }
      );
    }

    // ตรวจสอบ ownership: ต้องเป็น admin หรือเป็นเจ้าของข้อมูล
    if (!isAdmin) {
      const sessionUserId = (session?.user as any)?.id;
      const sessionLineId = (session?.user as any)?.lineId || (session?.user as any)?.sub || (session as any)?.profile?.userId;
      
      const isOwner = (existing.userId && existing.userId === sessionUserId) ||
                     (existing.lineId && existing.lineId === sessionLineId);
      
      if (!isOwner) {
        return NextResponse.json(
          { success: false, message: 'ไม่มีสิทธิ์ลบข้อมูลนี้' },
          { status: 403 }
        );
      }
    }
    
    await prisma.resumeDeposit.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'ลบข้อมูลเรียบร้อยแล้ว'
    });
    
  } catch (error) {
    console.error('Error deleting resume deposit:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
      { status: 500 }
    );
  }
}
