import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import theme from "@constants/theme";
// fonts
import "@fontsource/poppins/700.css";
import "@fontsource/open-sans/400.css";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
