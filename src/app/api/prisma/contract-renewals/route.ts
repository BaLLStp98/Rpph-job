import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

export async function GET() {
  try {
    const items = await prisma.contractRenewal.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ data: items })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const created = await prisma.contractRenewal.create({ data: body })
    return NextResponse.json({ data: created }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Failed to create' }, { status: 500 })
  }
}


