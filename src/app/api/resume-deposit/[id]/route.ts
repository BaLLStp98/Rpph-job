import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const resumeDeposit = await prisma.resumeDeposit.findUnique({
      where: { id },
      include: {
        education: true,
        workExperience: true,
        documents: true
      }
    });
    
    if (!resumeDeposit) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลการฝากประวัติ' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: resumeDeposit
    });
    
  } catch (error) {
    console.error('Error fetching resume deposit:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
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
    let updateData: any = {};
    const contentType = request.headers.get('content-type') || '';
    let profileImagePath: string | undefined;

    if (contentType.includes('multipart/form-data')) {
      // รองรับอัปเดตรูปพร้อมข้อมูลแบบ multipart
      const formData = await request.formData();
      const formDataJson = (formData.get('formData') as string) || '{}';
      updateData = JSON.parse(formDataJson || '{}');

      const profileImageFile = formData.get('profileImage') as File | null;
      if (profileImageFile && profileImageFile.size > 0) {
        try {
          const timestamp = Date.now();
          const fileExtension = profileImageFile.name.split('.').pop() || 'jpg';
          const fileName = `profile_${timestamp}.${fileExtension}`;
          
          console.log('🔍 PATCH API - Processing profile image:', profileImageFile.name, 'Size:', profileImageFile.size);
          console.log('🔍 PATCH API - Generated filename:', fileName);
          
          const uploadDir = path.join(process.cwd(), 'public', 'image');
          await mkdir(uploadDir, { recursive: true });
          const filePath = path.join(uploadDir, fileName);
          const bytes = await profileImageFile.arrayBuffer();
          const buffer = Buffer.from(bytes);
          await writeFile(filePath, buffer);
          
          console.log('✅ PATCH API - Profile image saved:', filePath);
          profileImagePath = fileName;
        } catch (e) {
          console.error('❌ PATCH API - Error saving profile image:', e);
        }
      } else {
        console.log('🔍 PATCH API - No profile image file provided');
      }
    } else {
      updateData = await request.json();
    }
    
    // Normalize enums and dates before update
    const mapGender = (g: any) => {
      if (g == null) return undefined;
      const v = String(g).trim();
      const upper = v.toUpperCase();
      if (upper === 'MALE' || v === 'ชาย') return 'MALE';
      if (upper === 'FEMALE' || v === 'หญิง') return 'FEMALE';
      return 'UNKNOWN';
    };
    const mapMarital = (m: any) => {
      if (m == null) return undefined;
      const v = String(m).trim();
      const upper = v.toUpperCase();
      if (upper === 'SINGLE' || v === 'โสด') return 'SINGLE';
      if (upper === 'MARRIED' || v === 'สมรส') return 'MARRIED';
      if (upper === 'DIVORCED' || v === 'หย่า') return 'DIVORCED';
      if (upper === 'WIDOWED' || v === 'หม้าย') return 'WIDOWED';
      return 'UNKNOWN';
    };
    const toDate = (d: any) => (d ? new Date(d) : null);

    if (Object.prototype.hasOwnProperty.call(updateData, 'gender')) {
      updateData.gender = mapGender(updateData.gender);
    }
    if (Object.prototype.hasOwnProperty.call(updateData, 'maritalStatus')) {
      updateData.maritalStatus = mapMarital(updateData.maritalStatus);
    }
    // Convert known date fields if provided
    ['birthDate','idCardIssueDate','idCardExpiryDate','availableDate'].forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(updateData, k)) {
        updateData[k] = toDate(updateData[k]);
      }
    });

    if (profileImagePath) {
      updateData.profileImageUrl = profileImagePath;
      console.log('🔍 PATCH API - Setting profileImageUrl:', profileImagePath);
    } else {
      console.log('🔍 PATCH API - No profileImagePath to set');
    }
    
    // Validate status if provided
    if (updateData.status) {
      const validStatuses = ['PENDING', 'REVIEWING', 'CONTACTED', 'HIRED', 'REJECTED', 'ARCHIVED'];
      if (!validStatuses.includes(updateData.status)) {
        return NextResponse.json(
          { success: false, message: 'สถานะไม่ถูกต้อง' },
          { status: 400 }
        );
      }
    }
    
    // Add review information if status is being updated
    if (updateData.status && updateData.status !== 'PENDING') {
      updateData.reviewedAt = new Date();
      // You might want to add reviewedBy from session data
    }
    
    // Extract nested relations from updateData
    const education = updateData.education;
    const workExperience = updateData.workExperience;
    const previousGovernmentService = updateData.previousGovernmentService;
    delete updateData.education;
    delete updateData.workExperience;
    delete updateData.previousGovernmentService;
    delete updateData.documents; // ลบข้อมูล documents ที่ไม่ถูกต้อง
    
    // Update the main resume deposit record
    const resumeDeposit = await prisma.resumeDeposit.update({
      where: { id },
      data: updateData,
      include: {
        education: true,
        workExperience: true,
        documents: true
      }
    });
    
    // Handle education updates
    if (education && Array.isArray(education)) {
      // Delete existing education records
      await prisma.resumeDepositEducation.deleteMany({
        where: { resumeDepositId: id }
      });
      
      // Create new education records
      if (education.length > 0) {
        await prisma.resumeDepositEducation.createMany({
          data: education.map((edu: any) => ({
            resumeDepositId: id,
            level: edu.level || '',
            school: edu.school || edu.institution || '',
            major: edu.major || '',
            startYear: edu.startYear || edu.year || null,
            endYear: edu.endYear || edu.year || null,
            gpa: edu.gpa ? parseFloat(edu.gpa) : null
          }))
        });
      }
    }
    
    // Handle work experience updates
    if (workExperience && Array.isArray(workExperience)) {
      // Delete existing work experience records
      await prisma.resumeDepositWorkExperience.deleteMany({
        where: { resumeDepositId: id }
      });
      
      // Create new work experience records
      if (workExperience.length > 0) {
        await prisma.resumeDepositWorkExperience.createMany({
          data: workExperience.map((work: any) => ({
            resumeDepositId: id,
            position: work.position || '',
            company: work.company || '',
            startDate: work.startDate ? new Date(work.startDate) : null,
            endDate: work.endDate ? new Date(work.endDate) : null,
            isCurrent: work.isCurrent || false,
            description: work.description || work.reason || '',
            salary: work.salary || ''
          }))
        });
      }
    }
    
    // Handle previous government service updates
    if (previousGovernmentService && Array.isArray(previousGovernmentService)) {
      // Delete existing previous government service records
      await prisma.resumeDepositPreviousGovernmentService.deleteMany({
        where: { resumeDepositId: id }
      });
      
      // Create new previous government service records
      if (previousGovernmentService.length > 0) {
        await prisma.resumeDepositPreviousGovernmentService.createMany({
          data: previousGovernmentService.map((gov: any) => ({
            resumeDepositId: id,
            position: gov.position || '',
            department: gov.department || '',
            reason: gov.reason || '',
            date: gov.date || ''
          }))
        });
      }
    }
    
    // Fetch the updated record with all relations
    const updatedResumeDeposit = await prisma.resumeDeposit.findUnique({
      where: { id },
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
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลการฝากประวัติที่ต้องการอัปเดต' },
        { status: 404 }
      );
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
    
    await prisma.resumeDeposit.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'ลบข้อมูลการฝากประวัติเรียบร้อยแล้ว'
    });
    
  } catch (error) {
    console.error('Error deleting resume deposit:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลการฝากประวัติที่ต้องการลบ' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
      { status: 500 }
    );
  }
}
