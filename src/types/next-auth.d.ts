import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      lineId?: string
    }
  }

  interface JWT {
    accessToken?: string
    id?: string
    lineId?: string
    name?: string
    picture?: string
    provider?: string
  }
}
