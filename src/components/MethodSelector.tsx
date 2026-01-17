import React from "react";
import { Box, Text } from "ink";

interface MethodSelectorProps {
  value: string;
  onChange: (method: string) => void;
  focused: boolean;
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({
  value,
  onChange,
  focused,
}) => {
  const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  return (
    <Box
      borderStyle="round"
      borderColor={focused ? "yellow" : "cyan"}
      width={12}
      flexDirection="column"
      paddingX={1}
    >
      <Text bold dimColor={!focused}>Method</Text>
      {methods.map((method) => (
        <Text
          key={method}
          color={method === value ? "cyan" : "white"}
          bold={method === value}
        >
          {method === value ? `▶ ${method}` : `  ${method}`}
        </Text>
      ))}
    </Box>
  );
};
