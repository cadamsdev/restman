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
  const [activeTab, setActiveTab] = useState<"info" | "body" | "cookies">("info");
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
    } else if (input === '3') {
      setActiveTab("cookies");
      return;
    } else if (key.leftArrow) {
      setActiveTab(activeTab === "info" ? "cookies" : activeTab === "body" ? "info" : "body");
      return;
    } else if (key.rightArrow) {
      setActiveTab(activeTab === "info" ? "body" : activeTab === "body" ? "cookies" : "info");
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

  const parseCookies = (headers: Record<string, string>): Array<{ name: string; value: string; attributes: string }> => {
    const cookies: Array<{ name: string; value: string; attributes: string }> = [];
    
    Object.entries(headers).forEach(([key, value]) => {
      if (key.toLowerCase() === 'set-cookie') {
        // Handle multiple Set-Cookie headers (they might be comma-separated or in array)
        const cookieStrings = value.split(/,(?=\s*[a-zA-Z0-9_-]+=)/);
        
        cookieStrings.forEach(cookieStr => {
          const parts = cookieStr.trim().split(';');
          if (parts.length > 0) {
            const [nameValue, ...attrs] = parts;
            const [name, val] = nameValue.split('=');
            cookies.push({
              name: name?.trim() || '',
              value: val?.trim() || '',
              attributes: attrs.join('; ').trim()
            });
          }
        });
      }
    });
    
    return cookies;
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
          Response {focused && response && "- ←/→ or 1/2/3 to switch tabs"}
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
            <Box marginRight={2}>
              <Text 
                bold={activeTab === "body"} 
                color={activeTab === "body" ? "cyan" : undefined}
                dimColor={activeTab !== "body"}
              >
                [2] Body
              </Text>
            </Box>
            <Box>
              <Text 
                bold={activeTab === "cookies"} 
                color={activeTab === "cookies" ? "cyan" : undefined}
                dimColor={activeTab !== "cookies"}
              >
                [3] Cookies
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
            ) : activeTab === "body" ? (
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
            ) : (
              <Box flexDirection="column">
                <Text bold>Cookies:</Text>
                {(() => {
                  const cookies = parseCookies(response.headers);
                  if (cookies.length === 0) {
                    return <Text dimColor italic>No cookies set</Text>;
                  }
                  return cookies.map((cookie, idx) => (
                    <Box key={idx} flexDirection="column" marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
                      <Text color="cyan">{cookie.name} = {cookie.value}</Text>
                      {cookie.attributes && (
                        <Text dimColor>{cookie.attributes}</Text>
                      )}
                    </Box>
                  ));
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
