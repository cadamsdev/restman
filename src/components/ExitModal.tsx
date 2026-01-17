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
            <Text 
              color={selectedOption === "yes" ? "green" : "gray"} 
              bold={selectedOption === "yes"}
            >
              Yes
            </Text>
            <Text color="gray"> / </Text>
            <Text 
              color={selectedOption === "no" ? "red" : "gray"} 
              bold={selectedOption === "no"}
            >
              No
            </Text>
          </Text>
        </Box>
        <Text marginTop={1} color="gray" dimColor>
          ← → to select, Enter to confirm, Y/N for quick select
        </Text>
      </Box>
    </Box>
  );
};
