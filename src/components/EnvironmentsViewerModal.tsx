import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';

interface Environment {
  id: number;
  name: string;
  variables: Record<string, string>;
}

interface EnvironmentsViewerModalProps {
  environments: Environment[];
  activeEnvironmentId: number | null;
  onSelectEnvironment: (id: number) => void;
  onAddEnvironment: () => void;
  onEditEnvironment: (id: number) => void;
  onDeleteEnvironment: (id: number) => void;
  onClose: () => void;
}

export function EnvironmentsViewerModal({
  environments,
  activeEnvironmentId,
  onSelectEnvironment,
  onAddEnvironment,
  onEditEnvironment,
  onDeleteEnvironment,
  onClose,
}: EnvironmentsViewerModalProps) {
  const activeIndex = environments.findIndex((env) => env.id === activeEnvironmentId);
  const [selectedIndex, setSelectedIndex] = useState<number>(activeIndex >= 0 ? activeIndex : 0);

  const handleKeyboard = useCallback(
    (key: { name: string; shift?: boolean; sequence?: string }) => {
      if (key.name === 'escape') {
        onClose();
        return;
      }

      if (key.name === 'up' && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
        return;
      }

      if (key.name === 'down' && selectedIndex < environments.length - 1) {
        setSelectedIndex(selectedIndex + 1);
        return;
      }

      if (key.name === 'return') {
        const selectedEnv = environments[selectedIndex];
        if (selectedEnv) {
          onSelectEnvironment(selectedEnv.id);
        }
        return;
      }

      if (key.sequence === 'n') {
        onAddEnvironment();
        return;
      }

      if (key.sequence === 'e') {
        const selectedEnv = environments[selectedIndex];
        if (selectedEnv) {
          onEditEnvironment(selectedEnv.id);
        }
        return;
      }

      if (key.sequence === 'D' && key.shift) {
        const selectedEnv = environments[selectedIndex];
        if (selectedEnv && environments.length > 1) {
          onDeleteEnvironment(selectedEnv.id);
          if (selectedIndex >= environments.length - 1) {
            setSelectedIndex(Math.max(0, selectedIndex - 1));
          }
        }
        return;
      }
    },
    [
      selectedIndex,
      environments,
      onSelectEnvironment,
      onAddEnvironment,
      onEditEnvironment,
      onDeleteEnvironment,
      onClose,
    ],
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
          zIndex: 1000,
        }}
      >
        <box
          style={{
            border: true,
            borderStyle: 'double',
            borderColor: '#665544',
            paddingLeft: 3,
            paddingRight: 3,
            paddingTop: 1,
            paddingBottom: 1,
            flexDirection: 'column',
            width: 60,
            backgroundColor: '#1a1a1a',
          }}
        >
          <box style={{ justifyContent: 'center' }}>
            <text fg="#CC8844">Environments (0)</text>
          </box>

          <box style={{ marginTop: 1, justifyContent: 'center' }}>
            <text fg="#666666">No environments configured</text>
          </box>
          <box style={{ justifyContent: 'center' }}>
            <text fg="#666666">Press n to add a new environment</text>
          </box>

          <box style={{ marginTop: 1, flexDirection: 'column', paddingLeft: 1, paddingRight: 1 }}>
            <text fg="#888888">Use variables in your requests:</text>
            <text fg="#666666">
              {' '}
              URL: {'{{'} BASE_URL {'}}'}/api/users
            </text>
            <text fg="#666666">
              {' '}
              Headers: Authorization: Bearer {'{{'} API_KEY {'}}'}
            </text>
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
            <text fg="#666666">n: New | ESC: Close</text>
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
        zIndex: 1000,
      }}
    >
      <box
        style={{
          border: true,
          borderStyle: 'double',
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
          <text fg="#CC8844">Environments ({environments.length})</text>
        </box>

        <box style={{ marginTop: 1, flexDirection: 'column', paddingLeft: 2, paddingRight: 2 }}>
          {environments.slice(0, 8).map((env, index) => {
            const isSelected = index === selectedIndex;
            const isActive = env.id === activeEnvironmentId;
            const varCount = Object.keys(env.variables).length;

            return (
              <box key={env.id} style={{ flexDirection: 'column', marginBottom: 1 }}>
                <box style={{ flexDirection: 'row' }}>
                  <text fg={isSelected ? '#CC8844' : '#999999'}>
                    {isSelected ? '▸ ' : '  '}
                    {env.name}
                    {isActive ? ' (active)' : ''}
                  </text>
                </box>
                <box style={{ marginLeft: 2 }}>
                  <text fg="#666666">
                    {varCount} variable{varCount !== 1 ? 's' : ''}
                  </text>
                </box>
              </box>
            );
          })}
          {environments.length > 8 && (
            <box>
              <text fg="#666666">... and {environments.length - 8} more</text>
            </box>
          )}
        </box>

        <box style={{ marginTop: 1, flexDirection: 'column', paddingLeft: 1, paddingRight: 1 }}>
          <text fg="#888888">
            Use variables: {'{{'} VARIABLE_NAME {'}}'}
          </text>
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
          <text fg="#666666">
            ↕: Navigate | Enter: Activate | n: New | e: Edit | Shift+D: Delete | ESC: Close
          </text>
        </box>
      </box>
    </box>
  );
}
