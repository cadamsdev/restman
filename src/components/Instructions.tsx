import React from "react";
import { Box, Text } from "ink";

export const Instructions: React.FC = () => {
  return (
    <Box
      justifyContent="center"
      paddingX={1}
      marginTop={1}
    >
      <Text dimColor>
        Enter/Ctrl+S: Send | Tab: Next | ↑↓: Change Method | q/Esc: Exit | Ctrl+C: Force Quit
      </Text>
    </Box>
  );
};
