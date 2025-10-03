import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
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
    
    const resumeDeposit = await prisma.resumeDeposit.findUnique({
      where: { id },
      include: {
        education: true,
        workExperience: true,
        previousGovernmentService: true,
        documents: true
      }
    });
    
    if (!resumeDeposit) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูล' },
        { status: 404 }
      );
    }
    
    // Debug: ตรวจสอบข้อมูล profileImage
    console.log('🔍 API Resume Deposit Debug:');
    console.log('• ID:', id);
    console.log('• ProfileImage:', resumeDeposit.profileImage);
    console.log('• ProfileImage Type:', typeof resumeDeposit.profileImage);
    console.log('• ProfileImage Length:', resumeDeposit.profileImage?.length);
    
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
        division: data.division || '',
        skills: data.skills || '',
        languages: data.languages || '',
        computerSkills: data.computerSkills || '',
        certificates: data.certificates || '',
        references: data.references || '',
        profileImage: data.profileImage || '',
        status: data.status || 'PENDING',
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
    console.error('Error updating resume deposit:', error);
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
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ ID' },
        { status: 400 }
      );
    }

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
    if (data.department !== undefined) updateData.department = data.department;
    if (data.spouse_first_name !== undefined) updateData.spouse_first_name = data.spouse_first_name;
    if (data.spouse_last_name !== undefined) updateData.spouse_last_name = data.spouse_last_name;
    if (data.staff_position !== undefined) updateData.staff_position = data.staff_position;
    if (data.staff_department !== undefined) updateData.staff_department = data.staff_department;
    if (data.staff_start_work !== undefined) updateData.staff_start_work = data.staff_start_work;

    // ตรวจสอบว่ามีเรคอร์ดอยู่ก่อนอัปเดต เพื่อหลีกเลี่ยง Prisma P2025
    const existing = await prisma.resumeDeposit.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลสำหรับอัปเดต' },
        { status: 404 }
      );
    }

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
    
    return NextResponse.json({
      success: true,
      message: 'อัปเดตข้อมูลเรียบร้อยแล้ว',
      data: updatedResumeDeposit
    });
    
  } catch (error) {
    console.error('Error updating resume deposit:', error);
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
