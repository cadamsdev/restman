import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { Fieldset } from './Fieldset';
import type { RequestOptions } from '../http-client';
import type { SavedRequest } from '../saved-requests-storage';

interface SavedRequestsPanelProps {
  savedRequests: SavedRequest[];
  focused: boolean;
  onSelectRequest: (request: RequestOptions) => void;
  onDeleteRequest: (id: number) => void;
}

export const SavedRequestsPanel: React.FC<SavedRequestsPanelProps> = ({
  savedRequests,
  focused,
  onSelectRequest,
  onDeleteRequest,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [deleteMode, setDeleteMode] = useState(false);
  const maxVisibleLines = 18; // Lines available for display

  useEffect(() => {
    // Reset selection when savedRequests changes
    if (savedRequests.length > 0 && selectedIndex >= savedRequests.length) {
      setSelectedIndex(savedRequests.length - 1);
    }
  }, [savedRequests, selectedIndex]);

  useInput(
    (input, key) => {
      if (!focused) return;

      if (savedRequests.length === 0) return;

      // Handle delete confirmation mode
      if (deleteMode) {
        if (input === 'y' || input === 'Y') {
          const request = savedRequests[selectedIndex];
          if (request) {
            onDeleteRequest(request.id);
          }
          setDeleteMode(false);
          return;
        }
        if (input === 'n' || input === 'N' || key.escape) {
          setDeleteMode(false);
          return;
        }
        return;
      }

      // Navigate through saved requests
      if (key.upArrow) {
        const newIndex = Math.max(0, selectedIndex - 1);
        setSelectedIndex(newIndex);
        // Adjust scroll if needed
        if (newIndex < scrollOffset) {
          setScrollOffset(newIndex);
        }
      } else if (key.downArrow) {
        const newIndex = Math.min(savedRequests.length - 1, selectedIndex + 1);
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
        const newIndex = Math.min(savedRequests.length - 1, selectedIndex + maxVisibleLines);
        setSelectedIndex(newIndex);
        setScrollOffset(Math.min(Math.max(0, savedRequests.length - maxVisibleLines), newIndex));
      } else if (input === 'g') {
        // Go to top
        setSelectedIndex(0);
        setScrollOffset(0);
      } else if (input === 'G') {
        // Go to bottom
        const lastIndex = savedRequests.length - 1;
        setSelectedIndex(lastIndex);
        setScrollOffset(Math.max(0, lastIndex - maxVisibleLines + 1));
      } else if (key.return) {
        // Load selected request
        if (savedRequests[selectedIndex]) {
          onSelectRequest(savedRequests[selectedIndex].request);
        }
      } else if (input === 'd' || key.delete) {
        // Enter delete mode
        setDeleteMode(true);
      }
    },
    { isActive: focused },
  );

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
    return url.substring(0, maxLength - 3) + '...';
  };

  if (savedRequests.length === 0) {
    return (
      <Fieldset
        title="💾 Saved Requests (Empty)"
        borderColor="yellow"
        titleColor="yellow"
        focused={focused}
        width="100%"
        height="100%"
      >
        <Box marginTop={1}>
          <Text dimColor>No saved requests yet. Press 's' to save your current request!</Text>
        </Box>
        <Box marginTop={2}>
          <Text dimColor>• ESC: Return to main view</Text>
        </Box>
      </Fieldset>
    );
  }

  const visibleRequests = savedRequests.slice(scrollOffset, scrollOffset + maxVisibleLines);
  const title = `💾 Saved Requests (${savedRequests.length} total) - ${selectedIndex + 1}/${savedRequests.length}`;

  return (
    <Fieldset
      title={title}
      borderColor="green"
      titleColor="green"
      focused={focused}
      width="100%"
      height="100%"
    >
      {visibleRequests.map((entry, index) => {
        const actualIndex = scrollOffset + index;
        const isSelected = actualIndex === selectedIndex;

        // Safety check for invalid entries
        if (!entry || !entry.request || !entry.request.method || !entry.request.url) {
          return null;
        }

        return (
          <Box key={entry.id} marginBottom={0} flexDirection="column">
            <Text
              backgroundColor={isSelected ? 'green' : undefined}
              color={isSelected ? 'black' : undefined}
              wrap="truncate"
            >
              {isSelected ? '▶ ' : '  '}
              <Text bold color={isSelected ? 'black' : 'cyan'}>
                {entry.name}
              </Text>
            </Text>
            <Text
              backgroundColor={isSelected ? 'green' : undefined}
              color={isSelected ? 'black' : undefined}
              wrap="truncate"
            >
              {'    '}
              <Text bold color={isSelected ? 'black' : 'white'}>
                {entry.request.method.padEnd(6)}
              </Text>{' '}
              <Text color={isSelected ? 'black' : 'gray'}>
                {truncateUrl(entry.request.url, 45)}
              </Text>{' '}
              <Text dimColor color={isSelected ? 'black' : undefined}>
                {formatTimestamp(entry.timestamp)}
              </Text>
            </Text>
          </Box>
        );
      })}

      <Box marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
        {deleteMode ? (
          <Text color="red" bold>
            Delete "{savedRequests[selectedIndex]?.name}"? (y/n)
          </Text>
        ) : (
          <Text dimColor>
            ↑↓: Navigate | PgUp/PgDn: Scroll | g/G: Top/Bottom | Enter: Load | d: Delete | ESC:
            Return
          </Text>
        )}
      </Box>
    </Fieldset>
  );
};
