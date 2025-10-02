// Migration script to move data from JSON files to Prisma/MySQL database
// Run with: node migrate-to-prisma.js

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

// Read JSON data
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message)
    return []
  }
}

// Convert Thai date format to ISO string
function convertThaiDate(thaiDate) {
  if (!thaiDate) return null
  
  // Handle different date formats
  if (thaiDate.includes('/')) {
    const [day, month, year] = thaiDate.split('/')
    const buddhistYear = parseInt(year)
    const gregorianYear = buddhistYear - 543
    return new Date(gregorianYear, parseInt(month) - 1, parseInt(day))
  }
  
  return new Date(thaiDate)
}

// Convert gender string to enum
function convertGender(gender) {
  switch (gender) {
    case 'ชาย': return 'MALE'
    case 'หญิง': return 'FEMALE'
    default: return 'UNKNOWN'
  }
}

// Convert marital status string to enum
function convertMaritalStatus(status) {
  switch (status) {
    case 'โสด': return 'SINGLE'
    case 'สมรส': return 'MARRIED'
    case 'หย่า': return 'DIVORCED'
    case 'หม้าย': return 'WIDOWED'
    default: return 'UNKNOWN'
  }
}

// Convert user status string to enum
function convertUserStatus(status) {
  switch (status) {
    case 'รอดำเนินการ': return 'PENDING'
    case 'เปิดใช้งาน': return 'ACTIVE'
    case 'ปิดการใช้งาน': return 'INACTIVE'
    default: return 'PENDING'
  }
}

// Convert application status string to enum
function convertApplicationStatus(status) {
  switch (status) {
    case 'pending': return 'PENDING'
    case 'approved': return 'APPROVED'
    case 'rejected': return 'REJECTED'
    default: return 'PENDING'
  }
}

// Convert user role string to enum
function convertUserRole(role) {
  switch (role) {
    case 'เจ้าหน้าที่โรงพยาบาล': return 'HOSPITAL_STAFF'
    case 'ผู้สมัครงาน': return 'APPLICANT'
    default: return 'APPLICANT'
  }
}

// Migrate users from register.json
async function migrateUsers() {
  console.log('🔄 Migrating users from register.json...')
  
  const users = readJsonFile('./data/register.json')
  
  for (const user of users) {
    try {
      const userData = {
        id: user.id,
        lineId: user.lineId,
        prefix: user.prefix,
        firstName: user.firstName,
        lastName: user.lastName,
        lineDisplayName: user.lineDisplayName,
        email: user.email,
        phone: user.phone,
        gender: convertGender(user.gender),
        birthDate: convertThaiDate(user.birthDate),
        nationality: user.nationality,
        religion: user.religion,
        maritalStatus: convertMaritalStatus(user.maritalStatus),
        address: user.address,
        province: user.province,
        district: user.district,
        subDistrict: user.subDistrict,
        postalCode: user.postalCode,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
        isHospitalStaff: user.isHospitalStaff,
        hospitalDepartment: user.hospitalDepartment,
        username: user.username,
        password: user.password,
        profileImageUrl: user.profileImageUrl,
        status: convertUserStatus(user.status),
        department: user.department,
        role: convertUserRole(user.role),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      }

      // Create user
      const createdUser = await prisma.user.upsert({
        where: { id: user.id },
        update: userData,
        create: userData
      })

      // Migrate education
      if (user.educationList && user.educationList.length > 0) {
        // Delete existing education
        await prisma.userEducation.deleteMany({
          where: { userId: user.id }
        })
        
        // Create new education records
        for (const edu of user.educationList) {
          await prisma.userEducation.create({
            data: {
              userId: user.id,
              level: edu.level,
              school: edu.school,
              major: edu.major,
              startYear: edu.startYear,
              endYear: edu.endYear,
              gpa: edu.gpa ? parseFloat(edu.gpa) : null
            }
          })
        }
      }

      // Migrate work experience
      if (user.workList && user.workList.length > 0) {
        // Delete existing work experience
        await prisma.userWorkExperience.deleteMany({
          where: { userId: user.id }
        })
        
        // Create new work experience records
        for (const work of user.workList) {
          await prisma.userWorkExperience.create({
            data: {
              userId: user.id,
              position: work.position,
              company: work.company,
              startDate: convertThaiDate(work.startDate),
              endDate: convertThaiDate(work.endDate),
              isCurrent: work.isCurrent,
              description: work.description,
              salary: work.salary
            }
          })
        }
      }
      
      console.log(`✅ Migrated user: ${user.firstName} ${user.lastName}`)
    } catch (error) {
      console.error(`❌ Error migrating user ${user.id}:`, error.message)
    }
  }
  
  console.log(`✅ Migrated ${users.length} users successfully`)
}

