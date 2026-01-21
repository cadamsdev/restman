import { useCallback, useRef } from 'react';
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
  const textareaRef = useRef<any>(null);

  const handleKeyboard = useCallback(
    (key: { name: string; ctrl?: boolean; sequence?: string }) => {
      if (!focused) return;

      if (key.name === 'escape') {
        onCancel?.();
        return;
      }
    },
    [focused, onCancel]
  );

  useKeyboard(handleKeyboard);

  const handleContentChange = useCallback(() => {
    if (textareaRef.current) {
      const newValue = textareaRef.current.plainText;
      onChange(newValue);
    }
  }, [onChange]);

  return (
    <textarea
      ref={textareaRef}
      initialValue={value}
      onContentChange={handleContentChange}
      focused={focused}
      style={{
        height: rows,
      }}
    />
  );
}
