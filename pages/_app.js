import { Box, ChakraProvider, CSSReset } from "@chakra-ui/react";
import theme from "../constants/theme";
// fonts
import "@fontsource/poppins/700.css";
import "styles/globals.css";
import "@fontsource/open-sans/400.css";
import { NextUIProvider } from "@nextui-org/react";
import Navbar from "../global-components/Navbar";

function MyApp({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <Navbar />
        <Component {...pageProps} />
      </ChakraProvider>
    </NextUIProvider>
  );
}

export default MyApp;
