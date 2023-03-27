import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import NextNprogress from "nextjs-progressbar";

import { api } from "~/utils/api";

import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";

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
      <Toaster position="bottom-center" />
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
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
