// Migration script to move data from JSON files to MySQL database
// Run with: node migrate-to-mysql.js

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root', // Change to your MySQL username
  password: '', // Change to your MySQL password
  database: 'rpph_job_system',
  charset: 'utf8mb4'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Read JSON data
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
}

// Migrate users from register.json
async function migrateUsers() {
  console.log('🔄 Migrating users from register.json...');
  
  const users = readJsonFile('./data/register.json');
  const connection = await pool.getConnection();
  
  try {
    for (const user of users) {
      const userData = {
        id: user.id,
        line_id: user.lineId,
        prefix: user.prefix,
        first_name: user.firstName,
        last_name: user.lastName,
        line_display_name: user.lineDisplayName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birth_date: user.birthDate,
        nationality: user.nationality,
        religion: user.religion,
        marital_status: user.maritalStatus,
        address: user.address,
        province: user.province,
        district: user.district,
        sub_district: user.subDistrict,
        postal_code: user.postalCode,
        emergency_contact: user.emergencyContact,
        emergency_phone: user.emergencyPhone,
        is_hospital_staff: user.isHospitalStaff,
        hospital_department: user.hospitalDepartment,
        username: user.username,
        password: user.password, // In production, hash this password
        profile_image_url: user.profileImageUrl,
        status: user.status,
        department: user.department,
        role: user.role,
        last_login: user.lastLogin,
        created_at: user.createdAt,
        updated_at: user.updatedAt
      };

      await connection.execute(`
        INSERT INTO users (
          id, line_id, prefix, first_name, last_name, line_display_name,
          email, phone, gender, birth_date, nationality, religion,
          marital_status, address, province, district, sub_district,
          postal_code, emergency_contact, emergency_phone, is_hospital_staff,
          hospital_department, username, password, profile_image_url,
          status, department, role, last_login, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          line_display_name = VALUES(line_display_name),
          email = VALUES(email),
          phone = VALUES(phone),
          updated_at = VALUES(updated_at)
      `, Object.values(userData));

      // Migrate education
      if (user.educationList && user.educationList.length > 0) {
        for (const edu of user.educationList) {
          await connection.execute(`
            INSERT INTO user_education (user_id, level, school, major, start_year, end_year, gpa)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [user.id, edu.level, edu.school, edu.major, edu.startYear, edu.endYear, edu.gpa]);
        }
      }

      // Migrate work experience
      if (user.workList && user.workList.length > 0) {
        for (const work of user.workList) {
          await connection.execute(`
            INSERT INTO user_work_experience (user_id, position, company, start_date, end_date, is_current, description, salary)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [user.id, work.position, work.company, work.startDate, work.endDate, work.isCurrent, work.description, work.salary]);
        }
      }
    }
    
    console.log(`✅ Migrated ${users.length} users successfully`);
  } catch (error) {
    console.error('❌ Error migrating users:', error);
  } finally {
    connection.release();
  }
}

// Migrate application forms from application-forms.json
async function migrateApplicationForms() {
  console.log('🔄 Migrating application forms from application-forms.json...');
  
  const applications = readJsonFile('./data/application-forms.json');
  const connection = await pool.getConnection();
  
  try {
    for (const app of applications.applications) {
      const appData = {
        id: app.id,
        user_id: null, // Will be linked by email or line_id if exists
        submitted_at: app.submittedAt,
        status: app.status,
        prefix: app.prefix,
        first_name: app.firstName,
        last_name: app.lastName,
        id_number: app.idNumber,
        id_card_issued_at: app.idCardIssuedAt,
        id_card_issue_date: app.idCardIssueDate,
        id_card_expiry_date: app.idCardExpiryDate,
        age: app.age,
        race: app.race,
        place_of_birth: app.placeOfBirth,
        gender: app.gender,
        nationality: app.nationality,
        religion: app.religion,
        marital_status: app.maritalStatus,
        address_according_to_house_registration: app.addressAccordingToHouseRegistration,
        current_address: app.currentAddress,
        phone: app.phone,
        email: app.email,
        emergency_contact: app.emergencyContact,
        emergency_phone: app.emergencyPhone,
        emergency_relationship: app.emergencyRelationship,
        applied_position: app.appliedPosition,
        expected_salary: app.expectedSalary,
        available_date: app.availableDate,
        current_work: app.currentWork,
        department: app.department,
        skills: app.skills,
        languages: app.languages,
        computer_skills: app.computerSkills,
        certificates: app.certificates,
        references: app.references,
        profile_image: app.profileImage,
        created_at: app.submittedAt,
        updated_at: app.updatedAt
      };

      // Try to find user by email first, then by line_id
      if (app.email) {
        const [userRows] = await connection.execute('SELECT id FROM users WHERE email = ?', [app.email]);
        if (userRows.length > 0) {
          appData.user_id = userRows[0].id;
        }
      }

      await connection.execute(`
        INSERT INTO application_forms (
          id, user_id, submitted_at, status, prefix, first_name, last_name,
          id_number, id_card_issued_at, id_card_issue_date, id_card_expiry_date,
          age, race, place_of_birth, gender, nationality, religion, marital_status,
          address_according_to_house_registration, current_address, phone, email,
          emergency_contact, emergency_phone, emergency_relationship,
          applied_position, expected_salary, available_date, current_work,
          department, skills, languages, computer_skills, certificates,
          references, profile_image, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          status = VALUES(status),
          updated_at = VALUES(updated_at)
      `, Object.values(appData));

      // Migrate education
      if (app.education && app.education.length > 0) {
        for (const edu of app.education) {
          await connection.execute(`
            INSERT INTO application_education (application_id, level, institution, major, year, gpa)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [app.id, edu.level, edu.institution, edu.major, edu.year, edu.gpa]);
        }
      }

      // Migrate work experience
      if (app.workExperience && app.workExperience.length > 0) {
        for (const work of app.workExperience) {
          await connection.execute(`
            INSERT INTO application_work_experience (application_id, position, company, start_date, end_date, salary, reason)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [app.id, work.position, work.company, work.startDate, work.endDate, work.salary, work.reason]);
        }
      }

      // Migrate documents
      if (app.documents) {
        for (const [docType, fileName] of Object.entries(app.documents)) {
          if (fileName) {
            await connection.execute(`
              INSERT INTO application_documents (application_id, document_type, file_name)
              VALUES (?, ?, ?)
            `, [app.id, docType, fileName]);
          }
        }
      }
    }
    
    console.log(`✅ Migrated ${applications.applications.length} application forms successfully`);
  } catch (error) {
    console.error('❌ Error migrating application forms:', error);
  } finally {
    connection.release();
  }
}

// Main migration function
async function migrate() {
  try {
    console.log('🚀 Starting migration to MySQL...');
    
    // Test database connection
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    connection.release();
    
    // Run migrations
    await migrateUsers();
    await migrateApplicationForms();
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
}

module.exports = { migrate, migrateUsers, migrateApplicationForms };
