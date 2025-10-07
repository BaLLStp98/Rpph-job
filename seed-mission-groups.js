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

async function seedMissionGroups() {
  console.log('🏥 เริ่มเพิ่มกลุ่มภารกิจทั้ง 4 กลุ่ม...\n');
  
  try {
    for (const group of missionGroups) {
      console.log(`📝 กำลังเพิ่มกลุ่มภารกิจ: ${group.name}`);
      
      const result = await prisma.$executeRawUnsafe(`
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
      console.log(`   - ID: ${group.id}`);
      console.log(`   - ลำดับ: ${group.order}`);
      console.log(`   - สถานะ: ${group.status}\n`);
    }
    
    console.log('🎉 เสร็จสิ้นการเพิ่มกลุ่มภารกิจทั้งหมด!');
    
    // แสดงสถิติรวม
    const totalGroups = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM mission_groups');
    const activeGroups = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM mission_groups WHERE status = "ACTIVE"');
    
    console.log('\n📊 สถิติกลุ่มภารกิจ:');
    console.log(`   - จำนวนกลุ่มภารกิจทั้งหมด: ${totalGroups[0].count} กลุ่ม`);
    console.log(`   - กลุ่มภารกิจที่เปิดใช้งาน: ${activeGroups[0].count} กลุ่ม`);
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// เรียกใช้ฟังก์ชัน
seedMissionGroups();
