import { Text } from "ink";
import { Panel } from "./Panel";
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
    <Panel
      title="🌍 Environment"
      focused={focused}
      editMode={editMode}
      width={28}
    >
      {activeEnv ? (
        <Text color={focused ? "cyan" : "gray"} bold={focused}>
          ▸ {activeEnv.name}
        </Text>
      ) : (
        <Text dimColor italic>
          ∅ None selected
        </Text>
      )}
    </Panel>
  );
};
