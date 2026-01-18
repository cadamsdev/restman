import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Fieldset } from './Fieldset';
import type { Response } from '../http-client';

interface ResponseEditorProps {
  response: Response | null;
  focused: boolean;
  editMode?: boolean;
  activeTab: 'body' | 'headers' | 'cookies';
  onTabChange: (tab: 'body' | 'headers' | 'cookies') => void;
  isModalOpen?: boolean;
}

type Tab = 'body' | 'headers' | 'cookies';

export const ResponseEditor: React.FC<ResponseEditorProps> = ({
  response,
  focused,
  editMode = false,
  activeTab,
  onTabChange,
  isModalOpen = false,
}) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const maxVisibleLines = 5; // Lines visible in the response fieldset (plus 1 for line count indicator)

  // Handle keyboard input for scrolling
  useInput(
    (input, key) => {
      if (!focused || isModalOpen) return;

      // Handle left/right arrow navigation between tabs
      if (key.leftArrow) {
        if (activeTab === 'cookies') {
          onTabChange('headers');
          setScrollOffset(0);
          return;
        } else if (activeTab === 'headers') {
          onTabChange('body');
          setScrollOffset(0);
          return;
        }
        // Already on first tab, do nothing
        return;
      }

      if (key.rightArrow) {
        if (activeTab === 'body') {
          onTabChange('headers');
          setScrollOffset(0);
          return;
        } else if (activeTab === 'headers') {
          onTabChange('cookies');
          setScrollOffset(0);
          return;
        }
        // Already on last tab, do nothing
        return;
      }

      // Scrolling (up/down arrows)
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
          setScrollOffset(
            Math.min(Math.max(0, totalLines - maxVisibleLines), scrollOffset + maxVisibleLines),
          );
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
    },
    { isActive: focused },
  );

  const formatBody = (body: string, headers: Record<string, string>): string => {
    const contentType =
      Object.entries(headers).find(([key]) => key.toLowerCase() === 'content-type')?.[1] || '';

    // If it's JSON content, ensure it's formatted (it should already be formatted by HTTPClient)
    if (
      contentType.includes('application/json') ||
      contentType.includes('application/vnd.api+json')
    ) {
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

  const parseCookies = (
    headers: Record<string, string>,
  ): Array<{ name: string; value: string; attributes: string }> => {
    const cookies: Array<{ name: string; value: string; attributes: string }> = [];

    Object.entries(headers).forEach(([key, value]) => {
      if (key.toLowerCase() === 'set-cookie') {
        const cookieStrings = value.split(/,(?=\s*[a-zA-Z0-9_-]+=)/);

        cookieStrings.forEach((cookieStr) => {
          const parts = cookieStr.trim().split(';');
          if (parts.length > 0) {
            const [nameValue, ...attrs] = parts;
            const [name, val] = nameValue.split('=');
            cookies.push({
              name: name?.trim() || '',
              value: val?.trim() || '',
              attributes: attrs.join('; ').trim(),
            });
          }
        });
      }
    });

    return cookies;
  };

  const getTabLines = (): string[] => {
    if (!response) return [];

    if (activeTab === 'body') {
      const formattedBody = formatBody(response.body, response.headers);
      return formattedBody.split('\n');
    } else if (activeTab === 'headers') {
      return Object.entries(response.headers).map(([key, value]) => `${key}: ${value}`);
    } else {
      // cookies
      const cookies = parseCookies(response.headers);
      if (cookies.length === 0) {
        return ['No cookies set'];
      }
      const lines: string[] = [];
      cookies.forEach((cookie) => {
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
        bold={activeTab === 'body'}
        color={activeTab === 'body' ? 'cyan' : 'gray'}
        backgroundColor={activeTab === 'body' ? (focused ? 'cyan' : undefined) : undefined}
        inverse={activeTab === 'body' && focused}
      >
        Body
      </Text>
      <Text dimColor>│</Text>
      <Text
        bold={activeTab === 'headers'}
        color={activeTab === 'headers' ? 'cyan' : 'gray'}
        backgroundColor={activeTab === 'headers' ? (focused ? 'cyan' : undefined) : undefined}
        inverse={activeTab === 'headers' && focused}
      >
        Headers
      </Text>
      <Text dimColor>│</Text>
      <Text
        bold={activeTab === 'cookies'}
        color={activeTab === 'cookies' ? 'cyan' : 'gray'}
        backgroundColor={activeTab === 'cookies' ? (focused ? 'cyan' : undefined) : undefined}
        inverse={activeTab === 'cookies' && focused}
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
      return line.substring(0, maxLength) + '...';
    };

    const lines = getTabLines();
    const totalLines = lines.length;
    const visibleLines = lines.slice(scrollOffset, scrollOffset + maxVisibleLines);

    return (
      <Box flexDirection="column" flexGrow={1}>
        {visibleLines.map((line, idx) => (
          <Text key={idx} color={focused ? 'cyan' : 'gray'} dimColor={!focused}>
            {truncateLine(line) || ' '}
          </Text>
        ))}
        <Text dimColor italic>
          [{scrollOffset + 1}-{Math.min(scrollOffset + maxVisibleLines, totalLines)} of {totalLines}{' '}
          lines]
        </Text>
      </Box>
    );
  };

  const getTitle = () => {
    if (!response) {
      return '📊 Response';
    }
    return `📊 Response - ${response.status} ${response.statusText} (${response.time}ms)`;
  };

  const getTitleColor = () => {
    if (!response) {
      return undefined; // Use default color
    }
    if (response.status >= 200 && response.status < 300) {
      return 'green';
    } else if (response.status >= 400) {
      return 'red';
    } else {
      return 'yellow';
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
