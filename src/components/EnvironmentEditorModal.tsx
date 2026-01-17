import { useState } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";

interface EnvironmentEditorModalProps {
  environmentName?: string;
  variables?: Record<string, string>;
  onSave: (name: string, variables: Record<string, string>) => void;
  onCancel: () => void;
}

export const EnvironmentEditorModal: React.FC<EnvironmentEditorModalProps> = ({
  environmentName = "",
  variables = {},
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState<string>(environmentName);
  const [variablesText, setVariablesText] = useState<string>(
    Object.entries(variables)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n")
  );
  const [focusedField, setFocusedField] = useState<"name" | "variables">("name");

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }

    if (key.tab) {
      setFocusedField(focusedField === "name" ? "variables" : "name");
      return;
    }

    if (input === "s" && key.ctrl) {
      handleSave();
      return;
    }
  });

  const handleSave = () => {
    if (!name.trim()) {
      return; // Don't save without a name
    }

    // Parse variables from text (format: KEY=value, one per line)
    const parsedVariables: Record<string, string> = {};
    const lines = variablesText.split("\n");
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const equalsIndex = trimmed.indexOf("=");
      if (equalsIndex === -1) continue;

      const key = trimmed.substring(0, equalsIndex).trim();
      const value = trimmed.substring(equalsIndex + 1).trim();

      if (key) {
        parsedVariables[key] = value;
      }
    }

    onSave(name, parsedVariables);
  };

  return (
    <Box
      position="absolute"
      top="25%"
      left="50%"
      width={80}
      marginLeft={-40}
      borderStyle="double"
      borderColor="yellow"
      padding={1}
      flexDirection="column"
    >
      <Box marginBottom={1} justifyContent="center">
        <Text bold color="yellow">
          {environmentName ? "Edit Environment" : "New Environment"}
        </Text>
      </Box>

      {/* Name Field */}
      <Box marginBottom={1} flexDirection="column">
        <Text bold color={focusedField === "name" ? "yellow" : "cyan"}>
          Name:
        </Text>
        {focusedField === "name" ? (
          <TextInput
            value={name}
            onChange={setName}
            placeholder="e.g., Development, Staging, Production"
          />
        ) : (
          <Text>{name || "Enter a name..."}</Text>
        )}
      </Box>

      {/* Variables Field */}
      <Box marginBottom={1} flexDirection="column">
        <Text bold color={focusedField === "variables" ? "yellow" : "cyan"}>
          Variables (KEY=value, one per line):
        </Text>
        {focusedField === "variables" ? (
          <Box
            borderStyle="round"
            borderColor="yellow"
            paddingX={1}
            height={8}
          >
            <TextInput
              value={variablesText}
              onChange={setVariablesText}
              placeholder="BASE_URL=https://api.example.com&#10;API_KEY=your-api-key"
            />
          </Box>
        ) : (
          <Box
            borderStyle="round"
            borderColor="gray"
            paddingX={1}
            height={8}
          >
            <Text>
              {variablesText || "Enter variables..."}
            </Text>
          </Box>
        )}
      </Box>

      {/* Instructions */}
      <Box borderStyle="single" borderColor="gray" paddingX={1} marginTop={1}>
        <Text dimColor>
          Tab: Switch Fields | Ctrl+S: Save | ESC: Cancel
        </Text>
      </Box>
    </Box>
  );
};
