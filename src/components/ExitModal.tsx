import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

interface ExitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({ onConfirm, onCancel }) => {
  const [selectedOption, setSelectedOption] = useState<"yes" | "no">("no");

  useInput((input, key) => {
    // Handle arrow keys for navigation
    if (key.leftArrow) {
      setSelectedOption("yes");
      return;
    }
    if (key.rightArrow) {
      setSelectedOption("no");
      return;
    }

    // Handle Enter to confirm selection
    if (key.return) {
      if (selectedOption === "yes") {
        onConfirm();
      } else {
        onCancel();
      }
      return;
    }

    // Handle Y/N keys directly
    if (input === "y" || input === "Y") {
      onConfirm();
      return;
    }
    if (input === "n" || input === "N" || key.escape) {
      onCancel();
      return;
    }
  });

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
      />
      
      {/* Modal content */}
      <Box
        borderStyle="double"
        borderColor="red"
        paddingX={3}
        paddingY={1}
        flexDirection="column"
        width={55}
        backgroundColor="black"
      >
        <Box justifyContent="center">
          <Text bold color="red">
            🚻 Exit RestMan?
          </Text>
        </Box>
        <Box marginTop={1} justifyContent="center">
          <Text dimColor>
            Are you sure you want to quit?
          </Text>
        </Box>
        <Box marginTop={1} justifyContent="center" gap={3}>
          <Text 
            backgroundColor={selectedOption === "yes" ? "red" : undefined}
            color={selectedOption === "yes" ? "black" : "red"} 
            bold
          >
            {selectedOption === "yes" ? "[✓ Yes]" : "  Yes  "}
          </Text>
          <Text 
            backgroundColor={selectedOption === "no" ? "green" : undefined}
            color={selectedOption === "no" ? "black" : "green"} 
            bold
          >
            {selectedOption === "no" ? "[✓ No]" : "  No  "}
          </Text>
        </Box>
        <Box marginTop={1} justifyContent="center" borderStyle="single" borderColor="gray" paddingX={1}>
          <Text dimColor>
            ←→ select │ Enter confirm │ Y/N quick select
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
