import { type IconType } from 'react-icons'

function IconButton({ children, Icon, className = "" }: { children?: React.ReactNode, Icon: IconType, className?: string }) {
    return (
        <button className={`py-2 ${children ? "px-4" : "px-2"} font-normal text-sm flex items-center gap-2 rounded-xl bg-gray-200 ${className}`}>
            <Icon />
            {children}
        </button>
    )
}

export default IconButton