// API route for MySQL users operations
// GET /api/mysql/users - Get all users
// POST /api/mysql/users - Create new user

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
    
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params = [];
    
    if (status || department) {
      const conditions = [];
      if (status) {
        conditions.push('status = ?');
        params.push(status);
      }
      if (department) {
        conditions.push('department = ?');
        params.push(department);
      }
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }
    
    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );
    const total = countResult[0].total;
    
    // Get users with pagination
    const [rows] = await pool.execute(`
      SELECT 
        id, line_id, prefix, first_name, last_name, line_display_name,
        email, phone, gender, birth_date, nationality, religion,
        marital_status, address, province, district, sub_district,
        postal_code, emergency_contact, emergency_phone, is_hospital_staff,
        hospital_department, username, profile_image_url, status,
        department, role, last_login, created_at, updated_at
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC 
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
    console.error('Error fetching users:', error);
    return Response.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const userData = await request.json();
    
    // Validate required fields
    if (!userData.first_name || !userData.last_name || !userData.email) {
      return Response.json(
        { success: false, message: 'กรุณากรอกข้อมูลที่จำเป็น' },
        { status: 400 }
      );
    }
    
    // Hash password if provided
    if (userData.password) {
      // In production, use bcrypt or similar
      // const hashedPassword = await bcrypt.hash(userData.password, 10);
      // userData.password = hashedPassword;
    }
    
    const [result] = await pool.execute(`
      INSERT INTO users (
        id, line_id, prefix, first_name, last_name, line_display_name,
        email, phone, gender, birth_date, nationality, religion,
        marital_status, address, province, district, sub_district,
        postal_code, emergency_contact, emergency_phone, is_hospital_staff,
        hospital_department, username, password, profile_image_url,
        status, department, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userData.id || Date.now().toString(),
      userData.line_id || null,
      userData.prefix || null,
      userData.first_name,
      userData.last_name,
      userData.line_display_name || null,
      userData.email,
      userData.phone || null,
      userData.gender || 'ไม่ระบุ',
      userData.birth_date || null,
      userData.nationality || 'ไทย',
      userData.religion || null,
      userData.marital_status || 'ไม่ระบุ',
      userData.address || null,
      userData.province || null,
      userData.district || null,
      userData.sub_district || null,
      userData.postal_code || null,
      userData.emergency_contact || null,
      userData.emergency_phone || null,
      userData.is_hospital_staff || false,
      userData.hospital_department || null,
      userData.username || null,
      userData.password || null,
      userData.profile_image_url || null,
      userData.status || 'รอดำเนินการ',
      userData.department || null,
      userData.role || 'ผู้สมัครงาน'
    ]);
    
    return Response.json({
      success: true,
      message: 'สร้างผู้ใช้เรียบร้อยแล้ว',
      userId: result.insertId
    });
    
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle duplicate key errors
    if (error.code === 'ER_DUP_ENTRY') {
      return Response.json(
        { success: false, message: 'อีเมลหรือชื่อผู้ใช้นี้มีอยู่แล้ว' },
        { status: 409 }
      );
    }
    
    return Response.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้' },
      { status: 500 }
    );
  }
}
