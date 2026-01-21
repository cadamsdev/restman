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
  const borderColor = focused ? '#CC8844' : editMode ? '#BB7733' : '#555555';

  const renderTabHeader = () => {
    const tabs = [
      { name: 'body', label: 'Body', color: '#99AA77' },
      { name: 'headers', label: 'Headers', color: '#CC8844' },
      { name: 'cookies', label: 'Cookies', color: '#BB7733' },
    ];

    return (
      <box style={{ flexDirection: 'row', gap: 1 }}>
        {tabs.map((tab) => (
          <text
            key={tab.name}
            fg={activeTab === tab.name ? tab.color : '#666666'}
          >
            {tab.label}
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
          <text fg={response.status >= 200 && response.status < 300 ? '#99AA77' : '#BB6655'}>
            Status: {response.status} {response.statusText} ({response.time}ms)
          </text>
          <text fg="#999999">{response.body.substring(0, 1000)}</text>
          {response.body.length > 1000 && (
            <text fg="#666666">... (truncated, press Space for full view)</text>
          )}
        </box>
      );
    } else if (activeTab === 'headers') {
      const headerLines = Object.entries(response.headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      const truncatedHeaders = headerLines.substring(0, 1000);
      return (
        <box style={{ flexDirection: 'column' }}>
          <text fg="#999999">{truncatedHeaders || '(no headers)'}</text>
          {headerLines.length > 1000 && (
            <text fg="#666666">... (truncated, press Space for full view)</text>
          )}
        </box>
      );
    } else {
      return <text fg="#666666">(cookies not yet implemented)</text>;
    }
  };

  return (
    <box
      title="Response"
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
