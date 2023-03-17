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
  overwriteClassname = false,
  ...rest
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: HTMLAttributes<HTMLButtonElement>["className"];
  disabled?: boolean;
  overwriteClassname?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  LeftIcon?: IconType;
  RightIcon?: IconType;
  type?: any;
}) {
  return (
    <button
      className={
        !overwriteClassname
          ? `text-brand-dark focus:ring-accent w-fit rounded-full bg-black px-5 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-neutral-900  focus:outline-none 
        focus:ring-4 active:translate-y-[2px] disabled:bg-neutral-500 ${
          className || ""
        }`
          : className
      }
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