// Migrate application forms from application-forms.json
async function migrateApplicationForms() {
  console.log('🔄 Migrating application forms from application-forms.json...')
  
  const applications = readJsonFile('./data/application-forms.json')
  
  for (const app of applications.applications) {
    try {
      // Try to find user by email
      let userId = null
      if (app.email) {
        const user = await prisma.user.findUnique({
          where: { email: app.email }
        })
        if (user) {
          userId = user.id
        }
      }

      const appData = {
        id: app.id,
        userId: userId,
        submittedAt: new Date(app.submittedAt),
        status: convertApplicationStatus(app.status),
        prefix: app.prefix,
        firstName: app.firstName,
        lastName: app.lastName,
        idNumber: app.idNumber,
        idCardIssuedAt: app.idCardIssuedAt,
        idCardIssueDate: convertThaiDate(app.idCardIssueDate),
        idCardExpiryDate: convertThaiDate(app.idCardExpiryDate),
        birthDate: convertThaiDate(app.birthDate),
        age: app.age ? parseInt(app.age) : null,
        race: app.race,
        placeOfBirth: app.placeOfBirth,
        gender: convertGender(app.gender),
        nationality: app.nationality,
        religion: app.religion,
        maritalStatus: convertMaritalStatus(app.maritalStatus),
        addressAccordingToHouseRegistration: app.addressAccordingToHouseRegistration,
        currentAddress: app.currentAddress,
        phone: app.phone,
        email: app.email,
        emergencyContact: app.emergencyContact,
        emergencyPhone: app.emergencyPhone,
        emergencyRelationship: app.emergencyRelationship,
        appliedPosition: app.appliedPosition,
        expectedSalary: app.expectedSalary,
        availableDate: convertThaiDate(app.availableDate),
        currentWork: app.currentWork,
        department: app.department,
        skills: app.skills,
        languages: app.languages,
        computerSkills: app.computerSkills,
        certificates: app.certificates,
        references: app.references,
        profileImage: app.profileImage,
        createdAt: new Date(app.submittedAt),
        updatedAt: new Date(app.updatedAt)
      }

      // Create application
      const createdApp = await prisma.applicationForm.upsert({
        where: { id: app.id },
        update: appData,
        create: appData
      })

      // Migrate education
      if (app.education && app.education.length > 0) {
        // Delete existing education
        await prisma.applicationEducation.deleteMany({
          where: { applicationId: app.id }
        })
        
        // Create new education records
        for (const edu of app.education) {
          await prisma.applicationEducation.create({
            data: {
              applicationId: app.id,
              level: edu.level,
              institution: edu.institution,
              major: edu.major,
              year: edu.year,
              gpa: edu.gpa ? parseFloat(edu.gpa) : null
            }
          })
        }
      }

      // Migrate work experience
      if (app.workExperience && app.workExperience.length > 0) {
        // Delete existing work experience
        await prisma.applicationWorkExperience.deleteMany({
          where: { applicationId: app.id }
        })
        
        // Create new work experience records
        for (const work of app.workExperience) {
          await prisma.applicationWorkExperience.create({
            data: {
              applicationId: app.id,
              position: work.position,
              company: work.company,
              startDate: convertThaiDate(work.startDate),
              endDate: convertThaiDate(work.endDate),
              salary: work.salary,
              reason: work.reason
            }
          })
        }
      }

      // Migrate documents
      if (app.documents) {
        // Delete existing documents
        await prisma.applicationDocument.deleteMany({
          where: { applicationId: app.id }
        })
        
        // Create new document records
        for (const [docType, fileName] of Object.entries(app.documents)) {
          if (fileName) {
            const documentType = docType.toUpperCase().replace(/([A-Z])/g, '_$1').substring(1)
            await prisma.applicationDocument.create({
              data: {
                applicationId: app.id,
                documentType: documentType,
                fileName: fileName
              }
            })
          }
        }
      }
      
      console.log(`✅ Migrated application: ${app.firstName} ${app.lastName}`)
    } catch (error) {
      console.error(`❌ Error migrating application ${app.id}:`, error.message)
    }
  }
  
  console.log(`✅ Migrated ${applications.applications.length} application forms successfully`)
}

// Migrate hospital departments
async function migrateHospitalDepartments() {
  console.log('🔄 Migrating hospital departments...')
  
  const departments = [
    { name: 'งานเทคโนโลยีสารสนเทศ', description: 'ดูแลระบบคอมพิวเตอร์และเทคโนโลยี' },
    { name: 'แผนกการเงินและบัญชี', description: 'จัดการด้านการเงินและบัญชี' },
    { name: 'แผนกการตลาด', description: 'ดูแลด้านการตลาดและประชาสัมพันธ์' },
    { name: 'แผนกผลิต', description: 'ดูแลการผลิตและควบคุมคุณภาพ' },
    { name: 'แผนกบุคคล', description: 'จัดการด้านทรัพยากรบุคคล' },
    { name: 'แผนกการแพทย์', description: 'ดูแลด้านการรักษาพยาบาล' },
    { name: 'แผนกเภสัชกรรม', description: 'ดูแลด้านยาและเภสัชกรรม' },
    { name: 'แผนกพยาบาล', description: 'ดูแลด้านการพยาบาล' }
  ]
  
  for (const dept of departments) {
    // Check if department exists
    const existing = await prisma.hospitalDepartment.findFirst({
      where: { name: dept.name }
    })
    
    if (!existing) {
      await prisma.hospitalDepartment.create({
        data: dept
      })
    }
  }
  
  console.log(`✅ Migrated ${departments.length} hospital departments successfully`)
}

// Main migration function
async function migrate() {
  try {
    console.log('🚀 Starting migration to Prisma/MySQL...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Run migrations
    await migrateHospitalDepartments()
    await migrateUsers()
    await migrateApplicationForms()
    
    console.log('🎉 Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate()
}

module.exports = { migrate, migrateUsers, migrateApplicationForms, migrateHospitalDepartments }
