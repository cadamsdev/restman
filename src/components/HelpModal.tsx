import { useCallback } from 'react';
import { useKeyboard } from '@opentui/react';

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  const handleKeyboard = useCallback(
    (key: { name: string; sequence?: string }) => {
      if (key.name === 'escape' || key.sequence === '/' || key.name === 'return') {
        onClose();
        return;
      }
    },
    [onClose],
  );

  useKeyboard(handleKeyboard);

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
      {/* Modal content */}
      <box
        style={{
          border: true,
          borderColor: '#665544',
          paddingLeft: 3,
          paddingRight: 3,
          paddingTop: 1,
          paddingBottom: 1,
          flexDirection: 'column',
          width: 70,
          backgroundColor: '#1a1a1a',
        }}
      >
        <box style={{ justifyContent: 'center' }}>
          <text fg="#CC8844">RestMan Keyboard Shortcuts</text>
        </box>

        <box style={{ marginTop: 1, flexDirection: 'column', gap: 1 }}>
          {/* Navigation Section */}
          <box style={{ flexDirection: 'column' }}>
            <text fg="#999999">Navigation:</text>
            <box style={{ flexDirection: 'column', paddingLeft: 2 }}>
              <text fg="#666666">Tab / Shift+Tab Navigate between fields</text>
              <text fg="#666666">↑ / ↓ Navigate up/down</text>
              <text fg="#666666">← / → Switch tabs in Request/Response panels</text>
              <text fg="#666666">0-4 Quick navigation (0:Env, 1:Method, 2:URL, 3:Req, 4:Res)</text>
            </box>
          </box>

          {/* Actions Section */}
          <box style={{ flexDirection: 'column' }}>
            <text fg="#999999">Actions:</text>
            <box style={{ flexDirection: 'column', paddingLeft: 2 }}>
              <text fg="#666666">Enter Send HTTP request</text>
              <text fg="#666666">e Edit focused field</text>
              <text fg="#666666">Space Expand response viewer (when on response)</text>
              <text fg="#666666">s Save current request</text>
              <text fg="#666666">h View history</text>
              <text fg="#666666">v Manage environments</text>
            </box>
          </box>

          {/* Edit Mode Section */}
          <box style={{ flexDirection: 'column' }}>
            <text fg="#999999">Edit Mode:</text>
            <box style={{ flexDirection: 'column', paddingLeft: 2 }}>
              <text fg="#666666">ESC Exit edit mode</text>
              <text fg="#666666">Enter Submit changes</text>
            </box>
          </box>

          {/* Application Section */}
          <box style={{ flexDirection: 'column' }}>
            <text fg="#999999">Application:</text>
            <box style={{ flexDirection: 'column', paddingLeft: 2 }}>
              <text fg="#666666">/ Show this help menu</text>
              <text fg="#666666">q / ESC Quit application</text>
              <text fg="#666666">Ctrl+C Force quit</text>
            </box>
          </box>
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
          <text fg="#666666">Press / or ESC or Enter to close</text>
        </box>
      </box>
    </box>
  );
}
