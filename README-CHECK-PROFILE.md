# 🔍 ระบบ Check Profile - ตรวจสอบสถานะการเข้าสู่ระบบ

## 🎯 วัตถุประสงค์

ระบบ Check Profile ถูกออกแบบมาเพื่อตรวจสอบสถานะการเข้าสู่ระบบของ Line และนำทางผู้ใช้ไปยังหน้าที่เหมาะสมโดยอัตโนมัติ

## 🔄 การทำงาน

### **1. การตรวจสอบสถานะ**
- ใช้ `useSession()` จาก NextAuth.js เพื่อตรวจสอบสถานะการเข้าสู่ระบบ
- รองรับ 3 สถานะ:
  - `loading`: กำลังโหลดข้อมูล session
  - `authenticated`: เข้าสู่ระบบแล้ว
  - `unauthenticated`: ยังไม่ได้เข้าสู่ระบบ

### **2. การนำทางอัตโนมัติ**
- **หากเข้าสู่ระบบแล้ว**: นำทางไปยัง `/register` เพื่อกรอกข้อมูล
- **หากยังไม่ได้เข้าสู่ระบบ**: นำทางไปยัง `/auth/signin` เพื่อเข้าสู่ระบบด้วย Line

### **3. UI/UX Features**
- **Loading State**: แสดง spinner และข้อความ "กำลังตรวจสอบสถานะ..."
- **Redirect State**: แสดงข้อความและ icon ที่เหมาะสมก่อน redirect
- **Error State**: แสดงปุ่มให้ผู้ใช้เลือกดำเนินการเอง

## 🎨 UI Components

### **Loading Screen**
```
┌─────────────────────────┐
│        ⭕ (spinner)     │
│   กำลังตรวจสอบสถานะ...   │
│ กรุณารอสักครู่...        │
└─────────────────────────┘
```

### **Success Redirect**
```
┌─────────────────────────┐
│        ✅ (check)       │
│    เข้าสู่ระบบสำเร็จ!    │
│ กำลังนำทางไปยังหน้าลงทะเบียน │
│        ⭕ (spinner)     │
└─────────────────────────┘
```

### **Unauthenticated Redirect**
```
┌─────────────────────────┐
│        ✅ (check)       │
│      กำลังนำทาง...       │
│ กำลังนำทางไปยังหน้าเข้าสู่ระบบ │
│        ⭕ (spinner)     │
└─────────────────────────┘
```

### **Error State**
```
┌─────────────────────────┐
│        ⚠️ (warning)     │
│ ไม่สามารถตรวจสอบสถานะได้  │
│                        │
│ [เข้าสู่ระบบด้วย Line]    │
│ [กลับหน้าหลัก]          │
└─────────────────────────┘
```

## 🚀 การใช้งาน

### **สำหรับผู้ใช้**
1. เข้าไปที่ `http://localhost:3000/check-profile`
2. ระบบจะตรวจสอบสถานะการเข้าสู่ระบบโดยอัตโนมัติ
3. รอสักครู่ ระบบจะนำทางไปยังหน้าที่เหมาะสม

### **สำหรับ Developer**
```typescript
// ตรวจสอบสถานะ session
const { data: session, status } = useSession()

// ตรวจสอบและ redirect
useEffect(() => {
  if (status === 'authenticated') {
    router.push('/register')
  } else if (status === 'unauthenticated') {
    router.push('/auth/signin')
  }
}, [session, status])
```

## 📁 โครงสร้างไฟล์

```
src/app/check-profile/
└── page.tsx              # หน้า check-profile หลัก
```

## 🎯 Components

### **CheckProfilePage**
- ใช้ `useSession()` เพื่อตรวจสอบสถานะ
- ใช้ `useRouter()` สำหรับการนำทาง
- จัดการ loading, redirect, และ error states
- แสดง UI ที่เหมาะสมสำหรับแต่ละสถานะ

## 🔧 Technical Features

### **State Management**
- `useSession()`: ตรวจสอบสถานะ NextAuth
- `useState()`: จัดการ redirect state
- `useEffect()`: ตรวจจับการเปลี่ยนแปลงสถานะ

