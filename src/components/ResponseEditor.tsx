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
      <box style={{ flexDirection: 'row', gap: 1, flexShrink: 0 }}>
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
      const isBinaryContent = response.body.startsWith('(binary content -');
      return (
        <scrollbox style={{ flexGrow: 1 }}>
          <text fg={isBinaryContent ? '#CC8844' : '#999999'}>{response.body}</text>
        </scrollbox>
      );
    } else if (activeTab === 'headers') {
      const headerLines = Object.entries(response.headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      return (
        <scrollbox style={{ flexGrow: 1 }}>
          <text fg="#999999">{headerLines || '(no headers)'}</text>
        </scrollbox>
      );
    } else {
      return <text fg="#666666">(cookies not yet implemented)</text>;
    }
  };

  const title = response
    ? `Response - ${response.status} ${response.statusText} (${response.time}ms)`
    : 'Response';

  return (
    <box
      title={title}
      style={{
        height: 15,
        flexShrink: 0,
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
