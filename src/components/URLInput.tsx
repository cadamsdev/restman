import React from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";

interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
}

export const URLInput: React.FC<URLInputProps> = ({
  value,
  onChange,
  focused,
}) => {
  return (
    <Box
      borderStyle="round"
      borderColor={focused ? "yellow" : "cyan"}
      flexGrow={1}
      marginLeft={1}
      paddingX={1}
      flexDirection="column"
    >
      <Text bold dimColor={!focused}>URL</Text>
      {focused ? (
        <TextInput value={value} onChange={onChange} />
      ) : (
        <Text dimColor>{value || "Enter URL..."}</Text>
      )}
    </Box>
  );
};
