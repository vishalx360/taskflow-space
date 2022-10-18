import { Box, Heading, Image, Spinner, Stack, Text } from "@chakra-ui/react";

function LoadingScreen({ loadingText }) {
  return (
    <Stack alignItems="center" justifyContent="center" w="100%" h="100vh">
      <Box position="relative">
        <Spinner
          h="80px"
          w="80px"
          thickness="30px"
          speed="0.65s"
          emptyColor="gray.200"
          color="orange.500"
        />
      </Box>

      {loadingText && (
        <Heading mt="5" fontSize="1.5em">
          {loadingText}
        </Heading>
      )}
    </Stack>
  );
}

export default LoadingScreen;
