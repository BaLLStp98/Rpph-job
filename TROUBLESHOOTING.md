# 🔧 การแก้ไข Error - NextAuth Line OAuth

## ปัญหาที่พบบ่อยและการแก้ไข

### 1. Environment Variables ไม่ถูกตั้งค่า

**อาการ**: Error "Invalid client" หรือ "Configuration error"

**การแก้ไข**:
1. สร้างไฟล์ `.env.local` ในโฟลเดอร์ `client/`
2. ใส่ข้อมูลต่อไปนี้:

```env
# Line OAuth Configuration
LINE_CLIENT_ID=your_line_channel_id_here
LINE_CLIENT_SECRET=your_line_channel_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gBZd/896aVcbGDBjRayEkIJfb8dLS1AhuhidOvgHyrg=
```

### 2. Line OAuth Configuration Error

**อาการ**: Error "Invalid redirect URI"

**การแก้ไข**:
1. ไปที่ Line Developers Console
2. ตรวจสอบ Callback URL ต้องเป็น: `http://localhost:3000/api/auth/callback/line`
3. ตรวจสอบ Channel ID และ Channel Secret

### 3. NextAuth Secret Error

**อาการ**: Error "NextAuth configuration error"

**การแก้ไข**:
1. สร้าง NEXTAUTH_SECRET ใหม่:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. TypeScript Errors

**อาการ**: Type errors ใน NextAuth configuration

**การแก้ไข**:
- ไฟล์ `src/app/api/auth/[...nextauth]/route.ts` ได้ถูกแก้ไขแล้ว
- ใช้ type assertion สำหรับ session callbacks

### 5. Development Server Error

**อาการ**: Server ไม่ start หรือ crash

**การแก้ไข**:
1. หยุด server: `Ctrl + C`
2. ลบ `.next` folder: `rm -rf .next`
3. รันใหม่: `npm run dev`

## การทดสอบระบบ

### 1. ตรวจสอบ Environment Variables

เปิดเบราว์เซอร์ไปที่: `http://localhost:3000/api/test-env`

### 2. ทดสอบ NextAuth API

เปิดเบราว์เซอร์ไปที่: `http://localhost:3000/api/auth/signin/line`

### 3. ทดสอบผ่าน UI

1. เปิด `http://localhost:3000`
2. คลิกปุ่ม "ทดสอบ NextAuth"
3. ดูผลการตรวจสอบ

## หมายเหตุสำคัญ

- **Environment Variables**: ต้องมีไฟล์ `.env.local` และต้อง restart server หลังแก้ไข
- **Line Console**: ต้องตั้งค่า Callback URL ให้ถูกต้อง
- **Development Mode**: เปิด debug mode ใน development
- **TypeScript**: ตรวจสอบ type definitions ให้ถูกต้อง

## การตรวจสอบ Logs

```bash
# ดู Next.js logs
npm run dev

# ดู error logs
tail -f .next/server.log
```

## การติดต่อ Support

หากยังมีปัญหา:
1. ตรวจสอบ error message ใน console
2. ดู logs ใน terminal
3. ตรวจสอบ environment variables
4. ทดสอบ API endpoints 