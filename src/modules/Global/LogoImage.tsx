import Image from "next/image";
import LOGO_URL from "../../../public/logo/taskflow-full-logo.png";
import BLACK_LOGO_URL from "../../../public/logo/taskflow-full-logo-black.png";

function LogoImage({
  width = 250,
  className,
  dark = false,
}: {
  width?: number;
  className?: string;
  dark?: boolean;
}) {
  return (
    <Image
      width={width}
      height="50"
      src={dark ? BLACK_LOGO_URL : LOGO_URL}
      placeholder="blur"
      className={className}
      alt="Taskflow.space Logo"
      quality={100}
    />
  );
}

export default LogoImage;
