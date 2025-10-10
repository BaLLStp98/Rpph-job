# 🔄 Flow การ Register ระบบสมัครงาน

## 📋 ภาพรวม Flow

ระบบ Register ทำงานผ่าน **2 เส้นทางหลัก**:

### **1. เส้นทางปกติ (register)**
```
ผู้ใช้ → /register → กรอกข้อมูล → บันทึก → ResumeDeposit
```

### **2. เส้นทางฝ่าย (register?department=ชื่อฝ่าย)**
```
ผู้ใช้ → /register?department=ชื่อฝ่าย → กรอกข้อมูล → บันทึก → ResumeDeposit
```

---

## 🎯 Flow รายละเอียด

### **Step 1: เข้าสู่ระบบ**
```
1. ผู้ใช้เข้าถึง /register หรือ /register?department=ชื่อฝ่าย
2. ระบบตรวจสอบ session (NextAuth)
3. ถ้าไม่ได้ login → redirect ไป /auth/signin
4. ถ้า login แล้ว → ไป step 2
```

### **Step 2: โหลดข้อมูลเดิม (ถ้ามี)**
```javascript
// ระบบจะเรียก API เพื่อโหลดข้อมูลเดิม
GET /api/resume-deposit?userId={userId}&email={email}

// ถ้ามีข้อมูลเดิม → แสดงในฟอร์ม
// ถ้าไม่มีข้อมูลเดิม → แสดงฟอร์มว่าง
```

### **Step 3: กรอกข้อมูลในฟอร์ม**
```
ฟอร์มแบ่งเป็น 3 ขั้นตอน:

📝 ขั้นตอนที่ 1: ข้อมูลส่วนตัว
- ข้อมูลพื้นฐาน (ชื่อ, นามสกุล, อีเมล, เบอร์โทร)
- ข้อมูลบัตรประจำตัวประชาชน
- ข้อมูลที่อยู่ (ปัจจุบัน, ตามทะเบียนบ้าน)
- ข้อมูลผู้ติดต่อฉุกเฉิน

🎓 ขั้นตอนที่ 2: ข้อมูลการศึกษา
- ประวัติการศึกษา (ระดับ, สถาบัน, สาขา, ปี, GPA)
- สามารถเพิ่ม/ลบ/แก้ไขได้

💼 ขั้นตอนที่ 3: ข้อมูลประสบการณ์
- ประวัติการทำงาน
- ประวัติการรับราชการก่อนหน้า (ถ้ามี)
- ทักษะและความสามารถ
```

### **Step 4: บันทึกข้อมูล**
```javascript
// เมื่อกดปุ่ม "บันทึกข้อมูล"
POST /api/resume-deposit

// ข้อมูลที่ส่งไป:
{
  // ข้อมูลส่วนตัว
  firstName: "ชื่อ",
  lastName: "นามสกุล",
  email: "email@example.com",
  phone: "0812345678",
  
  // ข้อมูลการศึกษา (Array)
  education: [
    {
      level: "ปริญญาตรี",
      school: "มหาวิทยาลัย",
      major: "สาขา",
      startYear: "2020",
      endYear: "2024",
      gpa: 3.5
    }
  ],
  
  // ข้อมูลประสบการณ์ทำงาน (Array)
  workExperience: [
    {
      position: "ตำแหน่ง",
      company: "บริษัท",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      salary: "30000",
      description: "รายละเอียด"
    }
  ],
  
  // ข้อมูลการรับราชการก่อนหน้า (Array)
  previousGovernmentService: [
    {
      position: "ตำแหน่ง",
      department: "หน่วยงาน",
      reason: "เหตุผลออก",
      date: "2023-12-31",
      type: "civilServant" // หรือ "employee"
    }
  ],
  
  // ข้อมูลการสมัครงาน
  department: "ชื่อฝ่าย",
  expectedPosition: "ตำแหน่งที่สมัคร",
  expectedSalary: "เงินเดือนที่คาดหวัง"
}
```

