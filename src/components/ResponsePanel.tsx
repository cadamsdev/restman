import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import { Response } from "../http-client";

interface ResponsePanelProps {
  response: Response | null;
  focused: boolean;
}

export const ResponsePanel: React.FC<ResponsePanelProps> = ({
  response,
  focused,
}) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [activeTab, setActiveTab] = useState<"info" | "body">("info");
  const maxVisibleBodyLines = 12; // Lines reserved for body content

  useEffect(() => {
    setScrollOffset(0);
    setActiveTab("info");
  }, [response]);

  useInput((input, key) => {
    if (!focused || !response) return;

    // Tab switching
    if (input === '1') {
      setActiveTab("info");
      return;
    } else if (input === '2') {
      setActiveTab("body");
      return;
    } else if (key.leftArrow || key.rightArrow) {
      setActiveTab(activeTab === "info" ? "body" : "info");
      return;
    }

    // Scrolling only works in body tab
    if (activeTab === "body") {
      const formattedBody = formatBody(response.body, response.headers);
      const totalLines = formattedBody.split("\n").length;

      if (key.upArrow) {
        setScrollOffset(Math.max(0, scrollOffset - 1));
      } else if (key.downArrow) {
        setScrollOffset(Math.min(Math.max(0, totalLines - maxVisibleBodyLines), scrollOffset + 1));
      } else if (key.pageUp) {
        setScrollOffset(Math.max(0, scrollOffset - maxVisibleBodyLines));
      } else if (key.pageDown) {
        setScrollOffset(Math.min(Math.max(0, totalLines - maxVisibleBodyLines), scrollOffset + maxVisibleBodyLines));
      } else if (input === 'g') {
        setScrollOffset(0);
      } else if (input === 'G') {
        setScrollOffset(Math.max(0, totalLines - maxVisibleBodyLines));
      }
    }
  }, { isActive: focused });

  const formatBody = (body: string, headers: Record<string, string>): string => {
    const contentType = Object.entries(headers).find(
      ([key]) => key.toLowerCase() === 'content-type'
    )?.[1] || '';
    
    if (contentType.includes('application/json')) {
      try {
        const parsed = JSON.parse(body);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return body;
      }
    }
    return body;
  };

  return (
    <Box
      borderStyle="round"
      borderColor={focused ? "yellow" : "green"}
      flexDirection="column"
      paddingX={1}
      width="100%"
      height="100%"
    >
      <Box justifyContent="space-between">
        <Text bold dimColor={!focused}>
          Response {focused && response && "- ←/→ or 1/2 to switch tabs"}
        </Text>
      </Box>
      {response ? (
        <Box flexDirection="column" marginTop={1} height="100%">
          {/* Tab Headers */}
          <Box flexShrink={0}>
            <Box marginRight={2}>
              <Text 
                bold={activeTab === "info"} 
                color={activeTab === "info" ? "cyan" : undefined}
                dimColor={activeTab !== "info"}
              >
                [1] Info
              </Text>
            </Box>
            <Box>
              <Text 
                bold={activeTab === "body"} 
                color={activeTab === "body" ? "cyan" : undefined}
                dimColor={activeTab !== "body"}
              >
                [2] Body
              </Text>
            </Box>
          </Box>

          {/* Tab Content */}
          <Box flexDirection="column" marginTop={1} flexGrow={1}>
            {activeTab === "info" ? (
              <Box flexDirection="column">
                {/* Response Metadata */}
                <Box flexDirection="column" borderStyle="single" borderColor="gray" paddingX={1} marginBottom={1}>
                  <Box>
                    <Text bold color={response.status >= 200 && response.status < 300 ? "green" : response.status >= 400 ? "red" : "yellow"}>
                      Status: {response.status} {response.statusText}
                    </Text>
                  </Box>
                  <Box>
                    <Text dimColor>Time: {response.time}ms</Text>
                    <Text dimColor> | </Text>
                    <Text dimColor>Size: {new Blob([response.body]).size} bytes</Text>
                  </Box>
                </Box>

                {/* All Headers */}
                <Box flexDirection="column">
                  <Text bold>Headers:</Text>
                  {Object.entries(response.headers).map(([key, value]) => (
                    <Text key={key} dimColor>
                      {key}: {value}
                    </Text>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box flexDirection="column" flexGrow={1}>
                <Text bold dimColor>Body {focused && "(↑/↓ PgUp/PgDn g/G to scroll)"}:</Text>
                {(() => {
                  const formattedBody = formatBody(response.body, response.headers);
                  const lines = formattedBody.split("\n");
                  const totalLines = lines.length;
                  const visibleLines = lines.slice(scrollOffset, scrollOffset + maxVisibleBodyLines);
                  
                  return (
                    <>
                      {visibleLines.map((line, idx) => (
                        <Text key={idx}>{line || " "}</Text>
                      ))}
                      {totalLines > maxVisibleBodyLines && (
                        <Text dimColor italic>
                          [{scrollOffset + 1}-{Math.min(scrollOffset + maxVisibleBodyLines, totalLines)} of {totalLines} lines]
                        </Text>
                      )}
                    </>
                  );
                })()}
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Text dimColor italic marginTop={1}>
          No response yet. Send a request to see results.
        </Text>
      )}
    </Box>
  );
};
