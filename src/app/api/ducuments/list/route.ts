import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
	try {
		const dir = path.join(process.cwd(), 'public', 'ducuments');
		const entries = await fs.readdir(dir, { withFileTypes: true });
		const files = entries
			.filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.pdf'))
			.map((e) => e.name)
			.sort((a, b) => a.localeCompare(b, 'th')); // เรียงชื่อไฟล์

		return NextResponse.json({ success: true, files });
	} catch (error: any) {
		return NextResponse.json({ success: false, message: error?.message || 'failed' }, { status: 500 });
	}
}
