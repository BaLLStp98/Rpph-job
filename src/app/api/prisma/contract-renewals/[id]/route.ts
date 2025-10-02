import { NextResponse } from 'next/server'
import { prisma } from '../../../../../../lib/prisma'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.contractRenewal.findUnique({ where: { id: params.id } })
    if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: item })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Failed to fetch' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const updated = await prisma.contractRenewal.update({ where: { id: params.id }, data: body })
    return NextResponse.json({ data: updated })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.contractRenewal.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Failed to delete' }, { status: 500 })
  }
}


