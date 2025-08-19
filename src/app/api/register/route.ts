import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Simple file-based storage for demonstration
const DATA_FILE = path.join(process.cwd(), 'data', 'applications.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const prefix = formData.get('prefix') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const gender = formData.get('gender') as string
    const birthDate = formData.get('birthDate') as string
    const nationality = formData.get('nationality') as string
    const religion = formData.get('religion') as string
    const maritalStatus = formData.get('maritalStatus') as string
    const address = formData.get('address') as string
    const province = formData.get('province') as string
    const district = formData.get('district') as string
    const subDistrict = formData.get('subDistrict') as string
    const postalCode = formData.get('postalCode') as string
    const emergencyContact = formData.get('emergencyContact') as string
    const emergencyPhone = formData.get('emergencyPhone') as string
    
    // Parse JSON arrays
    const educationList = JSON.parse(formData.get('educationList') as string)
    const workList = JSON.parse(formData.get('workList') as string)
    
    // Handle profile image
    const profileImage = formData.get('profileImage') as File | null
    let profileImageUrl = null
    
    if (profileImage) {
      // In a real application, you would upload the image to a cloud storage service
      // For now, we'll store the file name
      profileImageUrl = profileImage.name
    }

    // Get Line ID from session (you might need to pass this from frontend)
    const lineId = formData.get('lineId') as string || 'unknown';
    console.log('API Register - Received Line ID:', lineId);

    // Create application object (for create flow)
    const application = {
      id: Date.now().toString(),
      lineId,
      prefix,
      firstName,
      lastName,
      email,
      phone,
      gender,
      birthDate,
      nationality,
      religion,
      maritalStatus,
      address,
      province,
      district,
      subDistrict,
      postalCode,
      emergencyContact,
      emergencyPhone,
      profileImageUrl,
      educationList,
      workList,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending'
    }

    console.log('API Register - Created application with Line ID:', application.lineId);
    console.log('API Register - Application details:', {
      id: application.id,
      lineId: application.lineId,
      name: `${application.firstName} ${application.lastName}`,
      email: application.email
    });

    // Read existing applications
    const applications = readApplications()

    // Upsert by lineId
    let action: 'created' | 'updated' = 'created'
    let applicationIdToReturn = application.id
    const existingIndex = applications.findIndex((app: any) => app.lineId === lineId)

    if (existingIndex !== -1) {
      // Update existing application but keep original id/createdAt
      const existing = applications[existingIndex]
      const updated = {
        ...existing,
        ...application,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      }
      applications[existingIndex] = updated
      action = 'updated'
      applicationIdToReturn = existing.id
    } else {
      applications.push(application)
      action = 'created'
      applicationIdToReturn = application.id
    }

    // Write back to file
    writeApplications(applications)

    return NextResponse.json({
      success: true,
      message: action === 'created' ? 'Application created successfully' : 'Application updated successfully',
      applicationId: applicationIdToReturn,
      action,
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit application',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const applications = readApplications()
    
    return NextResponse.json({
      success: true,
      applications: applications
    })
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