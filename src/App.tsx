import React, { useState, useEffect } from "react";
import { Box, Text, useInput, useApp } from "ink";
import { HTTPClient } from "./http-client";
import packageJson from "../package.json";
import type { RequestOptions, Response } from "./http-client";
import { URLInput } from "./components/URLInput";
import { MethodSelector } from "./components/MethodSelector";
import { RequestEditor } from "./components/RequestEditor";
import { ResponseEditor } from "./components/ResponseEditor";
import { ResponsePanel } from "./components/ResponsePanel";
import { Toast } from "./components/Toast";
import { Instructions } from "./components/Instructions";
import { ExitModal } from "./components/ExitModal";
import { HelpModal } from "./components/HelpModal";
import { MethodSelectorModal } from "./components/MethodSelectorModal";
import { HistoryPanel } from "./components/HistoryPanel";
import type { HistoryEntry } from "./components/HistoryPanel";
import { SaveModal } from "./components/SaveModal";
import { SavedRequestsPanel } from "./components/SavedRequestsPanel";
import { EnvironmentSelector } from "./components/EnvironmentSelector";
import { EnvironmentSelectorModal } from "./components/EnvironmentSelectorModal";
import { EnvironmentsPanel } from "./components/EnvironmentsPanel";
import { EnvironmentEditorModal } from "./components/EnvironmentEditorModal";
import { ResponseBodyModal } from "./components/ResponseBodyModal";
import { loadHistory, saveHistory } from "./history-storage";
import { loadSavedRequests, saveSavedRequests, type SavedRequest } from "./saved-requests-storage";
import { loadEnvironments, saveEnvironments, setActiveEnvironment, addEnvironment, updateEnvironment, deleteEnvironment, getActiveEnvironment, type EnvironmentsConfig } from "./environment-storage";
import { substituteVariables, substituteVariablesInHeaders } from "./variable-substitution";

type FocusField = "method" | "url" | "request" | "response" | "environment";

