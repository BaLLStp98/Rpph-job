import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Simple file-based storage for demonstration
const DATA_FILE = path.join(process.cwd(), 'data', 'register.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// // Ensure public/image directory exists
// const ensureImageDir = () => {
//   const imageDir = path.join(process.cwd(), 'public', 'image')
//   if (!fs.existsSync(imageDir)) {
//     fs.mkdirSync(imageDir, { recursive: true })
//   }
//   return imageDir
// }

// Read applications from file
const readApplications = () => {
  ensureDataDir()
  if (!fs.existsSync(DATA_FILE)) {
    return []
  }
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading applications:', error)
    return []
  }
}

// Write applications to file
const writeApplications = (applications: any[]) => {
  ensureDataDir()
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(applications, null, 2))
  } catch (error) {
    console.error('Error writing applications:', error)
    throw error
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const contentType = request.headers.get('content-type')
    
//     let applicationData: any = {}
    
//     if (contentType?.includes('application/json')) {
//       // Handle JSON data (from admin/members)
//       applicationData = await request.json()
//     } else {
//       // Handle FormData (from register form)
//       const formData = await request.formData()
      
//       // Extract form data
//       const prefix = formData.get('prefix') as string
//       const firstName = formData.get('firstName') as string
//       const lastName = formData.get('lastName') as string
//       const lineDisplayName = formData.get('lineDisplayName') as string
//       const email = formData.get('email') as string
//       const phone = formData.get('phone') as string
//       const gender = formData.get('gender') as string
//       const birthDate = formData.get('birthDate') as string
//       const nationality = formData.get('nationality') as string
//       const religion = formData.get('religion') as string
//       const maritalStatus = formData.get('maritalStatus') as string
//       const address = formData.get('address') as string
//       const province = formData.get('province') as string
//       const district = formData.get('district') as string
//       const subDistrict = formData.get('subDistrict') as string
//       const postalCode = formData.get('postalCode') as string
//       const emergencyContact = formData.get('emergencyContact') as string
//       const emergencyPhone = formData.get('emergencyPhone') as string
//       const isHospitalStaff = formData.get('isHospitalStaff') === 'true'
//       const hospitalDepartment = formData.get('hospitalDepartment') as string
//       const username = formData.get('username') as string
//       const password = formData.get('password') as string
      
//       // Parse JSON arrays
//       const educationList = JSON.parse(formData.get('educationList') as string)
//       const workList = JSON.parse(formData.get('workList') as string)
      
//       applicationData = {
//         prefix,
//         firstName,
//         lastName,
//         lineDisplayName,
//         email,
//         phone,
//         gender,
//         birthDate,
//         nationality,
//         religion,
//         maritalStatus,
//         address,
//         province,
//         district,
//         subDistrict,
//         postalCode,
//         emergencyContact,
//         emergencyPhone,
//         isHospitalStaff,
//         hospitalDepartment,
//         username,
//         password,
//         educationList,
//         workList
//       }
      
//       // Handle profile image (save to public/image)
//       const profileImage = formData.get('profileImage') as File | null
//       let profileImageUrl: string | null = null

//       // Pre-generate id for naming image file
//       const generatedId = Date.now().toString()

//       if (profileImage) {
//         try {
//           const imageDir = ensureImageDir()
//           const arrayBuffer = await profileImage.arrayBuffer()
//           const buffer = Buffer.from(arrayBuffer)
//           // determine extension
//           const originalName = (profileImage as any).name as string | undefined
//           let ext = 'png'
//           if (originalName && originalName.includes('.')) {
//             ext = originalName.split('.').pop()!.toLowerCase()
//           } else {
//             const mime = (profileImage as any).type as string | undefined
//             if (mime === 'image/jpeg' || mime === 'image/jpg') ext = 'jpg'
//             else if (mime === 'image/webp') ext = 'webp'
//             else if (mime === 'image/gif') ext = 'gif'
//           }
//           const fileName = `profile_${generatedId}.${ext}`
//           const filePath = path.join(imageDir, fileName)
//           fs.writeFileSync(filePath, buffer)
//           profileImageUrl = fileName
//         } catch (e) {
//           console.error('Error saving profile image:', e)
//         }
//       }
      
//       applicationData.profileImageUrl = profileImageUrl
//     }

//     // Get Line ID from session (you might need to pass this from frontend)
//     const lineId = applicationData.lineId || 'unknown';
//     console.log('API Register - Received Line ID:', lineId);

//     // Pre-generate id for naming image file
//     const generatedId = applicationData.id || Date.now().toString()

//     // Create application object (for create flow)
//     const application = {
//       id: generatedId,
//       lineId,
//       prefix: applicationData.prefix,
//       firstName: applicationData.firstName,
//       lastName: applicationData.lastName,
//       lineDisplayName: applicationData.lineDisplayName,
//       email: applicationData.email,
//       phone: applicationData.phone,
//       gender: applicationData.gender,
//       birthDate: applicationData.birthDate,
//       nationality: applicationData.nationality,
//       religion: applicationData.religion,
//       maritalStatus: applicationData.maritalStatus,
//       address: applicationData.address,
//       province: applicationData.province,
//       district: applicationData.district,
//       subDistrict: applicationData.subDistrict,
//       postalCode: applicationData.postalCode,
//       emergencyContact: applicationData.emergencyContact,
//       emergencyPhone: applicationData.emergencyPhone,
//       isHospitalStaff: applicationData.isHospitalStaff,
//       hospitalDepartment: applicationData.hospitalDepartment,
//       username: applicationData.username,
//       password: applicationData.password,
//       profileImageUrl: applicationData.profileImageUrl,
//       educationList: applicationData.educationList || [],
//       workList: applicationData.workList || [],
//       createdAt: applicationData.createdAt || new Date().toISOString(),
//       updatedAt: applicationData.updatedAt || new Date().toISOString(),
//       status: applicationData.status || 'pending'
//     }

//     console.log('API Register - Created application with Line ID:', application.lineId);
//     console.log('API Register - Application details:', {
//       id: application.id,
//       lineId: application.lineId,
//       name: `${application.firstName} ${application.lastName}`,
//       email: application.email
//     });

//     // Read existing applications
//     const applications = readApplications()

//     // Upsert by lineId
//     let action: 'created' | 'updated' = 'created'
//     let applicationIdToReturn = application.id
//     const existingIndex = applications.findIndex((app: any) => app.lineId === lineId)

//     if (existingIndex !== -1) {
//       // Update existing application but keep original id/createdAt
//       const existing = applications[existingIndex]
//       const updated = {
//         ...existing,
//         ...application,
//         id: existing.id,
//         createdAt: existing.createdAt,
//         updatedAt: new Date().toISOString(),
//       }
//       applications[existingIndex] = updated
//       action = 'updated'
//       applicationIdToReturn = existing.id
//     } else {
//       applications.push(application)
//       action = 'created'
//       applicationIdToReturn = application.id
//     }

//     // Write back to file
//     writeApplications(applications)

//     return NextResponse.json({
//       success: true,
//       message: action === 'created' ? 'Application created successfully' : 'Application updated successfully',
//       applicationId: applicationIdToReturn,
//       action,
//     })

//   } catch (error) {
//     console.error('Registration error:', error)
//     return NextResponse.json(
//       {
//         success: false,
//         message: 'Failed to submit application',
//         error: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     )
//   }
// }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    
    const applications = readApplications()
    
    // ถ้ามี department parameter ให้กรองข้อมูล
    let filteredApplications = applications
    if (department) {
      filteredApplications = applications.filter((app: any) => 
        app.hospitalDepartment === department || 
        app.department === department ||
        app.appliedDepartment === department
      )
    }
    
    return NextResponse.json(filteredApplications)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch applications',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 