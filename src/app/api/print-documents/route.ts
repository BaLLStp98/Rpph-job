import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { application } = await request.json();

    // สร้าง PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // สร้าง buffer สำหรับ PDF
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {});

    // เริ่มสร้าง PDF
    doc.fontSize(16).font('Helvetica-Bold').text('เอกสารแนบใบสมัครงาน', { align: 'center' });
    doc.fontSize(14).font('Helvetica').text(`ผู้สมัคร: ${application.prefix || ''} ${application.firstName} ${application.lastName}`, { align: 'center' });
    doc.fontSize(12).font('Helvetica').text(`ตำแหน่ง: ${application.appliedPosition}`, { align: 'center' });
    doc.moveDown();

    // รายการเอกสารแนบ
    doc.fontSize(14).font('Helvetica-Bold').text('รายการเอกสารแนบ:');
    doc.fontSize(12).font('Helvetica');
    doc.moveDown();

    if (application.documents) {
      let documentCount = 1;

      if (application.documents.idCard) {
        doc.text(`${documentCount}. สำเนาบัตรประชาชน`);
        doc.text(`   ไฟล์: ${application.documents.idCard}`);
        doc.moveDown();
        documentCount++;
      }

      if (application.documents.houseRegistration) {
        doc.text(`${documentCount}. สำเนาทะเบียนบ้าน`);
        doc.text(`   ไฟล์: ${application.documents.houseRegistration}`);
        doc.moveDown();
        documentCount++;
      }

      if (application.documents.educationCertificate) {
        doc.text(`${documentCount}. สำเนาหลักฐานการศึกษา`);
        doc.text(`   ไฟล์: ${application.documents.educationCertificate}`);
        doc.moveDown();
        documentCount++;
      }

      if (application.documents.medicalCertificate) {
        doc.text(`${documentCount}. ใบรับรองแพทย์`);
        doc.text(`   ไฟล์: ${application.documents.medicalCertificate}`);
        doc.moveDown();
        documentCount++;
      }

      if (application.documents.militaryCertificate) {
        doc.text(`${documentCount}. สำเนาหลักฐานทางทหาร`);
        doc.text(`   ไฟล์: ${application.documents.militaryCertificate}`);
        doc.moveDown();
        documentCount++;
      }

      if (application.documents.drivingLicense) {
        doc.text(`${documentCount}. ใบอนุญาตขับรถยนต์`);
        doc.text(`   ไฟล์: ${application.documents.drivingLicense}`);
        doc.moveDown();
        documentCount++;
      }

      if (application.documents.nameChangeCertificate) {
        doc.text(`${documentCount}. สำเนาหลักฐานการเปลี่ยนชื่อ`);
        doc.text(`   ไฟล์: ${application.documents.nameChangeCertificate}`);
        doc.moveDown();
        documentCount++;
      }
    }

    // ข้อมูลการตรวจสอบ
    doc.fontSize(14).font('Helvetica-Bold').text('ข้อมูลการตรวจสอบ:');
    doc.fontSize(12).font('Helvetica');
    doc.text(`วันที่ตรวจสอบ: ${new Date().toLocaleDateString('th-TH')}`);
    doc.text(`ผู้ตรวจสอบ: _________________`);
    doc.moveDown();

    // สถานะเอกสาร
    doc.fontSize(14).font('Helvetica-Bold').text('สถานะเอกสาร:');
    doc.fontSize(12).font('Helvetica');
    doc.text('□ ครบถ้วน');
    doc.text('□ ไม่ครบถ้วน');
    doc.text('□ ต้องแก้ไข');
    doc.moveDown();

    // หมายเหตุ
    doc.fontSize(14).font('Helvetica-Bold').text('หมายเหตุ:');
    doc.fontSize(12).font('Helvetica');
    doc.text('_________________________________________________________________');
    doc.text('_________________________________________________________________');
    doc.moveDown();

    // ลายเซ็น
    doc.fontSize(12).font('Helvetica').text('ลงชื่อผู้ตรวจสอบ: _________________', { align: 'right' });
    doc.text('วันที่: _________________', { align: 'right' });

    // สิ้นสุด PDF
    doc.end();

    // รอให้ PDF สร้างเสร็จ
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="documents_${application.id}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating documents PDF:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้าง PDF เอกสารแนบ' },
      { status: 500 }
    );
  }
} 