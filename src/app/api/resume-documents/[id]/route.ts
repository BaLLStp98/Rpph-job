import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parsedId = Number(id);
    if (!Number.isFinite(parsedId)) {
      return NextResponse.json(
        { success: false, message: 'รหัสเอกสารไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    await prisma.resumeDepositDocument.delete({ where: { id: parsedId } });

    return NextResponse.json({ success: true, message: 'ลบไฟล์แนบเรียบร้อยแล้ว' });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'ไม่พบไฟล์แนบที่ต้องการลบ' },
        { status: 404 }
      );
    }
    console.error('Error deleting resume document:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบไฟล์แนบ' },
      { status: 500 }
    );
  }
}


