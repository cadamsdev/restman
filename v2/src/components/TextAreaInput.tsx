import { useState, useEffect, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';

interface TextAreaInputProps {
  value: string;
  onChange: (value: string) => void;
  onCancel?: () => void;
  focused?: boolean;
  rows?: number;
}

export function TextAreaInput({
  value,
  onChange,
  onCancel,
  focused = true,
  rows = 5,
}: TextAreaInputProps) {
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blink cursor
  useEffect(() => {
    if (!focused) return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, [focused]);

  const handleKeyboard = useCallback((key: {
    name: string;
    ctrl?: boolean;
    sequence?: string;
  }) => {
    if (!focused) return;

    if (key.name === 'escape') {
      onCancel?.();
      return;
    }

    if (key.name === 'return') {
      onChange(value + '\n');
      return;
    }

    if (key.name === 'backspace') {
      onChange(value.slice(0, -1));
      return;
    }

    if (key.ctrl) return; // Ignore ctrl combinations

    // Add character
    if (key.sequence && key.sequence.length === 1) {
      onChange(value + key.sequence);
    }
  }, [focused, onCancel, onChange, value]);

  useKeyboard(handleKeyboard);

  const lines = value.split('\n');
  const displayLines = lines.slice(0, rows);
  const cursor = focused && cursorVisible ? '█' : '';

  return (
    <box flexDirection="column">
      {displayLines.map((line, i) => (
        <text key={i} fg={focused ? '#00FF00' : '#FFFFFF'}>
          {line}
          {i === displayLines.length - 1 ? cursor : ''}
        </text>
      ))}
      {displayLines.length === 0 && (
        <text fg={focused ? '#00FF00' : '#666666'}>{cursor || '(empty)'}</text>
      )}
    </box>
  );
}
