import { useState, useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import type { RequestOptions } from '../http-client';
import type { SavedRequest } from '../saved-requests-storage';

interface SavedRequestsModalProps {
  savedRequests: SavedRequest[];
  onSelectRequest: (request: RequestOptions) => void;
  onClose: () => void;
}

export function SavedRequestsModal({
  savedRequests,
  onSelectRequest,
  onClose,
}: SavedRequestsModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(savedRequests.length > 0 ? 0 : 0);

  const handleKeyboard = useCallback(
    (key: { name: string; sequence?: string }) => {
      if (key.name === 'escape') {
        onClose();
        return;
      }

      if (savedRequests.length === 0) return;

      if (key.name === 'up') {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
        return;
      }

      if (key.name === 'down') {
        setSelectedIndex((prev) => Math.min(savedRequests.length - 1, prev + 1));
        return;
      }

      if (key.sequence === 'g') {
        setSelectedIndex(0);
        return;
      }

      if (key.sequence === 'G') {
        setSelectedIndex(savedRequests.length - 1);
        return;
      }

      if (key.name === 'return') {
        const selectedRequest = savedRequests[selectedIndex];
        if (selectedRequest) {
          onSelectRequest(selectedRequest.request);
          onClose();
        }
        return;
      }
    },
    [savedRequests, selectedIndex, onSelectRequest, onClose],
  );

  useKeyboard(handleKeyboard);

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
            border: true,
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
            <text fg="#CC8844">Saved Requests (0)</text>
          </box>

          <box style={{ marginTop: 1, justifyContent: 'center' }}>
            <text fg="#666666">No saved requests yet</text>
          </box>
          <box style={{ justifyContent: 'center' }}>
            <text fg="#666666">Press 's' to save your first request</text>
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

  const visibleRequests = savedRequests.slice(0, 10);

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
          border: true,
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
          <text fg="#CC8844">
            Saved Requests ({savedRequests.length}) - {selectedIndex + 1}/{savedRequests.length}
          </text>
        </box>

        <box style={{ marginTop: 1, flexDirection: 'column' }}>
          {visibleRequests.map((request, index) => {
            const isSelected = index === selectedIndex;

            if (!request || !request.request || !request.request.method || !request.request.url) {
              return null;
            }

            return (
              <box key={request.id} style={{ flexDirection: 'column' }}>
                <box>
                  <text
                    bg={isSelected ? '#2a2520' : undefined}
                    fg={isSelected ? '#CC8844' : '#99AA77'}
                  >
                    {isSelected ? '▶ ' : '  '}
                    {request.name}
                  </text>
                </box>
                <box style={{ marginLeft: 2 }}>
                  <text
                    bg={isSelected ? '#2a2520' : undefined}
                    fg={isSelected ? '#BB7733' : '#999999'}
                  >
                    {request.request.method.padEnd(6, ' ')}
                  </text>
                  <text
                    bg={isSelected ? '#2a2520' : undefined}
                    fg={isSelected ? '#BB7733' : '#999999'}
                  >
                    {' '}
                    {truncateUrl(request.request.url, 55)}
                  </text>
                </box>
                <box style={{ marginLeft: 2 }}>
                  <text fg="#666666">Saved {formatTimestamp(request.timestamp)}</text>
                </box>
              </box>
            );
          })}
          {savedRequests.length > 10 && (
            <box style={{ marginTop: 1 }}>
              <text fg="#666666">... and {savedRequests.length - 10} more</text>
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
