# 🚀 การตั้งค่า NextAuth.js สำหรับ RPPH Job

## 📋 ขั้นตอนการตั้งค่า

### 1. สร้างไฟล์ `.env.local` ในโฟลเดอร์ `client`

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Line OAuth Configuration
LINE_CLIENT_ID=your-line-client-id-here
LINE_CLIENT_SECRET=your-line-client-secret-here
```

### 2. สร้าง Line Developer Account

1. ไปที่ [Line Developers Console](https://developers.line.biz/)
2. สร้าง Provider ใหม่
3. สร้าง Channel ประเภท "LINE Login"
4. ตั้งค่า Callback URL: `http://localhost:3000/api/auth/callback/line`

### 3. ตั้งค่า Environment Variables

- `LINE_CLIENT_ID`: จาก Line Developers Console
- `LINE_CLIENT_SECRET`: จาก Line Developers Console
- `NEXTAUTH_SECRET`: สร้าง secret key ใหม่ (ใช้ `openssl rand -base64 32`)

## 🔄 Flow การทำงาน

1. **หน้า Home** → แสดงปุ่ม "เข้าสู่ระบบด้วย Line"
2. **NextAuth Line Login** → เข้าสู่ระบบด้วย Line OAuth
3. **หลัง Login สำเร็จ** → นำทางไปหน้า Register
4. **หน้า Register** → กรอกข้อมูลสมัครงาน
5. **หลังบันทึกข้อมูล** → ไปหน้า Check Profile
6. **Check Profile** → ตรวจสอบข้อมูล
7. **หากมีข้อมูลแล้ว** → นำทางไปหน้า Dashboard

## 🛠️ การทดสอบ

1. รัน `npm run dev`
2. ไปที่ `http://localhost:3000`
3. คลิก "เข้าสู่ระบบด้วย Line"
4. ทดสอบการ login และ flow ต่างๆ

## 📝 หมายเหตุ

- ต้องมี Line Developer Account และ Channel ที่ถูกต้อง
- ต้องตั้งค่า Callback URL ให้ถูกต้อง
- ต้องมี Environment Variables ที่ครบถ้วน
