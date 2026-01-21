import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';

interface MethodSelectorModalProps {
  currentMethod: string;
  onSelect: (method: string) => void;
  onCancel: () => void;
}

export function MethodSelectorModal({
  currentMethod,
  onSelect,
  onCancel,
}: MethodSelectorModalProps) {
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const [selectedIndex, setSelectedIndex] = useState(methods.indexOf(currentMethod));

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

  const handleKeyboard = useCallback(
    (key: { name: string; sequence?: string }) => {
      if (key.name === 'escape') {
        onCancel();
        return;
      }

      if (key.name === 'return') {
        const selectedMethod = methods[selectedIndex];
        if (selectedMethod) {
          onSelect(selectedMethod);
        }
        return;
      }

      if (key.name === 'up') {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : methods.length - 1));
        return;
      }

      if (key.name === 'down') {
        setSelectedIndex((prev) => (prev < methods.length - 1 ? prev + 1 : 0));
        return;
      }

      // Quick selection by first letter
      if (key.sequence) {
        const upperInput = key.sequence.toUpperCase();
        const methodIndex = methods.findIndex((m) => m.startsWith(upperInput));
        if (methodIndex !== -1) {
          setSelectedIndex(methodIndex);
        }
      }
    },
    [methods, selectedIndex, onSelect, onCancel],
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
      {/* Modal content */}
      <box
        style={{
          border: 'double',
          borderColor: '#FF00FF',
          paddingLeft: 3,
          paddingRight: 3,
          paddingTop: 1,
          paddingBottom: 1,
          flexDirection: 'column',
          width: 40,
          backgroundColor: '#000000',
        }}
      >
        <box style={{ justifyContent: 'center' }}>
          <text fg="#FF00FF">Select HTTP Method</text>
        </box>

        <box style={{ marginTop: 1, flexDirection: 'column', paddingLeft: 2, paddingRight: 2 }}>
          {methods.map((method, index) => (
            <text
              key={method}
              fg={index === selectedIndex ? getMethodColor(method) : '#888888'}
            >
              {index === selectedIndex ? `▸ ${method}` : `  ${method}`}
            </text>
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
