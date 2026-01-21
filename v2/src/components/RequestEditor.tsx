import { TextAreaInput } from './TextAreaInput';

interface RequestEditorProps {
  headers: string;
  onHeadersChange: (value: string) => void;
  params: string;
  onParamsChange: (value: string) => void;
  body: string;
  onBodyChange: (value: string) => void;
  focused: boolean;
  editMode: boolean;
  activeTab: 'headers' | 'params' | 'body';
  onTabChange: (tab: 'headers' | 'params' | 'body') => void;
}

export function RequestEditor({
  headers,
  onHeadersChange,
  params,
  onParamsChange,
  body,
  onBodyChange,
  focused,
  editMode,
  activeTab,
}: RequestEditorProps) {
  const borderColor = focused ? '#FF00FF' : editMode ? '#00FF00' : '#888888';

  const renderTabHeader = () => {
    const tabs = [
      { name: 'headers', label: '📋 Headers', color: '#FFFF00' },
      { name: 'params', label: '🔗 Params', color: '#00FFFF' },
      { name: 'body', label: '📝 Body', color: '#00FF00' },
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
    if (activeTab === 'headers') {
      return editMode ? (
        <TextAreaInput
          value={headers}
          onChange={onHeadersChange}
          onCancel={() => {}}
          focused={true}
          rows={8}
        />
      ) : (
        <text fg="#FFFFFF">{headers || '(empty)'}</text>
      );
    } else if (activeTab === 'params') {
      return editMode ? (
        <TextAreaInput
          value={params}
          onChange={onParamsChange}
          onCancel={() => {}}
          focused={true}
          rows={8}
        />
      ) : (
        <text fg="#FFFFFF">{params || '(empty)'}</text>
      );
    } else {
      return editMode ? (
        <TextAreaInput
          value={body}
          onChange={onBodyChange}
          onCancel={() => {}}
          focused={true}
          rows={8}
        />
      ) : (
        <text fg="#FFFFFF">{body || '(empty)'}</text>
      );
    }
  };

  return (
    <box
      title="📤 Request"
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
      {editMode && (
        <text fg="#888888">
          (Press ESC to exit edit mode)
        </text>
      )}
      {renderContent()}
    </box>
  );
}
