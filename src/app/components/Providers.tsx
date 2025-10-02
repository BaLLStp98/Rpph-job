'use client'

import { SessionProvider, useSession } from "next-auth/react"
import { ReactNode, useEffect, useRef } from "react"
import { UserProvider } from '../../contexts/UserContext'

interface ProvidersProps {
  children: ReactNode
}

function KeyedUserProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const previousUserKeyRef = useRef<string | null>(null)
  const currentUserKey = (session?.user as any)?.id || (session?.user as any)?.email || 'guest'

  useEffect(() => {
    const previousUserKey = previousUserKeyRef.current
    if (previousUserKey && previousUserKey !== currentUserKey) {
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.clear()
        }
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('user')
        }
      } catch {}
    }
    previousUserKeyRef.current = currentUserKey
  }, [currentUserKey])

  return <UserProvider key={currentUserKey}>{children}</UserProvider>
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <KeyedUserProvider>
        {children}
      </KeyedUserProvider>
    </SessionProvider>
  )
}
