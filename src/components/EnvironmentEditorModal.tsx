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
      flexDirection="column"
      width="100%"
      height="100%"
    >
      {/* Header */}
      <Box
        borderStyle="round"
        borderColor="yellow"
        paddingX={1}
        justifyContent="center"
      >
        <Text bold color="yellow">
          🌍 {environmentName ? "Edit Environment" : "New Environment"}
        </Text>
      </Box>

      {/* Modal Content */}
      <Box
        marginTop={1}
        paddingX={2}
        flexDirection="column"
        flexGrow={1}
      >
        {/* Name Field */}
        <Box marginBottom={1} flexDirection="column">
          <Text bold color={focusedField === "name" ? "yellow" : "cyan"}>
            Name:
          </Text>
          {focusedField === "name" ? (
            <Box
              borderStyle="round"
              borderColor="yellow"
              paddingX={1}
            >
              <TextInput
                value={name}
                onChange={setName}
                placeholder="e.g., Development, Staging, Production"
              />
            </Box>
          ) : (
            <Box
              borderStyle="round"
              borderColor="gray"
              paddingX={1}
            >
              <Text dimColor={!name}>{name || "Enter a name..."}</Text>
            </Box>
          )}
        </Box>

        {/* Variables Field */}
        <Box marginBottom={1} flexDirection="column" flexGrow={1}>
          <Text bold color={focusedField === "variables" ? "yellow" : "cyan"}>
            Variables (KEY=value, one per line):
          </Text>
          <Box
            borderStyle="round"
            borderColor={focusedField === "variables" ? "yellow" : "gray"}
            paddingX={1}
            flexGrow={1}
            flexDirection="column"
          >
            {focusedField === "variables" ? (
              <TextInput
                value={variablesText}
                onChange={setVariablesText}
                placeholder="BASE_URL=https://api.example.com"
              />
            ) : variablesText ? (
              <Box flexDirection="column">
                {variablesText.split('\n').slice(0, 10).map((line, i) => (
                  <Text key={i} dimColor={!line.trim()}>
                    {line || " "}
                  </Text>
                ))}
                {variablesText.split('\n').length > 10 && (
                  <Text dimColor>... and {variablesText.split('\n').length - 10} more lines</Text>
                )}
              </Box>
            ) : (
              <Text dimColor>Enter variables...</Text>
            )}
          </Box>
        </Box>

        {/* Instructions */}
        <Box borderStyle="round" borderColor="gray" paddingX={1}>
          <Text dimColor>
            Tab: Switch Fields | Ctrl+S: Save | ESC: Cancel
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
