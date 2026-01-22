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
  const borderColor = focused ? '#CC8844' : editMode ? '#BB7733' : '#555555';
  const activeEnv = environments.find((e) => e.id === activeEnvironmentId);

  return (
    <box
      title="Environment"
      style={{
        width: '100%',
        minHeight: 3,
        border: true,
        borderColor,
        paddingLeft: 1,
        paddingRight: 1,
        overflow: 'hidden',
      }}
    >
      <text fg={activeEnv ? '#BB7733' : '#666666'}>
        {activeEnv ? `▸ ${activeEnv.name}` : '(no environment selected)'}
      </text>
    </box>
  );
}