### **Step 5: ประมวลผลข้อมูล**
```javascript
// API จะสร้างข้อมูลในฐานข้อมูล:

1. ResumeDeposit (ตารางหลัก)
   - ข้อมูลส่วนตัว
   - ข้อมูลการสมัครงาน
   - สถานะ: PENDING

2. Education (ตารางย่อย)
   - ข้อมูลการศึกษาทั้งหมด
   - เชื่อมโยงกับ ResumeDeposit

3. WorkExperience (ตารางย่อย)
   - ข้อมูลประสบการณ์ทำงาน
   - เชื่อมโยงกับ ResumeDeposit

4. PreviousGovernmentService (ตารางย่อย)
   - ข้อมูลการรับราชการก่อนหน้า
   - เชื่อมโยงกับ ResumeDeposit

5. Documents (ตารางย่อย)
   - ข้อมูลเอกสารแนบ
   - เชื่อมโยงกับ ResumeDeposit
```

### **Step 6: แสดงผลลัพธ์**
```
✅ สำเร็จ: "บันทึกข้อมูลเรียบร้อยแล้ว"
❌ ผิดพลาด: แสดงข้อความ error
```

---

## 🔄 Flow พิเศษ: register?department

### **เมื่อเข้าถึง register?department=ชื่อฝ่าย**

```javascript
// 1. ระบบตรวจสอบ department parameter
const department = searchParams.get('department');

// 2. โหลดข้อมูลเดิม (ถ้ามี)
const existingData = await loadResumeByDepartment(department);

// 3. แสดงฟอร์มพร้อมข้อมูลเดิม
if (existingData) {
  // แสดงข้อมูลเดิมในฟอร์ม
  applyResumeToFormInputs(existingData);
} else {
  // แสดงฟอร์มว่าง
}

// 4. เมื่อบันทึก → บันทึกไปที่ ResumeDeposit พร้อม department
```

---

## 🗄️ ฐานข้อมูลที่เกี่ยวข้อง

### **ตารางหลัก**
- **ResumeDeposit** - ข้อมูลหลักของการฝากประวัติ
- **User** - ข้อมูลผู้ใช้ (จาก NextAuth)

### **ตารางย่อย**
- **Education** - ข้อมูลการศึกษา
- **WorkExperience** - ข้อมูลประสบการณ์ทำงาน
- **PreviousGovernmentService** - ข้อมูลการรับราชการก่อนหน้า
- **Documents** - ข้อมูลเอกสารแนบ

---

## 🔒 ความปลอดภัย

### **Authentication**
- ใช้ NextAuth Line OAuth
- ตรวจสอบ session ก่อนเข้าถึงฟอร์ม
- บันทึก userId เพื่อความปลอดภัย

### **Data Validation**
- ตรวจสอบข้อมูลที่จำเป็น
- ป้องกัน SQL Injection
- ตรวจสอบ file upload

### **Authorization**
- ผู้ใช้สามารถดู/แก้ไขข้อมูลของตัวเองเท่านั้น
- Admin สามารถดูข้อมูลทั้งหมดได้

---

## 📱 UI/UX Features

### **Responsive Design**
- รองรับ mobile และ desktop
- ใช้ HeroUI components
- Slide-in panels สำหรับ mobile

### **Progress Tracking**
- แสดงความคืบหน้า 3 ขั้นตอน
- ปุ่มย้อนกลับ/ถัดไป
- บันทึกข้อมูลอัตโนมัติ

### **User Experience**
- Auto-save ข้อมูล
- Validation แบบ real-time
- Loading states
- Error handling

---

## 🎯 สรุป

**ระบบ Register ทำงานผ่าน:**
1. **Authentication** - ตรวจสอบการเข้าสู่ระบบ
2. **Data Loading** - โหลดข้อมูลเดิม (ถ้ามี)
3. **Form Display** - แสดงฟอร์ม 3 ขั้นตอน
4. **Data Validation** - ตรวจสอบข้อมูล
5. **Database Save** - บันทึกข้อมูลในฐานข้อมูล
6. **Result Display** - แสดงผลลัพธ์

**ข้อมูลจะถูกบันทึกใน ResumeDeposit และตารางย่อยที่เกี่ยวข้อง โดยรองรับทั้งการสร้างใหม่และการแก้ไขข้อมูลเดิม**
