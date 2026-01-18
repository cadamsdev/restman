import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { Fieldset } from "./Fieldset";
import type { Response } from "../http-client";

interface ResponseEditorProps {
  response: Response | null;
  focused: boolean;
  editMode?: boolean;
}

type Tab = "body" | "headers" | "cookies";

export const ResponseEditor: React.FC<ResponseEditorProps> = ({
  response,
  focused,
  editMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("body");
  const [scrollOffset, setScrollOffset] = useState(0);
  const maxVisibleLines = 5; // Lines visible in the response fieldset (plus 1 for line count indicator)

  // Handle keyboard input for tab switching and scrolling
  useInput((input, key) => {
    if (!focused) return;

    // Tab switching with left/right arrows (no wrapping)
    if (key.leftArrow) {
      if (activeTab === "cookies") {
        setActiveTab("headers");
        setScrollOffset(0);
      } else if (activeTab === "headers") {
        setActiveTab("body");
        setScrollOffset(0);
      }
      // Do nothing if already on first tab (body)
      return;
    }
    
    if (key.rightArrow) {
      if (activeTab === "body") {
        setActiveTab("headers");
        setScrollOffset(0);
      } else if (activeTab === "headers") {
        setActiveTab("cookies");
        setScrollOffset(0);
      }
      // Do nothing if already on last tab (cookies)
      return;
    }
    
    // Tab key continues to wrap around for convenience
    if (key.tab && key.shift) {
      if (activeTab === "body") {
        setActiveTab("cookies");
      } else if (activeTab === "cookies") {
        setActiveTab("headers");
      } else {
        setActiveTab("body");
      }
      setScrollOffset(0);
      return;
    }
    
    if (key.tab) {
      if (activeTab === "body") {
        setActiveTab("headers");
      } else if (activeTab === "headers") {
        setActiveTab("cookies");
      } else {
        setActiveTab("body");
      }
      setScrollOffset(0);
      return;
    }
    
    // Direct tab shortcuts
    if (input === "5") {
      setActiveTab("body");
      setScrollOffset(0);
      return;
    }
    
    if (input === "6") {
      setActiveTab("headers");
      setScrollOffset(0);
      return;
    }
    
    if (input === "7") {
      setActiveTab("cookies");
      setScrollOffset(0);
      return;
    }

    // Scrolling (up/down arrows work only in edit mode)
    if (response) {
      const lines = getTabLines();
      const totalLines = lines.length;

      if (editMode && key.upArrow) {
        setScrollOffset(Math.max(0, scrollOffset - 1));
        return;
      }
      
      if (editMode && key.downArrow) {
        setScrollOffset(Math.min(Math.max(0, totalLines - maxVisibleLines), scrollOffset + 1));
        return;
      }
      
      if (key.pageUp) {
        setScrollOffset(Math.max(0, scrollOffset - maxVisibleLines));
        return;
      }
      
      if (key.pageDown) {
        setScrollOffset(Math.min(Math.max(0, totalLines - maxVisibleLines), scrollOffset + maxVisibleLines));
        return;
      }
      
      if (input === 'g') {
        setScrollOffset(0);
        return;
      }
      
      if (input === 'G') {
        setScrollOffset(Math.max(0, totalLines - maxVisibleLines));
        return;
      }
    }
  }, { isActive: focused });

  const formatBody = (body: string, headers: Record<string, string>): string => {
    const contentType = Object.entries(headers).find(
      ([key]) => key.toLowerCase() === 'content-type'
    )?.[1] || '';
    
    // If it's JSON content, ensure it's formatted (it should already be formatted by HTTPClient)
    if (contentType.includes('application/json') || contentType.includes('application/vnd.api+json')) {
      try {
        // Try to parse to verify it's valid JSON, but return original if already formatted
        const parsed = JSON.parse(body);
        // Only re-format if the body appears to be minified (no newlines)
        if (!body.includes('\n') && body.length > 50) {
          return JSON.stringify(parsed, null, 2);
        }
        return body; // Already formatted
      } catch {
        return body; // Not valid JSON, return as-is
      }
    }
    return body;
  };

  const parseCookies = (headers: Record<string, string>): Array<{ name: string; value: string; attributes: string }> => {
    const cookies: Array<{ name: string; value: string; attributes: string }> = [];
    
    Object.entries(headers).forEach(([key, value]) => {
      if (key.toLowerCase() === 'set-cookie') {
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

  const getTabLines = (): string[] => {
    if (!response) return [];

    if (activeTab === "body") {
      const formattedBody = formatBody(response.body, response.headers);
      return formattedBody.split("\n");
    } else if (activeTab === "headers") {
      return Object.entries(response.headers).map(([key, value]) => `${key}: ${value}`);
    } else {
      // cookies
      const cookies = parseCookies(response.headers);
      if (cookies.length === 0) {
        return ["No cookies set"];
      }
      const lines: string[] = [];
      cookies.forEach(cookie => {
        lines.push(`${cookie.name} = ${cookie.value}`);
        if (cookie.attributes) {
          lines.push(`  ${cookie.attributes}`);
        }
      });
      return lines;
    }
  };

  const renderTabBar = () => (
    <Box gap={1} marginBottom={1}>
      <Text
        bold={activeTab === "body"}
        color={activeTab === "body" ? "cyan" : "gray"}
        backgroundColor={activeTab === "body" ? (focused ? "cyan" : undefined) : undefined}
        inverse={activeTab === "body" && focused}
      >
        Body
      </Text>
      <Text dimColor>│</Text>
      <Text
        bold={activeTab === "headers"}
        color={activeTab === "headers" ? "cyan" : "gray"}
        backgroundColor={activeTab === "headers" ? (focused ? "cyan" : undefined) : undefined}
        inverse={activeTab === "headers" && focused}
      >
        Headers
      </Text>
      <Text dimColor>│</Text>
      <Text
        bold={activeTab === "cookies"}
        color={activeTab === "cookies" ? "cyan" : "gray"}
        backgroundColor={activeTab === "cookies" ? (focused ? "cyan" : undefined) : undefined}
        inverse={activeTab === "cookies" && focused}
      >
        Cookies
      </Text>
    </Box>
  );

  const renderContent = () => {
    if (!response) {
      return (
        <Text dimColor italic>
          No response yet. Send a request to see results.
        </Text>
      );
    }

    const truncateLine = (line: string, maxLength: number = 120): string => {
      if (line.length <= maxLength) return line;
      return line.substring(0, maxLength) + "...";
    };

    const lines = getTabLines();
    const totalLines = lines.length;
    const visibleLines = lines.slice(scrollOffset, scrollOffset + maxVisibleLines);
    
    return (
      <Box flexDirection="column" flexGrow={1}>
        {visibleLines.map((line, idx) => (
          <Text key={idx} color={focused ? "cyan" : "gray"} dimColor={!focused}>
            {truncateLine(line) || " "}
          </Text>
        ))}
        <Text dimColor italic>
          [{scrollOffset + 1}-{Math.min(scrollOffset + maxVisibleLines, totalLines)} of {totalLines} lines]
        </Text>
      </Box>
    );
  };

  const getTitle = () => {
    if (!response) {
      return "📊 Response";
    }
    return `📊 Response - ${response.status} ${response.statusText} (${response.time}ms)`;
  };

  const getTitleColor = () => {
    if (!response) {
      return undefined; // Use default color
    }
    if (response.status >= 200 && response.status < 300) {
      return "green";
    } else if (response.status >= 400) {
      return "red";
    } else {
      return "yellow";
    }
  };

  return (
    <Fieldset
      title={getTitle()}
      titleColor={getTitleColor()}
      focused={focused}
      editMode={false}
      flexGrow={1}
    >
      <Box flexDirection="column">
        {renderTabBar()}
        <Box height={7} flexDirection="column">
          {renderContent()}
        </Box>
      </Box>
    </Fieldset>
  );
};