### **Navigation**
- `useRouter()`: สำหรับการนำทาง
- `setTimeout()`: เพิ่ม delay เพื่อให้ผู้ใช้เห็นข้อความ
- Conditional routing ตามสถานะ

### **UI/UX**
- Responsive design
- Loading animations
- Smooth transitions
- Error handling
- Fallback options

## 🎨 Design System

### **Colors**
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Background**: Gradient blue to indigo
- **Cards**: White (#FFFFFF)

### **Animations**
- Spinner animation สำหรับ loading
- Pulse animation สำหรับ redirect
- Smooth transitions

## 🔄 Flow Diagram

```
เริ่มต้น
   ↓
ตรวจสอบ Session
   ↓
┌─────────────────┐
│   Loading?      │
└─────────────────┘
   ↓
┌─────────────────┐
│ Authenticated?  │
└─────────────────┘
   ↓ Yes
┌─────────────────┐
│ Redirect to     │
│ /register       │
└─────────────────┘
   ↓ No
┌─────────────────┐
│ Redirect to     │
│ /auth/signin    │
└─────────────────┘
```

## 🎯 Use Cases

### **1. ผู้ใช้ใหม่**
- เข้า `/check-profile`
- ระบบตรวจสอบว่าไม่ได้ login
- นำทางไป `/auth/signin`
- หลังจาก login สำเร็จ สามารถกลับมาที่ `/check-profile` อีกครั้ง

### **2. ผู้ใช้ที่ login แล้ว**
- เข้า `/check-profile`
- ระบบตรวจสอบว่า login แล้ว
- นำทางไป `/register` เพื่อกรอกข้อมูล

### **3. การจัดการ Error**
- หากเกิดข้อผิดพลาดในการตรวจสอบ
- แสดงปุ่มให้ผู้ใช้เลือกดำเนินการเอง
- มีปุ่ม "เข้าสู่ระบบด้วย Line" และ "กลับหน้าหลัก"

## 🔧 Integration

### **กับ NextAuth.js**
- ใช้ `SessionProvider` จาก NextAuth
- เข้าถึง session data ผ่าน `useSession()`
- รองรับ JWT และ database sessions

### **กับระบบ Register**
- นำทางไปยัง `/register` เมื่อ login สำเร็จ
- ผู้ใช้สามารถกรอกข้อมูลได้ทันที

### **กับระบบ Line OAuth**
- นำทางไปยัง `/auth/signin` เมื่อยังไม่ได้ login
- ใช้ Line OAuth provider ที่ตั้งค่าไว้

## 🎯 Future Enhancements

- [ ] เพิ่มการตรวจสอบข้อมูลที่กรอกแล้ว
- [ ] เพิ่มการแสดงข้อมูลผู้ใช้ในหน้า check-profile
- [ ] เพิ่มการตั้งค่า redirect URL ตามความต้องการ
- [ ] เพิ่มการบันทึกประวัติการเข้าชม
- [ ] เพิ่มการแสดงสถิติการใช้งาน
- [ ] เพิ่มการแจ้งเตือนเมื่อ session หมดอายุ
- [ ] เพิ่มการตรวจสอบสิทธิ์การเข้าถึง
- [ ] เพิ่มการแสดงข้อมูล Line profile
- [ ] เพิ่มการเชื่อมต่อกับ API อื่นๆ
- [ ] เพิ่มการแสดงสถานะการเชื่อมต่อ

## 🐛 Troubleshooting

### **ปัญหาที่พบบ่อย**

1. **ไม่ redirect ไปไหน**
   - ตรวจสอบว่า NextAuth ตั้งค่าถูกต้อง
   - ตรวจสอบ environment variables
   - ตรวจสอบ console errors

2. **Redirect ไปผิดหน้า**
   - ตรวจสอบ logic ใน useEffect
   - ตรวจสอบ session data
   - ตรวจสอบ router configuration

3. **Loading ไม่หาย**
   - ตรวจสอบ SessionProvider
   - ตรวจสอบ NextAuth configuration
   - ตรวจสอบ network connectivity

### **Debug Steps**
1. เปิด Developer Tools
2. ตรวจสอบ Network tab
3. ตรวจสอบ Console errors
4. ตรวจสอบ Application tab > Session Storage
5. ทดสอบ `/api/auth/session` endpoint 