// Migration script to move departments from JSON to database
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

// Helper function to convert date string to Date object
function convertDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr);
  } catch (error) {
    console.warn(`Invalid date format: ${dateStr}`);
    return null;
  }
}

// Helper function to convert status string to enum
function convertStatus(status) {
  switch (status?.toLowerCase()) {
    case 'active': return 'ACTIVE';
    case 'inactive': return 'INACTIVE';
    case 'pending': return 'PENDING';
    default: return 'ACTIVE';
  }
}

// Helper function to convert gender string to enum
function convertGender(gender) {
  switch (gender?.toLowerCase()) {
    case 'male': return 'MALE';
    case 'female': return 'FEMALE';
    case 'any': return 'UNKNOWN';
    default: return 'UNKNOWN';
  }
}

async function migrateDepartments() {
  try {
    console.log('🔄 Migrating departments from JSON to database...');
    
    // อ่านข้อมูลจากไฟล์ JSON
    const jsonData = JSON.parse(fs.readFileSync('data/departments-clean.json', 'utf8'));
    const departments = jsonData.departments;
    
    console.log(`📋 Found ${departments.length} departments in JSON file`);
    
    let addedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const dept of departments) {
      try {
        // ตรวจสอบว่ามีอยู่แล้วหรือไม่ (ใช้ id จาก JSON)
        const existing = await prisma.department.findUnique({
          where: { id: dept.id }
        });
        
        const departmentData = {
          name: dept.name || '',
          code: dept.code || '',
          description: dept.description || null,
          manager: dept.manager || null,
          managerEmail: dept.managerEmail || null,
          managerPhone: dept.managerPhone || null,
          location: dept.location || null,
          employeeCount: parseInt(dept.employeeCount) || 0,
          status: convertStatus(dept.status),
          salary: dept.salary || null,
          applicationStartDate: convertDate(dept.applicationStartDate),
          applicationEndDate: convertDate(dept.applicationEndDate),
          education: dept.education || null,
          gender: convertGender(dept.gender),
          positions: dept.positions || null,
          createdAt: convertDate(dept.createdAt) || new Date(),
          updatedAt: convertDate(dept.updatedAt) || new Date()
        };
        
        if (existing) {
          // อัปเดตข้อมูลที่มีอยู่
          await prisma.department.update({
            where: { id: dept.id },
            data: departmentData
          });
          console.log(`🔄 Updated: ${dept.name}`);
          updatedCount++;
        } else {
          // สร้างใหม่
          const newDept = await prisma.department.create({
            data: {
              id: dept.id, // ใช้ id จาก JSON
              ...departmentData
            }
          });
          console.log(`✅ Added: ${dept.name}`);
          addedCount++;
          
          // เพิ่ม attachments ถ้ามี
          if (dept.attachments && Array.isArray(dept.attachments)) {
            for (const attachment of dept.attachments) {
              await prisma.departmentAttachment.create({
                data: {
                  departmentId: newDept.id,
                  path: attachment.path || '',
                  filename: attachment.filename || ''
                }
              });
            }
            console.log(`  📎 Added ${dept.attachments.length} attachments`);
          }
        }
        
      } catch (error) {
        console.error(`❌ Error processing department ${dept.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Migration Summary:`);
    console.log(`   - Added: ${addedCount} departments`);
    console.log(`   - Updated: ${updatedCount} departments`);
    console.log(`   - Errors: ${errorCount} departments`);
    console.log(`   - Total processed: ${departments.length} departments`);
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// รัน migration
migrateDepartments();
