# 🔧 แก้ไขปัญหา "Invalid redirect_uri value" สำหรับ LINE Login

## 🚨 ปัญหาที่พบ
```
400 Bad Request
Invalid redirect_uri value. Check if it is registered in a LINE developers site.
```

## 🔍 สาเหตุ
1. **ไม่มีไฟล์ `.env.local`** - ไฟล์ environment variables ไม่ได้ถูกสร้าง
2. **Callback URL ไม่ตรงกัน** - URL ที่ตั้งใน LINE Developers Console ไม่ตรงกับที่ใช้ในโค้ด
3. **LINE_CLIENT_ID และ LINE_CLIENT_SECRET ไม่ถูกต้อง**

## ✅ วิธีแก้ไข

### ขั้นตอนที่ 1: สร้างไฟล์ `.env.local`

สร้างไฟล์ `.env.local` ในโฟลเดอร์หลักของโปรเจกต์ (D:\Rpph-job\) และใส่ข้อมูล:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gBZd/896aVcbGDBjRayEkIJfb8dLS1AhuhidOvgHyrg=

# Line OAuth Configuration
LINE_CLIENT_ID=your_line_channel_id_here
LINE_CLIENT_SECRET=your_line_channel_secret_here
```

### ขั้นตอนที่ 2: ตั้งค่า LINE Developers Console

1. **ไปที่ [LINE Developers Console](https://developers.line.biz/)**
2. **เข้าสู่ระบบด้วย LINE Account**
3. **สร้าง Provider ใหม่** (ถ้ายังไม่มี)
4. **สร้าง Channel ประเภท "LINE Login"**
5. **ตั้งค่า Callback URL**:
   ```
   http://localhost:3000/api/auth/callback/line
   ```
6. **เก็บข้อมูล**:
   - **Channel ID** → ใส่ใน `LINE_CLIENT_ID`
   - **Channel Secret** → ใส่ใน `LINE_CLIENT_SECRET`

### ขั้นตอนที่ 3: ตรวจสอบการตั้งค่า

1. **ตรวจสอบ Callback URL** ใน LINE Console ต้องเป็น:
   ```
   http://localhost:3000/api/auth/callback/line
   ```

2. **ตรวจสอบ Environment Variables**:
   - `NEXTAUTH_URL=http://localhost:3000`
   - `NEXTAUTH_SECRET` ต้องมีค่า (ใช้ค่าที่ให้ไว้หรือสร้างใหม่)
   - `LINE_CLIENT_ID` ต้องเป็น Channel ID จริง
   - `LINE_CLIENT_SECRET` ต้องเป็น Channel Secret จริง

### ขั้นตอนที่ 4: รีสตาร์ท Development Server

```bash
# หยุด server (Ctrl + C)
# รันใหม่
npm run dev
```

## 🧪 การทดสอบ

1. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`
2. คลิกปุ่ม "เข้าสู่ระบบด้วย Line"
3. ระบบควรจะ redirect ไป LINE Login ได้แล้ว

## 🔄 สำหรับ Production

เมื่อ deploy ไป production ต้องเปลี่ยน:

```env
NEXTAUTH_URL=https://yourdomain.com
```

และเพิ่ม Callback URL ใน LINE Console:
```
https://yourdomain.com/api/auth/callback/line
```

## 📝 หมายเหตุ

- ไฟล์ `.env.local` จะไม่ถูก commit เข้า Git (มีใน .gitignore)
- เก็บ `LINE_CLIENT_SECRET` เป็นความลับ
- Callback URL ต้องตรงกันทุกตัวอักษร
