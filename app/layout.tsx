import Head from 'next/head'
import { type ReactNode } from 'react'
import Providers from './providers'
import "./styles/globals.css"

function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}

export default RootLayout