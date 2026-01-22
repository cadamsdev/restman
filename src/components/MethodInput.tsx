interface MethodInputProps {
  value: string;
  onChange: (method: string) => void;
  focused: boolean;
  editMode: boolean;
}

export function MethodInput({ value, focused, editMode }: MethodInputProps) {
  const getMethodColor = (method: string): string => {
    switch (method) {
      case 'GET':
        return '#8899AA';
      case 'POST':
        return '#99AA77';
      case 'PUT':
        return '#CC9944';
      case 'PATCH':
        return '#9988BB';
      case 'DELETE':
        return '#BB6655';
      default:
        return '#999999';
    }
  };

  const borderColor = focused ? '#CC8844' : editMode ? '#BB7733' : '#555555';

  return (
    <box
      title="Method"
      style={{
        width: 20,
        minHeight: 3,
        border: true,
        borderColor,
        paddingLeft: 1,
        paddingRight: 1,
        overflow: 'hidden',
      }}
    >
      <text fg={focused ? getMethodColor(value) : '#666666'}>
        ▸ {value}
      </text>
    </box>
  );
}
