import { type ReactNode } from 'react'
import Navbar from './components/Navbar'

function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <Navbar activeSection='home' />
            {children}
        </div>
    )
}

export default DashboardLayout