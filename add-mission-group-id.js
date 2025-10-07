const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMissionGroupId() {
  console.log('🔄 เพิ่มคอลัมน์ mission_group_id ในตาราง departments...\n');
  
  try {
    // เพิ่มคอลัมน์ mission_group_id
    await prisma.$executeRawUnsafe(`
      ALTER TABLE departments 
      ADD COLUMN mission_group_id VARCHAR(50) NULL
    `);
    
    console.log('✅ เพิ่มคอลัมน์ mission_group_id สำเร็จ');
    
    // เพิ่ม Foreign Key
    await prisma.$executeRawUnsafe(`
      ALTER TABLE departments 
      ADD CONSTRAINT departments_mission_group_id_fkey 
      FOREIGN KEY (mission_group_id) REFERENCES mission_groups(id) 
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
    
    console.log('✅ เพิ่ม Foreign Key สำเร็จ');
    
  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log('⚠️  คอลัมน์ mission_group_id มีอยู่แล้ว');
    } else if (error.message.includes('Duplicate key name')) {
      console.log('⚠️  Foreign Key มีอยู่แล้ว');
    } else {
      console.error('❌ เกิดข้อผิดพลาด:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// เรียกใช้ฟังก์ชัน
addMissionGroupId();
