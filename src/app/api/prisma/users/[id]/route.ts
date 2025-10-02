// API route for individual user operations with Prisma
// GET /api/prisma/users/[id] - Get user by ID
// PUT /api/prisma/users/[id] - Update user
// DELETE /api/prisma/users/[id] - Delete user

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        education: {
          orderBy: { createdAt: 'asc' }
        },
        workExperience: {
          orderBy: { startDate: 'desc' }
        },
        applications: {
          orderBy: { submittedAt: 'desc' }
        }
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลผู้ใช้' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: user
    })
    
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updateData = await request.json()
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id
    delete updateData.createdAt
    delete updateData.updatedAt
    
    // Convert date strings to Date objects
    if (updateData.birthDate) {
      updateData.birthDate = new Date(updateData.birthDate)
    }
    if (updateData.lastLogin) {
      updateData.lastLogin = new Date(updateData.lastLogin)
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        education: true,
        workExperience: true
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว',
      data: user
    })
    
  } catch (error) {
    console.error('Error updating user:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลผู้ใช้ที่ต้องการอัปเดต' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.user.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      message: 'ลบข้อมูลผู้ใช้เรียบร้อยแล้ว'
    })
    
  } catch (error) {
    console.error('Error deleting user:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลผู้ใช้ที่ต้องการลบ' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลบข้อมูลผู้ใช้' },
      { status: 500 }
    )
  }
}
