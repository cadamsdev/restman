import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { Fieldset } from "./Fieldset";

interface RequestEditorProps {
  headers: string;
  onHeadersChange: (value: string) => void;
  body: string;
  onBodyChange: (value: string) => void;
  focused: boolean;
  editMode: boolean;
}

type Tab = "headers" | "body";

export const RequestEditor: React.FC<RequestEditorProps> = ({
  headers,
  onHeadersChange,
  body,
  onBodyChange,
  focused,
  editMode,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("headers");
  const [cursorLine, setCursorLine] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);

  const currentValue = activeTab === "headers" ? headers : body;
  const onChange = activeTab === "headers" ? onHeadersChange : onBodyChange;
  const lines = currentValue.split("\n");

  // Handle keyboard input for tab switching (when not in edit mode)
  useInput((input, key) => {
    if (!focused) return;

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
        onChange(newLines.join("\n"));
        setCursorLine(cursorLine + 1);
        setCursorPosition(0);
        return;
      }

      if (key.backspace || key.delete) {
        if (cursorPosition > 0) {
          const currentLine = lines[cursorLine];
          const newLine = currentLine.slice(0, cursorPosition - 1) + currentLine.slice(cursorPosition);
          const newLines = [...lines];
          newLines[cursorLine] = newLine;
          onChange(newLines.join("\n"));
          setCursorPosition(cursorPosition - 1);
        } else if (cursorLine > 0) {
          const currentLine = lines[cursorLine];
          const previousLine = lines[cursorLine - 1];
          const newLines = [...lines];
          newLines[cursorLine - 1] = previousLine + currentLine;
          newLines.splice(cursorLine, 1);
          onChange(newLines.join("\n"));
          setCursorLine(cursorLine - 1);
          setCursorPosition(previousLine.length);
        }
        return;
      }

      if (input && !key.ctrl && !key.meta && !key.escape) {
        const currentLine = lines[cursorLine];
        const newLine = currentLine.slice(0, cursorPosition) + input + currentLine.slice(cursorPosition);
        const newLines = [...lines];
        newLines[cursorLine] = newLine;
        onChange(newLines.join("\n"));
        setCursorPosition(cursorPosition + input.length);
      }
      return;
    }

    // Tab switching when not in edit mode
    if (key.leftArrow || (key.tab && key.shift)) {
      setActiveTab("headers");
      setCursorLine(0);
      setCursorPosition(0);
    } else if (key.rightArrow || key.tab) {
      setActiveTab("body");
      setCursorLine(0);
      setCursorPosition(0);
    } else if (input === "h" || input === "3") {
      setActiveTab("headers");
      setCursorLine(0);
      setCursorPosition(0);
    } else if (input === "b" || input === "4") {
      setActiveTab("body");
      setCursorLine(0);
      setCursorPosition(0);
    }
  }, { isActive: focused });

  const renderTabBar = () => (
    <Box gap={1} marginBottom={1}>
      <Text
        bold={activeTab === "headers"}
        color={activeTab === "headers" ? "cyan" : "gray"}
        backgroundColor={activeTab === "headers" ? (focused ? "cyan" : undefined) : undefined}
        inverse={activeTab === "headers" && focused && !editMode}
      >
        {activeTab === "headers" ? "▶" : " "} 📋 Headers (h/3)
      </Text>
      <Text dimColor>│</Text>
      <Text
        bold={activeTab === "body"}
        color={activeTab === "body" ? "cyan" : "gray"}
        backgroundColor={activeTab === "body" ? (focused ? "cyan" : undefined) : undefined}
        inverse={activeTab === "body" && focused && !editMode}
      >
        {activeTab === "body" ? "▶" : " "} 📝 Body (b/4)
      </Text>
    </Box>
  );

  const renderContent = () => {
    const displayLines = lines.length > 0 && lines[0] !== "" ? lines : [""];
    
    return (
      <Box flexDirection="column" flexGrow={1}>
        {displayLines.map((line, idx) => (
          <Text key={idx} color={focused ? "cyan" : "gray"} dimColor={!focused}>
            {editMode && idx === cursorLine ? (
              <>
                {line.slice(0, cursorPosition)}
                <Text backgroundColor="magenta" color="black">
                  {line[cursorPosition] || " "}
                </Text>
                {line.slice(cursorPosition + 1)}
              </>
            ) : (
              line || (idx === 0 && !editMode ? (activeTab === "headers" ? "No headers set..." : "No body set...") : " ")
            )}
          </Text>
        ))}
      </Box>
    );
  };

  return (
    <Fieldset
      title="📨 Request"
      focused={focused}
      editMode={editMode}
      flexGrow={1}
    >
      <Box flexDirection="column">
        {renderTabBar()}
        <Box height={5} flexDirection="column">
          {renderContent()}
        </Box>
      </Box>
    </Fieldset>
  );
};
