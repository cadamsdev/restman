import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { TextInput } from './TextInput';

interface SaveModalProps {
  defaultName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function SaveModal({ defaultName, onSave, onCancel }: SaveModalProps) {
  const [name, setName] = useState(defaultName);

  const handleKeyboard = useCallback(
    (key: { name: string }) => {
      if (key.name === 'escape') {
        onCancel();
        return;
      }

      if (key.name === 'return') {
        if (name.trim()) {
          onSave(name.trim());
        }
        return;
      }
    },
    [name, onSave, onCancel],
  );

  useKeyboard(handleKeyboard);

  return (
    <box
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: 1000,
      }}
    >
      <box
        style={{
          border: 'double',
          borderColor: '#665544',
          paddingLeft: 3,
          paddingRight: 3,
          paddingTop: 1,
          paddingBottom: 1,
          flexDirection: 'column',
          width: 65,
          backgroundColor: '#1a1a1a',
        }}
      >
        <box style={{ justifyContent: 'center' }}>
          <text fg="#CC8844">Save Request</text>
        </box>

        <box style={{ marginTop: 1 }}>
          <text fg="#666666">Enter a name for this request:</text>
        </box>

        <box
          style={{
            marginTop: 1,
            border: true,
            borderColor: '#CC8844',
            paddingLeft: 1,
            paddingRight: 1,
          }}
        >
          <TextInput
            value={name}
            onChange={setName}
            onSubmit={() => name.trim() && onSave(name.trim())}
            onCancel={onCancel}
            focused={true}
            placeholder="e.g., Get User Profile"
          />
        </box>

        <box
          style={{
            marginTop: 1,
            justifyContent: 'center',
            border: true,
            borderColor: '#443322',
            paddingLeft: 1,
            paddingRight: 1,
          }}
        >
          <text fg="#666666">Enter: Save | ESC: Cancel</text>
        </box>
      </box>
    </box>
  );
}
