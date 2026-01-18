import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Fieldset } from './Fieldset';

interface RequestEditorProps {
  url: string;
  headers: string;
  onHeadersChange: (value: string) => void;
  params: string;
  onParamsChange: (value: string) => void;
  body: string;
  onBodyChange: (value: string) => void;
  focused: boolean;
  editMode: boolean;
  activeTab: 'headers' | 'params' | 'body';
  onTabChange: (tab: 'headers' | 'params' | 'body') => void;
  isModalOpen?: boolean;
}

export const RequestEditor: React.FC<RequestEditorProps> = ({
  url,
  headers,
  onHeadersChange,
  params,
  onParamsChange,
  body,
  onBodyChange,
  focused,
  editMode,
  activeTab,
  onTabChange,
  isModalOpen = false,
}) => {
  const [cursorLine, setCursorLine] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);

  const currentValue = activeTab === 'headers' ? headers : activeTab === 'params' ? params : body;
  const onChange =
    activeTab === 'headers'
      ? onHeadersChange
      : activeTab === 'params'
        ? onParamsChange
        : onBodyChange;
  const lines = currentValue.split('\n');

  // Handle keyboard input for editing (when in edit mode)
  useInput(
    (input, key) => {
      if (!focused || isModalOpen) return;

      // Handle left/right arrow navigation between tabs (when not in edit mode)
      if (!editMode) {
        if (key.leftArrow) {
          if (activeTab === 'body') {
            onTabChange('params');
            return;
          } else if (activeTab === 'params') {
            onTabChange('headers');
            return;
          }
        }
        if (key.rightArrow) {
          if (activeTab === 'headers') {
            onTabChange('params');
            return;
          } else if (activeTab === 'params') {
            onTabChange('body');
            return;
          }
        }
      }

      // Handle edit mode - multi-line text editing
      if (editMode) {
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

        if (input && !key.ctrl && !key.meta && !key.escape) {
          const currentLine = lines[cursorLine];
          const newLine =
            currentLine.slice(0, cursorPosition) + input + currentLine.slice(cursorPosition);
          const newLines = [...lines];
          newLines[cursorLine] = newLine;
          onChange(newLines.join('\n'));
          setCursorPosition(cursorPosition + input.length);
        }
        return;
      }
    },
    { isActive: focused },
  );

  const renderTabBar = () => (
    <Box gap={1} marginBottom={1}>
      <Text
        bold={activeTab === 'headers'}
        color={activeTab === 'headers' ? 'cyan' : 'gray'}
        backgroundColor={activeTab === 'headers' ? (focused ? 'cyan' : undefined) : undefined}
        inverse={activeTab === 'headers' && focused && !editMode}
      >
        Headers
      </Text>
      <Text dimColor>│</Text>
      <Text
        bold={activeTab === 'params'}
        color={activeTab === 'params' ? 'cyan' : 'gray'}
        backgroundColor={activeTab === 'params' ? (focused ? 'cyan' : undefined) : undefined}
        inverse={activeTab === 'params' && focused && !editMode}
      >
        Params
      </Text>
      <Text dimColor>│</Text>
      <Text
        bold={activeTab === 'body'}
        color={activeTab === 'body' ? 'cyan' : 'gray'}
        backgroundColor={activeTab === 'body' ? (focused ? 'cyan' : undefined) : undefined}
        inverse={activeTab === 'body' && focused && !editMode}
      >
        Body
      </Text>
    </Box>
  );

  const renderContent = () => {
    // Special rendering for params tab to show preview and format key-value pairs
    if (activeTab === 'params') {
      const displayLines = lines.length > 0 && lines[0] !== '' ? lines : [''];

      // Build preview URL
      let previewUrl = url || '';
      if (params.trim()) {
        const urlParams = new URLSearchParams();
        params.split('\n').forEach((line) => {
          const trimmed = line.trim();
          if (!trimmed) return;
          const equalIndex = trimmed.indexOf('=');
          if (equalIndex !== -1) {
            const key = trimmed.substring(0, equalIndex).trim();
            const value = trimmed.substring(equalIndex + 1).trim();
            if (key) urlParams.append(key, value);
          }
        });
        const paramString = urlParams.toString();
        if (paramString) {
          previewUrl += (previewUrl.includes('?') ? '&' : '?') + paramString;
        }
      }

      return (
        <Box flexDirection="column" flexGrow={1}>
          {/* URL Preview */}
          {!editMode && params.trim() && (
            <Box marginBottom={1}>
              <Text dimColor>Preview: </Text>
              <Text color="green">{previewUrl}</Text>
            </Box>
          )}

          {/* Params list with key-value formatting */}
          {displayLines.map((line, idx) => {
            const equalIndex = line.indexOf('=');
            const hasKeyValue = equalIndex !== -1 && !editMode;

            return (
              <Text key={idx} color={focused ? 'cyan' : 'gray'} dimColor={!focused}>
                {editMode && idx === cursorLine ? (
                  <>
                    {line.slice(0, cursorPosition)}
                    <Text backgroundColor="magenta" color="black">
                      {line[cursorPosition] || ' '}
                    </Text>
                    {line.slice(cursorPosition + 1)}
                  </>
                ) : hasKeyValue ? (
                  <>
                    <Text color="yellow" bold>
                      {line.substring(0, equalIndex)}
                    </Text>
                    <Text dimColor>=</Text>
                    <Text color="cyan">
                      {'"'}
                      {line.substring(equalIndex + 1)}
                      {'"'}
                    </Text>
                  </>
                ) : (
                  line || (idx === 0 ? 'key=value' : ' ')
                )}
              </Text>
            );
          })}
        </Box>
      );
    }

    // Default rendering for headers and body
    const displayLines = lines.length > 0 && lines[0] !== '' ? lines : [''];

    return (
      <Box flexDirection="column" flexGrow={1}>
        {displayLines.map((line, idx) => (
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
              line ||
              (idx === 0 && !editMode
                ? activeTab === 'headers'
                  ? 'No headers set...'
                  : 'No body set...'
                : ' ')
            )}
          </Text>
        ))}
      </Box>
    );
  };

  return (
    <Fieldset title="📨 Request" focused={focused} editMode={editMode} flexGrow={1}>
      <Box flexDirection="column">
        {renderTabBar()}
        <Box height={5} flexDirection="column">
          {renderContent()}
        </Box>
      </Box>
    </Fieldset>
  );
};
