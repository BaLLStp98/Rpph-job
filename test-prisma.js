// Test Prisma connection and data
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔄 Testing Prisma connection...')
  
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Connected to database successfully')
    
    // Test users table
    const userCount = await prisma.user.count()
    console.log(`✅ Users table has ${userCount} records`)
    
    // Test application forms table
    const appCount = await prisma.applicationForm.count()
    console.log(`✅ Application forms table has ${appCount} records`)
    
    // Test hospital departments table
    const deptCount = await prisma.hospitalDepartment.count()
    console.log(`✅ Hospital departments table has ${deptCount} records`)
    
    // Test sample data
    const sampleUsers = await prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true
      }
    })
    
    console.log('📋 Sample users:')
    sampleUsers.forEach(user => {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.email}) - ${user.status}`)
    })
    
    // Test sample applications
    const sampleApps = await prisma.applicationForm.findMany({
      take: 3,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        appliedPosition: true,
        status: true
      }
    })
    
    console.log('📋 Sample applications:')
    sampleApps.forEach(app => {
      console.log(`  - ${app.firstName} ${app.lastName} - ${app.appliedPosition} (${app.status})`)
    })
    
    console.log('🎉 All tests passed! Prisma is working correctly.')
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.log('\nTroubleshooting:')
    console.log('1. Make sure MySQL is running')
    console.log('2. Check your DATABASE_URL in .env.local')
    console.log('3. Run: npx prisma db push')
    console.log('4. Run: node migrate-to-prisma.js')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
