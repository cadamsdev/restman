import React from "react";
import { Box, Text } from "ink";

interface InstructionsProps {
  editMode: boolean;
}

export const Instructions: React.FC<InstructionsProps> = ({ editMode }) => {
  return (
    <Box
      justifyContent="center"
      paddingX={1}
      marginTop={1}
    >
      {editMode ? (
        <Text dimColor>
          <Text color="green" bold>[EDIT MODE]</Text> ESC: Exit Edit | Ctrl+S: Send | /: Help | Ctrl+C: Force Quit
        </Text>
      ) : (
        <Text dimColor>
          Enter: Send | e: Edit | m/u/h/b/r: Jump | ↑↓: Change Method | /: Help | q: Exit
        </Text>
      )}
    </Box>
  );
};
