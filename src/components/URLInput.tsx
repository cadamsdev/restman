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
      borderColor={focused ? "magenta" : editMode ? "green" : "gray"}
      flexGrow={1}
      paddingX={1}
      flexDirection="column"
    >
      <Text>
        <Text bold color={focused ? "magenta" : "gray"}>🌐 URL</Text>
        {editMode && <Text color="green"> [✎]</Text>}
      </Text>
      {editMode ? (
        <TextInput value={value} onChange={onChange} />
      ) : (
        <Text color={value ? "cyan" : "gray"} italic={!value}>
          {value || "Enter URL..."}
        </Text>
      )}
    </Box>
  );
};
