import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import theme from "../constants/theme";
// fonts
import "@fontsource/open-sans/400.css";
import "@fontsource/poppins/700.css";
import Layout from "@global-components/Layout";
import { NextUIProvider } from "@nextui-org/react";
import "styles/globals.css";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <NextUIProvider>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ChakraProvider>
    </NextUIProvider>
  );
}

export default MyApp;
