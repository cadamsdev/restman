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
  const [variablesLines, setVariablesLines] = useState<string[]>(
    Object.entries(variables).length > 0
      ? Object.entries(variables).map(([key, value]) => `${key}=${value}`)
      : [""]
  );
  const [focusedField, setFocusedField] = useState<"name" | "variables">("name");
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }

    if (key.tab) {
      setFocusedField(focusedField === "name" ? "variables" : "name");
      if (focusedField === "name") {
        setCurrentLineIndex(0);
      }
      return;
    }

    if (input === "s" && key.ctrl) {
      handleSave();
      return;
    }

    // Arrow key navigation between fields
    if (key.upArrow && focusedField === "variables" && currentLineIndex === 0) {
      // At top of variables list, go to name field
      setFocusedField("name");
      return;
    }
    
    if (key.downArrow && focusedField === "name") {
      // From name field, go to variables
      setFocusedField("variables");
      setCurrentLineIndex(0);
      return;
    }

    // Handle arrow key navigation in variables field
    if (focusedField === "variables") {
      if (key.upArrow && currentLineIndex > 0) {
        setCurrentLineIndex(currentLineIndex - 1);
        return;
      }
      if (key.downArrow && currentLineIndex < variablesLines.length - 1) {
        setCurrentLineIndex(currentLineIndex + 1);
        return;
      }
      // Add new line with Enter
      if (key.return) {
        const newLines = [
          ...variablesLines.slice(0, currentLineIndex + 1),
          "",
          ...variablesLines.slice(currentLineIndex + 1),
        ];
        setVariablesLines(newLines);
        setCurrentLineIndex(currentLineIndex + 1);
        return;
      }
      // Delete current line with Ctrl+D (if empty or if there are multiple lines)
      if (input === "d" && key.ctrl && variablesLines.length > 1) {
        const newLines = variablesLines.filter((_, i) => i !== currentLineIndex);
        setVariablesLines(newLines);
        setCurrentLineIndex(Math.min(currentLineIndex, newLines.length - 1));
        return;
      }
    }
  });

  const handleSave = () => {
    if (!name.trim()) {
      return; // Don't save without a name
    }

    // Parse variables from lines (format: KEY=value, one per line)
    const parsedVariables: Record<string, string> = {};
    
    for (const line of variablesLines) {
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

  const handleLineChange = (newValue: string) => {
    const newLines = [...variablesLines];
    newLines[currentLineIndex] = newValue;
    setVariablesLines(newLines);
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
              <Box flexDirection="column">
                {variablesLines.map((line, i) => (
                  <Box key={i}>
                    <Text color={i === currentLineIndex ? "yellow" : "gray"}>
                      {i === currentLineIndex ? "▶ " : "  "}
                    </Text>
                    {i === currentLineIndex ? (
                      <TextInput
                        value={line}
                        onChange={handleLineChange}
                        placeholder="KEY=value"
                      />
                    ) : (
                      <Text dimColor={!line.trim()}>{line || " "}</Text>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Box flexDirection="column">
                {variablesLines.slice(0, 10).map((line, i) => (
                  <Text key={i} dimColor={!line.trim()}>
                    {line || " "}
                  </Text>
                ))}
                {variablesLines.length > 10 && (
                  <Text dimColor>... and {variablesLines.length - 10} more lines</Text>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Instructions */}
        <Box borderStyle="round" borderColor="gray" paddingX={1}>
          <Text dimColor>
            {focusedField === "variables" 
              ? "↑↓: Navigate Lines | Enter: New Line | Ctrl+D: Delete Line | Tab/↑: Switch | Ctrl+S: Save | ESC: Cancel"
              : "Tab/↓: Switch Fields | Ctrl+S: Save | ESC: Cancel"
            }
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
