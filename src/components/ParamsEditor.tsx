import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Fieldset } from './Fieldset';

interface ParamsEditorProps {
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
  editMode: boolean;
}

export const ParamsEditor: React.FC<ParamsEditorProps> = ({
  value,
  onChange,
  focused,
  editMode,
}) => {
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
          setCursorPosition(lines[cursorLine - 1]?.length || 0);
        }
        return;
      }

      if (key.rightArrow) {
        if (cursorPosition < (lines[cursorLine]?.length || 0)) {
          setCursorPosition(cursorPosition + 1);
        } else if (cursorLine < lines.length - 1) {
          setCursorLine(cursorLine + 1);
          setCursorPosition(0);
        }
        return;
      }

      if (key.return) {
        const currentLine = lines[cursorLine];
        if (!currentLine) return;
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
          if (!currentLine) return;
          const newLine =
            currentLine.slice(0, cursorPosition - 1) + currentLine.slice(cursorPosition);
          const newLines = [...lines];
          newLines[cursorLine] = newLine;
          onChange(newLines.join('\n'));
          setCursorPosition(cursorPosition - 1);
        } else if (cursorLine > 0) {
          const currentLine = lines[cursorLine];
          const previousLine = lines[cursorLine - 1];
          if (!previousLine || !currentLine) return;
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
        if (!currentLine) return;
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
    <Fieldset
      title={editMode ? '🔧 Query Params (Editing)' : '🔧 Query Params'}
      focused={focused}
      editMode={editMode}
      flexGrow={1}
    >
      <Box flexDirection="column" width="100%">
        {editMode ? (
          <>
            {lines.map((line, index) => (
              <Box key={index}>
                {index === cursorLine ? (
                  <Text>
                    {line.slice(0, cursorPosition)}
                    <Text backgroundColor="yellow" color="black">
                      {line[cursorPosition] || ' '}
                    </Text>
                    {line.slice(cursorPosition + 1)}
                  </Text>
                ) : (
                  <Text dimColor={index !== cursorLine}>{line}</Text>
                )}
              </Box>
            ))}
          </>
        ) : (
          <>
            {lines.length > 0 && lines[0] ? (
              lines.map((line, index) => (
                <Box key={index}>
                  <Text dimColor={!focused}>{line || (index === 0 ? 'key=value' : '')}</Text>
                </Box>
              ))
            ) : (
              <Text dimColor={!focused} italic>
                key=value
              </Text>
            )}
          </>
        )}
      </Box>
    </Fieldset>
  );
};
