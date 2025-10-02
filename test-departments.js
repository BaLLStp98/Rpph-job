// Test script to add departments to database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDepartments() {
  try {
    console.log('🔄 Testing department operations...');
    
    // Test 1: Check if departments table exists
    console.log('📋 Checking departments table...');
    const count = await prisma.department.count();
    console.log(`✅ Found ${count} departments in database`);
    
    // Test 2: Add a test department
    console.log('📝 Adding test department...');
    const testDept = await prisma.department.create({
      data: {
        name: 'แผนกทดสอบ',
        code: 'TEST',
        description: 'แผนกสำหรับทดสอบระบบ',
        manager: 'ผู้จัดการทดสอบ',
        managerEmail: 'test@example.com',
        managerPhone: '080-000-0000',
        location: 'ชั้นทดสอบ',
        employeeCount: 1,
        status: 'ACTIVE',
        salary: '15,000 บาท',
        applicationStartDate: new Date('2024-01-01'),
        applicationEndDate: new Date('2024-12-31'),
        education: 'ปริญญาตรี',
        gender: 'UNKNOWN',
        positions: 'เจ้าหน้าที่ทดสอบ'
      }
    });
    console.log('✅ Test department created:', testDept.id);
    
    // Test 3: List all departments
    console.log('📋 Listing all departments...');
    const departments = await prisma.department.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    departments.forEach(dept => {
      console.log(`  - ${dept.name} (${dept.code}) - ${dept.status}`);
    });
    
    // Test 4: Clean up test department
    console.log('🧹 Cleaning up test department...');
    await prisma.department.delete({
      where: { id: testDept.id }
    });
    console.log('✅ Test department deleted');
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run test
testDepartments();
