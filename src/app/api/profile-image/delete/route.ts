import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { prisma } from '../../../../../lib/prisma'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { fileName, applicationId } = body || {}

		if (!applicationId) {
			return NextResponse.json(
				{ success: false, message: 'ไม่พบ applicationId' },
				{ status: 400 }
			)
		}

		const publicDir = path.join(process.cwd(), 'public')
		const imageDir = path.join(publicDir, 'image')

		// ลบทุกเวอร์ชันของรูปสำหรับไอดีนี้ (profile_<id>.* และ profile_temp_<id>.*)
		if (fileName) {
			const targetPath = path.join(imageDir, fileName)
			if (fs.existsSync(targetPath)) {
				fs.unlinkSync(targetPath)
			}
		}
		const toDelete = fs
			.readdirSync(imageDir)
			.filter((f) => f.startsWith(`profile_${applicationId}.`) || f.startsWith(`profile_temp_${applicationId}.`))
		toDelete.forEach((f) => {
			try { fs.unlinkSync(path.join(imageDir, f)) } catch {}
		})

		// อัปเดตสถานะในฐานข้อมูลให้ไม่ชี้ไฟล์อีกต่อไป
		try {
			await prisma.user.update({ where: { id: applicationId }, data: { profileImageUrl: null } })
		} catch (e) {
			console.error('Failed to clear user profileImageUrl:', e)
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Delete profile image error:', error)
		return NextResponse.json(
			{ success: false, message: 'เกิดข้อผิดพลาดในการลบรูปภาพ' },
			{ status: 500 }
		)
	}
}


