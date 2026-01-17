import React, { useState, useEffect } from "react";
import { Box, Text, useInput, useApp } from "ink";
import { HTTPClient, RequestOptions, Response } from "./http-client";
import { URLInput } from "./components/URLInput";
import { MethodSelector } from "./components/MethodSelector";
import { HeadersEditor } from "./components/HeadersEditor";
import { BodyEditor } from "./components/BodyEditor";
import { ResponsePanel } from "./components/ResponsePanel";
import { StatusBar } from "./components/StatusBar";
import { Instructions } from "./components/Instructions";
import { ExitModal } from "./components/ExitModal";
import { HelpModal } from "./components/HelpModal";

type FocusField = "method" | "url" | "headers" | "body";

export const App: React.FC = () => {
  const { exit } = useApp();
  const httpClient = new HTTPClient();

  // State
  const [method, setMethod] = useState<string>("GET");
  const [url, setUrl] = useState<string>("https://jsonplaceholder.typicode.com/posts/1");
  const [headers, setHeaders] = useState<string>("Content-Type: application/json\nAccept: application/json");
  const [body, setBody] = useState<string>("");
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<FocusField>("url");
  const [error, setError] = useState<string>("");
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<FocusField | null>(null);
  const [responseViewMode, setResponseViewMode] = useState<boolean>(false);

  const fields: FocusField[] = ["method", "url", "headers", "body"];

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

    // Exit modal handles its own keyboard input
    if (showExitModal) {
      return; // Ignore all keys when modal is shown - modal handles them
    }

    // Handle response view mode
    if (responseViewMode) {
      if (key.escape) {
        setResponseViewMode(false);
        return;
      }
      // All other inputs are handled by ResponsePanel
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

    // Show help modal
    if (input === "/") {
      setShowHelpModal(true);
      return;
    }

    // Only allow navigation hotkeys in readonly mode
    if (!editMode) {
      // Enter edit mode
      if (input === "e") {
        setEditMode(focusedField);
        return;
      }

      // Quick navigation hotkeys
      if (input === "m" || input === "1") {
        setFocusedField("method");
        setEditMode(null);
        return;
      }
      if (input === "u" || input === "2") {
        setFocusedField("url");
        setEditMode(null);
        return;
      }
      if (input === "h" || input === "3") {
        setFocusedField("headers");
        setEditMode(null);
        return;
      }
      if (input === "b" || input === "4") {
        setFocusedField("body");
        setEditMode(null);
        return;
      }
    }

    // Method selection when focused on method and in edit mode
    if (editMode === "method") {
      const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
      const currentIndex = methods.indexOf(method);
      
      if (key.upArrow && currentIndex > 0) {
        setMethod(methods[currentIndex - 1]);
        return;
      }
      if (key.downArrow && currentIndex < methods.length - 1) {
        setMethod(methods[currentIndex + 1]);
        return;
      }
    }

    // Arrow key navigation (only in readonly mode)
    if (!editMode) {
      if (key.upArrow) {
        const currentIndex = fields.indexOf(focusedField);
        const prevIndex = (currentIndex - 1 + fields.length) % fields.length;
        setFocusedField(fields[prevIndex]);
        return;
      }
      if (key.downArrow) {
        const currentIndex = fields.indexOf(focusedField);
        const nextIndex = (currentIndex + 1) % fields.length;
        setFocusedField(fields[nextIndex]);
        return;
      }
    }

    // Tab navigation
    if (key.tab) {
      if (key.shift) {
        // Shift+Tab - previous field
        const currentIndex = fields.indexOf(focusedField);
        const prevIndex = (currentIndex - 1 + fields.length) % fields.length;
        setFocusedField(fields[prevIndex]);
      } else {
        // Tab - next field
        const currentIndex = fields.indexOf(focusedField);
        const nextIndex = (currentIndex + 1) % fields.length;
        setFocusedField(fields[nextIndex]);
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

  const sendRequest = async () => {
    if (!url) {
      setError("URL is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const requestOptions: RequestOptions = {
        method,
        url,
        headers: parseHeaders(headers),
        body: body || undefined,
      };

      const result = await httpClient.sendRequest(requestOptions);
      setResponse(result);
      // Automatically switch to response view mode after successful request
      setResponseViewMode(true);
      setEditMode(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flexDirection="column" width="100%" height="100%">
      {/* Response View Mode - Full Screen Response */}
      {responseViewMode ? (
        <Box flexDirection="column" width="100%" height="100%">
          <Box
            borderStyle="round"
            borderColor="blue"
            paddingX={1}
            justifyContent="center"
          >
            <Text bold color="cyan">
              🌐 ShellMan - Response View (ESC to return)
            </Text>
          </Box>
          <Box marginTop={1} flexGrow={1}>
            <ResponsePanel
              response={response}
              focused={true}
            />
          </Box>
        </Box>
      ) : (
        <>
          {/* Header */}
          <Box
            borderStyle="round"
            borderColor="blue"
            paddingX={1}
            justifyContent="center"
          >
            <Text bold color="cyan">
              🌐 ShellMan - REST API Client
            </Text>
          </Box>

          {/* Method and URL Row */}
          <Box marginTop={1}>
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

          {/* Headers and Body */}
          <Box marginTop={1} height={10}>
            <HeadersEditor
              value={headers}
              onChange={setHeaders}
              focused={focusedField === "headers"}
              editMode={editMode === "headers"}
            />
            <BodyEditor
              value={body}
              onChange={setBody}
              focused={focusedField === "body"}
              editMode={editMode === "body"}
            />
          </Box>

          {/* Status Bar */}
          <Box marginTop={1}>
            <StatusBar
              loading={loading}
              response={response}
              error={error}
            />
          </Box>

          {/* Instructions */}
          <Instructions editMode={editMode !== null} />
        </>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}

      {/* Exit Modal */}
      {showExitModal && (
        <ExitModal
          onConfirm={() => exit()}
          onCancel={() => setShowExitModal(false)}
        />
      )}
    </Box>
  );
};
