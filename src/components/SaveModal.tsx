import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";

interface SaveModalProps {
  defaultName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export const SaveModal: React.FC<SaveModalProps> = ({
  defaultName,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(defaultName);

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }
    if (key.return) {
      if (name.trim()) {
        onSave(name.trim());
      }
      return;
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
        borderColor="green"
        paddingX={3}
        paddingY={1}
        flexDirection="column"
        width={65}
        backgroundColor="black"
      >
        <Box justifyContent="center">
          <Text bold color="green">
            💾 Save Request
          </Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Enter a name for this request:</Text>
        </Box>
        <Box marginTop={1} borderStyle="round" borderColor="cyan" paddingX={1}>
          <Text color="cyan" bold>📝 </Text>
          <TextInput
            value={name}
            onChange={setName}
            placeholder="e.g., Get User Profile"
          />
        </Box>
        <Box marginTop={1} justifyContent="center" borderStyle="single" borderColor="gray" paddingX={1}>
          <Text dimColor>
            <Text color="green" bold>Enter</Text> Save │ <Text color="yellow" bold>ESC</Text> Cancel
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
