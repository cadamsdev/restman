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
  onCancel?: () => void;
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
  onCancel,
}: RequestEditorProps) {
  const borderColor = focused ? '#CC8844' : editMode ? '#BB7733' : '#555555';

  const renderTabHeader = () => {
    const tabs = [
      { name: 'headers', label: 'Headers', color: '#CC8844' },
      { name: 'params', label: 'Params', color: '#9988BB' },
      { name: 'body', label: 'Body', color: '#99AA77' },
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
    if (activeTab === 'headers') {
      return editMode ? (
        <TextAreaInput
          value={headers}
          onChange={onHeadersChange}
          onCancel={onCancel}
          focused={true}
          rows={8}
        />
      ) : (
        <text fg="#999999">{headers || '(empty)'}</text>
      );
    } else if (activeTab === 'params') {
      return editMode ? (
        <TextAreaInput
          value={params}
          onChange={onParamsChange}
          onCancel={onCancel}
          focused={true}
          rows={8}
        />
      ) : (
        <text fg="#999999">{params || '(empty)'}</text>
      );
    } else {
      return editMode ? (
        <TextAreaInput
          value={body}
          onChange={onBodyChange}
          onCancel={onCancel}
          focused={true}
          rows={8}
        />
      ) : (
        <text fg="#999999">{body || '(empty)'}</text>
      );
    }
  };

  return (
    <box
      title="Request"
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
