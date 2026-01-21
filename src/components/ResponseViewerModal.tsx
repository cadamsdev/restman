import { useCallback } from 'react';
import { useKeyboard } from '@opentui/react';
import type { Response } from '../http-client';

interface ResponseViewerModalProps {
  response: Response;
  activeTab: 'body' | 'headers' | 'cookies';
  onClose: () => void;
}

export function ResponseViewerModal({ response, activeTab, onClose }: ResponseViewerModalProps) {
  const handleKeyboard = useCallback(
    (key: { name: string }) => {
      if (key.name === 'escape' || key.name === 'space') {
        onClose();
        return;
      }
    },
    [onClose],
  );

  useKeyboard(handleKeyboard);

  const renderContent = () => {
    if (activeTab === 'body') {
      return (
        <box style={{ flexDirection: 'column', gap: 1 }}>
          <text fg={response.status >= 200 && response.status < 300 ? '#99AA77' : '#BB6655'}>
            Status: {response.status} {response.statusText} ({response.time}ms)
          </text>
          <text fg="#999999">{response.body}</text>
        </box>
      );
    } else if (activeTab === 'headers') {
      const headerLines = Object.entries(response.headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      return <text fg="#999999">{headerLines || '(no headers)'}</text>;
    } else {
      return <text fg="#666666">(cookies not yet implemented)</text>;
    }
  };

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
          width: '90%',
          height: '90%',
          backgroundColor: '#1a1a1a',
        }}
      >
        <box style={{ justifyContent: 'center' }}>
          <text fg="#CC8844">
            Response {activeTab === 'body' ? 'Body' : activeTab === 'headers' ? 'Headers' : 'Cookies'}
          </text>
        </box>

        <box
          style={{
            marginTop: 1,
            flexGrow: 1,
            border: true,
            borderColor: '#555555',
            paddingLeft: 1,
            paddingRight: 1,
          }}
        >
          {renderContent()}
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
          <text fg="#666666">Space/ESC: Close</text>
        </box>
      </box>
    </box>
  );
}
