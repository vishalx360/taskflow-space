import { useAutoAnimate } from "@formkit/auto-animate/react";
import Image from "next/image";

function BoardBackground({
  background,
}: {
  background: string | undefined | null;
}) {
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent} className="fixed left-0 top-0 h-full w-screen ">
      {background && background.startsWith("wallpaper:") && (
        <Image
          key={background}
          className="w-screen object-cover"
          alt="background"
          fill
          src={background.slice(10)}
        />
      )}
      {background && background.startsWith("gradient:") && (
        <div
          key={background}
          className="h-screen w-screen"
          style={{ backgroundImage: background.slice(9) }}
        />
      )}
    </div>
  );
}

export default BoardBackground;
