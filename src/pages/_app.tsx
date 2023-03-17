import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";

import { Raleway } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const raleway = Raleway({ subsets: ['latin'] })


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={raleway.className}>
        <Toaster position="bottom-center" />
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
