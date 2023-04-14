import Image from "next/image";
import FULL_DARK_LOGO_URL from "../../../public/logo/taskflow-full-logo-dark.png";
import FULL_LOGO_URL from "../../../public/logo/taskflow-full-logo.png";

import SHORT_LOGO_URL from "../../../public/logo/taskflow-short-logo.png";
import SHORT_DARK_LOGO_URL from "../../../public/logo/taskflow-short-logo-dark.png";

function LogoImage({
  width,
  className,
  dark = false,
  short = false,
}: {
  width?: number;
  className?: string;
  dark?: boolean;
  short?: boolean;
}) {
  return (
    <Image
      width={width ? width : short ? 70 : 200}
      height="50"
      src={
        dark
          ? short
            ? SHORT_DARK_LOGO_URL
            : FULL_DARK_LOGO_URL
          : short
          ? SHORT_LOGO_URL
          : FULL_LOGO_URL
      }
      className={className}
      alt="Taskflow.space Logo"
      quality={100}
    />
  );
}

export default LogoImage;
