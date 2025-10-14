import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const missionGroupId = searchParams.get('missionGroupId');
    const includeMissionGroup = searchParams.get('includeMissionGroup') === 'true';

    const departments = await prisma.hospitalDepartment.findMany({
      where: missionGroupId ? { missionGroupId: missionGroupId } : {},
      include: includeMissionGroup ? {
        missionGroup: true
      } : undefined,
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: departments,
      count: departments.length
    });

  } catch (error) {
    console.error('Error fetching hospital departments:', error);
    return NextResponse.json({
      success: false,
      error: 'ไม่สามารถดึงข้อมูลฝ่ายได้'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, missionGroupId } = body;

    if (!name) {
      return NextResponse.json({
        success: false,
        error: 'ชื่อฝ่ายเป็นข้อมูลที่จำเป็น'
      }, { status: 400 });
    }

    const department = await prisma.hospitalDepartment.create({
      data: {
        name,
        description,
        missionGroupId
      },
      include: {
        missionGroup: true
      }
    });

    return NextResponse.json({
      success: true,
      data: department,
      message: 'สร้างฝ่ายใหม่เรียบร้อยแล้ว'
    });

  } catch (error) {
    console.error('Error creating hospital department:', error);
    return NextResponse.json({
      success: false,
      error: 'ไม่สามารถสร้างฝ่ายใหม่ได้'
    }, { status: 500 });
  }
}