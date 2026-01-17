import { Box, Text } from "ink";
import type { Environment } from "../environment-storage";

interface EnvironmentSelectorProps {
  environments: Environment[];
  activeEnvironmentId: number | null;
  focused: boolean;
  editMode: boolean;
  onSelect: (id: number) => void;
}

export const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  environments,
  activeEnvironmentId,
  focused,
  editMode,
  onSelect,
}) => {
  const activeEnv = environments.find((env: Environment) => env.id === activeEnvironmentId);

  return (
    <Box
      borderStyle="round"
      borderColor={focused ? "yellow" : "cyan"}
      paddingX={1}
      flexDirection="column"
      width={25}
    >
      <Text bold dimColor={!focused}>
        Environment {editMode && <Text color="green">[EDIT]</Text>}
      </Text>
      {activeEnv ? (
        <Text dimColor={!focused} color={focused ? "green" : undefined}>
          🌍 {activeEnv.name}
        </Text>
      ) : (
        <Text dimColor>
          None selected
        </Text>
      )}
      {editMode && environments.length > 1 && (
        <Text dimColor color="gray">
          ↑↓ to cycle
        </Text>
      )}
    </Box>
  );
};
