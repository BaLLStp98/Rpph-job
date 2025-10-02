import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const contactData = await request.json()

    if (!contactData) {
      return NextResponse.json(
        { error: 'No contact data provided' },
        { status: 400 }
      )
    }

    // ตรวจสอบข้อมูลที่จำเป็น
    const requiredFields = ['name', 'email', 'phone', 'contactType', 'message']
    for (const field of requiredFields) {
      if (!contactData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // สร้างโฟลเดอร์ data ถ้ายังไม่มี
    const dataDir = join(process.cwd(), 'data')
    await mkdir(dataDir, { recursive: true })

    const filePath = join(dataDir, 'contact-messages.json')
    
    let messages = []
    
    try {
      // อ่านไฟล์ที่มีอยู่
      const existingData = await readFile(filePath, 'utf-8')
      const parsedData = JSON.parse(existingData)
      messages = parsedData.messages || []
    } catch (error) {
      // ถ้าไฟล์ไม่มี ให้สร้างใหม่
      messages = []
    }

    // เพิ่มข้อมูลใหม่
    const newMessage = {
      id: Date.now().toString(),
      ...contactData,
      submittedAt: new Date().toISOString(),
      status: 'pending' // pending, read, replied
    }

    messages.push(newMessage)

    // บันทึกไฟล์
    const jsonData = JSON.stringify({ messages }, null, 2)
    await writeFile(filePath, jsonData, 'utf-8')

    // ส่งอีเมลแจ้งเตือน (ถ้ามีการตั้งค่า SMTP)
    // TODO: เพิ่มการส่งอีเมลแจ้งเตือน

    return NextResponse.json({
      success: true,
      message: 'Contact message saved successfully',
      messageId: newMessage.id
    })
  } catch (error) {
    console.error('Error saving contact message:', error)
    return NextResponse.json(
      { error: 'Failed to save contact message' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'contact-messages.json')
    
    try {
      const data = await readFile(filePath, 'utf-8')
      const parsedData = JSON.parse(data)
      return NextResponse.json(parsedData)
    } catch (error) {
      // ถ้าไฟล์ไม่มี ให้ส่งข้อมูลว่าง
      return NextResponse.json({ messages: [] })
    }
  } catch (error) {
    console.error('Error reading contact messages:', error)
    return NextResponse.json(
      { error: 'Failed to read contact messages' },
      { status: 500 }
    )
  }
}
