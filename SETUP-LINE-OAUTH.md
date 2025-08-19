# การตั้งค่า Line OAuth Step by Step

## ขั้นตอนที่ 1: สร้าง Line Developer Account

1. ไปที่ [Line Developers Console](https://developers.line.biz/)
2. สมัครสมาชิกหรือเข้าสู่ระบบ
3. ยืนยันอีเมลและข้อมูลส่วนตัว

## ขั้นตอนที่ 2: สร้าง Line Login Channel

1. คลิก "Create Channel"
2. เลือก "LINE Login"
3. กรอกข้อมูล Channel:
   - **Channel name**: ชื่อแอปของคุณ (เช่น "My NextAuth App")
   - **Channel description**: คำอธิบายสั้นๆ
   - **Category**: เลือก "Business"
   - **Subcategory**: เลือก "Other"

## ขั้นตอนที่ 3: ตั้งค่า Callback URL

1. ไปที่แท็บ "LINE Login"
2. ในส่วน "Callback URL" ใส่:
   ```
   http://localhost:3000/api/auth/callback/line
   ```
3. คลิก "Add"
4. บันทึกการตั้งค่า

## ขั้นตอนที่ 4: เก็บ Channel ID และ Channel Secret

1. ไปที่แท็บ "Basic settings"
2. เก็บข้อมูล:
   - **Channel ID** (จะใช้เป็น LINE_CLIENT_ID)
   - **Channel Secret** (จะใช้เป็น LINE_CLIENT_SECRET)

## ขั้นตอนที่ 5: สร้างไฟล์ .env.local

สร้างไฟล์ `.env.local` ในโฟลเดอร์ `client/` และใส่ข้อมูล:

```env
# Line OAuth Configuration
LINE_CLIENT_ID=your_channel_id_from_step_4
LINE_CLIENT_SECRET=your_channel_secret_from_step_4

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

## ขั้นตอนที่ 6: สร้าง NEXTAUTH_SECRET

รันคำสั่งนี้ใน terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

หรือใช้:

```bash
openssl rand -base64 32
```

## ขั้นตอนที่ 7: ทดสอบระบบ

1. รันโปรเจค: `npm run dev`
2. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`
3. คลิกปุ่ม "เข้าสู่ระบบ"
4. เลือก "เข้าสู่ระบบด้วย Line"
5. อนุญาตการเข้าถึงใน Line
6. ระบบจะ redirect กลับมาที่หน้าแรกพร้อมข้อมูลผู้ใช้

## หมายเหตุสำคัญ

- **Callback URL ต้องตรงกัน**: ต้องเป็น `http://localhost:3000/api/auth/callback/line` เท่านั้น
- **สำหรับ Production**: เปลี่ยน NEXTAUTH_URL และ Callback URL เป็น domain จริง
- **Channel Secret**: เก็บไว้เป็นความลับ อย่าแชร์กับใคร

## การแก้ไขปัญหา

### ปัญหา: "Invalid redirect URI"
- ตรวจสอบ Callback URL ใน Line Console ว่าตรงกับที่ตั้งไว้

### ปัญหา: "Invalid client"
- ตรวจสอบ LINE_CLIENT_ID และ LINE_CLIENT_SECRET ว่าถูกต้อง

### ปัญหา: "NextAuth configuration error"
- ตรวจสอบ NEXTAUTH_SECRET ว่ามีค่าและไม่เป็น null 