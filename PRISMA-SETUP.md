# การตั้งค่าฐานข้อมูล Prisma สำหรับระบบ RPPH

## สรุปการติดตั้ง

✅ **เสร็จสิ้นแล้ว** - ระบบ Prisma ได้ถูกตั้งค่าเรียบร้อยแล้ว!

## ไฟล์ที่สร้างขึ้น

### 1. Prisma Schema (`prisma/schema.prisma`)
- โครงสร้างฐานข้อมูล MySQL
- Models สำหรับ User, ApplicationForm, และตารางย่อย
- Relations ระหว่างตาราง
- Enums สำหรับค่าคงที่

### 2. Prisma Client (`lib/prisma.ts`)
- การเชื่อมต่อฐานข้อมูล
- Singleton pattern สำหรับประสิทธิภาพ

### 3. API Routes
- `src/app/api/prisma/users/route.ts` - จัดการผู้ใช้
- `src/app/api/prisma/users/[id]/route.ts` - จัดการผู้ใช้รายบุคคล
- `src/app/api/prisma/applications/route.ts` - จัดการใบสมัคร

### 4. Migration Scripts
- `migrate-to-prisma.js` - ย้ายข้อมูลจาก JSON ไปยัง Prisma
- `test-prisma.js` - ทดสอบการเชื่อมต่อ

## การใช้งาน

### 1. ตั้งค่าฐานข้อมูล
```bash
# สร้างฐานข้อมูล MySQL
mysql -u root -p -e "CREATE DATABASE rpph_job_system;"

# ตั้งค่า Prisma
npx prisma db push

# ย้ายข้อมูลจาก JSON
node migrate-to-prisma.js
```

### 2. ทดสอบการเชื่อมต่อ
```bash
node test-prisma.js
```

### 3. เปิด Prisma Studio
```bash
npx prisma studio
```

## โครงสร้างฐานข้อมูล

### ตารางหลัก
- **User** - ข้อมูลผู้ใช้จาก register.json
- **ApplicationForm** - ข้อมูลใบสมัครจาก application-forms.json
- **HospitalDepartment** - แผนกโรงพยาบาล

### ตารางย่อย
- **UserEducation** - ประวัติการศึกษาของผู้ใช้
- **UserWorkExperience** - ประวัติการทำงานของผู้ใช้
- **ApplicationEducation** - ประวัติการศึกษาจากใบสมัคร
- **ApplicationWorkExperience** - ประวัติการทำงานจากใบสมัคร
- **ApplicationDocument** - เอกสารแนบ

## API Endpoints

### Users
- `GET /api/prisma/users` - ดึงรายการผู้ใช้ (รองรับ pagination, search, filter)
- `POST /api/prisma/users` - สร้างผู้ใช้ใหม่
- `GET /api/prisma/users/[id]` - ดึงข้อมูลผู้ใช้ตาม ID
- `PUT /api/prisma/users/[id]` - อัปเดตข้อมูลผู้ใช้
- `DELETE /api/prisma/users/[id]` - ลบผู้ใช้

### Applications
- `GET /api/prisma/applications` - ดึงรายการใบสมัคร (รองรับ pagination, search, filter)
- `POST /api/prisma/applications` - สร้างใบสมัครใหม่

## ตัวอย่างการใช้งาน

### ใน API Route
```typescript
import { prisma } from '../../../lib/prisma'

export async function GET() {
  const users = await prisma.user.findMany({
    include: {
      education: true,
      workExperience: true
    }
  })
  
  return Response.json({ users })
}
```

### ใน Component
```typescript
const response = await fetch('/api/prisma/users')
const data = await response.json()
const users = data.data
```

## Environment Variables

สร้างไฟล์ `.env.local`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/rpph_job_system"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

## การบำรุงรักษา

### 1. อัปเดต Schema
```bash
# แก้ไข prisma/schema.prisma
npx prisma db push
npx prisma generate
```

### 2. สร้าง Migration
```bash
npx prisma migrate dev --name your-migration-name
```

### 3. Reset Database
```bash
npx prisma migrate reset
```

## ข้อดีของ Prisma

1. **Type Safety** - TypeScript support เต็มรูปแบบ
2. **Auto-completion** - IDE support ที่ดี
3. **Query Builder** - เขียน query ได้ง่าย
4. **Migration** - จัดการ schema changes
5. **Studio** - GUI สำหรับจัดการข้อมูล
6. **Performance** - Connection pooling และ query optimization

## การแก้ไขปัญหา

### 1. Database Connection Error
- ตรวจสอบ DATABASE_URL ใน .env.local
- ตรวจสอบว่า MySQL ทำงานอยู่
- ตรวจสอบสิทธิ์การเข้าถึงฐานข้อมูล

### 2. Schema Sync Error
- รัน `npx prisma db push`
- ตรวจสอบ Prisma schema syntax

### 3. Migration Error
- ตรวจสอบข้อมูล JSON format
- ตรวจสอบ enum values
- ดู error logs ใน console

## Next Steps

1. **ทดสอบ API** - ใช้ Postman หรือ curl
2. **อัปเดต Frontend** - เปลี่ยนจาก JSON API ไปยัง Prisma API
3. **เพิ่ม Features** - ใช้ Prisma features เพิ่มเติม
4. **Production Setup** - ตั้งค่าสำหรับ production

## ข้อมูลเพิ่มเติม

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [MySQL with Prisma](https://www.prisma.io/docs/concepts/database-connectors/mysql)
