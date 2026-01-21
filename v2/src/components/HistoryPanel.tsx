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
  const [selectedIndex, setSelectedIndex] = useState(history.length > 0 ? history.length - 1 : 0);

  const handleKeyboard = useCallback(
    (key: { name: string; sequence?: string }) => {
      if (key.name === 'escape') {
        onClose();
        return;
      }

      if (history.length === 0) return;

      if (key.name === 'up') {
        setSelectedIndex((prev) => Math.min(history.length - 1, prev + 1));
        return;
      }

      if (key.name === 'down') {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
        return;
      }

      if (key.sequence === 'g') {
        setSelectedIndex(0);
        return;
      }

      if (key.sequence === 'G') {
        setSelectedIndex(history.length - 1);
        return;
      }

      if (key.name === 'return') {
        const selectedEntry = history[selectedIndex];
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
            border: 'double',
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
  const visibleHistory = reversedHistory.slice(0, 10);
  const actualSelectedIndex = history.length - 1 - selectedIndex;

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
          border: 'double',
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
          {visibleHistory.map((entry, index) => {
            const reverseIndex = history.length - 1 - index;
            const isSelected = reverseIndex === selectedIndex;

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
          {history.length > 10 && (
            <box style={{ marginTop: 1 }}>
              <text fg="#666666">... and {history.length - 10} more</text>
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
