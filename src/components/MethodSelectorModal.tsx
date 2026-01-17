import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

interface MethodSelectorModalProps {
  currentMethod: string;
  onSelect: (method: string) => void;
  onCancel: () => void;
}

export const MethodSelectorModal: React.FC<MethodSelectorModalProps> = ({
  currentMethod,
  onSelect,
  onCancel,
}) => {
  const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  const [selectedIndex, setSelectedIndex] = useState(methods.indexOf(currentMethod));

  const getMethodColor = (method: string): string => {
    switch (method) {
      case "GET": return "blue";
      case "POST": return "green";
      case "PUT": return "yellow";
      case "PATCH": return "cyan";
      case "DELETE": return "red";
      default: return "white";
    }
  };

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }
    
    if (key.return) {
      const selectedMethod = methods[selectedIndex];
      if (selectedMethod) {
        onSelect(selectedMethod);
      }
      return;
    }

    if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : methods.length - 1));
      return;
    }

    if (key.downArrow) {
      setSelectedIndex((prev) => (prev < methods.length - 1 ? prev + 1 : 0));
      return;
    }

    // Quick selection by first letter
    const upperInput = input.toUpperCase();
    const methodIndex = methods.findIndex(m => m.startsWith(upperInput));
    if (methodIndex !== -1) {
      setSelectedIndex(methodIndex);
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
        borderColor="magenta"
        paddingX={3}
        paddingY={1}
        flexDirection="column"
        width={40}
        backgroundColor="black"
      >
        <Box justifyContent="center">
          <Text bold color="magenta">
            ⚡ Select HTTP Method
          </Text>
        </Box>
        
        <Box marginTop={1} flexDirection="column" paddingX={2}>
          {methods.map((method, index) => (
            <Text
              key={method}
              color={index === selectedIndex ? getMethodColor(method) : "gray"}
              bold={index === selectedIndex}
              dimColor={index !== selectedIndex}
            >
              {index === selectedIndex ? `▸ ${method}` : `  ${method}`}
            </Text>
          ))}
        </Box>
        
        <Box marginTop={1} justifyContent="center" borderStyle="single" borderColor="gray" paddingX={1}>
          <Text dimColor>
            <Text color="cyan" bold>↕</Text> Navigate │ <Text color="green" bold>Enter</Text> Select │ <Text color="yellow" bold>ESC</Text> Cancel
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
