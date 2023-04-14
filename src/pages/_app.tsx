import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import NextNprogress from "nextjs-progressbar";
import ScrollToTop from "react-scroll-to-top";

import { api } from "@/utils/api";

import { Toaster } from "@/modules/ui/toaster";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Button } from "@/modules/ui/button";
import { MdArrowUpward } from "react-icons/md";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster />
      {/* black color  */}
      <NextNprogress
        color="#424242"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
      />
      <main className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
      <ScrollToTop
        component={<ScrollToTopButton />}
        smooth
        style={{
          background: "transparent",
          // simple shadow
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          borderRadius: "50%",
          position: "fixed",
          bottom: 20,
          overflow: "visible",
          zIndex: 100,
          right: 20,
        }}
        color="#"
      />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

function ScrollToTopButton() {
  return (
    <div className="group rounded-full bg-black p-2 text-white">
      <MdArrowUpward size="1.5em" />
    </div>
  );
}
