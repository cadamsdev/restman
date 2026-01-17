import React from "react";
import { Box, Text } from "ink";

interface ToastProps {
  message: string;
  type: "loading" | "error" | "success";
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, type, visible }) => {
  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case "loading":
        return "⏳";
      case "error":
        return "✗";
      case "success":
        return "✓";
      default:
        return "●";
    }
  };

  const getColor = () => {
    switch (type) {
      case "loading":
        return "yellow";
      case "error":
        return "red";
      case "success":
        return "green";
      default:
        return "white";
    }
  };

  return (
    <Box
      position="absolute"
      width="100%"
      justifyContent="center"
      paddingY={1}
    >
      <Box
        borderStyle="round"
        borderColor={getColor()}
        paddingX={2}
        backgroundColor="black"
      >
        <Text color={getColor()} bold>
          {getIcon()} {message}
        </Text>
      </Box>
    </Box>
  );
};
