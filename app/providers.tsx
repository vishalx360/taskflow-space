"use client";
import { type ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>{children}</SessionProvider>
    )
}

export default Providers