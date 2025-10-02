// API route for individual department operations
// GET /api/prisma/departments/[id] - Get department by ID
// PUT /api/prisma/departments/[id] - Update department
// DELETE /api/prisma/departments/[id] - Delete department

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        attachments: true
      }
    })
    
    if (!department) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลแผนก' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: department
    })
    
  } catch (error) {
    console.error('Error fetching department:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแผนก' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const maxRetries = 3
  let retryCount = 0
  
  // Read request body once outside the retry loop
  const { id } = await params
  const rawBody = await request.text()
  const updateData = rawBody ? JSON.parse(rawBody) : {}
  // แยก missionGroupId/missionGroupName ออก เพื่อไม่ให้ Prisma validation error
  const missionGroupIdFromBody = updateData.missionGroupId
  delete updateData.missionGroupId
  delete updateData.missionGroupName
  
  // Remove fields that shouldn't be updated directly
  delete updateData.id
  delete updateData.createdAt
  delete updateData.updatedAt
  // Block direct attachments mutation in this endpoint
  delete updateData.attachments
  
  // Convert date strings to Date objects
  const convertDate = (dateStr: string) => {
    if (!dateStr) return null
    return new Date(dateStr)
  }
  
  // Convert status and gender
  const convertStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'ACTIVE'
      case 'inactive': return 'INACTIVE'
      case 'pending': return 'PENDING'
      default: return 'ACTIVE'
    }
  }
  
  const convertGender = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case 'male': return 'MALE'
      case 'female': return 'FEMALE'
      case 'any': return 'UNKNOWN'
      default: return 'UNKNOWN'
    }
  }
  
  // Convert specific fields
  if (updateData.applicationStartDate) {
    updateData.applicationStartDate = convertDate(updateData.applicationStartDate)
  }
  if (updateData.applicationEndDate) {
    updateData.applicationEndDate = convertDate(updateData.applicationEndDate)
  }
  if (updateData.status) {
    updateData.status = convertStatus(updateData.status)
  }
  if (updateData.gender) {
    updateData.gender = convertGender(updateData.gender)
  }
  if (updateData.employeeCount) {
    updateData.employeeCount = parseInt(updateData.employeeCount)
  }
  
  while (retryCount < maxRetries) {
    try {
    
      const department = await prisma.$transaction(async (tx) => {
        // First check if the department exists
        const existingDepartment = await tx.department.findUnique({
          where: { id }
        })
        
        if (!existingDepartment) {
          throw new Error(`Department with id ${id} not found`)
        }
        
        const updated = await tx.department.update({
          where: { id },
          data: updateData,
          include: {
            attachments: true
          }
        })
        // อัปเดต mission_group_id ถ้าส่งมา
        if (missionGroupIdFromBody) {
          await tx.$executeRawUnsafe(
            'UPDATE departments SET mission_group_id = ? WHERE id = ?',
            String(missionGroupIdFromBody),
            id
          )
        }
        return updated
      }, {
        timeout: 10000, // 10 second timeout
        isolationLevel: 'ReadCommitted'
      })
      
      return NextResponse.json({
        success: true,
        message: 'อัปเดตแผนกเรียบร้อยแล้ว',
        data: department
      })
      
    } catch (error) {
      console.error(`Error updating department (attempt ${retryCount + 1}):`, error)
      
      // Check if it's a lock timeout error or MySQL lock wait timeout
      if (error.code === 'P2034' || 
          (error.message && error.message.includes('Lock wait timeout')) ||
          (error.message && error.message.includes('1205'))) {
        retryCount++
        if (retryCount < maxRetries) {
          // Wait before retry (exponential backoff with jitter)
          const baseDelay = Math.min(Math.pow(2, retryCount) * 1000, 3000) // Cap at 3 seconds
          const jitter = Math.random() * 1000 // Add random jitter
          const delay = baseDelay + jitter
          console.log(`Lock timeout detected, retrying in ${Math.round(delay)}ms... (attempt ${retryCount + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
      }
      
      // Check if it's a "record not found" error
      if (error.code === 'P2025' || 
          (error.message && error.message.includes('not found'))) {
        console.error('Department not found:', error)
        return NextResponse.json(
          { success: false, message: 'ไม่พบแผนกที่ต้องการอัปเดต' },
          { status: 404 }
        )
      }
      
      // For other errors, don't retry
      console.error('Non-retryable error:', error)
      return NextResponse.json(
        { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตแผนก' },
        { status: 500 }
      )
    }
  }
  
  return NextResponse.json(
    { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตแผนก หลังจากลองซ้ำหลายครั้ง' },
    { status: 500 }
  )
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Delete department (cascade will delete related records)
    await prisma.department.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      message: 'ลบแผนกเรียบร้อยแล้ว'
    })
    
  } catch (error) {
    console.error('Error deleting department:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบแผนก' },
      { status: 500 }
    )
  }
}
