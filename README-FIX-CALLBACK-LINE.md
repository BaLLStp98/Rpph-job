# 🔧 การแก้ไขปัญหา "Cannot GET /api/auth/callback/line"

## 🚨 ปัญหาที่พบ
- ข้อผิดพลาด: "Cannot GET /api/auth/callback/line"
- NextAuth callback route ไม่ทำงาน
- Line OAuth ไม่สามารถ redirect กลับมาได้

## ✅ สิ่งที่แก้ไขแล้ว

### 1. **NextAuth Configuration** (`src/app/api/auth/[...nextauth]/route.ts`)
- เพิ่ม `secret` และ `session.strategy`
- เพิ่ม `jwt.secret` สำหรับ JWT signing
- เพิ่ม debug mode สำหรับ development

### 2. **NextAuth Types** (`src/types/next-auth.d.ts`)
- เพิ่ม `lineId`, `name`, `picture`, `provider` ใน JWT interface
- เพิ่ม `lineId` ใน Session interface

### 3. **หน้าทดสอบ** (`src/app/test-auth/page.tsx`)
- สร้างหน้าทดสอบ NextAuth
- แสดงสถานะการเข้าสู่ระบบ
- แสดงข้อมูล Session และ Environment Variables

### 4. **ปุ่มทดสอบใน Dashboard**
- เพิ่มปุ่ม "ทดสอบ NextAuth" ในหน้า Dashboard
- เพิ่มปุ่ม "ทดสอบ Line Login" สำหรับทดสอบ Line OAuth

## 🛠️ ขั้นตอนการแก้ไขปัญหา

### ขั้นตอนที่ 1: ตรวจสอบไฟล์ `.env`
```bash
# ตรวจสอบว่ามีไฟล์ .env และมีข้อมูลครบ
DATABASE_URL="mysql://root:@localhost:3306/mydata"
NEXT_PUBLIC_LIFF_ID=2007299644-z1G5LG7b
LINE_CLIENT_ID=2007299644
LINE_CLIENT_SECRET=b1eb1d21deb819cc3cd2999af9640f44
NEXTAUTH_SECRET=3jKf0U2PiXzNfqpqP/ciT4U9bflkq5nXGzW9cR0NQPo=
NEXTAUTH_URL=http://localhost:3000
```

### ขั้นตอนที่ 2: รีสตาร์ท Development Server
```bash
npm run dev
```

### ขั้นตอนที่ 3: ทดสอบ NextAuth API
1. ไปที่ `http://localhost:3000/api/auth/test`
2. ตรวจสอบว่า API ตอบกลับข้อมูลถูกต้อง

### ขั้นตอนที่ 4: ทดสอบ NextAuth Page
1. ไปที่ `http://localhost:3000/test-auth`
2. ตรวจสอบสถานะการเข้าสู่ระบบ
3. ทดสอบปุ่ม "เข้าสู่ระบบด้วย Line"

## 🔍 การทดสอบ

### วิธีที่ 1: ทดสอบผ่าน Dashboard
1. ไปที่หน้า Dashboard
2. คลิกปุ่ม "ทดสอบ NextAuth"
3. ตรวจสอบสถานะและทดสอบการทำงาน

### วิธีที่ 2: ทดสอบโดยตรง
1. ไปที่ `http://localhost:3000/test-auth`
2. ตรวจสอบข้อมูล Environment Variables
3. ทดสอบการเข้าสู่ระบบด้วย Line

### วิธีที่ 3: ทดสอบ API
1. ไปที่ `http://localhost:3000/api/auth/test`
2. ตรวจสอบข้อมูลที่ตอบกลับ

## 🚨 ข้อผิดพลาดที่อาจเกิดขึ้น

### 1. **"Cannot GET /api/auth/callback/line"**
- ตรวจสอบว่า development server ทำงานที่ port 3000
- ตรวจสอบว่าไฟล์ `[...nextauth]/route.ts` มีอยู่และถูกต้อง
- ตรวจสอบ Environment Variables

### 2. **"Invalid client_id" หรือ "Invalid client_secret"**
- ตรวจสอบ `LINE_CLIENT_ID` และ `LINE_CLIENT_SECRET` ใน `.env`
- ตรวจสอบการตั้งค่าใน Line Developer Console

### 3. **"Invalid redirect_uri"**
- ตรวจสอบ Callback URL ใน Line Developer Console
- ต้องตรงกับ `http://localhost:3000/api/auth/callback/line`

### 4. **NextAuth ไม่ทำงาน**
- ตรวจสอบว่า `SessionProvider` ครอบ `UserProvider` ใน `Providers.tsx`
- ตรวจสอบว่า `Providers` ถูกใช้ใน `layout.tsx`

## 📱 การตั้งค่า Line Developer Console

### 1. **สร้าง Provider และ Channel**
1. ไปที่ [Line Developers Console](https://developers.line.biz/)
2. สร้าง Provider ใหม่
3. สร้าง Channel ประเภท "LINE Login"

### 2. **ตั้งค่า Callback URL**
- Callback URL: `http://localhost:3000/api/auth/callback/line`
- สำหรับ Production: เปลี่ยนเป็น domain จริง

### 3. **คัดลอก Credentials**
- Channel ID → `LINE_CLIENT_ID`
- Channel Secret → `LINE_CLIENT_SECRET`

## 🔗 ลิงก์ที่เกี่ยวข้อง

- [Line Developers Console](https://developers.line.biz/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Line Login Documentation](https://developers.line.biz/en/docs/line-login/)

## 📞 การขอความช่วยเหลือ

หากยังมีปัญหา:
1. ตรวจสอบ console ใน browser
2. ตรวจสอบ terminal ที่รัน development server
3. ตรวจสอบ Network tab ใน Developer Tools
4. ตรวจสอบการตั้งค่าใน Line Developer Console
5. ใช้หน้าทดสอบ NextAuth เพื่อตรวจสอบสถานะ

## 🎯 สิ่งที่คาดหวังหลังแก้ไข

- ✅ NextAuth API ทำงานได้ (`/api/auth/test`)
- ✅ หน้า NextAuth ทดสอบแสดงผลได้ (`/test-auth`)
- ✅ Line OAuth callback ทำงานได้ (`/api/auth/callback/line`)
- ✅ การเข้าสู่ระบบด้วย Line สำเร็จ
- ✅ Session ถูกสร้างและจัดการได้ถูกต้อง
