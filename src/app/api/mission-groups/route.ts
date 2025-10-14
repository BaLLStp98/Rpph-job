import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDepartments = searchParams.get('includeDepartments') === 'true';

    const missionGroups = await prisma.missionGroup.findMany({
      include: includeDepartments ? {
        hospitalDepartments: {
          orderBy: {
            name: 'asc'
          }
        }
      } : undefined,
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: missionGroups,
      count: missionGroups.length
    });

  } catch (error) {
    console.error('Error fetching mission groups:', error);
    return NextResponse.json({
      success: false,
      error: 'ไม่สามารถดึงข้อมูลกลุ่มภารกิจได้'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({
        success: false,
        error: 'ชื่อกลุ่มภารกิจเป็นข้อมูลที่จำเป็น'
      }, { status: 400 });
    }

    const missionGroup = await prisma.missionGroup.create({
      data: {
        name,
        description
      }
    });

    return NextResponse.json({
      success: true,
      data: missionGroup,
      message: 'สร้างกลุ่มภารกิจใหม่เรียบร้อยแล้ว'
    });

  } catch (error) {
    console.error('Error creating mission group:', error);
    return NextResponse.json({
      success: false,
      error: 'ไม่สามารถสร้างกลุ่มภารกิจใหม่ได้'
    }, { status: 500 });
  }
}