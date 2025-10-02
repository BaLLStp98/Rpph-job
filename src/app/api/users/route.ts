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

// GET - ดึงข้อมูลผู้ใช้ทั้งหมด (สำหรับ admin เท่านั้น)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    
    const data = readUsersData();
    let users = data.users;

    // กรองตาม role
    if (role && role !== 'all') {
      users = users.filter((user: any) => user.role === role);
    }

    // กรองตาม status
    if (status && status !== 'all') {
      users = users.filter((user: any) => user.status === status);
    }

    // ไม่ส่ง password กลับไป
    const sanitizedUsers = users.map((user: any) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json({ users: sanitizedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - เพิ่มผู้ใช้ใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, firstName, lastName, role, department, phone } = body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!username || !email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const data = readUsersData();
    
    // ตรวจสอบว่า username หรือ email ซ้ำหรือไม่
    const existingUser = data.users.find((user: any) => 
      user.username === username || user.email === email
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }

    // เข้ารหัส password
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = {
      id: (data.users.length + 1).toString(),
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      status: 'active',
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: role === 'admin' || role === 'superadmin' 
        ? ['manage_applications', 'view_reports']
        : ['view_profile', 'edit_profile', 'submit_application'],
      department: department || null,
      phone: phone || null,
      profileImage: null
    };

    data.users.push(newUser);
    
    if (writeUsersData(data)) {
      // ส่งข้อมูลกลับโดยไม่มี password
      const { password: _, ...userWithoutPassword } = newUser;
      return NextResponse.json(userWithoutPassword, { status: 201 });
    } else {
      throw new Error('Failed to write data');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตข้อมูลผู้ใช้
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const data = readUsersData();
    const userIndex = data.users.findIndex((user: any) => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // อัปเดตข้อมูล
    data.users[userIndex] = {
      ...data.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // ถ้ามีการเปลี่ยน password ให้เข้ารหัสใหม่
    if (updateData.password) {
      data.users[userIndex].password = await bcrypt.hash(updateData.password, 10);
    }

    if (writeUsersData(data)) {
      // ส่งข้อมูลกลับโดยไม่มี password
      const { password, ...userWithoutPassword } = data.users[userIndex];
      return NextResponse.json(userWithoutPassword);
    } else {
      throw new Error('Failed to write data');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - ลบผู้ใช้
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const data = readUsersData();
    const userIndex = data.users.findIndex((user: any) => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // ลบผู้ใช้
    data.users.splice(userIndex, 1);

    if (writeUsersData(data)) {
      return NextResponse.json({ message: 'User deleted successfully' });
    } else {
      throw new Error('Failed to write data');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
