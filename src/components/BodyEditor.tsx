import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Fieldset } from './Fieldset';

interface BodyEditorProps {
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
  editMode: boolean;
}

export const BodyEditor: React.FC<BodyEditorProps> = ({ value, onChange, focused, editMode }) => {
  const [cursorLine, setCursorLine] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const lines = value.split('\n');

  useInput(
    (input, key) => {
      if (!editMode) return;

      if (key.upArrow) {
        setCursorLine(Math.max(0, cursorLine - 1));
        setCursorPosition(0);
        return;
      }

      if (key.downArrow) {
        setCursorLine(Math.min(lines.length - 1, cursorLine + 1));
        setCursorPosition(0);
        return;
      }

      if (key.leftArrow) {
        if (cursorPosition > 0) {
          setCursorPosition(cursorPosition - 1);
        } else if (cursorLine > 0) {
          setCursorLine(cursorLine - 1);
          setCursorPosition(lines[cursorLine - 1].length);
        }
        return;
      }

      if (key.rightArrow) {
        if (cursorPosition < lines[cursorLine].length) {
          setCursorPosition(cursorPosition + 1);
        } else if (cursorLine < lines.length - 1) {
          setCursorLine(cursorLine + 1);
          setCursorPosition(0);
        }
        return;
      }

      if (key.return) {
        const currentLine = lines[cursorLine];
        const before = currentLine.slice(0, cursorPosition);
        const after = currentLine.slice(cursorPosition);
        const newLines = [...lines];
        newLines[cursorLine] = before;
        newLines.splice(cursorLine + 1, 0, after);
        onChange(newLines.join('\n'));
        setCursorLine(cursorLine + 1);
        setCursorPosition(0);
        return;
      }

      if (key.backspace || key.delete) {
        if (cursorPosition > 0) {
          const currentLine = lines[cursorLine];
          const newLine =
            currentLine.slice(0, cursorPosition - 1) + currentLine.slice(cursorPosition);
          const newLines = [...lines];
          newLines[cursorLine] = newLine;
          onChange(newLines.join('\n'));
          setCursorPosition(cursorPosition - 1);
        } else if (cursorLine > 0) {
          const currentLine = lines[cursorLine];
          const previousLine = lines[cursorLine - 1];
          const newLines = [...lines];
          newLines[cursorLine - 1] = previousLine + currentLine;
          newLines.splice(cursorLine, 1);
          onChange(newLines.join('\n'));
          setCursorLine(cursorLine - 1);
          setCursorPosition(previousLine.length);
        }
        return;
      }

      if (input && !key.ctrl && !key.meta) {
        const currentLine = lines[cursorLine];
        const newLine =
          currentLine.slice(0, cursorPosition) + input + currentLine.slice(cursorPosition);
        const newLines = [...lines];
        newLines[cursorLine] = newLine;
        onChange(newLines.join('\n'));
        setCursorPosition(cursorPosition + input.length);
      }
    },
    { isActive: editMode },
  );

  return (
    <Fieldset title="💾 Body" focused={focused} editMode={editMode} width="50%">
      <Box flexDirection="column" flexGrow={1}>
        {value ? (
          lines.map((line, idx) => (
            <Text key={idx} color={focused ? 'cyan' : 'gray'} dimColor={!focused}>
              {editMode && idx === cursorLine ? (
                <>
                  {line.slice(0, cursorPosition)}
                  <Text backgroundColor="magenta" color="black">
                    {line[cursorPosition] || ' '}
                  </Text>
                  {line.slice(cursorPosition + 1)}
                </>
              ) : (
                line || ' '
              )}
            </Text>
          ))
        ) : (
          <Text dimColor italic>
            ∅ Empty
          </Text>
        )}
      </Box>
    </Fieldset>
  );
};