export const App: React.FC = () => {
  const { exit } = useApp();
  const httpClient = new HTTPClient();

  // State
  const [method, setMethod] = useState<string>("GET");
  const [url, setUrl] = useState<string>("https://jsonplaceholder.typicode.com/posts/1");
  const [headers, setHeaders] = useState<string>("Content-Type: application/json\nAccept: application/json");
  const [params, setParams] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<FocusField>("url");
  const [error, setError] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"loading" | "error" | "success">("loading");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showMethodModal, setShowMethodModal] = useState<boolean>(false);
  const [showEnvironmentSelectorModal, setShowEnvironmentSelectorModal] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<FocusField | null>(null);
  const [showResponseBodyModal, setShowResponseBodyModal] = useState<boolean>(false);
  const [historyViewMode, setHistoryViewMode] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIdCounter, setHistoryIdCounter] = useState<number>(1);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [savedRequestsViewMode, setSavedRequestsViewMode] = useState<boolean>(false);
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
  const [savedRequestIdCounter, setSavedRequestIdCounter] = useState<number>(1);
  const [environmentsConfig, setEnvironmentsConfig] = useState<EnvironmentsConfig>({ activeEnvironmentId: null, environments: [] });
  const [environmentsViewMode, setEnvironmentsViewMode] = useState<boolean>(false);
  const [showEnvironmentEditor, setShowEnvironmentEditor] = useState<boolean>(false);
  const [editingEnvironmentId, setEditingEnvironmentId] = useState<number | null>(null);
  const [requestActiveTab, setRequestActiveTab] = useState<"headers" | "params" | "body">("headers");
  const [responseActiveTab, setResponseActiveTab] = useState<"body" | "headers" | "cookies">("body");

  const fields: FocusField[] = ["url", "request", "response", "environment", "method"];

  // Load history from disk on startup
  useEffect(() => {
    const initHistory = async () => {
      const loadedHistory = await loadHistory();
      if (loadedHistory.length > 0) {
        setHistory(loadedHistory);
        // Set the counter to be one more than the highest ID
        const maxId = Math.max(...loadedHistory.map(h => h.id));
        setHistoryIdCounter(maxId + 1);
      }
    };
    initHistory();
  }, []);

  // Load saved requests from disk on startup
  useEffect(() => {
    const initSavedRequests = async () => {
      const loaded = await loadSavedRequests();
      if (loaded.length > 0) {
        setSavedRequests(loaded);
        // Set the counter to be one more than the highest ID
        const maxId = Math.max(...loaded.map(r => r.id));
        setSavedRequestIdCounter(maxId + 1);
      }
    };
    initSavedRequests();
  }, []);

  // Load environments from disk on startup
  useEffect(() => {
    const initEnvironments = async () => {
      const loaded = await loadEnvironments();
      setEnvironmentsConfig(loaded);
    };
    initEnvironments();
  }, []);

  // Save history to disk whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      saveHistory(history);
    }
  }, [history]);

  // Save saved requests to disk whenever they change
  useEffect(() => {
    if (savedRequests.length > 0) {
      saveSavedRequests(savedRequests);
    }
  }, [savedRequests]);

  // Save environments to disk whenever they change
  useEffect(() => {
    if (environmentsConfig.environments.length > 0) {
      saveEnvironments(environmentsConfig);
    }
  }, [environmentsConfig]);

  // Auto-dismiss toast after 3 seconds for success/error messages
  useEffect(() => {
    if (showToast && toastType !== "loading") {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast, toastType]);

  // Handle keyboard input
  useInput((input, key) => {
    // Handle help modal
    if (showHelpModal) {
      if (input === "/" || key.escape) {
        setShowHelpModal(false);
        return;
      }
      return; // Ignore other keys when help modal is shown
    }

    // Save modal handles its own keyboard input
    if (showSaveModal) {
      return; // Ignore all keys when modal is shown - modal handles them
    }

    // Exit modal handles its own keyboard input
    if (showExitModal) {
      return; // Ignore all keys when modal is shown - modal handles them
    }

    // Method selector modal handles its own keyboard input
    if (showMethodModal) {
      return; // Ignore all keys when modal is shown - modal handles them
    }

    // Environment selector modal handles its own keyboard input
    if (showEnvironmentSelectorModal) {
      return; // Ignore all keys when modal is shown - modal handles them
    }

    // Environment editor modal handles its own keyboard input
    if (showEnvironmentEditor) {
      return; // Ignore all keys when modal is shown - modal handles them
    }

    // Response body modal handles its own keyboard input
    if (showResponseBodyModal) {
      return; // Ignore all keys when modal is shown - modal handles them
    }

    // Handle environments view mode
    if (environmentsViewMode) {
      if (key.escape) {
        setEnvironmentsViewMode(false);
        return;
      }
      // All other inputs are handled by EnvironmentsPanel
      return;
    }

    // Handle saved requests view mode
    if (savedRequestsViewMode) {
      if (key.escape) {
        setSavedRequestsViewMode(false);
        return;
      }
      // All other inputs are handled by SavedRequestsPanel
      return;
    }

    // Handle history view mode
    if (historyViewMode) {
      if (key.escape) {
        setHistoryViewMode(false);
        return;
      }
      // All other inputs are handled by HistoryPanel
      return;
    }

    // Open response body modal with spacebar when response is in edit mode
    if (editMode === "response" && input === " " && response) {
      setShowResponseBodyModal(true);
      setEditMode(null); // Exit edit mode when opening modal
      return;
    }

    // Exit edit mode with ESC (only if in edit mode)
    if (editMode && key.escape) {
      setEditMode(null);
      return;
    }

    // Show exit confirmation (only in readonly mode)
    if (!editMode && (input === "q" || key.escape)) {
      setShowExitModal(true);
      return;
    }

    // Force quit without confirmation
    if (key.ctrl && input === "c") {
      exit();
      return;
    }

    // Show help modal (only in readonly mode)
    if (!editMode && input === "/") {
      setShowHelpModal(true);
      return;
    }

    // Only allow navigation hotkeys in readonly mode
    if (!editMode) {
      // Enter edit mode (or open modal for method/environment)
      if (input === "e") {
        if (focusedField === "method") {
          setShowMethodModal(true);
        } else if (focusedField === "environment") {
          setShowEnvironmentSelectorModal(true);
        } else {
          setEditMode(focusedField);
        }
        return;
      }

      // Open response body modal with spacebar when response is focused
      if (input === " " && focusedField === "response" && response) {
        setShowResponseBodyModal(true);
        return;
      }

      // Open history view
      if (input === "h" || input === "5") {
        setHistoryViewMode(true);
        return;
      }

      // Save current request
      if (input === "s") {
        setShowSaveModal(true);
        return;
      }

      // Open saved requests view
      if (input === "l" || input === "6") {
        setSavedRequestsViewMode(true);
        return;
      }

      // Open environments view
      if (input === "v" || input === "7") {
        setEnvironmentsViewMode(true);
        return;
      }

      // Quick navigation hotkeys
      if (input === "0") {
        setFocusedField("environment");
        setEditMode(null);
        return;
      }
      if (input === "1") {
        setFocusedField("method");
        setEditMode(null);
        return;
      }
      if (input === "2") {
        setFocusedField("url");
        setEditMode(null);
        return;
      }
      if (input === "3") {
        setFocusedField("request");
        setEditMode(null);
        return;
      }
      if (input === "p" || input === "4") {
        setFocusedField("response");
        setEditMode(null);
        return;
      }
    }

    // Arrow key navigation (only in readonly mode)
    if (!editMode) {
      if (key.upArrow) {
        const currentIndex = fields.indexOf(focusedField);
        const prevIndex = (currentIndex - 1 + fields.length) % fields.length;
        const prevField = fields[prevIndex];
        if (prevField) setFocusedField(prevField);
        return;
      }
      if (key.downArrow) {
        const currentIndex = fields.indexOf(focusedField);
        const nextIndex = (currentIndex + 1) % fields.length;
        const nextField = fields[nextIndex];
        if (nextField) setFocusedField(nextField);
        return;
      }
    }

    // Tab navigation with sub-tab support
    if (key.tab) {
      if (key.shift) {
        // Shift+Tab - previous tab/field
        if (focusedField === "request") {
          if (requestActiveTab === "body") {
            setRequestActiveTab("params");
            return;
          } else if (requestActiveTab === "params") {
            setRequestActiveTab("headers");
            return;
          }
          // On first tab, move to previous field
        } else if (focusedField === "response") {
          if (responseActiveTab === "cookies") {
            setResponseActiveTab("headers");
            return;
          } else if (responseActiveTab === "headers") {
            setResponseActiveTab("body");
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
          if (prevField === "request") setRequestActiveTab("headers");
          if (prevField === "response") setResponseActiveTab("body");
        }
      } else {
        // Tab - next tab/field
        if (focusedField === "request") {
          if (requestActiveTab === "headers") {
            setRequestActiveTab("params");
            return;
          } else if (requestActiveTab === "params") {
            setRequestActiveTab("body");
            return;
          }
          // On last tab, move to next field
        } else if (focusedField === "response") {
          if (responseActiveTab === "body") {
            setResponseActiveTab("headers");
            return;
          } else if (responseActiveTab === "headers") {
            setResponseActiveTab("cookies");
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
          if (nextField === "request") setRequestActiveTab("headers");
          if (nextField === "response") setResponseActiveTab("body");
        }
      }
      return;
    }

    // Send request options
    if (!editMode) {
      // In readonly mode, Enter sends request
      if (key.return) {
        sendRequest();
        return;
      }
    }
    
    // Ctrl+S always sends request (works in both modes)
    if (input === "s" && key.ctrl) {
      sendRequest();
      return;
    }
  });

  const parseHeaders = (headersText: string): Record<string, string> => {
    const headers: Record<string, string> = {};
    const lines = headersText.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const colonIndex = trimmed.indexOf(":");
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
    const lines = paramsText.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const equalIndex = trimmed.indexOf("=");
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
      setError("URL is required");
      setToastMessage("URL is required");
      setToastType("error");
      setShowToast(true);
      return;
    }

    setLoading(true);
    setError("");
    setToastMessage("Sending request...");
    setToastType("loading");
    setShowToast(true);

    try {
      // Get active environment variables
      const activeEnv = getActiveEnvironment(environmentsConfig);
      const variables = activeEnv?.variables || {};

      // Apply variable substitution
      let substitutedUrl = substituteVariables(url, variables);
      const substitutedBody = body ? substituteVariables(body, variables) : undefined;
      const parsedHeaders = parseHeaders(headers);
      const substitutedHeaders = substituteVariablesInHeaders(parsedHeaders, variables);

      // Add query parameters to URL
      if (params) {
        const urlParams = parseParams(params);
        // Apply variable substitution to param values
        const substitutedParams = new URLSearchParams();
        urlParams.forEach((value, key) => {
          substitutedParams.append(key, substituteVariables(value, variables));
        });
        
        const paramString = substitutedParams.toString();
        if (paramString) {
          substitutedUrl += (substitutedUrl.includes('?') ? '&' : '?') + paramString;
        }
      }

      const requestOptions: RequestOptions = {
        method,
        url: substitutedUrl,
        headers: substitutedHeaders,
        body: substitutedBody,
      };

      // Add request to history (before sending)
      const historyEntry: HistoryEntry = {
        id: historyIdCounter,
        timestamp: new Date(),
        request: requestOptions,
      };
      
      setHistory(prev => [...prev, historyEntry]);
      setHistoryIdCounter(prev => prev + 1);

      const result = await httpClient.sendRequest(requestOptions);
      setResponse(result);
      
      // Update history entry with response info
      setHistory(prev => 
        prev.map(entry => 
          entry.id === historyEntry.id 
            ? { ...entry, status: result.status, statusText: result.statusText, time: result.time }
            : entry
        )
      );
      
      // Show success toast
      setToastMessage(`${result.status} ${result.statusText} (${result.time}ms)`);
      setToastType("success");
      setShowToast(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const loadRequestFromHistory = (request: RequestOptions) => {
    // Safety check
    if (!request || !request.method || !request.url) {
      return;
    }
    
    setMethod(request.method);
    
    // Separate URL and query params
    const urlObj = new URL(request.url);
    setUrl(urlObj.origin + urlObj.pathname);
    
    // Convert URL params to string format
    const paramsArray: string[] = [];
    urlObj.searchParams.forEach((value, key) => {
      paramsArray.push(`${key}=${value}`);
    });
    setParams(paramsArray.join("\n"));
    
    // Convert headers object back to string format
    const headersString = Object.entries(request.headers || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    setHeaders(headersString);
    
    setBody(request.body || "");
    setHistoryViewMode(false);
  };

  const saveCurrentRequest = (name: string) => {
    // Build final URL with params for saving
    let finalUrl = url;
    if (params) {
      const urlParams = parseParams(params);
      const paramString = urlParams.toString();
      if (paramString) {
        finalUrl += (finalUrl.includes('?') ? '&' : '?') + paramString;
      }
    }
    
    const savedRequest: SavedRequest = {
      id: savedRequestIdCounter,
      name,
      timestamp: new Date(),
      request: {
        method,
        url: finalUrl,
        headers: parseHeaders(headers),
        body: body || undefined,
      },
    };
    
    setSavedRequests(prev => [...prev, savedRequest]);
    setSavedRequestIdCounter(prev => prev + 1);
    setShowSaveModal(false);
  };

  const loadRequestFromSaved = (request: RequestOptions) => {
    // Safety check
    if (!request || !request.method || !request.url) {
      return;
    }
    
    setMethod(request.method);
    
    // Separate URL and query params
    try {
      const urlObj = new URL(request.url);
      setUrl(urlObj.origin + urlObj.pathname);
      
      // Convert URL params to string format
      const paramsArray: string[] = [];
      urlObj.searchParams.forEach((value, key) => {
        paramsArray.push(`${key}=${value}`);
      });
      setParams(paramsArray.join("\n"));
    } catch (e) {
      // If URL parsing fails, just set the whole URL
      setUrl(request.url);
      setParams("");
    }
    
    // Convert headers object back to string format
    const headersString = Object.entries(request.headers || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    setHeaders(headersString);
    
    setBody(request.body || "");
    setSavedRequestsViewMode(false);
  };

  const deleteSavedRequest = (id: number) => {
    setSavedRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleAddEnvironment = () => {
    setEditingEnvironmentId(null);
    setShowEnvironmentEditor(true);
  };

  const handleEditEnvironment = (id: number) => {
    setEditingEnvironmentId(id);
    setShowEnvironmentEditor(true);
  };

  const handleSaveEnvironment = (name: string, variables: Record<string, string>) => {
    if (editingEnvironmentId === null) {
      // Add new environment
      setEnvironmentsConfig(addEnvironment(environmentsConfig, name, variables));
    } else {
      // Update existing environment
      setEnvironmentsConfig(updateEnvironment(environmentsConfig, editingEnvironmentId, name, variables));
    }
    setShowEnvironmentEditor(false);
    setEditingEnvironmentId(null);
  };

  const handleDeleteEnvironment = (id: number) => {
    setEnvironmentsConfig(deleteEnvironment(environmentsConfig, id));
  };

  const handleSelectEnvironment = (id: number) => {
    setEnvironmentsConfig(setActiveEnvironment(environmentsConfig, id));
    setEnvironmentsViewMode(false);
  };


  return (
    <Box flexDirection="column" width="100%" height="100%" minWidth={50}>
      {/* Environment Editor Modal - Full Screen Overlay */}
      {showEnvironmentEditor ? (
        <EnvironmentEditorModal
          environmentName={editingEnvironmentId ? environmentsConfig.environments.find(e => e.id === editingEnvironmentId)?.name : ""}
          variables={editingEnvironmentId ? environmentsConfig.environments.find(e => e.id === editingEnvironmentId)?.variables : {}}
          onSave={handleSaveEnvironment}
          onCancel={() => {
            setShowEnvironmentEditor(false);
            setEditingEnvironmentId(null);
          }}
        />
      ) : /* Environments View Mode - Full Screen Environments */
      environmentsViewMode ? (
        <Box flexDirection="column" width="100%" height="100%">
          <Box paddingX={1} marginBottom={1}>
            <Text bold color="magenta">
              🚀 RestMan <Text dimColor italic>v{packageJson.version}</Text> <Text color="cyan">- Environments</Text> <Text dimColor>(ESC to return)</Text>
            </Text>
          </Box>
          <Box flexGrow={1}>
            <EnvironmentsPanel
              config={environmentsConfig}
              focused={true}
              onSelectEnvironment={handleSelectEnvironment}
              onAddEnvironment={handleAddEnvironment}
              onEditEnvironment={handleEditEnvironment}
              onDeleteEnvironment={handleDeleteEnvironment}
            />
          </Box>
        </Box>
      ) : savedRequestsViewMode ? (
        <Box flexDirection="column" width="100%" height="100%">
          <Box paddingX={1} marginBottom={1}>
            <Text bold color="magenta">
              🚀 RestMan <Text dimColor italic>v{packageJson.version}</Text> <Text color="cyan">- Saved Requests</Text> <Text dimColor>(ESC to return)</Text>
            </Text>
          </Box>
          <Box flexGrow={1}>
            <SavedRequestsPanel
              savedRequests={savedRequests}
              focused={true}
              onSelectRequest={loadRequestFromSaved}
              onDeleteRequest={deleteSavedRequest}
            />
          </Box>
        </Box>
      ) : historyViewMode ? (
        <Box flexDirection="column" width="100%" height="100%">
          <Box paddingX={1} marginBottom={1}>
            <Text bold color="magenta">
              🚀 RestMan <Text dimColor italic>v{packageJson.version}</Text> <Text color="cyan">- Request History</Text> <Text dimColor>(ESC to return)</Text>
            </Text>
          </Box>
          <Box flexGrow={1}>
            <HistoryPanel
              history={history}
              focused={true}
              onSelectRequest={loadRequestFromHistory}
            />
          </Box>
        </Box>
      ) : (
        <>
          {/* Header */}
          <Box paddingX={1} marginBottom={1}>
            <Text bold color="magenta">🚀 RestMan <Text dimColor italic>v{packageJson.version}</Text></Text>
          </Box>

          {/* Environment Selector Row */}
          <Box>
            <EnvironmentSelector
              environments={environmentsConfig.environments}
              activeEnvironmentId={environmentsConfig.activeEnvironmentId}
              focused={focusedField === "environment"}
              editMode={editMode === "environment"}
              onSelect={(id: number) => setEnvironmentsConfig(setActiveEnvironment(environmentsConfig, id))}
            />
          </Box>

          {/* Method and URL Row */}
          <Box gap={1}>
            <MethodSelector
              value={method}
              onChange={setMethod}
              focused={focusedField === "method"}
              editMode={editMode === "method"}
            />
            <URLInput
              value={url}
              onChange={setUrl}
              focused={focusedField === "url"}
              editMode={editMode === "url"}
            />
          </Box>

          {/* Request Editor (Headers, Params and Body tabs) */}
          <Box minHeight={10} flexGrow={1}>
            <RequestEditor
              url={url}
              headers={headers}
              onHeadersChange={setHeaders}
              params={params}
              onParamsChange={setParams}
              body={body}
              onBodyChange={setBody}
              focused={focusedField === "request"}
              editMode={editMode === "request"}
              activeTab={requestActiveTab}
              onTabChange={setRequestActiveTab}
              isModalOpen={showExitModal || showHelpModal || showMethodModal || showSaveModal || showEnvironmentSelectorModal || showEnvironmentEditor || showResponseBodyModal}
            />
          </Box>

          {/* Response Editor (Body, Headers and Cookies tabs) */}
          <Box minHeight={10} flexGrow={1}>
            <ResponseEditor
              response={response}
              focused={focusedField === "response"}
              editMode={editMode === "response"}
              activeTab={responseActiveTab}
              onTabChange={setResponseActiveTab}
              isModalOpen={showExitModal || showHelpModal || showMethodModal || showSaveModal || showEnvironmentSelectorModal || showEnvironmentEditor || showResponseBodyModal}
            />
          </Box>

          {/* Instructions */}
          <Instructions editMode={editMode !== null} />
        </>
      )}

      {/* Response Body Modal */}
      {showResponseBodyModal && response && (
        <ResponseBodyModal
          body={response.body}
          onClose={() => setShowResponseBodyModal(false)}
        />
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}

      {/* Method Selector Modal */}
      {showMethodModal && (
        <MethodSelectorModal
          currentMethod={method}
          onSelect={(newMethod) => {
            setMethod(newMethod);
            setShowMethodModal(false);
          }}
          onCancel={() => setShowMethodModal(false)}
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

      {/* Save Modal */}
      {showSaveModal && (
        <SaveModal
          defaultName={`${method} ${url.split('/').pop() || 'request'}`}
          onSave={saveCurrentRequest}
          onCancel={() => setShowSaveModal(false)}
        />
      )}

      {/* Exit Modal */}
      {showExitModal && (
        <ExitModal
          onConfirm={() => exit()}
          onCancel={() => setShowExitModal(false)}
        />
      )}

      {/* Toast Notification - Overlay */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          visible={showToast}
        />
      )}
    </Box>
  );
};
