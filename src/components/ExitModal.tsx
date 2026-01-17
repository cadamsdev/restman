import React from "react";
import { Box, Text } from "ink";

interface ExitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <Box
      position="absolute"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      {/* Backdrop overlay */}
      <Box
        position="absolute"
        width="100%"
        height="100%"
        backgroundColor="black"
      />
      
      {/* Modal content */}
      <Box
        borderStyle="double"
        borderColor="yellow"
        paddingX={2}
        paddingY={1}
        flexDirection="column"
        width={50}
        backgroundColor="black"
      >
        <Text bold color="yellow">
          Exit ShellMan?
        </Text>
        <Text marginTop={1}>
          Are you sure you want to quit?
        </Text>
        <Box marginTop={1} justifyContent="center">
          <Text>
            <Text color="green" bold>Y</Text>es / <Text color="red" bold>N</Text>o
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
