'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardBody, Button, Spinner } from '@heroui/react'

export default function TestPdfPage() {
	const [files, setFiles] = useState<string[]>([])
	const [loading, setLoading] = useState(true)
	const [selected, setSelected] = useState<string | null>(null)

	useEffect(() => {
		const run = async () => {
			try {
				const res = await fetch('/api/ducuments/list')
				const data = await res.json()
				if (data.success) setFiles(data.files)
			} finally {
				setLoading(false)
			}
		}
		run()
	}, [])

	return (
		<div className="min-h-screen p-6 bg-[#525659]">
			<Card className="max-w-6xl mx-auto">
				<CardBody>
					<h1 className="text-xl font-bold mb-4">ทดสอบพรีวิว PDF จาก /public/ducuments</h1>
					{loading ? (
						<div className="flex items-center gap-2 text-gray-600"><Spinner size="sm"/> กำลังโหลดรายชื่อไฟล์...</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								{files.map((name) => (
									<Button key={name} variant="flat" color="primary" className="w-full justify-start"
										onClick={() => setSelected(name)}>
										{name}
									</Button>
								))}
							</div>
							<div className="md:col-span-2 h-[80vh] bg-[#2b2b2b]">
								{selected ? (
									<object data={`/ducuments/${encodeURIComponent(selected)}`} type="application/pdf" className="w-full h-full">
										<embed src={`/ducuments/${encodeURIComponent(selected)}`} type="application/pdf" className="w-full h-full" />
										<div className="flex items-center justify-center h-full text-white text-sm">
											ไม่สามารถแสดงตัวอย่างไฟล์ได้
											<a className="underline ml-2" href={`/ducuments/${encodeURIComponent(selected)}`} target="_blank" rel="noreferrer">เปิดในแท็บใหม่</a>
										</div>
									</object>
								) : (
									<div className="flex items-center justify-center h-full text-white/80">เลือกไฟล์จากด้านซ้ายเพื่อพรีวิว</div>
								)}
							</div>
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	)
}
