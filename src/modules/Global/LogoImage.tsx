import Image from "next/image";
import LOGO_URL from "../../../public/logo/taskflow-full-logo.png";
import BLACK_LOGO_URL from "../../../public/logo/taskflow-full-logo-black.png";

function LogoImage({ dark = false }: { dark?: boolean }) {
  return (
    <Image
      width="250"
      height="50"
      src={dark ? BLACK_LOGO_URL : LOGO_URL}
      placeholder="blur"
      className="mr-3 "
      alt="Taskflow.space Logo"
      quality={100}
    />
  );
}

export default LogoImage;
