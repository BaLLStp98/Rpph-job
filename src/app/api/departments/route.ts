import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET - ดึงข้อมูลแผนกทั้งหมดหรือแผนกเฉพาะ
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // ดึงข้อมูลแผนกเฉพาะ
      const department = await prisma.department.findUnique({
        where: { id: id },
        include: { attachments: true }
      });
      
      if (department) {
        return NextResponse.json({ department });
      } else {
        return NextResponse.json(
          { error: 'ไม่พบแผนกที่ต้องการ' },
          { status: 404 }
        );
      }
    } else {
      // ดึงข้อมูลแผนกทั้งหมด
      const departments = await prisma.department.findMany({
        include: { attachments: true },
        orderBy: { createdAt: 'desc' }
      });
      
      return NextResponse.json({ departments });
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลแผนก' },
      { status: 500 }
    );
  }
}

// POST - เพิ่มแผนกใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newDepartment = await prisma.department.create({
      data: {
        name: body.name,
        description: body.description,
        status: body.status || 'ACTIVE',
        positions: body.positions,
        salary: body.salary,
        requirements: body.requirements,
        benefits: body.benefits,
        applicationStartDate: body.applicationStartDate ? new Date(body.applicationStartDate) : null,
        applicationEndDate: body.applicationEndDate ? new Date(body.applicationEndDate) : null,
        attachments: {
          create: body.attachments || []
        }
      },
      include: { attachments: true }
    });
    
    return NextResponse.json(newDepartment, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเพิ่มแผนกใหม่' },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตข้อมูลแผนก
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ไม่พบ ID ของแผนก' },
        { status: 400 }
      );
    }
    
    // แปลงวันที่ถ้ามี
    if (updateData.applicationStartDate) {
      updateData.applicationStartDate = new Date(updateData.applicationStartDate);
    }
    if (updateData.applicationEndDate) {
      updateData.applicationEndDate = new Date(updateData.applicationEndDate);
    }
    
    const updatedDepartment = await prisma.department.update({
      where: { id: id },
      data: updateData,
      include: { attachments: true }
    });
    
    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.error('Error updating department:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'ไม่พบแผนกที่ต้องการอัปเดต' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลแผนก' },
      { status: 500 }
    );
  }
}

// DELETE - ลบแผนก
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ไม่พบ ID ของแผนก' },
        { status: 400 }
      );
    }
    
    await prisma.department.delete({
      where: { id: id }
    });
    
    return NextResponse.json({ message: 'ลบแผนกสำเร็จ' });
  } catch (error) {
    console.error('Error deleting department:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'ไม่พบแผนกที่ต้องการลบ' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบแผนก' },
      { status: 500 }
    );
  }
}
