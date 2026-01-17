import React from "react";
import { Box, Text } from "ink";

interface HeadersEditorProps {
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
}

export const HeadersEditor: React.FC<HeadersEditorProps> = ({
  value,
  onChange,
  focused,
}) => {
  return (
    <Box
      borderStyle="round"
      borderColor={focused ? "yellow" : "cyan"}
      width="50%"
      flexDirection="column"
      paddingX={1}
    >
      <Text bold dimColor={!focused}>Headers (key: value)</Text>
      <Box flexDirection="column" flexGrow={1}>
        {value.split("\n").map((line, idx) => (
          <Text key={idx} dimColor={!focused}>
            {line || " "}
          </Text>
        ))}
      </Box>
      {focused && (
        <Text dimColor italic>
          [Click to edit - feature coming soon]
        </Text>
      )}
    </Box>
  );
};
