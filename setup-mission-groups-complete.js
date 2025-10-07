const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ข้อมูลกลุ่มภารกิจทั้ง 4 กลุ่มจากภาพ
const missionGroups = [
  {
    id: 'mg_admin_001',
    name: 'กลุ่มภารกิจด้านอำนวยการ สนับสนุนบริการ และระบบคุณภาพ',
    code: 'ADMIN',
    description: 'Administrative Mission Group, Service Support, and Quality System',
    order: 1,
    status: 'ACTIVE'
  },
  {
    id: 'mg_primary_001',
    name: 'กลุ่มภารกิจด้านบริการปฐมภูมิ',
    code: 'PRIMARY',
    description: 'Primary Care Service Mission Group',
    order: 2,
    status: 'ACTIVE'
  },
  {
    id: 'mg_tertiary_001',
    name: 'กลุ่มภารกิจด้านบริการตติยภูมิ',
    code: 'TERTIARY',
    description: 'Tertiary Care Service Mission Group',
    order: 3,
    status: 'ACTIVE'
  },
  {
    id: 'mg_nursing_001',
    name: 'กลุ่มภารกิจด้านการพยาบาล',
    code: 'NURSING',
    description: 'Nursing Mission Group',
    order: 4,
    status: 'ACTIVE'
  }
];

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

async function setupMissionGroupsComplete() {
  console.log('🚀 เริ่มตั้งค่าระบบกลุ่มภารกิจและฝ่าย...\n');
  
  try {
    // ขั้นตอนที่ 1: เพิ่มกลุ่มภารกิจ
    console.log('📝 ขั้นตอนที่ 1: เพิ่มกลุ่มภารกิจทั้ง 4 กลุ่ม...\n');
    
    for (const group of missionGroups) {
      console.log(`📝 กำลังเพิ่มกลุ่มภารกิจ: ${group.name}`);
      
      await prisma.$executeRawUnsafe(`
        INSERT INTO mission_groups (id, name, code, description, \`order\`, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        code = VALUES(code),
        description = VALUES(description),
        \`order\` = VALUES(\`order\`),
        status = VALUES(status),
        updated_at = NOW()
      `, group.id, group.name, group.code, group.description, group.order, group.status);
      
      console.log(`✅ สำเร็จ: ${group.name} (รหัส: ${group.code})`);
    }
    
    console.log('\n🎉 เสร็จสิ้นการเพิ่มกลุ่มภารกิจทั้งหมด!\n');
    
    // ขั้นตอนที่ 2: อัปเดตฝ่ายให้เชื่อมโยงกับกลุ่มภารกิจ
    console.log('🔄 ขั้นตอนที่ 2: อัปเดตฝ่ายให้เชื่อมโยงกับกลุ่มภารกิจ...\n');
    
    // ดึงข้อมูลฝ่ายทั้งหมด
    const departments = await prisma.department.findMany({
      select: { id: true, name: true }
    });
    
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
        // อัปเดต mission_group_id
        await prisma.department.update({
          where: { id: department.id },
          data: { missionGroupId: missionGroupId }
        });
        
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
      const count = await prisma.department.count({
        where: { missionGroupId: groupId }
      });
      const groupName = missionGroups.find(g => g.id === groupId)?.name || groupId;
      console.log(`   - ${groupName}: ${count} ฝ่าย`);
    }
    
    // แสดงสถิติรวม
    const totalGroups = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM mission_groups');
    const activeGroups = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM mission_groups WHERE status = "ACTIVE"');
    
    console.log('\n📊 สถิติกลุ่มภารกิจ:');
    console.log(`   - จำนวนกลุ่มภารกิจทั้งหมด: ${totalGroups[0].count} กลุ่ม`);
    console.log(`   - กลุ่มภารกิจที่เปิดใช้งาน: ${activeGroups[0].count} กลุ่ม`);
    
    console.log('\n🎉 เสร็จสิ้นการตั้งค่าระบบกลุ่มภารกิจและฝ่าย!');
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// เรียกใช้ฟังก์ชัน
setupMissionGroupsComplete();
