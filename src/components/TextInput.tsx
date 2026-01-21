import { useState, useEffect, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import { colors } from '../tokens';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  focused?: boolean;
  placeholder?: string;
}

export function TextInput({
  value,
  onChange,
  onSubmit,
  onCancel,
  focused = true,
  placeholder = '',
}: TextInputProps) {
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

    if (key.name === 'return') {
      onSubmit?.();
      return;
    }

    if (key.name === 'escape') {
      onCancel?.();
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
  }, [focused, onSubmit, onCancel, onChange, value]);

  useKeyboard(handleKeyboard);

  const displayValue = value || placeholder;
  const cursor = focused && cursorVisible ? '█' : '';

  return (
    <text fg={colors.textActive}>
      {displayValue}
      {cursor}
    </text>
  );
}
