import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';

interface ExitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExitModal({ onConfirm, onCancel }: ExitModalProps) {
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no'>('no');

  const handleKeyboard = useCallback(
    (key: { name: string; sequence?: string }) => {
      // Handle arrow keys for navigation
      if (key.name === 'left') {
        setSelectedOption('yes');
        return;
      }
      if (key.name === 'right') {
        setSelectedOption('no');
        return;
      }

      // Handle Enter to confirm selection
      if (key.name === 'return') {
        if (selectedOption === 'yes') {
          onConfirm();
        } else {
          onCancel();
        }
        return;
      }

      // Handle Y/N keys directly
      if (key.sequence === 'y' || key.sequence === 'Y') {
        onConfirm();
        return;
      }
      if (key.sequence === 'n' || key.sequence === 'N' || key.name === 'escape') {
        onCancel();
        return;
      }
    },
    [selectedOption, onConfirm, onCancel],
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
          borderColor: '#FF0000',
          paddingLeft: 3,
          paddingRight: 3,
          paddingTop: 1,
          paddingBottom: 1,
          flexDirection: 'column',
          width: 55,
          backgroundColor: '#000000',
        }}
      >
        <box style={{ justifyContent: 'center' }}>
          <text fg="#FF0000">Exit RestMan?</text>
        </box>
        <box style={{ marginTop: 1, justifyContent: 'center' }}>
          <text fg="#888888">Are you sure you want to quit?</text>
        </box>
        <box style={{ marginTop: 1, justifyContent: 'center', flexDirection: 'row', gap: 3 }}>
          <text
            bg={selectedOption === 'yes' ? '#FF0000' : undefined}
            fg={selectedOption === 'yes' ? '#000000' : '#FF0000'}
          >
            {selectedOption === 'yes' ? '[✓ Yes]' : '  Yes  '}
          </text>
          <text
            bg={selectedOption === 'no' ? '#00FF00' : undefined}
            fg={selectedOption === 'no' ? '#000000' : '#00FF00'}
          >
            {selectedOption === 'no' ? '[✓ No]' : '  No  '}
          </text>
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
          <text fg="#888888">←→ select │ Enter confirm │ Y/N quick select</text>
        </box>
      </box>
    </box>
  );
}
