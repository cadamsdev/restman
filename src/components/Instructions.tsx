import React from "react";
import { Box, Text } from "ink";

interface InstructionsProps {
  editMode: boolean;
}

export const Instructions: React.FC<InstructionsProps> = ({ editMode }) => {
  return (
    <Box
      borderStyle="round"
      borderColor={editMode ? "green" : "gray"}
      justifyContent="center"
      paddingX={1}
    >
      {editMode ? (
        <Text>
          <Text backgroundColor="green" color="black" bold> EDIT </Text>
          <Text dimColor> │ </Text>
          <Text color="yellow">ESC</Text><Text dimColor> Exit │ </Text>
          <Text color="yellow">Ctrl+S</Text><Text dimColor> Send │ </Text>
          <Text color="yellow">/</Text><Text dimColor> Help │ </Text>
          <Text color="yellow">Ctrl+C</Text><Text dimColor> Force Quit</Text>
        </Text>
      ) : (
        <Text>
          <Text color="green">Enter</Text><Text dimColor> Send │ </Text>
          <Text color="cyan">e</Text><Text dimColor> Edit │ </Text>
          <Text color="cyan">Space</Text><Text dimColor> Full View │ </Text>
          <Text color="cyan">s</Text><Text dimColor> Save │ </Text>
          <Text color="cyan">l</Text><Text dimColor> Load │ </Text>
          <Text color="cyan">h</Text><Text dimColor> History │ </Text>
          <Text color="cyan">v</Text><Text dimColor> Env │ </Text>
          <Text color="cyan">1-4</Text><Text dimColor> Jump │ </Text>
          <Text color="cyan">/</Text><Text dimColor> Help │ </Text>
          <Text color="cyan">q</Text><Text dimColor> Exit</Text>
        </Text>
      )}
    </Box>
  );
};
