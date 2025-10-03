# การบันทึกข้อมูล ๑.๘ และ ๑.๙ ใน ResumeDeposit

## 📋 สรุปการบันทึกข้อมูล

### ๑.๘ ปัจจุบันทำงานในตำแหน่ง
- **ตาราง:** `resume_deposit_work_experience`
- **ฟิลด์ที่บันทึก:**
  - `position` - ตำแหน่ง
  - `company` - บริษัท/องค์กร
  - `startDate` - วันที่เริ่มทำงาน
  - `endDate` - วันที่สิ้นสุดการทำงาน (null = ยังทำงานอยู่)
  - `salary` - เงินเดือน
  - `description` - รายละเอียดงาน/เหตุผลที่ออก
  - `isCurrent` - ยังทำงานอยู่หรือไม่

### ๑.๙ เคยรับราชการเป็นข้าราชการ/ลูกจ้าง
- **ตาราง:** `resume_deposit_previous_government_service`
- **ฟิลด์ที่บันทึก:**
  - `position` - ตำแหน่ง
  - `department` - สังกัด
  - `reason` - ออกจากราชการเพราะ
  - `date` - เมื่อวันที่
  - `type` - ประเภท (civilServant/employee)

## 🔄 Flow การบันทึกข้อมูล

```
1. ผู้ใช้กรอกข้อมูลในฟอร์ม
   ↓
2. ข้อมูล ๑.๘ → workExperience array
   ↓
3. ข้อมูล ๑.๙ → previousGovernmentService array
   ↓
4. กดปุ่ม "บันทึกข้อมูล"
   ↓
5. เรียก saveToResumeDeposit()
   ↓
6. ส่งข้อมูลไปที่ POST /api/resume-deposit
   ↓
7. บันทึกใน resume_deposits table
   ↓
8. บันทึก workExperience ใน resume_deposit_work_experience
   ↓
9. บันทึก previousGovernmentService ใน resume_deposit_previous_government_service
   ↓
10. แสดงข้อความ "บันทึกข้อมูลสำเร็จ"
```

## 📊 ตัวอย่างข้อมูลที่บันทึก

### ๑.๘ ประสบการณ์ทำงาน:
```json
{
  "workExperience": [
    {
      "position": "นักวิเคราะห์ระบบ",
      "company": "บริษัทเทคโนโลยี จำกัด",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": null,
      "salary": "60000",
      "description": "งานประจำ - วิเคราะห์และพัฒนาระบบ",
      "isCurrent": false
    },
    {
      "position": "โปรแกรมเมอร์",
      "company": "บริษัทซอฟต์แวร์ จำกัด",
      "startDate": "2022-06-01T00:00:00.000Z",
      "endDate": "2023-12-31T00:00:00.000Z",
      "salary": "45000",
      "description": "ลาออกเพื่อเปลี่ยนงาน",
      "isCurrent": false
    }
  ]
}
```

### ๑.๙ เคยรับราชการเป็นข้าราชการ/ลูกจ้าง:
```json
{
  "previousGovernmentService": [
    {
      "position": "นักวิชาการ",
      "department": "สำนักงานปลัดกระทรวง",
      "reason": "ลาออกเพื่อย้ายไปทำงานเอกชน",
      "date": "2022-05-31",
      "type": "civilServant"
    },
    {
      "position": "ลูกจ้างประจำ",
      "department": "สำนักงานเขต",
      "reason": "สัญญาจ้างหมดอายุ",
      "date": "2021-03-31",
      "type": "employee"
    }
  ]
}
```

## ✅ การทำงานที่ถูกต้อง

### ๑.๘ ปัจจุบันทำงานในตำแหน่ง:
- ✅ บันทึกใน `resume_deposit_work_experience` เท่านั้น
- ✅ รองรับการเพิ่ม/ลบ/แก้ไขข้อมูลหลายรายการ
- ✅ แสดงวันที่เริ่มและสิ้นสุดการทำงาน
- ✅ แสดงเงินเดือนและรายละเอียดงาน

### ๑.๙ เคยรับราชการเป็นข้าราชการ/ลูกจ้าง:
- ✅ บันทึกใน `resume_deposit_previous_government_service` เท่านั้น
- ✅ รองรับการเพิ่ม/ลบ/แก้ไขข้อมูลหลายรายการ
- ✅ แสดงประเภท (ข้าราชการ/ลูกจ้าง)
- ✅ แสดงเหตุผลและวันที่ออกจากราชการ

## 🎯 สรุป

**ข้อมูลทั้งสองส่วนบันทึกใน ResumeDeposit เท่านั้น:**
- **๑.๘** → `resume_deposit_work_experience`
- **๑.๙** → `resume_deposit_previous_government_service`

**การแสดงข้อมูลกลับมา:**
- ข้อมูลจะถูกโหลดผ่าน `loadResumeByDepartment()` หรือ `loadResumeById()`
- ข้อมูลจะถูกแปลงผ่าน `applyResumeToFormInputs()` เพื่อแสดงใน UI
- รองรับการเพิ่ม/ลบ/แก้ไขข้อมูลใน UI
