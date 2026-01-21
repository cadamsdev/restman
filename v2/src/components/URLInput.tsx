import { TextInput } from './TextInput';

interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
  editMode: boolean;
  onSubmit?: () => void;
}

export function URLInput({ value, onChange, focused, editMode, onSubmit }: URLInputProps) {
  const borderColor = focused ? '#FF00FF' : editMode ? '#00FF00' : '#888888';

  return (
    <box
      title="URL"
      style={{
        flexGrow: 1,
        border: true,
        borderColor,
        paddingLeft: 1,
        paddingRight: 1,
      }}
    >
      {editMode ? (
        <TextInput
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          onCancel={onSubmit}
          focused={true}
          placeholder="Enter URL..."
        />
      ) : (
        <text fg={value ? '#00FFFF' : '#888888'}>
          {value || 'Enter URL...'}
        </text>
      )}
    </box>
  );
}
