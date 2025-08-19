# NextAuth.js Line OAuth Setup

## การตั้งค่า Line OAuth

### 1. สร้าง Line Login Channel

1. ไปที่ [Line Developers Console](https://developers.line.biz/)
2. สร้าง Channel ใหม่เลือก "LINE Login"
3. ตั้งค่า Callback URL: `http://localhost:3000/api/auth/callback/line`
4. เก็บ Channel ID และ Channel Secret

### 2. สร้างไฟล์ Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์ `client/` และเพิ่มข้อมูลต่อไปนี้:

```env
# Line OAuth Configuration
LINE_CLIENT_ID=your_line_channel_id_here
LINE_CLIENT_SECRET=your_line_channel_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

### 3. สร้าง NEXTAUTH_SECRET

รันคำสั่งนี้เพื่อสร้าง secret:

```bash
openssl rand -base64 32
```

### 4. รันโปรเจค

```bash
npm run dev
```

## ฟีเจอร์ที่รวมอยู่

- ✅ Line OAuth Authentication
- ✅ Session Management
- ✅ User Profile Display
- ✅ Sign In/Sign Out UI
- ✅ TypeScript Support
- ✅ Responsive Design

## โครงสร้างไฟล์

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth API route
│   ├── auth/signin/page.tsx             # Sign in page
│   └── layout.tsx                       # Root layout with SessionProvider
├── components/
│   ├── Providers.tsx                    # SessionProvider wrapper
│   └── UserProfile.tsx                  # User profile component
└── types/
    └── next-auth.d.ts                   # TypeScript types
```

## การใช้งาน

1. ผู้ใช้คลิกปุ่ม "เข้าสู่ระบบ" ในหน้าแรก
2. ระบบจะ redirect ไปยัง Line OAuth
3. หลังจาก login สำเร็จ จะกลับมาที่หน้าแรก
4. แสดงข้อมูลผู้ใช้และปุ่ม "ออกจากระบบ"

## หมายเหตุ

- ต้องมี Line Developer Account
- Callback URL ต้องตรงกับที่ตั้งไว้ใน Line Console
- สำหรับ Production ต้องเปลี่ยน NEXTAUTH_URL เป็น domain จริง 