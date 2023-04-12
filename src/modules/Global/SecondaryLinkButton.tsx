import React from "react";
import { type IconType } from "react-icons";
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
  children: React.ReactNode;
  href: string;
  className?: string;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  isExternal?: boolean;
}) {
  const externalProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <a
      className={`border-accent bg-brand-light block  w-full rounded-full border-2 px-3  py-2 text-center font-semibold md:px-10 md:py-3 ${
        className || ""
      }`}
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
