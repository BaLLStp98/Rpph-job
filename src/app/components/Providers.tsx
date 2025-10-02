'use client'

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { UserProvider } from '../../contexts/UserContext'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </SessionProvider>
  )
}
