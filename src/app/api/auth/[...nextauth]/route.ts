import NextAuth from "next-auth"
import LineProvider from "next-auth/providers/line"
import { prisma } from "../../../../../lib/prisma"

const handler = NextAuth({
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID || 'demo-client-id',
      clientSecret: process.env.LINE_CLIENT_SECRET || 'demo-client-secret',
      authorization: {
        params: { scope: 'openid profile email' }
      }
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      try {
        if (account?.provider === 'line' && profile) {
          const lineId = (profile as any).sub
          const displayName = (profile as any).name ?? (profile as any).display_name ?? null
          const picture = (profile as any).picture ?? null
          const email = (profile as any).email ?? null

          // ใช้ email ถ้ามี ไม่เช่นนั้นสร้าง placeholder ปลอดภัยตามมาตรฐาน
          const normalizedEmail = email ?? (lineId ? `${lineId}@line.local` : undefined)

          // upsert ผู้ใช้ตาม lineId (unique) หรือ email (unique)
          const user = await prisma.user.upsert({
            where: lineId ? { lineId } : { email: normalizedEmail as string },
            update: {
              lineDisplayName: displayName ?? undefined,
              profileImageUrl: picture ?? undefined,
              lastLogin: new Date(),
            },
            create: {
              lineId: lineId ?? null,
              lineDisplayName: displayName ?? null,
              email: normalizedEmail ?? `${crypto.randomUUID()}@line.local`,
              firstName: displayName ?? 'ผู้ใช้',
              lastName: '-',
              role: 'APPLICANT',
              status: 'ACTIVE',
              profileImageUrl: picture ?? null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })

          // อัปเดต lastLogin แยกอีกครั้งเผื่อ callback ในอนาคตต้องใช้งาน
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          })
        }
        return true
      } catch (error) {
        console.error('LINE signIn upsert error:', error)
        return false
      }
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      if (profile) {
        token.id = (profile as any).sub
        token.lineId = (profile as any).sub
        token.name = (profile as any).name
        token.picture = (profile as any).picture
        token.email = (profile as any).email
      }

      // เติมข้อมูลจากฐาน เพื่อให้มี userId/email ที่แน่นอน (รองรับกรณี LINE ไม่ส่งอีเมล)
      try {
        if (!token.userId || !token.email) {
          const lineId = (token.lineId as string | undefined) ?? undefined
          const existing = await prisma.user.findFirst({
            where: lineId ? { lineId } : (token.email ? { email: token.email as string } : undefined),
            select: { id: true, email: true }
          })
          if (existing) {
            token.userId = existing.id
            token.email = existing.email
          }
        }
      } catch (e) {
        console.warn('jwt user hydrate warn:', e)
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string | undefined
        if (session.user) {
          // ใช้ userId จากฐานข้อมูลเป็นหลัก ถ้าไม่มีให้ fallback เป็น line sub
          session.user.id = (token.userId as string) || (token.id as string)
          session.user.lineId = token.lineId as string | undefined
          session.user.image = token.picture as string | undefined
          session.user.email = (token.email as string) || session.user.email
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  },
})

export { handler as GET, handler as POST }
