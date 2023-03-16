import { IconType } from "react-icons";
import { FiExternalLink } from "react-icons/fi";

function SecondaryLinkButton({
  children,
  className,
  href,
  LeftIcon,
  RightIcon,
  isExternal,
  ...rest
}: {
  children: any;
  href: string;
  className?: string;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  isExternal?: boolean;
}) {

  const externalProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}
  return (
    <a
      className={`block w-full rounded-full  border-2 border-accent bg-brand-light py-2  px-3 text-center font-semibold md:py-3 md:px-10 ${className}`}
      {...rest}
      href={href}

      {...externalProps}
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

export default SecondaryLinkButton;
