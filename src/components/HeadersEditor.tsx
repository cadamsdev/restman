import React from "react";
import { Box, Text } from "ink";

interface HeadersEditorProps {
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
  editMode: boolean;
}

export const HeadersEditor: React.FC<HeadersEditorProps> = ({
  value,
  onChange,
  focused,
  editMode,
}) => {
  return (
    <Box
      borderStyle="round"
      borderColor={focused ? "yellow" : "cyan"}
      width="50%"
      flexDirection="column"
      paddingX={1}
    >
      <Text bold dimColor={!focused}>
        Headers (key: value) {editMode && <Text color="green">[EDIT]</Text>}
      </Text>
      <Box flexDirection="column" flexGrow={1}>
        {value.split("\n").map((line, idx) => (
          <Text key={idx} dimColor={!focused}>
            {line || " "}
          </Text>
        ))}
      </Box>
    </Box>
  );
};
