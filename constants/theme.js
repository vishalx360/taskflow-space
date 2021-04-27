import { extendTheme } from "@chakra-ui/react";
const theme = extendTheme({
  fonts: {
    heading: "Poppins",
    body: "Open Sans",
  },
  colors: {
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
});
export default theme;
