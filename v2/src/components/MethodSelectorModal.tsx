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
          borderColor: '#665544',
          paddingLeft: 3,
          paddingRight: 3,
          paddingTop: 1,
          paddingBottom: 1,
          flexDirection: 'column',
          width: 40,
          backgroundColor: '#1a1a1a',
        }}
      >
        <box style={{ justifyContent: 'center' }}>
          <text fg="#CC8844">Select HTTP Method</text>
        </box>

        <box style={{ marginTop: 1, flexDirection: 'column', paddingLeft: 2, paddingRight: 2 }}>
          {methods.map((method, index) => (
            <text
              key={method}
              fg={index === selectedIndex ? getMethodColor(method) : '#666666'}
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
            borderColor: '#443322',
            paddingLeft: 1,
            paddingRight: 1,
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <text fg="#BB7733">↕</text>
          <text fg="#666666">Navigate │</text>
          <text fg="#99AA77">Enter</text>
          <text fg="#666666">Select │</text>
          <text fg="#CC8844">ESC</text>
          <text fg="#666666">Cancel</text>
        </box>
      </box>
    </box>
  );
}
