import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { TextInput } from './TextInput';

interface EnvironmentEditorModalProps {
  environmentName?: string;
  variables?: Record<string, string>;
  onSave: (name: string, variables: Record<string, string>) => void;
  onCancel: () => void;
}

export function EnvironmentEditorModal({
  environmentName = '',
  variables = {},
  onSave,
  onCancel,
}: EnvironmentEditorModalProps) {
  const [name, setName] = useState<string>(environmentName);
  const [variablesText, setVariablesText] = useState<string>(
    Object.entries(variables)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n'),
  );
  const [focusedField, setFocusedField] = useState<'name' | 'variables'>('name');

  const handleKeyboard = useCallback(
    (key: { name: string; ctrl?: boolean }) => {
      if (key.name === 'escape') {
        onCancel();
        return;
      }

      if (key.name === 'tab' || key.name === 'down') {
        setFocusedField(focusedField === 'name' ? 'variables' : 'name');
        return;
      }

      if (key.name === 'up') {
        setFocusedField(focusedField === 'variables' ? 'name' : 'variables');
        return;
      }

      if (key.ctrl && key.name === 's') {
        handleSave();
        return;
      }
    },
    [focusedField, onCancel],
  );

  useKeyboard(handleKeyboard);

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }

    const parsedVariables: Record<string, string> = {};
    const lines = variablesText.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex === -1) continue;

      const key = trimmed.substring(0, equalsIndex).trim();
      const value = trimmed.substring(equalsIndex + 1).trim();

      if (key) {
        parsedVariables[key] = value;
      }
    }

    onSave(name, parsedVariables);
  };

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
          width: 70,
          backgroundColor: '#1a1a1a',
        }}
      >
        <box style={{ justifyContent: 'center' }}>
          <text fg="#CC8844">{environmentName ? 'Edit Environment' : 'New Environment'}</text>
        </box>

        {/* Name Field */}
        <box style={{ marginTop: 1, flexDirection: 'column' }}>
          <text fg={focusedField === 'name' ? '#CC8844' : '#666666'}>Name:</text>
          <box
            style={{
              border: true,
              borderColor: focusedField === 'name' ? '#CC8844' : '#555555',
              paddingLeft: 1,
              paddingRight: 1,
            }}
          >
            {focusedField === 'name' ? (
              <TextInput
                value={name}
                onChange={setName}
                onSubmit={() => setFocusedField('variables')}
                onCancel={onCancel}
                focused={true}
                placeholder="e.g., Development, Staging, Production"
              />
            ) : (
              <text fg={name ? '#999999' : '#666666'}>{name || 'Enter a name...'}</text>
            )}
          </box>
        </box>

        {/* Variables Field */}
        <box style={{ marginTop: 1, flexDirection: 'column' }}>
          <text fg={focusedField === 'variables' ? '#CC8844' : '#666666'}>
            Variables (KEY=value, one per line):
          </text>
          <box
            style={{
              border: true,
              borderColor: focusedField === 'variables' ? '#CC8844' : '#555555',
              paddingLeft: 1,
              paddingRight: 1,
              height: 8,
            }}
          >
            {focusedField === 'variables' ? (
              <TextInput
                value={variablesText}
                onChange={setVariablesText}
                onSubmit={handleSave}
                onCancel={onCancel}
                focused={true}
                placeholder="KEY=value"
              />
            ) : (
              <text fg={variablesText ? '#999999' : '#666666'}>
                {variablesText || 'Enter variables...'}
              </text>
            )}
          </box>
        </box>

        <box
          style={{
            marginTop: 1,
            justifyContent: 'center',
            border: true,
            borderColor: '#555555',
            paddingLeft: 1,
            paddingRight: 1,
          }}
        >
          <text fg="#666666">Tab: Switch Fields | Ctrl+S: Save | ESC: Cancel</text>
        </box>
      </box>
    </box>
  );
}
