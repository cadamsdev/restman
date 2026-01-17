import React from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";

interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
  editMode: boolean;
}

export const URLInput: React.FC<URLInputProps> = ({
  value,
  onChange,
  focused,
  editMode,
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
      <Text bold dimColor={!focused}>
        URL {editMode && <Text color="green">[EDIT]</Text>}
      </Text>
      {editMode ? (
        <TextInput value={value} onChange={onChange} />
      ) : (
        <Text dimColor={!focused}>{value || "Enter URL..."}</Text>
      )}
    </Box>
  );
};
