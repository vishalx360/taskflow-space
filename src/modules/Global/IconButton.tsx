import { type MouseEventHandler } from 'react'
import { type IconType } from 'react-icons'

function IconButton({ children, onClick, Icon, className = "" }: { children?: React.ReactNode, onClick: MouseEventHandler<HTMLButtonElement>, Icon: IconType, className?: string }) {
    return (
        <button onClick={onClick} className={`py-2 ${children ? "px-4" : "px-2"} font-normal text-sm flex items-center gap-2 rounded-xl bg-gray-200 ${className}`}>
            <Icon />
            {children}
        </button>
    )
}

export default IconButton