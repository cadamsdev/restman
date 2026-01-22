import { useState, useEffect, useCallback } from 'react';
import { useKeyboard, useRenderer } from '@opentui/react';
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
  const [cursorPosition, setCursorPosition] = useState(value.length);
  const renderer = useRenderer();

  // Keep cursor position in bounds when value changes
  useEffect(() => {
    setCursorPosition((pos) => Math.min(pos, value.length));
  }, [value]);

  // Blink cursor
  useEffect(() => {
    if (!focused) return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, [focused]);

  // Handle paste events
  useEffect(() => {
    if (!focused) return;

    const handlePaste = (event: { text: string }) => {
      const newValue = value.slice(0, cursorPosition) + event.text + value.slice(cursorPosition);
      onChange(newValue);
      setCursorPosition(cursorPosition + event.text.length);
    };

    renderer.keyInput.on('paste', handlePaste);
    return () => {
      renderer.keyInput.off('paste', handlePaste);
    };
  }, [focused, onChange, value, cursorPosition, renderer]);

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
      if (cursorPosition > 0) {
        const newValue = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
        onChange(newValue);
        setCursorPosition(cursorPosition - 1);
      }
      return;
    }

    // Handle arrow key navigation
    if (key.name === 'left') {
      setCursorPosition(Math.max(0, cursorPosition - 1));
      return;
    }

    if (key.name === 'right') {
      setCursorPosition(Math.min(value.length, cursorPosition + 1));
      return;
    }

    if (key.name === 'home') {
      setCursorPosition(0);
      return;
    }

    if (key.name === 'end') {
      setCursorPosition(value.length);
      return;
    }

    // Ignore other navigation keys
    const ignoredKeys = ['up', 'down', 'pageup', 'pagedown', 'tab'];
    if (ignoredKeys.includes(key.name)) {
      return;
    }

    if (key.ctrl) return; // Ignore ctrl combinations

    // Handle pasted text (multi-character sequences) or single character input
    if (key.sequence) {
      const newValue = value.slice(0, cursorPosition) + key.sequence + value.slice(cursorPosition);
      onChange(newValue);
      setCursorPosition(cursorPosition + key.sequence.length);
    }
  }, [focused, onSubmit, onCancel, onChange, value, cursorPosition]);

  useKeyboard(handleKeyboard);

  const displayValue = value || placeholder;
  const cursor = focused && cursorVisible ? '█' : '';

  // Render cursor by replacing the character at cursor position
  let displayText: string;
  if (!value) {
    // Show placeholder with cursor at the end
    displayText = `${placeholder}${cursor}`;
  } else if (cursorPosition >= value.length) {
    // Cursor at the end
    displayText = `${value}${cursor}`;
  } else {
    // Cursor overlays the character at cursorPosition
    const beforeCursor = value.slice(0, cursorPosition);
    const afterCursor = value.slice(cursorPosition + 1);
    const cursorChar = cursor || value[cursorPosition];
    displayText = `${beforeCursor}${cursorChar}${afterCursor}`;
  }

  return (
    <text fg={colors.textActive}>
      {displayText}
    </text>
  );
}
