import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { prisma } from '../../../../../lib/prisma'

const ensureDir = (dirPath: string) => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}
}

const getExtensionFromNameOrType = (file: File): string => {
	// Prefer file name extension, fallback to mime type
	const name = (file as any).name as string | undefined
	if (name && name.includes('.')) {
		const ext = name.split('.').pop()!.toLowerCase()
		return ext
	}
	const mime = file.type || ''
	if (mime === 'image/png') return 'png'
	if (mime === 'image/jpeg') return 'jpg'
	if (mime === 'image/jpg') return 'jpg'
	if (mime === 'image/webp') return 'webp'
	if (mime === 'image/gif') return 'gif'
	return 'png'
}

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()
		const file = formData.get('file') as File | null
		const applicationId = formData.get('applicationId') as string | null

		if (!file || !applicationId) {
			return NextResponse.json(
				{ success: false, message: 'ข้อมูลไม่ครบ (file หรือ applicationId)' },
				{ status: 400 }
			)
		}

		const publicDir = path.join(process.cwd(), 'public')
		const imageDir = path.join(publicDir, 'image')
		ensureDir(imageDir)

		// ลบไฟล์เดิมของไอดีนี้ (ถ้ามี) เพื่อแทนที่
		const existingFiles = fs
			.readdirSync(imageDir)
			.filter((f) => f.startsWith(`profile_${applicationId}.`))
		existingFiles.forEach((f) => {
			try { fs.unlinkSync(path.join(imageDir, f)) } catch {}
		})

		const ext = getExtensionFromNameOrType(file)
		const fileName = `profile_${applicationId}.${ext}`
		const filePath = path.join(imageDir, fileName)

		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)
		fs.writeFileSync(filePath, buffer)

		// อัปเดตฟิลด์ profileImage ในตาราง ApplicationForm หรือ ResumeDeposit
		try {
			// ลองอัปเดต ApplicationForm ก่อน
			await prisma.applicationForm.update({
				where: { id: applicationId },
				data: { profileImage: fileName }
			})
		} catch (e) {
			// ถ้าไม่สำเร็จ ลองอัปเดต ResumeDeposit
			try {
				await prisma.resumeDeposit.update({
					where: { id: applicationId },
					data: { profileImageUrl: fileName }
				})
			} catch (e2) {
				console.error('Failed to update profileImage in both ApplicationForm and ResumeDeposit:', e2)
				// ไม่ fail การอัปโหลดรูป แม้จะอัปเดต DB ไม่สำเร็จ
			}
		}

		return NextResponse.json({ success: true, profileImage: fileName })
	} catch (error) {
		console.error('Upload profile image error:', error)
		return NextResponse.json(
			{ success: false, message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' },
			{ status: 500 }
		)
	}
}