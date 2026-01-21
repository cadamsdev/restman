import { useCallback, useState } from 'react';
import { useKeyboard, useTerminalDimensions } from '@opentui/react';
import { HTTPClient } from './http-client';
import type { RequestOptions, Response } from './http-client';
import { substituteVariables, substituteVariablesInHeaders } from './variable-substitution';
import { TextInput } from './components/TextInput';
import { TextAreaInput } from './components/TextAreaInput';

type FocusField = 'method' | 'url' | 'headers' | 'response';

export function App() {
  const { width, height } = useTerminalDimensions();
  const httpClient = new HTTPClient();

  // State
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('');
  const [headers, setHeaders] = useState<string>(
    'Content-Type: application/json\nAccept: application/json',
  );
  const [body, setBody] = useState<string>('');
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<FocusField>('url');
  const [editMode, setEditMode] = useState<FocusField | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  const fields: FocusField[] = ['method', 'url', 'headers', 'response'];

  const parseHeaders = (headersText: string): Record<string, string> => {
    const headers: Record<string, string> = {};
    const lines = headersText.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) continue;

      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (key) {
        headers[key] = value;
      }
    }

    return headers;
  };

  const sendRequest = async () => {
    if (!url) {
      setToastMessage('URL is required');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    setLoading(true);
    setToastMessage('Sending request...');

    try {
      const requestOptions: RequestOptions = {
        method,
        url,
        headers: parseHeaders(headers),
        body: body || undefined,
      };

      const result = await httpClient.sendRequest(requestOptions);
      setResponse(result);
      setToastMessage(`${result.status} ${result.statusText} (${result.time}ms)`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setToastMessage(errorMessage);
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyboard = useCallback(
    (key: { name: string; ctrl?: boolean; shift?: boolean; sequence?: string }) => {
      // Don't handle keys when in edit mode (input components handle them)
      if (editMode) return;

      // Quit
      if (key.name === 'q' || key.name === 'escape') {
        process.exit(0);
        return;
      }

      // Force quit
      if (key.ctrl && key.name === 'c') {
        process.exit(0);
        return;
      }

      // Send request
      if (key.name === 'return') {
        void sendRequest();
        return;
      }

      // Edit mode toggle
      if (key.name === 'e') {
        setEditMode(focusedField);
        return;
      }

      // Navigation
      if (key.name === 'tab') {
        const currentIndex = fields.indexOf(focusedField);
        const nextIndex = (currentIndex + 1) % fields.length;
        const nextField = fields[nextIndex];
        if (nextField) setFocusedField(nextField);
        return;
      }

      if (key.name === 'up') {
        const currentIndex = fields.indexOf(focusedField);
        const prevIndex = (currentIndex - 1 + fields.length) % fields.length;
        const prevField = fields[prevIndex];
        if (prevField) setFocusedField(prevField);
        return;
      }

      if (key.name === 'down') {
        const currentIndex = fields.indexOf(focusedField);
        const nextIndex = (currentIndex + 1) % fields.length;
        const nextField = fields[nextIndex];
        if (nextField) setFocusedField(nextField);
        return;
      }

      // Quick navigation
      if (key.sequence === '1') {
        setFocusedField('method');
        return;
      }
      if (key.sequence === '2') {
        setFocusedField('url');
        return;
      }
      if (key.sequence === '3') {
        setFocusedField('headers');
        return;
      }
      if (key.sequence === '4') {
        setFocusedField('response');
        return;
      }
    },
    [editMode, focusedField, fields],
  );

  useKeyboard(handleKeyboard);

  return (
    <box width={width} height={height} flexDirection="column" gap={1} paddingX={1}>
      {/* Header */}
      <text fg="#FF00FF" bold>
        🚀 RestMan v2.0.0
      </text>

      {/* Method and URL */}
      <box flexDirection="row" gap={1}>
        <box
          border="single"
          borderColor={focusedField === 'method' ? '#00FF00' : '#666666'}
          paddingX={1}
        >
          <text fg={focusedField === 'method' ? '#00FF00' : '#FFFFFF'}>{method}</text>
        </box>
        <box
          border="single"
          borderColor={focusedField === 'url' ? '#00FF00' : '#666666'}
          paddingX={1}
          flexGrow={1}
        >
          {editMode === 'url' ? (
            <TextInput
              value={url}
              onChange={setUrl}
              onSubmit={() => setEditMode(null)}
              onCancel={() => setEditMode(null)}
              focused={true}
              placeholder="Enter URL..."
            />
          ) : (
            <text fg={focusedField === 'url' ? '#00FF00' : '#FFFFFF'}>
              {url || '(empty - press e to edit)'}
            </text>
          )}
        </box>
      </box>

      {/* Headers */}
      <box
        border="single"
        borderColor={focusedField === 'headers' ? '#00FF00' : '#666666'}
        flexGrow={1}
        flexDirection="column"
        paddingX={1}
      >
        <text fg="#FFFF00" bold>
          Headers {focusedField === 'headers' ? '(focused)' : ''} {editMode === 'headers' ? '- EDITING (ESC to exit)' : ''}
        </text>
        {editMode === 'headers' ? (
          <TextAreaInput
            value={headers}
            onChange={setHeaders}
            onCancel={() => setEditMode(null)}
            focused={true}
            rows={8}
          />
        ) : (
          <text fg="#FFFFFF">{headers || '(empty)'}</text>
        )}
      </box>

      {/* Response */}
      <box
        border="single"
        borderColor={focusedField === 'response' ? '#00FF00' : '#666666'}
        flexGrow={1}
        flexDirection="column"
      >
        <text fg="#FFFF00" bold>
          Response {focusedField === 'response' ? '(focused)' : ''}
        </text>
        {response ? (
          <>
            <text fg="#00FF00">
              Status: {response.status} {response.statusText} ({response.time}ms)
            </text>
            <text fg="#FFFFFF">{response.body.substring(0, 500)}</text>
          </>
        ) : (
          <text fg="#666666">(no response yet - press Enter to send request)</text>
        )}
      </box>

      {/* Status Bar */}
      <box borderColor="#666666" paddingX={1}>
        <text fg="#FFFF00">
          {toastMessage || `Tab/↑↓: Navigate | e: Edit | Enter: Send | q: Quit`}
        </text>
      </box>
    </box>
  );
}
