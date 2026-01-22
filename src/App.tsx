import { useCallback, useState, useEffect } from 'react';
import { useKeyboard, useTerminalDimensions, useRenderer } from '@opentui/react';
import { HTTPClient } from './http-client';
import type { RequestOptions, Response } from './http-client';
import packageJson from '../package.json';
import {
  loadEnvironments,
  saveEnvironments,
  setActiveEnvironment,
  addEnvironment,
  updateEnvironment,
  deleteEnvironment,
  getActiveEnvironment,
  type EnvironmentsConfig,
} from './environment-storage';
import { loadSavedRequests, saveSavedRequests, type SavedRequest } from './saved-requests-storage';
import { loadHistory, saveHistory, type HistoryEntry } from './history-storage';
import { URLInput } from './components/URLInput';
import { MethodInput } from './components/MethodInput';
import { RequestEditor } from './components/RequestEditor';
import { ResponseViewer } from './components/ResponseViewer';
import { EnvironmentInput } from './components/EnvironmentInput';
import { Instructions } from './components/Instructions';
import { ExitModal } from './components/ExitModal';
import { EnvironmentSelectorModal } from './components/EnvironmentSelectorModal';
import { EnvironmentsViewerModal } from './components/EnvironmentsViewerModal';
import { EnvironmentEditorModal } from './components/EnvironmentEditorModal';
import { SaveModal } from './components/SaveModal';
import { HistoryViewer } from './components/HistoryViewer';
import { SavedRequestsModal } from './components/SavedRequestsModal';
import { MethodSelectorModal } from './components/MethodSelectorModal';
import { ResponseViewerModal } from './components/ResponseViewerModal';
import { HelpModal } from './components/HelpModal';
import { substituteVariables, substituteVariablesInHeaders } from './variable-substitution';

type FocusField = 'method' | 'url' | 'request' | 'response' | 'environment';

