import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { Fieldset } from "./Fieldset";
import type { Response } from "../http-client";

interface ResponseEditorProps {
  response: Response | null;
  focused: boolean;
}

type Tab = "body" | "headers" | "cookies";

export const ResponseEditor: React.FC<ResponseEditorProps> = ({
  response,
  focused,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("body");
  const [scrollOffset, setScrollOffset] = useState(0);
  const maxVisibleLines = 5; // Lines visible in the response fieldset

  // Handle keyboard input for tab switching and scrolling
  useInput((input, key) => {
    if (!focused) return;

    // Tab switching when not in edit mode
    if (key.leftArrow || (key.tab && key.shift)) {
      if (activeTab === "headers") {
        setActiveTab("cookies");
      } else if (activeTab === "cookies") {
        setActiveTab("body");
      } else {
        setActiveTab("headers");
      }
      setScrollOffset(0);
    } else if (key.rightArrow || key.tab) {
      if (activeTab === "body") {
        setActiveTab("headers");
      } else if (activeTab === "headers") {
        setActiveTab("cookies");
      } else {
        setActiveTab("body");
      }
      setScrollOffset(0);
    } else if (input === "b" || input === "5") {
      setActiveTab("body");
      setScrollOffset(0);
    } else if (input === "h" || input === "6") {
      setActiveTab("headers");
      setScrollOffset(0);
    } else if (input === "c" || input === "7") {
      setActiveTab("cookies");
      setScrollOffset(0);
    }

    // Scrolling (works in all tabs)
    if (response) {
      const lines = getTabLines();
      const totalLines = lines.length;

      if (key.upArrow) {
        setScrollOffset(Math.max(0, scrollOffset - 1));
      } else if (key.downArrow) {
        setScrollOffset(Math.min(Math.max(0, totalLines - maxVisibleLines), scrollOffset + 1));
      } else if (key.pageUp) {
        setScrollOffset(Math.max(0, scrollOffset - maxVisibleLines));
      } else if (key.pageDown) {
        setScrollOffset(Math.min(Math.max(0, totalLines - maxVisibleLines), scrollOffset + maxVisibleLines));
      } else if (input === 'g') {
        setScrollOffset(0);
      } else if (input === 'G') {
        setScrollOffset(Math.max(0, totalLines - maxVisibleLines));
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
        {activeTab === "body" ? "▶" : " "} 💾 Body (b/5)
      </Text>
      <Text dimColor>│</Text>
      <Text
        bold={activeTab === "headers"}
        color={activeTab === "headers" ? "cyan" : "gray"}
        backgroundColor={activeTab === "headers" ? (focused ? "cyan" : undefined) : undefined}
        inverse={activeTab === "headers" && focused}
      >
        {activeTab === "headers" ? "▶" : " "} 📋 Headers (h/6)
      </Text>
      <Text dimColor>│</Text>
      <Text
        bold={activeTab === "cookies"}
        color={activeTab === "cookies" ? "cyan" : "gray"}
        backgroundColor={activeTab === "cookies" ? (focused ? "cyan" : undefined) : undefined}
        inverse={activeTab === "cookies" && focused}
      >
        {activeTab === "cookies" ? "▶" : " "} 🍪 Cookies (c/7)
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

    const lines = getTabLines();
    const totalLines = lines.length;
    const visibleLines = lines.slice(scrollOffset, scrollOffset + maxVisibleLines);
    
    return (
      <Box flexDirection="column" flexGrow={1}>
        {visibleLines.map((line, idx) => (
          <Text key={idx} color={focused ? "cyan" : "gray"} dimColor={!focused}>
            {line || " "}
          </Text>
        ))}
        {totalLines > maxVisibleLines && (
          <Text dimColor italic>
            [{scrollOffset + 1}-{Math.min(scrollOffset + maxVisibleLines, totalLines)} of {totalLines} lines]
          </Text>
        )}
      </Box>
    );
  };

  const getTitle = () => {
    if (!response) {
      return "📊 Response";
    }
    return `📊 Response - ${response.status} ${response.statusText}`;
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
        <Box height={5} flexDirection="column">
          {renderContent()}
        </Box>
      </Box>
    </Fieldset>
  );
};
