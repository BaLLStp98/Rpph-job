// API route for MySQL applications operations
// GET /api/mysql/applications - Get all applications
// POST /api/mysql/applications - Create new application

import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rpph_job_system',
  charset: 'utf8mb4'
};

const pool = mysql.createPool(dbConfig);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    const search = searchParams.get('search');
    
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params = [];
    
    const conditions = [];
    
    if (status) {
      conditions.push('af.status = ?');
      params.push(status);
    }
    
    if (department) {
      conditions.push('af.department = ?');
      params.push(department);
    }
    
    if (search) {
      conditions.push('(af.first_name LIKE ? OR af.last_name LIKE ? OR af.email LIKE ? OR af.applied_position LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }
    
    // Get total count
    const [countResult] = await pool.execute(`
      SELECT COUNT(*) as total 
      FROM application_forms af 
      ${whereClause}
    `, params);
    const total = countResult[0].total;
    
    // Get applications with pagination
    const [rows] = await pool.execute(`
      SELECT 
        af.id, af.user_id, af.submitted_at, af.status, af.prefix,
        af.first_name, af.last_name, af.applied_position, af.expected_salary,
        af.email, af.phone, af.department, af.created_at, af.updated_at,
        u.line_display_name, u.profile_image_url
      FROM application_forms af
      LEFT JOIN users u ON af.user_id = u.id
      ${whereClause}
      ORDER BY af.submitted_at DESC 
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);
    
    return Response.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching applications:', error);
    return Response.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลใบสมัคร' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const applicationData = await request.json();
    
    // Validate required fields
    if (!applicationData.first_name || !applicationData.last_name || !applicationData.email) {
      return Response.json(
        { success: false, message: 'กรุณากรอกข้อมูลที่จำเป็น' },
        { status: 400 }
      );
    }
    
    const [result] = await pool.execute(`
      INSERT INTO application_forms (
        id, user_id, submitted_at, status, prefix, first_name, last_name,
        id_number, id_card_issued_at, id_card_issue_date, id_card_expiry_date,
        age, race, place_of_birth, gender, nationality, religion, marital_status,
        address_according_to_house_registration, current_address, phone, email,
        emergency_contact, emergency_phone, emergency_relationship,
        applied_position, expected_salary, available_date, current_work,
        department, skills, languages, computer_skills, certificates,
        references, profile_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      applicationData.id || Date.now().toString(),
      applicationData.user_id || null,
      applicationData.submitted_at || new Date().toISOString(),
      applicationData.status || 'pending',
      applicationData.prefix || null,
      applicationData.first_name,
      applicationData.last_name,
      applicationData.id_number || null,
      applicationData.id_card_issued_at || null,
      applicationData.id_card_issue_date || null,
      applicationData.id_card_expiry_date || null,
      applicationData.age || null,
      applicationData.race || null,
      applicationData.place_of_birth || null,
      applicationData.gender || 'ไม่ระบุ',
      applicationData.nationality || 'ไทย',
      applicationData.religion || null,
      applicationData.marital_status || 'ไม่ระบุ',
      applicationData.address_according_to_house_registration || null,
      applicationData.current_address || null,
      applicationData.phone || null,
      applicationData.email,
      applicationData.emergency_contact || null,
      applicationData.emergency_phone || null,
      applicationData.emergency_relationship || null,
      applicationData.applied_position || null,
      applicationData.expected_salary || null,
      applicationData.available_date || null,
      applicationData.current_work || false,
      applicationData.department || null,
      applicationData.skills || null,
      applicationData.languages || null,
      applicationData.computer_skills || null,
      applicationData.certificates || null,
      applicationData.references || null,
      applicationData.profile_image || null
    ]);
    
    const applicationId = result.insertId;
    
    // Insert education if provided
    if (applicationData.education && applicationData.education.length > 0) {
      for (const edu of applicationData.education) {
        await pool.execute(`
          INSERT INTO application_education (application_id, level, institution, major, year, gpa)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [applicationId, edu.level, edu.institution, edu.major, edu.year, edu.gpa]);
      }
    }
    
    // Insert work experience if provided
    if (applicationData.workExperience && applicationData.workExperience.length > 0) {
      for (const work of applicationData.workExperience) {
        await pool.execute(`
          INSERT INTO application_work_experience (application_id, position, company, start_date, end_date, salary, reason)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [applicationId, work.position, work.company, work.startDate, work.endDate, work.salary, work.reason]);
      }
    }
    
    return Response.json({
      success: true,
      message: 'สร้างใบสมัครเรียบร้อยแล้ว',
      applicationId: applicationId
    });
    
  } catch (error) {
    console.error('Error creating application:', error);
    return Response.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้างใบสมัคร' },
      { status: 500 }
    );
  }
}
