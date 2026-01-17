import { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { Environment, EnvironmentsConfig } from "../environment-storage";

interface EnvironmentsPanelProps {
  config: EnvironmentsConfig;
  focused: boolean;
  onSelectEnvironment: (id: number) => void;
  onAddEnvironment: () => void;
  onEditEnvironment: (id: number) => void;
  onDeleteEnvironment: (id: number) => void;
}

export const EnvironmentsPanel: React.FC<EnvironmentsPanelProps> = ({
  config,
  focused,
  onSelectEnvironment,
  onAddEnvironment,
  onEditEnvironment,
  onDeleteEnvironment,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useInput((input, key) => {
    if (!focused) return;

    if (key.upArrow && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    } else if (key.downArrow && selectedIndex < config.environments.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else if (key.return) {
      // Select the environment
      const selectedEnv = config.environments[selectedIndex];
      if (selectedEnv) {
        onSelectEnvironment(selectedEnv.id);
      }
    } else if (input === "n") {
      // Add new environment
      onAddEnvironment();
    } else if (input === "e") {
      // Edit selected environment
      const selectedEnv = config.environments[selectedIndex];
      if (selectedEnv) {
        onEditEnvironment(selectedEnv.id);
      }
    } else if (input === "d" && key.shift) {
      // Delete selected environment (Shift+D for safety)
      const selectedEnv = config.environments[selectedIndex];
      if (selectedEnv && config.environments.length > 1) {
        onDeleteEnvironment(selectedEnv.id);
        // Adjust selected index if needed
        if (selectedIndex >= config.environments.length - 1) {
          setSelectedIndex(Math.max(0, selectedIndex - 1));
        }
      }
    }
  });

  if (config.environments.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text>No environments configured.</Text>
        <Text dimColor>Press 'n' to add a new environment.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" width="100%" height="100%">
      {/* Header */}
      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={1}
        marginBottom={1}
      >
        <Text bold>
          🌍 Environments ({config.environments.length})
        </Text>
      </Box>

      {/* Environment List */}
      <Box flexDirection="column" paddingX={2}>
        {config.environments.map((env: Environment, index: number) => {
          const isSelected = index === selectedIndex;
          const isActive = env.id === config.activeEnvironmentId;
          
          return (
            <Box key={env.id} marginBottom={1}>
              <Box width={3}>
                <Text color={isActive ? "green" : undefined}>
                  {isActive ? "▶" : " "}
                </Text>
              </Box>
              <Box
                borderStyle="round"
                borderColor={isSelected ? "yellow" : "gray"}
                paddingX={1}
                flexGrow={1}
              >
                <Box flexDirection="column" width="100%">
                  <Text bold color={isActive ? "green" : undefined}>
                    {env.name}
                  </Text>
                  <Box marginTop={1}>
                    <Text dimColor>Variables: </Text>
                    <Text color="cyan">
                      {Object.keys(env.variables).length} defined
                    </Text>
                  </Box>
                  {Object.entries(env.variables).slice(0, 3).map(([key, value]: [string, string]) => (
                    <Box key={key} marginLeft={2}>
                      <Text dimColor>
                        {key}: <Text color="gray">{value.substring(0, 30)}{value.length > 30 ? "..." : ""}</Text>
                      </Text>
                    </Box>
                  ))}
                  {Object.keys(env.variables).length > 3 && (
                    <Box marginLeft={2}>
                      <Text dimColor>
                        ... and {Object.keys(env.variables).length - 3} more
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Instructions */}
      <Box
        marginTop={1}
        paddingX={2}
        borderStyle="round"
        borderColor="gray"
      >
        <Text dimColor>
          ↑↓: Navigate | Enter: Activate | n: New | e: Edit | Shift+D: Delete | ESC: Close
        </Text>
      </Box>
    </Box>
  );
};
