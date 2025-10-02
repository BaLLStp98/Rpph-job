// API route for individual user operations
// GET /api/mysql/users/[id] - Get user by ID
// PUT /api/mysql/users/[id] - Update user
// DELETE /api/mysql/users/[id] - Delete user

import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rpph_job_system',
  charset: 'utf8mb4'
};

const pool = mysql.createPool(dbConfig);

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Get user with details using stored procedure
    const [rows] = await pool.execute('CALL GetUserWithDetails(?)', [id]);
    
    if (rows[0].length === 0) {
      return Response.json(
        { success: false, message: 'ไม่พบข้อมูลผู้ใช้' },
        { status: 404 }
      );
    }
    
    const user = rows[0][0];
    const education = rows[1] || [];
    const workExperience = rows[2] || [];
    
    return Response.json({
      success: true,
      data: {
        ...user,
        education,
        workExperience
      }
    });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return Response.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;
    
    // Build dynamic update query
    const updateFields = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });
    
    if (updateFields.length === 0) {
      return Response.json(
        { success: false, message: 'ไม่มีข้อมูลที่จะอัปเดต' },
        { status: 400 }
      );
    }
    
    values.push(id);
    
    const [result] = await pool.execute(`
      UPDATE users 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, values);
    
    if (result.affectedRows === 0) {
      return Response.json(
        { success: false, message: 'ไม่พบข้อมูลผู้ใช้ที่ต้องการอัปเดต' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      message: 'อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว'
    });
    
  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return Response.json(
        { success: false, message: 'ไม่พบข้อมูลผู้ใช้ที่ต้องการลบ' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      message: 'ลบข้อมูลผู้ใช้เรียบร้อยแล้ว'
    });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบข้อมูลผู้ใช้' },
      { status: 500 }
    );
  }
}
