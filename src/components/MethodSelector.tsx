import React from "react";
import { Box, Text } from "ink";

interface MethodSelectorProps {
  value: string;
  onChange: (method: string) => void;
  focused: boolean;
  editMode: boolean;
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({
  value,
  onChange,
  focused,
  editMode,
}) => {
  const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  
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

  return (
    <Box
      borderStyle="round"
      borderColor={focused ? "magenta" : editMode ? "green" : "gray"}
      width={14}
      flexDirection="column"
      paddingX={1}
    >
      <Text>
        <Text bold color={focused ? "magenta" : "gray"}>⚡ Method</Text>
        {editMode && <Text color="green"> [↕]</Text>}
      </Text>
      {methods.map((method) => (
        <Text
          key={method}
          color={method === value ? getMethodColor(method) : "gray"}
          bold={method === value}
          dimColor={method !== value}
        >
          {method === value ? `▸ ${method}` : `  ${method}`}
        </Text>
      ))}
    </Box>
  );
};
