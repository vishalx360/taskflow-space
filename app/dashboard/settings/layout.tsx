import { type ReactNode } from 'react'

function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            Settings layout

            {children}
        </div>
    )
}

export default DashboardLayout