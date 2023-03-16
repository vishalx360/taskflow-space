import { type HTMLAttributes, type MouseEventHandler } from "react";
import { type IconType } from "react-icons";
import { BiLoaderAlt } from "react-icons/bi";

function PrimaryButton({
  children,
  className,
  isLoading = false,
  loadingText,
  LeftIcon,
  disabled,
  RightIcon,
  onClick,
  ...rest
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>,
  children: React.ReactNode;
  className?: HTMLAttributes<HTMLButtonElement>["className"];
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  type?: any;
}) {
  return (
    <button
      className={`w-fit rounded-full text-white bg-black px-5 py-3 text-center text-sm font-semibold text-brand-dark transition-all hover:bg-neutral-900 focus:outline-none  focus:ring-4 
        focus:ring-accent disabled:bg-neutral-500 active:translate-y-[2px] ${className || ""}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      <div className="flex items-center justify-center gap-3">
        {isLoading && <BiLoaderAlt className="animate-spin text-xl" />}
        {LeftIcon && !isLoading && <LeftIcon className="text-inherit" />}
        {isLoading && loadingText ? loadingText : children}
        {RightIcon && <RightIcon className="text-inherit" />}
      </div>
    </button>
  );
}

export default PrimaryButton;
