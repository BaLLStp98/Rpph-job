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
        token.id = profile.sub
        token.lineId = profile.sub
        token.name = profile.name
        token.picture = profile.picture
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string | undefined
        if (session.user) {
          session.user.id = token.id as string
          session.user.lineId = token.lineId as string
          session.user.image = token.picture as string
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
