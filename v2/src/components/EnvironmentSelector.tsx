interface Environment {
  id: number;
  name: string;
  variables: Record<string, string>;
}

interface EnvironmentSelectorProps {
  environments: Environment[];
  activeEnvironmentId: number | null;
  focused: boolean;
  editMode: boolean;
}

export function EnvironmentSelector({
  environments,
  activeEnvironmentId,
  focused,
  editMode,
}: EnvironmentSelectorProps) {
  const borderColor = focused ? '#FF00FF' : editMode ? '#00FF00' : '#888888';
  const activeEnv = environments.find((e) => e.id === activeEnvironmentId);

  return (
    <box
      title="Environment"
      style={{
        width: '100%',
        border: true,
        borderColor,
        paddingLeft: 1,
        paddingRight: 1,
      }}
    >
      <text fg={activeEnv ? '#00FFFF' : '#888888'}>
        {activeEnv ? `▸ ${activeEnv.name}` : '(no environment selected)'}
      </text>
    </box>
  );
}
