import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';

interface Environment {
  id: number;
  name: string;
  variables: Record<string, string>;
}

interface EnvironmentSelectorModalProps {
  environments: Environment[];
  currentEnvironmentId: number | null;
  onSelect: (id: number) => void;
  onCancel: () => void;
}

export function EnvironmentSelectorModal({
  environments,
  currentEnvironmentId,
  onSelect,
  onCancel,
}: EnvironmentSelectorModalProps) {
  const currentIndex = environments.findIndex((env) => env.id === currentEnvironmentId);
  const [selectedIndex, setSelectedIndex] = useState(currentIndex >= 0 ? currentIndex : 0);

  const handleKeyboard = useCallback(
    (key: { name: string }) => {
      if (key.name === 'escape') {
        onCancel();
        return;
      }

      if (key.name === 'return') {
        const selectedEnv = environments[selectedIndex];
        if (selectedEnv) {
          onSelect(selectedEnv.id);
        }
        return;
      }

      if (key.name === 'up') {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : environments.length - 1));
        return;
      }

      if (key.name === 'down') {
        setSelectedIndex((prev) => (prev < environments.length - 1 ? prev + 1 : 0));
        return;
      }
    },
    [environments, selectedIndex, onSelect, onCancel],
  );

  useKeyboard(handleKeyboard);

  if (environments.length === 0) {
    return (
      <box
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <box
          style={{
            border: 'double',
            borderColor: '#FFFF00',
            paddingLeft: 3,
            paddingRight: 3,
            paddingTop: 1,
            paddingBottom: 1,
            flexDirection: 'column',
            width: 50,
            backgroundColor: '#000000',
          }}
        >
          <box style={{ justifyContent: 'center' }}>
            <text fg="#FFFF00">🌍 No Environments Available</text>
          </box>

          <box style={{ marginTop: 1, paddingLeft: 2, paddingRight: 2, flexDirection: 'row', gap: 1 }}>
            <text fg="#888888">No environments found. Press</text>
            <text fg="#00FFFF">v</text>
            <text fg="#888888">to manage environments.</text>
          </box>

          <box
            style={{
              marginTop: 1,
              justifyContent: 'center',
              border: true,
              borderColor: '#888888',
              paddingLeft: 1,
              paddingRight: 1,
              flexDirection: 'row',
              gap: 1,
            }}
          >
            <text fg="#FFFF00">ESC</text>
            <text fg="#888888">Close</text>
          </box>
        </box>
      </box>
    );
  }

  return (
    <box
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {/* Modal content */}
      <box
        style={{
          border: 'double',
          borderColor: '#00FFFF',
          paddingLeft: 3,
          paddingRight: 3,
          paddingTop: 1,
          paddingBottom: 1,
          flexDirection: 'column',
          width: 50,
          backgroundColor: '#000000',
        }}
      >
        <box style={{ justifyContent: 'center' }}>
          <text fg="#00FFFF">🌍 Select Environment</text>
        </box>

        <box style={{ marginTop: 1, flexDirection: 'column', paddingLeft: 2, paddingRight: 2 }}>
          {environments.map((env, index) => (
            <box key={env.id}>
              <text fg={index === selectedIndex ? '#00FFFF' : '#888888'}>
                {index === selectedIndex ? `▸ ${env.name}` : `  ${env.name}`}
              </text>
            </box>
          ))}
        </box>

        <box
          style={{
            marginTop: 1,
            justifyContent: 'center',
            border: true,
            borderColor: '#888888',
            paddingLeft: 1,
            paddingRight: 1,
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <text fg="#00FFFF">↕</text>
          <text fg="#888888">Navigate │</text>
          <text fg="#00FF00">Enter</text>
          <text fg="#888888">Select │</text>
          <text fg="#FFFF00">ESC</text>
          <text fg="#888888">Cancel</text>
        </box>
      </box>
    </box>
  );
}
