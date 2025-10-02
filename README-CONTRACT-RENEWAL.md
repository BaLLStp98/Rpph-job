# ระบบการต่อสัญญา (Contract Renewal System)

## ภาพรวม
ระบบการต่อสัญญาเป็นส่วนหนึ่งของระบบจัดการข้อมูลพนักงานที่ช่วยให้สามารถบันทึกและจัดการข้อมูลการต่อสัญญาของพนักงานได้อย่างมีประสิทธิภาพ

## ฟีเจอร์หลัก

### 1. การยื่นคำขอต่อสัญญา
- กรอกข้อมูลพนักงาน (คำนำหน้า, ชื่อ, นามสกุล)
- ระบุหน่วยงานและตำแหน่ง
- กำหนดวันที่เริ่มและสิ้นสุดสัญญาใหม่
- ระบุเงินเดือนใหม่
- เพิ่มหมายเหตุ
- แนบไฟล์เอกสาร (PDF/รูปภาพ)

### 2. การจัดการข้อมูล (สำหรับ Admin)
- ดูรายการการต่อสัญญาทั้งหมด
- กรองข้อมูลตามสถานะ
- ดูรายละเอียดการต่อสัญญา
- อนุมัติหรือปฏิเสธคำขอ
- ดาวน์โหลดไฟล์แนบ

## โครงสร้างฐานข้อมูล

### ตาราง ContractRenewal
```sql
- id: String (Primary Key)
- employeeId: String (รหัสพนักงาน)
- employeeName: String (ชื่อ-นามสกุล)
- department: String (หน่วยงาน)
- position: String (ตำแหน่ง)
- newStartDate: DateTime (วันที่เริ่มสัญญาใหม่)
- newEndDate: DateTime (วันที่สิ้นสุดสัญญาใหม่)
- contractStartDate: DateTime (วันที่เริ่มสัญญาเดิม)
- contractEndDate: DateTime (วันที่สิ้นสุดสัญญาเดิม)
- newSalary: String (เงินเดือนใหม่)
- notes: String (หมายเหตุ)
- status: ContractRenewalStatus (สถานะ)
- createdAt: DateTime (วันที่สร้าง)
- updatedAt: DateTime (วันที่อัปเดต)
```

### ตาราง ContractRenewalAttachment
```sql
- id: Int (Primary Key)
- contractRenewalId: String (Foreign Key)
- fileName: String (ชื่อไฟล์)
- filePath: String (เส้นทางไฟล์)
- mimeType: String (ประเภทไฟล์)
- fileSize: Int (ขนาดไฟล์)
- createdAt: DateTime (วันที่สร้าง)
```

## API Endpoints

### 1. สร้างการต่อสัญญาใหม่
```
POST /api/contract-renewals
Content-Type: multipart/form-data

Body:
- prefix: String (คำนำหน้า)
- firstName: String (ชื่อ)
- lastName: String (นามสกุล)
- department: String (หน่วยงาน)
- position: String (ตำแหน่ง)
- newStartDate: String (วันที่เริ่มสัญญาใหม่)
- newEndDate: String (วันที่สิ้นสุดสัญญาใหม่)
- contractStartDate: String (วันที่เริ่มสัญญาเดิม)
- contractEndDate: String (วันที่สิ้นสุดสัญญาเดิม)
- newSalary: String (เงินเดือนใหม่)
- notes: String (หมายเหตุ)
- file: File (ไฟล์แนบ)
```

### 2. ดึงรายการการต่อสัญญา
```
GET /api/contract-renewals?page=1&limit=10&status=PENDING
```

### 3. ดึงรายละเอียดการต่อสัญญา
```
GET /api/contract-renewals/{id}
```

### 4. อัปเดตสถานะการต่อสัญญา
```
PUT /api/contract-renewals/{id}
Content-Type: application/json

Body:
{
  "status": "APPROVED" | "REJECTED",
  "notes": "String (หมายเหตุเพิ่มเติม)"
}
```

### 5. ลบการต่อสัญญา
```
DELETE /api/contract-renewals/{id}
```

## การใช้งาน

### สำหรับพนักงาน
1. เข้าสู่ระบบ Dashboard
2. คลิกปุ่ม "ต่อสัญญา"
3. กรอกข้อมูลในฟอร์ม
4. แนบไฟล์เอกสาร (ถ้ามี)
5. คลิก "บันทึก"

### สำหรับ Admin
1. เข้าสู่ระบบ Admin
2. ไปที่หน้า "การต่อสัญญา"
3. ดูรายการคำขอต่อสัญญา
4. คลิก "ดูรายละเอียด" เพื่อดูข้อมูล
5. คลิก "อนุมัติ" หรือ "ปฏิเสธ" ตามความเหมาะสม

## สถานะการต่อสัญญา

- **PENDING**: รอดำเนินการ (สถานะเริ่มต้น)
- **APPROVED**: อนุมัติ
- **REJECTED**: ปฏิเสธ

## การจัดเก็บไฟล์

ไฟล์แนบจะถูกจัดเก็บในโฟลเดอร์ `public/contract-renewals/` โดยใช้ชื่อไฟล์ที่ไม่ซ้ำกัน:
```
{contractRenewalId}-{timestamp}.{extension}
```

## การรักษาความปลอดภัย

- ตรวจสอบสิทธิ์การเข้าถึง API
- จำกัดขนาดไฟล์ที่อัปโหลด
- ตรวจสอบประเภทไฟล์ที่อนุญาต
- ใช้ HTTPS สำหรับการส่งข้อมูล

## การติดตั้งและใช้งาน

1. รัน migration เพื่อสร้างตารางในฐานข้อมูล:
```bash
npx prisma migrate dev
```

2. สร้างโฟลเดอร์สำหรับเก็บไฟล์:
```bash
mkdir -p public/contract-renewals
```

3. เริ่มต้นเซิร์ฟเวอร์:
```bash
npm run dev
```

4. เข้าถึงระบบผ่าน:
- Dashboard: `http://localhost:3000/dashboard`
- Admin: `http://localhost:3000/admin/contract-renewals`

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **ไฟล์ไม่สามารถอัปโหลดได้**
   - ตรวจสอบสิทธิ์การเขียนในโฟลเดอร์ `public/contract-renewals/`
   - ตรวจสอบขนาดไฟล์ไม่เกินขีดจำกัด

2. **ข้อมูลไม่ถูกบันทึก**
   - ตรวจสอบการเชื่อมต่อฐานข้อมูล
   - ตรวจสอบ log ใน console

3. **หน้า Admin ไม่แสดงข้อมูล**
   - ตรวจสอบสิทธิ์การเข้าถึง
   - ตรวจสอบ API endpoint

## การพัฒนาต่อ

- เพิ่มระบบแจ้งเตือน
- เพิ่มการส่งอีเมลแจ้งเตือน
- เพิ่มระบบอนุมัติหลายขั้นตอน
- เพิ่มรายงานสถิติ
- เพิ่มการ export ข้อมูลเป็น Excel
