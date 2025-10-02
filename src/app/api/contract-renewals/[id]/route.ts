import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const contractRenewal = await prisma.contractRenewal.findUnique({
      where: { id },
      include: {
        attachments: true
      }
    });

    if (!contractRenewal) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลการต่อสัญญา' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contractRenewal
    });

  } catch (error) {
    console.error('Error fetching contract renewal:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const {
      status,
      notes,
      employeeName,
      department,
      position,
      newStartDate,
      newEndDate,
      contractStartDate,
      contractEndDate
    } = body;

    // ตรวจสอบสถานะที่ถูกต้อง
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'สถานะไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // อัปเดตข้อมูล
    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (employeeName !== undefined) updateData.employeeName = employeeName;
    if (department !== undefined) updateData.department = department;
    if (position !== undefined) updateData.position = position;
    // newSalary ถูกถอดออกจากฐานข้อมูลแล้ว ไม่ควรอัปเดต
    if (newStartDate !== undefined) updateData.newStartDate = newStartDate ? new Date(newStartDate) : null;
    if (newEndDate !== undefined) updateData.newEndDate = newEndDate ? new Date(newEndDate) : null;
    if (contractStartDate !== undefined) updateData.contractStartDate = contractStartDate ? new Date(contractStartDate) : null;
    if (contractEndDate !== undefined) updateData.contractEndDate = contractEndDate ? new Date(contractEndDate) : null;

    const { id } = await params
    const contractRenewal = await prisma.contractRenewal.update({
      where: { id },
      data: updateData,
      include: {
        attachments: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'อัปเดตข้อมูลเรียบร้อยแล้ว',
      data: contractRenewal
    });

  } catch (error) {
    console.error('Error updating contract renewal:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // ลบข้อมูลการต่อสัญญา (attachments จะถูกลบตาม cascade)
    await prisma.contractRenewal.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'ลบข้อมูลเรียบร้อยแล้ว'
    });

  } catch (error) {
    console.error('Error deleting contract renewal:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
