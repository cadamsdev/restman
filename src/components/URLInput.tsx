import { TextInput } from './TextInput';
import { getBorderColor, getTextColor } from '../tokens';

interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
  editMode: boolean;
  onSubmit?: () => void;
}

export function URLInput({ value, onChange, focused, editMode, onSubmit }: URLInputProps) {
  const borderColor = getBorderColor(focused, editMode);

  return (
    <box
      title="URL"
      style={{
        flexGrow: 1,
        minHeight: 3,
        border: true,
        borderColor,
        paddingLeft: 1,
        paddingRight: 1,
        overflow: 'hidden',
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
        <text fg={getTextColor(editMode, !!value)}>
          {value || 'Enter URL...'}
        </text>
      )}
    </box>
  );
}
