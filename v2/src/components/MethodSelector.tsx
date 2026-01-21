interface MethodSelectorProps {
  value: string;
  onChange: (method: string) => void;
  focused: boolean;
  editMode: boolean;
}

export function MethodSelector({ value, focused, editMode }: MethodSelectorProps) {
  const getMethodColor = (method: string): string => {
    switch (method) {
      case 'GET':
        return '#0088FF';
      case 'POST':
        return '#00FF00';
      case 'PUT':
        return '#FFFF00';
      case 'PATCH':
        return '#00FFFF';
      case 'DELETE':
        return '#FF0000';
      default:
        return '#FFFFFF';
    }
  };

  const borderColor = focused ? '#FF00FF' : editMode ? '#00FF00' : '#888888';

  return (
    <box
      title="Method"
      style={{
        width: 20,
        border: true,
        borderColor,
        paddingLeft: 1,
        paddingRight: 1,
      }}
    >
      <text fg={focused ? getMethodColor(value) : '#888888'}>
        ▸ {value}
      </text>
    </box>
  );
}
