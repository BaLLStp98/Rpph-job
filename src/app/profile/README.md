# Profile Page Refactoring

## Overview
หน้า Profile ได้ถูกแยกออกเป็น components ย่อยเพื่อให้ code สั้นลงและจัดการได้ง่ายขึ้น

## Components Structure

### 1. ProfileImageSection
- **หน้าที่**: จัดการการแสดงรูปภาพโปรไฟล์และการอัปโหลด/ลบรูปภาพ
- **Props**:
  - `profileImage`: string | null - URL ของรูปภาพ
  - `profileData`: any - ข้อมูลโปรไฟล์
  - `editing`: boolean - สถานะการแก้ไข
  - `onImageChange`: (imageUrl: string) => void - callback เมื่อเปลี่ยนรูปภาพ
  - `onImageDelete`: () => void - callback เมื่อลบรูปภาพ

### 2. PersonalInfoSection
- **หน้าที่**: จัดการข้อมูลส่วนตัวพื้นฐาน
- **Props**:
  - `profileData`: any - ข้อมูลโปรไฟล์
  - `editing`: boolean - สถานะการแก้ไข
  - `errors`: {[key: string]: string} - ข้อผิดพลาดในการ validation
  - `hospitalDepartments`: Array<{id: string, name: string}> - รายการหน่วยงาน
  - `onEdit`: () => void - callback เมื่อเริ่มแก้ไข
  - `onSave`: () => void - callback เมื่อบันทึก
  - `onCancel`: () => void - callback เมื่อยกเลิก
  - `onChange`: (field: string, value: string | boolean) => void - callback เมื่อเปลี่ยนข้อมูล
  - `getInputClassName`: (hasError: boolean) => string - ฟังก์ชันสร้าง className

### 3. EducationSection
- **หน้าที่**: จัดการข้อมูลประวัติการศึกษา
- **Props**:
  - `profileData`: any - ข้อมูลโปรไฟล์
  - `editing`: boolean - สถานะการแก้ไข
  - `errors`: {[key: string]: string} - ข้อผิดพลาดในการ validation
  - `onAddEducation`: () => void - callback เมื่อเพิ่มข้อมูลการศึกษา
  - `onRemoveEducation`: (index: number) => void - callback เมื่อลบข้อมูลการศึกษา
  - `onEducationChange`: (index: number, field: string, value: string) => void - callback เมื่อเปลี่ยนข้อมูลการศึกษา
  - `getInputClassName`: (hasError: boolean) => string - ฟังก์ชันสร้าง className

### 4. WorkExperienceSection
- **หน้าที่**: จัดการข้อมูลประสบการณ์การทำงาน
- **Props**:
  - `profileData`: any - ข้อมูลโปรไฟล์
  - `editing`: boolean - สถานะการแก้ไข
  - `errors`: {[key: string]: string} - ข้อผิดพลาดในการ validation
  - `onAddWork`: () => void - callback เมื่อเพิ่มข้อมูลการทำงาน
  - `onRemoveWork`: (index: number) => void - callback เมื่อลบข้อมูลการทำงาน
  - `onWorkChange`: (index: number, field: string, value: string | boolean) => void - callback เมื่อเปลี่ยนข้อมูลการทำงาน
  - `getInputClassName`: (hasError: boolean) => string - ฟังก์ชันสร้าง className

### 5. DocumentsSection
- **หน้าที่**: จัดการการแสดงเอกสารแนบ
- **Props**:
  - `uploadedDocuments`: Array<{id: number, documentType: string, fileName: string, filePath: string, fileSize?: number, mimeType?: string}> - รายการเอกสาร
  - `onDeleteDocument`: (documentId: number) => void - callback เมื่อลบเอกสาร

## Benefits of Refactoring

1. **Code Organization**: แยก code ออกเป็น components ที่มีหน้าที่ชัดเจน
2. **Maintainability**: ง่ายต่อการบำรุงรักษาและแก้ไข
3. **Reusability**: สามารถนำ components ไปใช้ในที่อื่นได้
4. **Testing**: ง่ายต่อการเขียน unit tests
5. **Performance**: สามารถใช้ React.memo เพื่อ optimize re-rendering
6. **Readability**: code อ่านง่ายและเข้าใจง่ายขึ้น

## Usage

```tsx
import {
  ProfileImageSection,
  PersonalInfoSection,
  EducationSection,
  WorkExperienceSection,
  DocumentsSection
} from './components'

// ใช้ใน main component
<ProfileImageSection
  profileImage={profileImage}
  profileData={profileData}
  editing={editing}
  onImageChange={setProfileImage}
  onImageDelete={() => setProfileImage(null)}
/>
```

## File Structure

```
src/app/profile/
├── components/
│   ├── index.ts
│   ├── ProfileImageSection.tsx
│   ├── PersonalInfoSection.tsx
│   ├── EducationSection.tsx
│   ├── WorkExperienceSection.tsx
│   └── DocumentsSection.tsx
├── page.tsx
└── README.md
```
