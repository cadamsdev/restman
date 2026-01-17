import React from "react";
import { Box, Text } from "ink";

interface BodyEditorProps {
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
}

export const BodyEditor: React.FC<BodyEditorProps> = ({
  value,
  onChange,
  focused,
}) => {
  return (
    <Box
      borderStyle="round"
      borderColor={focused ? "yellow" : "cyan"}
      width="50%"
      marginLeft={1}
      flexDirection="column"
      paddingX={1}
    >
      <Text bold dimColor={!focused}>Body</Text>
      <Box flexDirection="column" flexGrow={1}>
        {value ? (
          value.split("\n").map((line, idx) => (
            <Text key={idx} dimColor={!focused}>
              {line || " "}
            </Text>
          ))
        ) : (
          <Text dimColor italic>
            Empty
          </Text>
        )}
      </Box>
      {focused && (
        <Text dimColor italic>
          [Click to edit - feature coming soon]
        </Text>
      )}
    </Box>
  );
};
