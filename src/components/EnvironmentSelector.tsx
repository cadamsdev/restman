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
      borderColor={focused ? "magenta" : editMode ? "green" : "gray"}
      paddingX={1}
      flexDirection="column"
      width={28}
    >
      <Text>
        <Text bold color={focused ? "magenta" : "gray"}>🌍 Environment</Text>
        {editMode && <Text color="green"> [↕]</Text>}
      </Text>
      {activeEnv ? (
        <Text color={focused ? "cyan" : "gray"} bold={focused}>
          ▸ {activeEnv.name}
        </Text>
      ) : (
        <Text dimColor italic>
          ∅ None selected
        </Text>
      )}
    </Box>
  );
};
