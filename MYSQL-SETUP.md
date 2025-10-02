# การติดตั้งฐานข้อมูล MySQL สำหรับระบบสมัครงาน RPPH

## ข้อกำหนดระบบ
- MySQL 8.0 หรือใหม่กว่า
- Node.js 18 หรือใหม่กว่า
- ข้อมูล JSON จากระบบเดิม

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง MySQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS (ใช้ Homebrew)
brew install mysql

# Windows
# ดาวน์โหลดจาก https://dev.mysql.com/downloads/mysql/
```

### 2. ตั้งค่า MySQL
```bash
# เริ่มต้น MySQL
sudo systemctl start mysql  # Linux
brew services start mysql   # macOS

# เข้าสู่ระบบ MySQL
mysql -u root -p

# สร้างผู้ใช้ใหม่ (แนะนำ)
CREATE USER 'rpph_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON rpph_job_system.* TO 'rpph_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. สร้างฐานข้อมูล
```bash
# รัน SQL schema
mysql -u root -p < database-schema.sql

# หรือใช้ผู้ใช้ที่สร้างใหม่
mysql -u rpph_user -p < database-schema.sql
```

### 4. ติดตั้ง Dependencies
```bash
# ติดตั้ง MySQL driver
npm install mysql2

# หรือใช้ไฟล์ package-mysql.json
cp package-mysql.json package.json
npm install
```

### 5. ย้ายข้อมูลจาก JSON
```bash
# แก้ไขการตั้งค่าฐานข้อมูลใน migrate-to-mysql.js
# เปลี่ยน host, user, password ตามการตั้งค่าของคุณ

# รัน migration
node migrate-to-mysql.js
```

## โครงสร้างฐานข้อมูล

### ตารางหลัก
- **users**: ข้อมูลผู้ใช้จาก register.json
- **application_forms**: ข้อมูลใบสมัครงานจาก application-forms.json
- **user_education**: ประวัติการศึกษาของผู้ใช้
- **user_work_experience**: ประวัติการทำงานของผู้ใช้
- **application_education**: ประวัติการศึกษาจากใบสมัคร
- **application_work_experience**: ประวัติการทำงานจากใบสมัคร
- **application_documents**: เอกสารแนบ
- **hospital_departments**: แผนกโรงพยาบาล

### Views
- **user_profile_view**: ข้อมูลผู้ใช้แบบรวม
- **application_summary_view**: สรุปข้อมูลใบสมัคร

### Stored Procedures
- **GetUserWithDetails**: ดึงข้อมูลผู้ใช้พร้อมรายละเอียด
- **GetApplicationWithDetails**: ดึงข้อมูลใบสมัครพร้อมรายละเอียด
- **UpdateUserStatus**: อัปเดตสถานะผู้ใช้

## การใช้งาน

### เชื่อมต่อฐานข้อมูลใน Next.js
```javascript
// lib/mysql.js
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'rpph_user',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'rpph_job_system',
  charset: 'utf8mb4'
};

export const pool = mysql.createPool(dbConfig);
```

### ตัวอย่างการใช้งาน API
```javascript
// pages/api/users/[id].js
import { pool } from '../../../lib/mysql';

export default async function handler(req, res) {
  const { id } = req.query;
  
  try {
    const [rows] = await pool.execute(
      'CALL GetUserWithDetails(?)',
      [id]
    );
    
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

## Environment Variables
สร้างไฟล์ `.env.local`:
```env
DB_HOST=localhost
DB_USER=rpph_user
DB_PASSWORD=your_secure_password
DB_NAME=rpph_job_system
```

## การสำรองข้อมูล
```bash
# สำรองข้อมูล
mysqldump -u rpph_user -p rpph_job_system > backup_$(date +%Y%m%d_%H%M%S).sql

# กู้คืนข้อมูล
mysql -u rpph_user -p rpph_job_system < backup_file.sql
```

## การบำรุงรักษา
```sql
-- ดูขนาดฐานข้อมูล
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'rpph_job_system'
GROUP BY table_schema;

-- ดูตารางที่ใช้พื้นที่มากที่สุด
SELECT 
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'rpph_job_system'
ORDER BY (data_length + index_length) DESC;
```

## การแก้ไขปัญหา

### ปัญหาการเชื่อมต่อ
1. ตรวจสอบว่า MySQL ทำงานอยู่
2. ตรวจสอบ username/password
3. ตรวจสอบสิทธิ์การเข้าถึง

### ปัญหาการย้ายข้อมูล
1. ตรวจสอบไฟล์ JSON ว่าอยู่ในตำแหน่งที่ถูกต้อง
2. ตรวจสอบการตั้งค่าใน migrate-to-mysql.js
3. ดู log error ใน console

### ปัญหาการแสดงผลภาษาไทย
1. ตรวจสอบ charset ของฐานข้อมูล (utf8mb4)
2. ตรวจสอบการตั้งค่า connection string

## การอัปเกรด
เมื่อมีการเปลี่ยนแปลงโครงสร้างฐานข้อมูล:
1. สำรองข้อมูลก่อน
2. รัน migration script ใหม่
3. ทดสอบการทำงาน
4. อัปเดต API endpoints ถ้าจำเป็น