export function App() {
  const { width, height } = useTerminalDimensions();
  const renderer = useRenderer();
  const httpClient = new HTTPClient();

  // State
  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('');
  const [headers, setHeaders] = useState<string>(
    'Content-Type: application/json\nAccept: application/json',
  );
  const [params, setParams] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [response, setResponse] = useState<Response | null>(null);
  const [_loading, setLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<FocusField>('url');
  const [editMode, setEditMode] = useState<FocusField | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showEnvironmentSelectorModal, setShowEnvironmentSelectorModal] = useState<boolean>(false);
  const [showEnvironmentsPanel, setShowEnvironmentsPanel] = useState<boolean>(false);
  const [showEnvironmentEditorModal, setShowEnvironmentEditorModal] = useState<boolean>(false);
  const [editingEnvironmentId, setEditingEnvironmentId] = useState<number | null>(null);
  const [showMethodSelectorModal, setShowMethodSelectorModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState<boolean>(false);
  const [showSavedRequestsModal, setShowSavedRequestsModal] = useState<boolean>(false);
  const [showResponseViewerModal, setShowResponseViewerModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [requestActiveTab, setRequestActiveTab] = useState<'headers' | 'params' | 'body'>(
    'headers',
  );
  const [responseActiveTab, setResponseActiveTab] = useState<'body' | 'headers' | 'cookies'>(
    'body',
  );
  const [environmentsConfig, setEnvironmentsConfig] = useState<EnvironmentsConfig>({
    activeEnvironmentId: null,
    environments: [],
  });

  const fields: FocusField[] = ['environment', 'method', 'url', 'request', 'response'];

  // Load environments from disk on startup
  useEffect(() => {
    const initEnvironments = async () => {
      const loaded = await loadEnvironments();
      setEnvironmentsConfig(loaded);
    };
    void initEnvironments();
  }, []);

  // Load saved requests from disk on startup
  useEffect(() => {
    const initSavedRequests = async () => {
      const loaded = await loadSavedRequests();
      setSavedRequests(loaded);
    };
    void initSavedRequests();
  }, []);

  // Load history from disk on startup
  useEffect(() => {
    const initHistory = async () => {
      const loaded = await loadHistory();
      setHistory(loaded);
    };
    void initHistory();
  }, []);

  // Save environments to disk whenever they change
  useEffect(() => {
    if (environmentsConfig.environments.length > 0) {
      void saveEnvironments(environmentsConfig);
    }
  }, [environmentsConfig]);

  // Clean exit handler
  const handleExit = useCallback(() => {
    const cleanExit = (globalThis as any).__restmanCleanExit;
    if (cleanExit) {
      cleanExit();
    } else {
      // Fallback if global not available
      renderer.destroy();
      process.exit(0);
    }
  }, [renderer]);

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

  const parseParams = (paramsText: string): URLSearchParams => {
    const params = new URLSearchParams();
    const lines = paramsText.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const equalIndex = trimmed.indexOf('=');
      if (equalIndex === -1) continue;

      const key = trimmed.substring(0, equalIndex).trim();
      const value = trimmed.substring(equalIndex + 1).trim();

      if (key) {
        params.append(key, value);
      }
    }

    return params;
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
      // Get active environment variables
      const activeEnv = getActiveEnvironment(environmentsConfig);
      const variables = activeEnv?.variables || {};

      // Apply variable substitution to URL
      const substitutedUrl = substituteVariables(url, variables);

      // Add query parameters to URL
      let finalUrl = substitutedUrl;
      if (params) {
        const urlParams = parseParams(params);
        const paramString = urlParams.toString();
        if (paramString) {
          finalUrl += (finalUrl.includes('?') ? '&' : '?') + paramString;
        }
      }

      // Apply variable substitution to headers
      const parsedHeaders = parseHeaders(headers);
      const substitutedHeaders = substituteVariablesInHeaders(parsedHeaders, variables);

      // Apply variable substitution to body
      const substitutedBody = body ? substituteVariables(body, variables) : undefined;

      const requestOptions: RequestOptions = {
        method,
        url: finalUrl,
        headers: substitutedHeaders,
        body: substitutedBody,
      };

      const result = await httpClient.sendRequest(requestOptions);
      setResponse(result);
      setToastMessage(`${result.status} ${result.statusText} (${result.time}ms)`);
      setTimeout(() => setToastMessage(''), 3000);

      // Add to history
      const historyEntry: HistoryEntry = {
        id: Date.now(),
        timestamp: new Date(),
        request: requestOptions,
        status: result.status,
        statusText: result.statusText,
        time: result.time,
      };
      const updatedHistory = [...history, historyEntry];
      setHistory(updatedHistory);
      void saveHistory(updatedHistory);
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
      // Exit modal handles its own keyboard input
      if (showExitModal) {
        return;
      }

      // Environment selector modal handles its own keyboard input
      if (showEnvironmentSelectorModal) {
        return;
      }

      // Environments panel handles its own keyboard input
      if (showEnvironmentsPanel) {
        return;
      }

      // Environment editor modal handles its own keyboard input
      if (showEnvironmentEditorModal) {
        return;
      }

      // Save modal handles its own keyboard input
      if (showSaveModal) {
        return;
      }

      // History panel handles its own keyboard input
      if (showHistoryPanel) {
        return;
      }

      // Saved requests modal handles its own keyboard input
      if (showSavedRequestsModal) {
        return;
      }

      // Method selector modal handles its own keyboard input
      if (showMethodSelectorModal) {
        return;
      }

      // Response viewer modal handles its own keyboard input
      if (showResponseViewerModal) {
        return;
      }

      // Help modal handles its own keyboard input
      if (showHelpModal) {
        return;
      }

      // Exit edit mode with ESC
      if (editMode && key.name === 'escape') {
        setEditMode(null);
        return;
      }

      // Don't handle keys when in edit mode (input components handle them)
      if (editMode) return;

      // Open help modal
      if (key.sequence === '/') {
        setShowHelpModal(true);
        return;
      }

      // Open response viewer modal with spacebar when focused on response
      if (key.name === 'space' && focusedField === 'response' && response) {
        setShowResponseViewerModal(true);
        return;
      }

      // Show exit modal
      if (key.name === 'q' || key.name === 'escape') {
        setShowExitModal(true);
        return;
      }

      // Force quit
      if (key.ctrl && key.name === 'c') {
        handleExit();
        return;
      }

      // Send request
      if (key.name === 'return') {
        void sendRequest();
        return;
      }

      // Open environments panel
      if (key.sequence === 'v') {
        setShowEnvironmentsPanel(true);
        return;
      }

      // Open save modal
      if (key.sequence === 's') {
        if (!url) {
          setToastMessage('URL is required to save request');
          setTimeout(() => setToastMessage(''), 3000);
          return;
        }
        setShowSaveModal(true);
        return;
      }

      // Open history panel
      if (key.sequence === 'h') {
        setShowHistoryPanel(true);
        return;
      }

      // Open saved requests modal
      if (key.sequence === 'l') {
        setShowSavedRequestsModal(true);
        return;
      }

      // Edit mode toggle
      if (key.name === 'e') {
        if (focusedField === 'environment') {
          setShowEnvironmentSelectorModal(true);
        } else if (focusedField === 'method') {
          setShowMethodSelectorModal(true);
        } else {
          setEditMode(focusedField);
        }
        return;
      }

      // Navigation
      if (key.name === 'tab') {
        if (key.shift) {
          // Shift+Tab - navigate backwards with sub-tab support
          if (focusedField === 'request') {
            if (requestActiveTab === 'body') {
              setRequestActiveTab('params');
              return;
            } else if (requestActiveTab === 'params') {
              setRequestActiveTab('headers');
              return;
            }
            // On first tab, move to previous field
          } else if (focusedField === 'response') {
            if (responseActiveTab === 'cookies') {
              setResponseActiveTab('headers');
              return;
            } else if (responseActiveTab === 'headers') {
              setResponseActiveTab('body');
              return;
            }
            // On first tab, move to previous field
          }

          // Move to previous field
          const currentIndex = fields.indexOf(focusedField);
          const prevIndex = (currentIndex - 1 + fields.length) % fields.length;
          const prevField = fields[prevIndex];
          if (prevField) {
            setFocusedField(prevField);
            // Reset to first tab when entering a panel
            if (prevField === 'request') setRequestActiveTab('headers');
            if (prevField === 'response') setResponseActiveTab('body');
          }
        } else {
          // Tab - navigate forward with sub-tab support
          if (focusedField === 'request') {
            if (requestActiveTab === 'headers') {
              setRequestActiveTab('params');
              return;
            } else if (requestActiveTab === 'params') {
              setRequestActiveTab('body');
              return;
            }
            // On last tab, move to next field
          } else if (focusedField === 'response') {
            if (responseActiveTab === 'body') {
              setResponseActiveTab('headers');
              return;
            } else if (responseActiveTab === 'headers') {
              setResponseActiveTab('cookies');
              return;
            }
            // On last tab, move to next field
          }

          // Move to next field
          const currentIndex = fields.indexOf(focusedField);
          const nextIndex = (currentIndex + 1) % fields.length;
          const nextField = fields[nextIndex];
          if (nextField) {
            setFocusedField(nextField);
            // Reset to first tab when entering a panel
            if (nextField === 'request') setRequestActiveTab('headers');
            if (nextField === 'response') setResponseActiveTab('body');
          }
        }
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

      // Left/Right arrow keys for tab navigation within request and response panels
      if (key.name === 'left') {
        if (focusedField === 'request') {
          if (requestActiveTab === 'body') {
            setRequestActiveTab('params');
          } else if (requestActiveTab === 'params') {
            setRequestActiveTab('headers');
          } else {
            setRequestActiveTab('body');
          }
          return;
        } else if (focusedField === 'response') {
          if (responseActiveTab === 'cookies') {
            setResponseActiveTab('headers');
          } else if (responseActiveTab === 'headers') {
            setResponseActiveTab('body');
          } else {
            setResponseActiveTab('cookies');
          }
          return;
        }
      }

      if (key.name === 'right') {
        if (focusedField === 'request') {
          if (requestActiveTab === 'headers') {
            setRequestActiveTab('params');
          } else if (requestActiveTab === 'params') {
            setRequestActiveTab('body');
          } else {
            setRequestActiveTab('headers');
          }
          return;
        } else if (focusedField === 'response') {
          if (responseActiveTab === 'body') {
            setResponseActiveTab('headers');
          } else if (responseActiveTab === 'headers') {
            setResponseActiveTab('cookies');
          } else {
            setResponseActiveTab('body');
          }
          return;
        }
      }

      // Quick navigation
      if (key.sequence === '0') {
        setFocusedField('environment');
        return;
      }
      if (key.sequence === '1') {
        setFocusedField('method');
        return;
      }
      if (key.sequence === '2') {
        setFocusedField('url');
        return;
      }
      if (key.sequence === '3') {
        setFocusedField('request');
        return;
      }
      if (key.sequence === '4') {
        setFocusedField('response');
        return;
      }
    },
    [
      editMode,
      focusedField,
      fields,
      showExitModal,
      showEnvironmentSelectorModal,
      showMethodSelectorModal,
      showHelpModal,
      showHistoryPanel,
      showSavedRequestsModal,
    ],
  );

  useKeyboard(handleKeyboard);

  return (
    <box
      style={{
        width,
        height,
        flexDirection: 'column',
        gap: 1,
        paddingLeft: 1,
        paddingRight: 1,
        paddingTop: 1,
        paddingBottom: 1,
        backgroundColor: 'black',
      }}
    >
      {/* Header */}
      <text fg="#CC8844">RestMan v{packageJson.version}</text>

      {/* Environment Selector */}
      <EnvironmentInput
        environments={environmentsConfig.environments}
        activeEnvironmentId={environmentsConfig.activeEnvironmentId}
        focused={focusedField === 'environment'}
        editMode={editMode === 'environment'}
      />

      {/* Method and URL */}
      <box style={{ flexDirection: 'row', gap: 1 }}>
        <MethodInput
          value={method}
          onChange={setMethod}
          focused={focusedField === 'method'}
          editMode={editMode === 'method'}
        />
        <URLInput
          value={url}
          onChange={setUrl}
          focused={focusedField === 'url'}
          editMode={editMode === 'url'}
          onSubmit={() => setEditMode(null)}
        />
      </box>

      {/* Request Editor */}
      <RequestEditor
        headers={headers}
        onHeadersChange={setHeaders}
        params={params}
        onParamsChange={setParams}
        body={body}
        onBodyChange={setBody}
        focused={focusedField === 'request'}
        editMode={editMode === 'request'}
        activeTab={requestActiveTab}
        onTabChange={setRequestActiveTab}
        onCancel={() => setEditMode(null)}
      />

      {/* Response Viewer */}
      <ResponseViewer
        response={response}
        focused={focusedField === 'response'}
        editMode={editMode === 'response'}
        activeTab={responseActiveTab}
        onTabChange={setResponseActiveTab}
      />

      {/* Instructions */}
      <Instructions editMode={editMode !== null} />

      {/* Toast */}
      {toastMessage && (
        <box
          style={{
            position: 'absolute',
            bottom: 2,
            left: 2,
            right: 2,
            border: true,
            borderColor: '#BB7733',
            paddingLeft: 2,
            paddingRight: 2,
            backgroundColor: '#1a1a1a',
          }}
        >
          <text fg="#CC8844">{toastMessage}</text>
        </box>
      )}

      {/* Method Selector Modal */}
      {showMethodSelectorModal && (
        <MethodSelectorModal
          currentMethod={method}
          onSelect={(newMethod) => {
            setMethod(newMethod);
            setShowMethodSelectorModal(false);
          }}
          onCancel={() => setShowMethodSelectorModal(false)}
        />
      )}

      {/* Environment Selector Modal */}
      {showEnvironmentSelectorModal && (
        <EnvironmentSelectorModal
          environments={environmentsConfig.environments}
          currentEnvironmentId={environmentsConfig.activeEnvironmentId}
          onSelect={(id) => {
            setEnvironmentsConfig(setActiveEnvironment(environmentsConfig, id));
            setShowEnvironmentSelectorModal(false);
          }}
          onCancel={() => setShowEnvironmentSelectorModal(false)}
        />
      )}

      {/* Environments Panel */}
      {showEnvironmentsPanel && (
        <EnvironmentsViewerModal
          environments={environmentsConfig.environments}
          activeEnvironmentId={environmentsConfig.activeEnvironmentId}
          onSelectEnvironment={(id) => {
            setEnvironmentsConfig(setActiveEnvironment(environmentsConfig, id));
            setShowEnvironmentsPanel(false);
          }}
          onAddEnvironment={() => {
            setEditingEnvironmentId(null);
            setShowEnvironmentEditorModal(true);
          }}
          onEditEnvironment={(id) => {
            setEditingEnvironmentId(id);
            setShowEnvironmentEditorModal(true);
          }}
          onDeleteEnvironment={(id) => {
            setEnvironmentsConfig(deleteEnvironment(environmentsConfig, id));
          }}
          onClose={() => setShowEnvironmentsPanel(false)}
        />
      )}

      {/* Environment Editor Modal */}
      {showEnvironmentEditorModal &&
        (() => {
          const editingEnv = editingEnvironmentId
            ? environmentsConfig.environments.find((e) => e.id === editingEnvironmentId)
            : null;

          return (
            <EnvironmentEditorModal
              environmentName={editingEnv?.name}
              variables={editingEnv?.variables}
              onSave={(name, variables) => {
                if (editingEnvironmentId) {
                  setEnvironmentsConfig(
                    updateEnvironment(environmentsConfig, editingEnvironmentId, name, variables),
                  );
                } else {
                  const newId = Date.now();
                  setEnvironmentsConfig(
                    addEnvironment(environmentsConfig, { id: newId, name, variables }),
                  );
                }
                setShowEnvironmentEditorModal(false);
                setEditingEnvironmentId(null);
              }}
              onCancel={() => {
                setShowEnvironmentEditorModal(false);
                setEditingEnvironmentId(null);
              }}
            />
          );
        })()}

      {/* Save Modal */}
      {showSaveModal && (
        <SaveModal
          defaultName={`${method} ${url}`}
          onSave={(name) => {
            const newRequest: SavedRequest = {
              id: Date.now(),
              name,
              timestamp: new Date(),
              request: {
                method,
                url,
                headers: parseHeaders(headers),
                body: body || undefined,
              },
            };
            const updatedRequests = [...savedRequests, newRequest];
            setSavedRequests(updatedRequests);
            void saveSavedRequests(updatedRequests);
            setShowSaveModal(false);
            setToastMessage(`Saved: ${name}`);
            setTimeout(() => setToastMessage(''), 3000);
          }}
          onCancel={() => setShowSaveModal(false)}
        />
      )}

      {/* History Panel */}
      {showHistoryPanel && (
        <HistoryViewer
          history={history}
          onSelectRequest={(request) => {
            setMethod(request.method);
            setUrl(request.url);
            setHeaders(
              Object.entries(request.headers)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n'),
            );
            setBody(request.body || '');
            setShowHistoryPanel(false);
            setToastMessage('Loaded from history');
            setTimeout(() => setToastMessage(''), 3000);
          }}
          onClose={() => setShowHistoryPanel(false)}
        />
      )}

      {/* Saved Requests Modal */}
      {showSavedRequestsModal && (
        <SavedRequestsModal
          savedRequests={savedRequests}
          onSelectRequest={(request) => {
            setMethod(request.method);
            setUrl(request.url);
            setHeaders(
              Object.entries(request.headers)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n'),
            );
            setBody(request.body || '');
            setParams('');
            setShowSavedRequestsModal(false);
            setToastMessage('Loaded saved request');
            setTimeout(() => setToastMessage(''), 3000);
          }}
          onClose={() => setShowSavedRequestsModal(false)}
        />
      )}

      {/* Response Viewer Modal */}
      {showResponseViewerModal && response && (
        <ResponseViewerModal
          response={response}
          activeTab={responseActiveTab}
          onClose={() => setShowResponseViewerModal(false)}
        />
      )}

      {/* Help Modal */}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}

      {/* Exit Modal */}
      {showExitModal && (
        <ExitModal onConfirm={handleExit} onCancel={() => setShowExitModal(false)} />
      )}
    </box>
  );
}
