import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import type { RequestOptions } from "../http-client";

export interface HistoryEntry {
  id: number;
  timestamp: Date;
  request: RequestOptions;
  status?: number;
  statusText?: string;
  time?: number;
}

interface HistoryPanelProps {
  history: HistoryEntry[];
  focused: boolean;
  onSelectRequest: (request: RequestOptions) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  focused,
  onSelectRequest,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const maxVisibleLines = 18; // Lines available for history display

  useEffect(() => {
    // Reset selection when history changes
    if (history.length > 0 && selectedIndex >= history.length) {
      setSelectedIndex(history.length - 1);
    }
  }, [history, selectedIndex]);

  useInput((input, key) => {
    if (!focused || history.length === 0) return;

    // Navigate through history
    if (key.upArrow) {
      const newIndex = Math.max(0, selectedIndex - 1);
      setSelectedIndex(newIndex);
      // Adjust scroll if needed
      if (newIndex < scrollOffset) {
        setScrollOffset(newIndex);
      }
    } else if (key.downArrow) {
      const newIndex = Math.min(history.length - 1, selectedIndex + 1);
      setSelectedIndex(newIndex);
      // Adjust scroll if needed
      if (newIndex >= scrollOffset + maxVisibleLines) {
        setScrollOffset(newIndex - maxVisibleLines + 1);
      }
    } else if (key.pageUp) {
      const newIndex = Math.max(0, selectedIndex - maxVisibleLines);
      setSelectedIndex(newIndex);
      setScrollOffset(Math.max(0, newIndex));
    } else if (key.pageDown) {
      const newIndex = Math.min(history.length - 1, selectedIndex + maxVisibleLines);
      setSelectedIndex(newIndex);
      setScrollOffset(Math.min(Math.max(0, history.length - maxVisibleLines), newIndex));
    } else if (input === 'g') {
      // Go to top
      setSelectedIndex(0);
      setScrollOffset(0);
    } else if (input === 'G') {
      // Go to bottom
      const lastIndex = history.length - 1;
      setSelectedIndex(lastIndex);
      setScrollOffset(Math.max(0, lastIndex - maxVisibleLines + 1));
    } else if (key.return) {
      // Load selected request
      if (history[selectedIndex]) {
        onSelectRequest(history[selectedIndex].request);
      }
    }
  }, { isActive: focused });

  const getStatusColor = (status?: number): string => {
    if (!status) return "gray";
    if (status >= 200 && status < 300) return "green";
    if (status >= 400) return "red";
    return "yellow";
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  const truncateUrl = (url: string, maxLength: number): string => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength - 3) + "...";
  };

  if (history.length === 0) {
    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="yellow"
        paddingX={1}
        paddingY={1}
        width="100%"
        height="100%"
      >
        <Text color="yellow" bold>
          📜 Request History (Empty)
        </Text>
        <Box marginTop={1}>
          <Text dimColor>
            No requests sent yet. Send your first request to see it here!
          </Text>
        </Box>
        <Box marginTop={2}>
          <Text dimColor>
            • ↑↓: Navigate • Enter: Load request • ESC: Return
          </Text>
        </Box>
      </Box>
    );
  }

  const visibleHistory = history.slice(scrollOffset, scrollOffset + maxVisibleLines);
  const reversedHistory = [...history].reverse();
  const reversedVisible = reversedHistory.slice(scrollOffset, scrollOffset + maxVisibleLines);

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="magenta"
      paddingX={1}
      paddingY={1}
      width="100%"
      height="100%"
    >
      <Box justifyContent="space-between" marginBottom={1}>
        <Text color="magenta" bold>
          📜 Request History ({history.length} total)
        </Text>
        <Text dimColor>
          {selectedIndex + 1}/{history.length}
        </Text>
      </Box>

      {reversedVisible.map((entry, index) => {
        const actualIndex = history.length - 1 - (scrollOffset + index);
        const isSelected = actualIndex === selectedIndex;
        
        // Safety check for invalid entries
        if (!entry || !entry.request || !entry.request.method || !entry.request.url) {
          return null;
        }
        
        return (
          <Box key={entry.id} marginBottom={0}>
            <Text
              backgroundColor={isSelected ? "magenta" : undefined}
              color={isSelected ? "black" : undefined}
              wrap="truncate"
            >
              {isSelected ? "▶ " : "  "}
              <Text bold color={isSelected ? "black" : getStatusColor(entry.status)}>
                {entry.request.method.padEnd(6)}
              </Text>
              {" "}
              <Text color={isSelected ? "black" : "white"}>
                {truncateUrl(entry.request.url, 50)}
              </Text>
              {" "}
              <Text dimColor={!isSelected} color={isSelected ? "black" : undefined}>
                {entry.status ? `(${entry.status})` : "(pending)"}
              </Text>
              {" "}
              <Text dimColor color={isSelected ? "black" : undefined}>
                {formatTimestamp(entry.timestamp)}
              </Text>
            </Text>
          </Box>
        );
      })}

      <Box marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
        <Text dimColor>
          ↑↓: Navigate | PgUp/PgDn: Scroll | g/G: Top/Bottom | Enter: Load | ESC: Return
        </Text>
      </Box>
    </Box>
  );
};
