import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'กรุณาเลือกไฟล์' }, { status: 400 })
    }

    // ตรวจสอบว่ามี ContractRenewal อยู่จริง
    const { id } = await params
    const exists = await prisma.contractRenewal.findUnique({ where: { id } })
    if (!exists) {
      return NextResponse.json({ error: 'ไม่พบรายการต่อสัญญา' }, { status: 404 })
    }

    // สร้างโฟลเดอร์
    const uploadDir = join(process.cwd(), 'public', 'contract-renewals')
    await mkdir(uploadDir, { recursive: true })

    // ตั้งชื่อไฟล์ใหม่
    const timestamp = Date.now()
    const ext = file.name.includes('.') ? file.name.split('.').pop() : ''
    const fileName = `${id}-${timestamp}${ext ? '.' + ext : ''}`
    const filePath = join(uploadDir, fileName)

    // เขียนไฟล์ลงดิสก์
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // บันทึกฐานข้อมูล
    const attachment = await prisma.contractRenewalAttachment.create({
      data: {
        contractRenewalId: id,
        fileName: file.name,
        filePath: `/contract-renewals/${fileName}`,
        mimeType: file.type,
        fileSize: file.size || null
      }
    })

    return NextResponse.json({ success: true, data: attachment })
  } catch (error) {
    console.error('Error uploading attachment:', error)
    return NextResponse.json({ error: 'อัปโหลดไฟล์ไม่สำเร็จ' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}


