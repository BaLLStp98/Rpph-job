const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// การแมปฝ่ายกับกลุ่มภารกิจตามภาพ
const departmentMissionGroupMapping = {
  // กลุ่มภารกิจด้านอำนวยการ สนับสนุนบริการ และระบบคุณภาพ
  'mg_admin_001': [
    'ฝ่ายบริหารงานทั่วไป',
    'ฝ่ายพัสดุ',
    'ฝ่ายงบประมาณการเงินและบัญชี',
    'ฝ่ายซ่อมบำรุง',
    'ฝ่ายวิชาการและแผนงาน',
    'ฝ่ายโภชนาการ',
    'กลุ่มงานพัฒนาคุณภาพ',
    'กลุ่มงานแพทยศาสตรศึกษา',
    'กลุ่มงานส่งเสริมการวิจัย'
  ],
  
  // กลุ่มภารกิจด้านบริการปฐมภูมิ
  'mg_primary_001': [
    'กลุ่มงานประกันสุขภาพ',
    'กลุ่มงานการแพทย์แผนไทยและการแพทย์ทางเลือก',
    'กลุ่มงานเวชศาสตร์ชุมชน',
    'กลุ่มงานอาชีวเวชกรรม'
  ],
  
  // กลุ่มภารกิจด้านบริการตติยภูมิ
  'mg_tertiary_001': [
    'กลุ่มงานเวชศาสตร์ฉุกเฉิน',
    'กลุ่มงานศัลยกรรม',
    'กลุ่มงานจักษุวิทยา',
    'กลุ่มงานกุมารเวชกรรม',
    'กลุ่มงานออร์โธปิดิกส์',
    'กลุ่มงานโสต ศอ นาสิก',
    'กลุ่มงานนิติเวชและพยาธิวิทยา',
    'กลุ่มงานอายุรกรรม',
    'กลุ่มงานสูติ - นรีเวชกรรม',
    'กลุ่มงานวิสัญญีวิทยา',
    'กลุ่มงานรังสีวิทยา',
    'กลุ่มงานจิตเวช',
    'กลุ่มงานเทคนิคการแพทย์',
    'กลุ่มงานเวชกรรมฟื้นฟู',
    'กลุ่มงานทันตกรรม',
    'กลุ่มงานเภสัชกรรม',
    'กลุ่มงานเวชศาสตร์ผู้สูงอายุ',
    'กลุ่มงานบริการการแพทย์ฉุกเฉินและรับส่งต่อ'
  ],
  
  // กลุ่มภารกิจด้านการพยาบาล
  'mg_nursing_001': [
    'กลุ่มงานการพยาบาลผู้ป่วยอุบัติฉุกเฉินและรับส่งต่อ',
    'กลุ่มงานการพยาบาลผู้คลอด',
    'กลุ่มงานการพยาบาลวิสัญญี',
    'กลุ่มงานการพยาบาลผู้ป่วยหนัก',
    'กลุ่มงานการพยาบาลผู้ป่วยห้องผ่าตัด',
    'กลุ่มงานการพยาบาลผู้ป่วยอายุรกรรม',
    'กลุ่มงานการพยาบาลด้านการควบคุมและป้องกันผู้ติดเชื้อ',
    'กลุ่มงานการพยาบาลผู้ป่วยศัลยกรรม',
    'กลุ่มงานการพยาบาลผู้ป่วยกุมารเวชกรรม',
    'กลุ่มงานการพยาบาลผู้ป่วยสูงอายุ',
    'กลุ่มงานการพยาบาลผู้ป่วยสูติ - นรีเวชกรรม',
    'กลุ่มงานการพยาบาลผู้ป่วยออร์โธปิดิกส์',
    'กลุ่มงานการพยาบาลตรวจรักษาพิเศษ',
    'กลุ่มงานการพยาบาลปฐมภูมิ',
    'กลุ่มงานการพยาบาลผู้ป่วยนอกตรวจโรคเฉพาะทาง',
    'กลุ่มงานวิจัยและพัฒนาการพยาบาล'
  ]
};

async function updateDepartmentsRaw() {
  console.log('🔄 เริ่มอัปเดตฝ่ายให้เชื่อมโยงกับกลุ่มภารกิจ...\n');
  
  try {
    // ดึงข้อมูลฝ่ายทั้งหมด
    const departments = await prisma.$queryRawUnsafe(`
      SELECT id, name FROM departments
    `);
    
    console.log(`📊 พบฝ่ายทั้งหมด: ${departments.length} ฝ่าย\n`);
    
    let updatedCount = 0;
    let notMatchedCount = 0;
    
    // อัปเดตแต่ละฝ่าย
    for (const department of departments) {
      let missionGroupId = null;
      
      // หา mission group ที่ตรงกับชื่อฝ่าย
      for (const [groupId, departmentNames] of Object.entries(departmentMissionGroupMapping)) {
        const matchedName = departmentNames.find(name => 
          department.name.includes(name) || name.includes(department.name)
        );
        
        if (matchedName) {
          missionGroupId = groupId;
          break;
        }
      }
      
      if (missionGroupId) {
        // อัปเดต mission_group_id ด้วย raw query
        await prisma.$executeRawUnsafe(`
          UPDATE departments 
          SET mission_group_id = ? 
          WHERE id = ?
        `, missionGroupId, department.id);
        
        console.log(`✅ อัปเดต: ${department.name} → กลุ่มภารกิจ ID: ${missionGroupId}`);
        updatedCount++;
      } else {
        console.log(`⚠️  ไม่พบกลุ่มภารกิจที่ตรงกับ: ${department.name}`);
        notMatchedCount++;
      }
    }
    
    console.log('\n📊 สรุปผลการอัปเดต:');
    console.log(`   - ฝ่ายที่อัปเดตสำเร็จ: ${updatedCount} ฝ่าย`);
    console.log(`   - ฝ่ายที่ไม่พบกลุ่มภารกิจที่ตรงกัน: ${notMatchedCount} ฝ่าย`);
    
    // แสดงสถิติตามกลุ่มภารกิจ
    console.log('\n📈 สถิติฝ่ายตามกลุ่มภารกิจ:');
    for (const [groupId, departmentNames] of Object.entries(departmentMissionGroupMapping)) {
      const result = await prisma.$queryRawUnsafe(`
        SELECT COUNT(*) as count FROM departments WHERE mission_group_id = ?
      `, groupId);
      console.log(`   - ${groupId}: ${result[0].count} ฝ่าย`);
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// เรียกใช้ฟังก์ชัน
updateDepartmentsRaw();
