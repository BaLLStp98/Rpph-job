import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dataFilePath = path.join(process.cwd(), 'data', 'users.json');

// Helper function to read users data
function readUsersData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(data);
    }
    return { users: [] };
  } catch (error) {
    console.error('Error reading users data:', error);
    return { users: [] };
  }
}

// Helper function to write users data
function writeUsersData(data: any) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing users data:', error);
    return false;
  }
}

// POST - ตรวจสอบการเข้าสู่ระบบ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const data = readUsersData();
    
    // ค้นหาผู้ใช้
    const user = data.users.find((u: any) => 
      u.username === username || u.email === username
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // ตรวจสอบสถานะผู้ใช้
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: 'Account is not active' },
        { status: 401 }
      );
    }

    // ตรวจสอบ password
    let isValidPassword = false;
    
    // สำหรับการทดสอบ - ตรวจสอบรหัสผ่านแบบ plain text ก่อน
    if (user.password === password) {
      isValidPassword = true;
    } else {
      // ถ้าไม่ตรงกับ plain text ให้ลองใช้ bcrypt.compare
      try {
        isValidPassword = await bcrypt.compare(password, user.password);
      } catch (error) {
        console.log('Bcrypt comparison failed, using plain text');
        isValidPassword = false;
      }
    }
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // อัปเดต lastLogin
    user.lastLogin = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    
    if (writeUsersData(data)) {
      // ส่งข้อมูลกลับโดยไม่มี password
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        message: 'Login successful'
      });
    } else {
      // แม้ว่าจะบันทึก lastLogin ไม่สำเร็จ แต่ยังคงให้เข้าสู่ระบบได้
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        message: 'Login successful'
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - ตรวจสอบข้อมูลผู้ใช้ตาม ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!id && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }

    const data = readUsersData();
    
    let user;
    if (id) {
      user = data.users.find((u: any) => u.id === id);
    } else if (email) {
      user = data.users.find((u: any) => u.email === email);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // ส่งข้อมูลกลับโดยไม่มี password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
