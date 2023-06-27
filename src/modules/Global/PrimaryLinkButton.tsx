import { type IconType } from "react-icons";
import { FiExternalLink } from "react-icons/fi";

function PrimaryLinkButton({
  children,
  className,
  href,
  LeftIcon,
  RightIcon,
  isExternal,
  ...rest
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  isExternal?: boolean;
}) {
  return (
    <a
      className={`text-brand-dark block w-full rounded-full bg-accent px-5 py-3 text-center font-semibold md:px-10 md:py-3 ${
        className || ""
      }`}
      {...rest}
      href={href}
    >
      <div className="flex items-center justify-center gap-3">
        {LeftIcon && <LeftIcon className="text-inherit" />}
        {children}
        {RightIcon && <RightIcon className="text-inherit" />}
        {isExternal && <FiExternalLink className="text-inherit" />}
      </div>
    </a>
  );
}

export default PrimaryLinkButton;
