import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

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
    doc.fontSize(16).font('Helvetica-Bold').text('ใบสมัครเข้ารับราชการเป็นบุคคลภายนอกช่วยปฏิบัติราชการ', { align: 'center' });
    doc.fontSize(14).font('Helvetica').text('ของโรงพยาบาลราชพิพัฒน์ สำนักการแพทย์ กรุงเทพมหานคร', { align: 'center' });
    doc.moveDown();

    // ส่วนข้อมูลส่วนตัว
    doc.fontSize(14).font('Helvetica-Bold').text('๑. ประวัติส่วนตัว');
    doc.fontSize(12).font('Helvetica');
    
    // ข้อมูลส่วนตัว
    doc.text(`ชื่อ: ${application.prefix || ''} ${application.firstName} ${application.lastName}`);
    doc.text(`อีเมล: ${application.email}`);
    doc.text(`เบอร์โทรศัพท์: ${application.phone}`);
    doc.text(`วันเกิด: ${application.birthDate}`);
    doc.text(`เพศ: ${application.gender}`);
    doc.text(`ที่อยู่ปัจจุบัน: ${application.currentAddress}`);
    doc.moveDown();

    // ข้อมูลตำแหน่งที่สมัคร
    doc.fontSize(14).font('Helvetica-Bold').text('ตำแหน่งที่สมัคร');
    doc.fontSize(12).font('Helvetica');
    doc.text(`ตำแหน่ง: ${application.appliedPosition}`);
    doc.text(`เงินเดือนที่คาดหวัง: ${application.expectedSalary}`);
    doc.moveDown();

    // ข้อมูลการศึกษา
    if (application.education && application.education.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('๑.๗ ประวัติการศึกษา');
      doc.fontSize(12).font('Helvetica');
      
      application.education.forEach((edu: any, index) => {
        doc.text(`การศึกษา #${index + 1}:`);
        doc.text(`  ระดับการศึกษา: ${edu.level || '-'}`);
        doc.text(`  สถาบันการศึกษา: ${edu.institution || edu.school || '-'}`);
        doc.text(`  สาขาวิชา: ${edu.major || '-'}`);
        doc.text(`  ปีที่จบ: ${edu.year || edu.graduationYear || '-'}`);
        doc.text(`  เกรดเฉลี่ย: ${edu.gpa || '-'}`);
        doc.moveDown();
      });
    }

    // ข้อมูลประสบการณ์การทำงาน
    if (application.workExperience && application.workExperience.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('๑.๘ ประสบการณ์การทำงาน');
      doc.fontSize(12).font('Helvetica');
      
      application.workExperience.forEach((work: any, index) => {
        doc.text(`ประสบการณ์การทำงาน #${index + 1}:`);
        doc.text(`  ตำแหน่ง: ${work.position}`);
        doc.text(`  บริษัท: ${work.company}`);
        doc.text(`  ระยะเวลา: ${work.startDate} - ${work.endDate}`);
        doc.text(`  เงินเดือน: ${work.salary || '-'}`);
        if (work.description || work.reason) {
          doc.text(`  รายละเอียด: ${work.description || work.reason}`);
        }
        doc.moveDown();
      });
    }

    // ข้อมูลเอกสารแนบ
    if (application.documents) {
      doc.fontSize(14).font('Helvetica-Bold').text('เอกสารแนบ');
      doc.fontSize(12).font('Helvetica');
      
      if (application.documents.idCard) {
        doc.text(`• สำเนาบัตรประชาชน: ${application.documents.idCard}`);
      }
      if (application.documents.houseRegistration) {
        doc.text(`• สำเนาทะเบียนบ้าน: ${application.documents.houseRegistration}`);
      }
      if (application.documents.educationCertificate) {
        doc.text(`• สำเนาหลักฐานการศึกษา: ${application.documents.educationCertificate}`);
      }
      if (application.documents.medicalCertificate) {
        doc.text(`• ใบรับรองแพทย์: ${application.documents.medicalCertificate}`);
      }
      doc.moveDown();
    }

    // ข้อมูลการสมัคร
    doc.fontSize(14).font('Helvetica-Bold').text('ข้อมูลการสมัคร');
    doc.fontSize(12).font('Helvetica');
    doc.text(`วันที่สมัคร: ${new Date(application.submittedAt).toLocaleDateString('th-TH')}`);
    doc.text(`สถานะ: ${application.status}`);
    doc.moveDown();

    // ลายเซ็น
    doc.fontSize(12).font('Helvetica').text('ลงชื่อผู้สมัคร: _________________', { align: 'right' });
    doc.text('วันที่: _________________', { align: 'right' });

    // สิ้นสุด PDF
    doc.end();

    // รอให้ PDF สร้างเสร็จ
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="application_${application.id}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้าง PDF' },
      { status: 500 }
    );
  }
} 