import { Text } from 'ink';
import { Fieldset } from './Fieldset';
import type { Environment } from '../environment-storage';

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
}) => {
  const activeEnv = environments.find((env: Environment) => env.id === activeEnvironmentId);

  return (
    <Fieldset title="🌍 Environment" focused={focused} editMode={editMode} width={28}>
      {activeEnv ? (
        <Text color={focused ? 'cyan' : 'gray'} bold={focused}>
          ▸ {activeEnv.name}
        </Text>
      ) : (
        <Text dimColor italic>
          ∅ None selected
        </Text>
      )}
    </Fieldset>
  );
};
