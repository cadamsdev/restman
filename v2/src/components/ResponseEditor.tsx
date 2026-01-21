import type { Response } from '../http-client';

interface ResponseEditorProps {
  response: Response | null;
  focused: boolean;
  editMode: boolean;
  activeTab: 'body' | 'headers' | 'cookies';
  onTabChange: (tab: 'body' | 'headers' | 'cookies') => void;
}

export function ResponseEditor({
  response,
  focused,
  editMode,
  activeTab,
}: ResponseEditorProps) {
  const borderColor = focused ? '#FF00FF' : editMode ? '#00FF00' : '#888888';

  const renderTabHeader = () => {
    const tabs = [
      { name: 'body', label: '📄 Body', color: '#00FF00' },
      { name: 'headers', label: '📋 Headers', color: '#FFFF00' },
      { name: 'cookies', label: '🍪 Cookies', color: '#FF8800' },
    ];

    return (
      <box style={{ flexDirection: 'row', gap: 1 }}>
        {tabs.map((tab) => (
          <text
            key={tab.name}
            fg={activeTab === tab.name ? tab.color : '#666666'}
          >
            {tab.label}
            {activeTab === tab.name ? ' ◀' : ''}
          </text>
        ))}
      </box>
    );
  };

  const renderContent = () => {
    if (!response) {
      return (
        <text fg="#666666">(no response yet - press Enter to send request)</text>
      );
    }

    if (activeTab === 'body') {
      return (
        <box style={{ flexDirection: 'column' }}>
          <text fg={response.status >= 200 && response.status < 300 ? '#00FF00' : '#FF0000'}>
            Status: {response.status} {response.statusText} ({response.time}ms)
          </text>
          <text fg="#FFFFFF">{response.body.substring(0, 1000)}</text>
          {response.body.length > 1000 && (
            <text fg="#888888">... (truncated, press Space for full view)</text>
          )}
        </box>
      );
    } else if (activeTab === 'headers') {
      const headerLines = Object.entries(response.headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      return <text fg="#FFFFFF">{headerLines || '(no headers)'}</text>;
    } else {
      return <text fg="#888888">(cookies not yet implemented)</text>;
    }
  };

  return (
    <box
      title="📥 Response"
      style={{
        flexGrow: 1,
        flexDirection: 'column',
        border: true,
        borderColor,
        paddingLeft: 1,
        paddingRight: 1,
      }}
    >
      {renderTabHeader()}
      {renderContent()}
    </box>
  );
}
