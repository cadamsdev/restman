import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import type { RequestOptions } from '../http-client';
import type { HistoryEntry } from '../history-storage';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelectRequest: (request: RequestOptions) => void;
  onClose: () => void;
}

export function HistoryPanel({ history, onSelectRequest, onClose }: HistoryPanelProps) {
  // Start at the most recent (index 0 in reversed list = last item in original)
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyboard = useCallback(
    (key: { name: string; sequence?: string }) => {
      if (key.name === 'escape') {
        onClose();
        return;
      }

      if (history.length === 0) return;

      if (key.name === 'up') {
        // Moving up the list = to newer items = lower index
        setSelectedIndex((prev) => Math.max(0, prev - 1));
        return;
      }

      if (key.name === 'down') {
        // Moving down the list = to older items = higher index
        setSelectedIndex((prev) => Math.min(history.length - 1, prev + 1));
        return;
      }

      if (key.sequence === 'g') {
        // g = go to newest (top of display = index 0)
        setSelectedIndex(0);
        return;
      }

      if (key.sequence === 'G') {
        // G = go to oldest (bottom of display = last index)
        setSelectedIndex(history.length - 1);
        return;
      }

      if (key.name === 'return') {
        // Map display index to actual history array index (reversed)
        const actualIndex = history.length - 1 - selectedIndex;
        const selectedEntry = history[actualIndex];
        if (selectedEntry) {
          onSelectRequest(selectedEntry.request);
          onClose();
        }
        return;
      }
    },
    [history, selectedIndex, onSelectRequest, onClose],
  );

  useKeyboard(handleKeyboard);

  const getStatusColor = (status?: number): string => {
    if (!status) return '#666666';
    if (status >= 200 && status < 300) return '#99AA77';
    if (status >= 400) return '#BB6655';
    return '#CC9944';
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
    return url.substring(0, maxLength - 3) + '...';
  };

  if (history.length === 0) {
    return (
      <box
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          zIndex: 1000,
        }}
      >
        <box
          style={{
            borderStyle: 'double',
            borderColor: '#665544',
            paddingLeft: 3,
            paddingRight: 3,
            paddingTop: 1,
            paddingBottom: 1,
            flexDirection: 'column',
            width: 60,
            backgroundColor: '#1a1a1a',
          }}
        >
          <box style={{ justifyContent: 'center' }}>
            <text fg="#CC8844">Request History (0)</text>
          </box>

          <box style={{ marginTop: 1, justifyContent: 'center' }}>
            <text fg="#666666">No requests sent yet</text>
          </box>
          <box style={{ justifyContent: 'center' }}>
            <text fg="#666666">Send your first request to see it here</text>
          </box>

          <box
            style={{
              marginTop: 1,
              justifyContent: 'center',
              border: true,
              borderColor: '#443322',
              paddingLeft: 1,
              paddingRight: 1,
            }}
          >
            <text fg="#666666">ESC: Close</text>
          </box>
        </box>
      </box>
    );
  }

  const reversedHistory = [...history].reverse();
  
  // Calculate viewport for scrolling
  const maxVisibleItems = 10;
  
  // Calculate scroll offset to keep selected item visible
  let scrollOffset = 0;
  if (history.length > maxVisibleItems) {
    // Center the selected item when possible
    const centerOffset = Math.floor(maxVisibleItems / 2);
    scrollOffset = Math.max(0, selectedIndex - centerOffset);
    scrollOffset = Math.min(scrollOffset, history.length - maxVisibleItems);
  }
  
  const visibleHistory = reversedHistory.slice(scrollOffset, scrollOffset + maxVisibleItems);
  const hasMoreAbove = scrollOffset > 0;
  const hasMoreBelow = scrollOffset + maxVisibleItems < history.length;

  return (
    <box
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: 1000,
      }}
    >
      <box
        style={{
          borderStyle: 'double',
          borderColor: '#665544',
          paddingLeft: 3,
          paddingRight: 3,
          paddingTop: 1,
          paddingBottom: 1,
          flexDirection: 'column',
          width: 80,
          backgroundColor: '#1a1a1a',
        }}
      >
        <box style={{ justifyContent: 'center' }}>
          <text fg="#CC8844">Request History ({history.length}) - {selectedIndex + 1}/{history.length}</text>
        </box>

        <box style={{ marginTop: 1, flexDirection: 'column' }}>
          {hasMoreAbove && (
            <box style={{ justifyContent: 'center' }}>
              <text fg="#666666">↑ {scrollOffset} more above</text>
            </box>
          )}
          {visibleHistory.map((entry, index) => {
            const displayIndex = scrollOffset + index;
            const isSelected = displayIndex === selectedIndex;

            if (!entry || !entry.request || !entry.request.method || !entry.request.url) {
              return null;
            }

            return (
              <box key={entry.id} style={{ flexDirection: 'column' }}>
                <box>
                  <text
                    bg={isSelected ? '#2a2520' : undefined}
                    fg={isSelected ? '#CC8844' : getStatusColor(entry.status)}
                  >
                    {isSelected ? '▶ ' : '  '}
                    {entry.request.method.padEnd(6, ' ')}
                  </text>
                  <text
                    bg={isSelected ? '#2a2520' : undefined}
                    fg={isSelected ? '#BB7733' : '#999999'}
                  >
                    {' '}{truncateUrl(entry.request.url, 45)}
                  </text>
                </box>
                <box style={{ marginLeft: 2 }}>
                  <text fg="#666666">
                    {entry.status ? `${entry.status} - ` : ''}
                    {formatTimestamp(entry.timestamp)}
                  </text>
                </box>
              </box>
            );
          })}
          {hasMoreBelow && (
            <box style={{ justifyContent: 'center' }}>
              <text fg="#666666">↓ {history.length - (scrollOffset + maxVisibleItems)} more below</text>
            </box>
          )}
        </box>

        <box
          style={{
            marginTop: 1,
            justifyContent: 'center',
            border: true,
            borderColor: '#443322',
            paddingLeft: 1,
            paddingRight: 1,
          }}
        >
          <text fg="#666666">↕: Navigate | g/G: Top/Bottom | Enter: Load | ESC: Close</text>
        </box>
      </box>
    </box>
  );
}
