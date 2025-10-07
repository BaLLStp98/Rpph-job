const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testMissionGroups() {
  console.log('🧪 ทดสอบระบบกลุ่มภารกิจ...\n');
  
  try {
    // ทดสอบดึงข้อมูลกลุ่มภารกิจ
    console.log('📝 ทดสอบดึงข้อมูลกลุ่มภารกิจ:');
    const missionGroups = await prisma.$queryRawUnsafe(`
      SELECT id, name, code, \`order\`, status 
      FROM mission_groups 
      WHERE status = 'ACTIVE' 
      ORDER BY \`order\` ASC
    `);
    
    console.log(`✅ พบกลุ่มภารกิจ: ${missionGroups.length} กลุ่ม`);
    missionGroups.forEach(group => {
      console.log(`   - ${group.name} (${group.code}) - ลำดับ: ${group.order}`);
    });
    
    // ทดสอบดึงข้อมูลฝ่ายตามกลุ่มภารกิจ
    console.log('\n📝 ทดสอบดึงข้อมูลฝ่ายตามกลุ่มภารกิจ:');
    for (const group of missionGroups) {
      const departments = await prisma.$queryRawUnsafe(`
        SELECT id, name, code 
        FROM departments 
        WHERE mission_group_id = ? 
        ORDER BY name ASC
      `, group.id);
      
      console.log(`\n   📊 ${group.name}:`);
      console.log(`      จำนวนฝ่าย: ${departments.length} ฝ่าย`);
      departments.forEach(dept => {
        console.log(`      - ${dept.name} (${dept.code})`);
      });
    }
    
    // สถิติรวม
    console.log('\n📈 สถิติรวม:');
    const totalDepartments = await prisma.$queryRawUnsafe(`
      SELECT COUNT(*) as count FROM departments
    `);
    const departmentsWithMissionGroup = await prisma.$queryRawUnsafe(`
      SELECT COUNT(*) as count FROM departments WHERE mission_group_id IS NOT NULL
    `);
    
    console.log(`   - จำนวนฝ่ายทั้งหมด: ${totalDepartments[0].count} ฝ่าย`);
    console.log(`   - ฝ่ายที่มีกลุ่มภารกิจ: ${departmentsWithMissionGroup[0].count} ฝ่าย`);
    console.log(`   - ฝ่ายที่ไม่มีกลุ่มภารกิจ: ${totalDepartments[0].count - departmentsWithMissionGroup[0].count} ฝ่าย`);
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// เรียกใช้ฟังก์ชัน
testMissionGroups();
