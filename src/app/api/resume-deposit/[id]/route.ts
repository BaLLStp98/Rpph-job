import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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