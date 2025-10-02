const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🏥 เริ่มเพิ่มแผนกใหม่ในโรงพยาบาล...\n');
  
  const departments = [
    {
      id: 'dept_cardio_001',
      name: 'แผนกศัลยกรรมหัวใจและทรวงอก',
      code: 'CARDIO',
      description: 'ให้บริการการผ่าตัดหัวใจและทรวงอก การรักษาโรคหัวใจและหลอดเลือด',
      manager: 'นพ.สมชาย หัวใจดี',
      managerEmail: 'somchai.cardio@hospital.com',
      managerPhone: '081-234-5678',
      location: 'ชั้น 5 อาคารศัลยกรรม',
      employeeCount: 25,
      status: 'ACTIVE',
      salary: '3,500,000 บาท',
      applicationStartDate: new Date('2024-02-01'),
      applicationEndDate: new Date('2024-03-01'),
      education: 'ปริญญาแพทยศาสตร์บัณฑิต และวุฒิบัตรเฉพาะทางด้านศัลยกรรมหัวใจและทรวงอก',
      gender: 'UNKNOWN',
      positions: 'แพทย์ศัลยกรรมหัวใจ, พยาบาลเฉพาะทาง, เจ้าหน้าที่เทคนิคการแพทย์'
    },
    {
      id: 'dept_pediatric_001',
      name: 'แผนกกุมารเวชศาสตร์',
      code: 'PEDIATRIC',
      description: 'ให้บริการการรักษาและดูแลสุขภาพเด็กตั้งแต่แรกเกิดจนถึง 15 ปี',
      manager: 'นพ.สมหญิง เด็กดี',
      managerEmail: 'somying.pediatric@hospital.com',
      managerPhone: '082-345-6789',
      location: 'ชั้น 3 อาคารผู้ป่วยนอก',
      employeeCount: 30,
      status: 'ACTIVE',
      salary: '2,800,000 บาท',
      applicationStartDate: new Date('2024-02-05'),
      applicationEndDate: new Date('2024-03-05'),
      education: 'ปริญญาแพทยศาสตร์บัณฑิต และวุฒิบัตรเฉพาะทางด้านกุมารเวชศาสตร์',
      gender: 'UNKNOWN',
      positions: 'แพทย์กุมารเวชศาสตร์, พยาบาลกุมารเวชศาสตร์, เจ้าหน้าที่เทคนิคการแพทย์'
    },
    {
      id: 'dept_obgyn_001',
      name: 'แผนกสูติศาสตร์-นรีเวชศาสตร์',
      code: 'OBGYN',
      description: 'ให้บริการการดูแลสุขภาพสตรี การตั้งครรภ์ การคลอด และการรักษาโรคทางนรีเวช',
      manager: 'นพ.สมศรี สตรีดี',
      managerEmail: 'somsri.obgyn@hospital.com',
      managerPhone: '083-456-7890',
      location: 'ชั้น 4 อาคารผู้ป่วยนอก',
      employeeCount: 20,
      status: 'ACTIVE',
      salary: '3,200,000 บาท',
      applicationStartDate: new Date('2024-02-10'),
      applicationEndDate: new Date('2024-03-10'),
      education: 'ปริญญาแพทยศาสตร์บัณฑิต และวุฒิบัตรเฉพาะทางด้านสูติศาสตร์-นรีเวชศาสตร์',
      gender: 'FEMALE',
      positions: 'แพทย์สูติศาสตร์-นรีเวชศาสตร์, พยาบาลสูติศาสตร์, เจ้าหน้าที่เทคนิคการแพทย์'
    },
    {
      id: 'dept_internal_001',
      name: 'แผนกอายุรศาสตร์',
      code: 'INTERNAL',
      description: 'ให้บริการการรักษาโรคภายในในผู้ใหญ่ การวินิจฉัยและการรักษาโรคเรื้อรัง',
      manager: 'นพ.สมศักดิ์ อายุดี',
      managerEmail: 'somsak.internal@hospital.com',
      managerPhone: '084-567-8901',
      location: 'ชั้น 2 อาคารผู้ป่วยนอก',
      employeeCount: 35,
      status: 'ACTIVE',
      salary: '2,500,000 บาท',
      applicationStartDate: new Date('2024-02-15'),
      applicationEndDate: new Date('2024-03-15'),
      education: 'ปริญญาแพทยศาสตร์บัณฑิต และวุฒิบัตรเฉพาะทางด้านอายุรศาสตร์',
      gender: 'UNKNOWN',
      positions: 'แพทย์อายุรศาสตร์, พยาบาลอายุรศาสตร์, เจ้าหน้าที่เทคนิคการแพทย์'
    },
    {
      id: 'dept_surgery_001',
      name: 'แผนกศัลยกรรมทั่วไป',
      code: 'SURGERY',
      description: 'ให้บริการการผ่าตัดทั่วไป การรักษาโรคที่ต้องใช้การผ่าตัด',
      manager: 'นพ.สมบัติ ศัลยกรรมดี',
      managerEmail: 'sombat.surgery@hospital.com',
      managerPhone: '085-678-9012',
      location: 'ชั้น 6 อาคารศัลยกรรม',
      employeeCount: 40,
      status: 'ACTIVE',
      salary: '3,000,000 บาท',
      applicationStartDate: new Date('2024-02-20'),
      applicationEndDate: new Date('2024-03-20'),
      education: 'ปริญญาแพทยศาสตร์บัณฑิต และวุฒิบัตรเฉพาะทางด้านศัลยกรรมทั่วไป',
      gender: 'UNKNOWN',
      positions: 'แพทย์ศัลยกรรมทั่วไป, พยาบาลศัลยกรรม, เจ้าหน้าที่เทคนิคการแพทย์'
    },
    {
      id: 'dept_psychiatry_001',
      name: 'แผนกจิตเวชศาสตร์',
      code: 'PSYCHIATRY',
      description: 'ให้บริการการรักษาและดูแลสุขภาพจิต การบำบัดทางจิตเวช',
      manager: 'นพ.สมใจ จิตดี',
      managerEmail: 'somjai.psychiatry@hospital.com',
      managerPhone: '086-789-0123',
      location: 'ชั้น 1 อาคารผู้ป่วยนอก',
      employeeCount: 15,
      status: 'ACTIVE',
      salary: '2,200,000 บาท',
      applicationStartDate: new Date('2024-02-25'),
      applicationEndDate: new Date('2024-03-25'),
      education: 'ปริญญาแพทยศาสตร์บัณฑิต และวุฒิบัตรเฉพาะทางด้านจิตเวชศาสตร์',
      gender: 'UNKNOWN',
      positions: 'แพทย์จิตเวชศาสตร์, พยาบาลจิตเวชศาสตร์, นักจิตวิทยาคลินิก'
    },
    {
      id: 'dept_radiology_001',
      name: 'แผนกรังสีวิทยา',
      code: 'RADIOLOGY',
      description: 'ให้บริการการตรวจวินิจฉัยด้วยรังสี X-ray, CT, MRI, Ultrasound',
      manager: 'นพ.สมรัง รังสีดี',
      managerEmail: 'somrang.radiology@hospital.com',
      managerPhone: '087-890-1234',
      location: 'ชั้นใต้ดิน อาคารตรวจวินิจฉัย',
      employeeCount: 18,
      status: 'ACTIVE',
      salary: '2,600,000 บาท',
      applicationStartDate: new Date('2024-03-01'),
      applicationEndDate: new Date('2024-04-01'),
      education: 'ปริญญาแพทยศาสตร์บัณฑิต และวุฒิบัตรเฉพาะทางด้านรังสีวิทยา',
      gender: 'UNKNOWN',
      positions: 'แพทย์รังสีวิทยา, เทคนิคการแพทย์รังสี, เจ้าหน้าที่เทคนิคการแพทย์'
    },
    {
      id: 'dept_lab_001',
      name: 'แผนกห้องปฏิบัติการ',
      code: 'LAB',
      description: 'ให้บริการการตรวจวิเคราะห์ทางห้องปฏิบัติการ การตรวจเลือด ตรวจปัสสาวะ และการตรวจทางจุลชีววิทยา',
      manager: 'นพ.สมทดลอง ทดลองดี',
      managerEmail: 'somtadlong.lab@hospital.com',
      managerPhone: '088-901-2345',
      location: 'ชั้น 1 อาคารห้องปฏิบัติการ',
      employeeCount: 22,
      status: 'ACTIVE',
      salary: '2,000,000 บาท',
      applicationStartDate: new Date('2024-03-05'),
      applicationEndDate: new Date('2024-04-05'),
      education: 'ปริญญาตรี สาขาเทคนิคการแพทย์ หรือสาขาที่เกี่ยวข้อง',
      gender: 'UNKNOWN',
      positions: 'เทคนิคการแพทย์, นักวิทยาศาสตร์การแพทย์, เจ้าหน้าที่ห้องปฏิบัติการ'
    }
  ];

  try {
    for (const department of departments) {
      console.log(`📝 กำลังเพิ่มแผนก: ${department.name}`);
      
      const result = await prisma.department.upsert({
        where: { id: department.id },
        update: department,
        create: department
      });
      
      console.log(`✅ สำเร็จ: ${result.name} (รหัส: ${result.code})`);
      console.log(`   - จำนวนตำแหน่ง: ${result.employeeCount} ตำแหน่ง`);
      console.log(`   - หัวหน้าแผนก: ${result.manager}`);
      console.log(`   - สถานะ: ${result.status}\n`);
    }
    
    console.log('🎉 เสร็จสิ้นการเพิ่มแผนกใหม่ทั้งหมด!');
    
    // แสดงสถิติรวม
    const totalDepartments = await prisma.department.count();
    const activeDepartments = await prisma.department.count({
      where: { status: 'ACTIVE' }
    });
    
    console.log('\n📊 สถิติแผนกทั้งหมด:');
    console.log(`   - จำนวนแผนกทั้งหมด: ${totalDepartments} แผนก`);
    console.log(`   - แผนกที่เปิดใช้งาน: ${activeDepartments} แผนก`);
    console.log(`   - แผนกที่ปิดใช้งาน: ${totalDepartments - activeDepartments} แผนก`);
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
