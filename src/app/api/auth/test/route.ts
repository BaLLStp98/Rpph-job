import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'NextAuth API is working',
    timestamp: new Date().toISOString(),
    env: {
      hasLineClientId: !!process.env.LINE_CLIENT_ID,
      hasLineClientSecret: !!process.env.LINE_CLIENT_SECRET,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL
    }
  })
}
