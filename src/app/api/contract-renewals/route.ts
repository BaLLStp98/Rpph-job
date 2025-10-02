import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // รับข้อมูลจาก form
    const prefix = formData.get('prefix') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const department = formData.get('department') as string;
    const position = formData.get('position') as string;
    const newStartDate = formData.get('newStartDate') as string;
    const newEndDate = formData.get('newEndDate') as string;
    const contractStartDate = formData.get('contractStartDate') as string;
    const contractEndDate = formData.get('contractEndDate') as string;
    const notes = formData.get('notes') as string;
    const file = formData.get('file') as File | null;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!prefix || !firstName || !lastName || !department || !position) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // สร้าง employeeId (ใช้ชื่อ-นามสกุล-วันที่ปัจจุบัน)
    const employeeId = `${firstName}-${lastName}-${Date.now()}`;
    const employeeName = `${prefix}${firstName} ${lastName}`;

    // บันทึกข้อมูลการต่อสัญญา
    const contractRenewal = await prisma.contractRenewal.create({
      data: {
        employeeId,
        employeeName,
        department,
        position,
        newStartDate: newStartDate ? new Date(newStartDate) : null,
        newEndDate: newEndDate ? new Date(newEndDate) : null,
        contractStartDate: contractStartDate ? new Date(contractStartDate) : null,
        contractEndDate: contractEndDate ? new Date(contractEndDate) : null,
        notes,
        status: 'PENDING'
      }
    });

    // จัดการไฟล์แนบ
    if (file && file.size > 0) {
      try {
        // สร้างโฟลเดอร์สำหรับเก็บไฟล์
        const uploadDir = join(process.cwd(), 'public', 'contract-renewals');
        await mkdir(uploadDir, { recursive: true });

        // สร้างชื่อไฟล์ที่ไม่ซ้ำ
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${contractRenewal.id}-${timestamp}.${fileExtension}`;
        const filePath = join(uploadDir, fileName);

        // บันทึกไฟล์
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // บันทึกข้อมูลไฟล์ในฐานข้อมูล
        await prisma.contractRenewalAttachment.create({
          data: {
            contractRenewalId: contractRenewal.id,
            fileName: file.name,
            filePath: `/contract-renewals/${fileName}`,
            mimeType: file.type,
            fileSize: file.size
          }
        });
      } catch (fileError) {
        console.error('Error saving file:', fileError);
        // ไม่ต้อง return error เพราะข้อมูลหลักบันทึกแล้ว
      }
    }

    return NextResponse.json({
      success: true,
      message: 'บันทึกข้อมูลการต่อสัญญาเรียบร้อยแล้ว',
      data: {
        id: contractRenewal.id,
        employeeName: contractRenewal.employeeName,
        department: contractRenewal.department,
        position: contractRenewal.position,
        status: contractRenewal.status
      }
    });

  } catch (error) {
    console.error('Error creating contract renewal:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
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

    const skip = (page - 1) * limit;

    // สร้าง where condition
    const where = status ? { status: status as any } : {};

    // ดึงข้อมูลการต่อสัญญา
    const contractRenewals = await prisma.contractRenewal.findMany({
      where,
      include: {
        attachments: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // นับจำนวนทั้งหมด
    const total = await prisma.contractRenewal.count({ where });

    return NextResponse.json({
      success: true,
      data: contractRenewals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching contract renewals:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
