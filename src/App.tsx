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

type FocusField = "method" | "url" | "headers" | "body" | "response";

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

  const fields: FocusField[] = ["method", "url", "headers", "body", "response"];

  // Handle keyboard input
  useInput((input, key) => {
    // Handle exit modal responses
    if (showExitModal) {
      if (input === "y" || input === "Y") {
        exit();
        return;
      }
      if (input === "n" || input === "N" || key.escape) {
        setShowExitModal(false);
        return;
      }
      return; // Ignore other keys when modal is shown
    }

    // Show exit confirmation
    if (input === "q" || key.escape) {
      setShowExitModal(true);
      return;
    }

    // Force quit without confirmation
    if (key.ctrl && input === "c") {
      exit();
      return;
    }

    // Method selection when focused on method
    if (focusedField === "method") {
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

    // Send request - multiple trigger options
    // 1. Ctrl+Enter
    // 2. Ctrl+S (like save/send)
    // 3. F5 (function key)
    if ((key.return && key.ctrl) || (input === "s" && key.ctrl) || input === "\x1B[15~") {
      sendRequest();
      return;
    }

    // Also allow Enter when not focused on a text input field
    if (key.return && !key.ctrl && focusedField !== "url") {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flexDirection="column" width="100%" height="100%">
      {/* Header */}
      <Box
        borderStyle="round"
        borderColor="blue"
        paddingX={1}
        justifyContent="center"
      >
        <Text bold color="cyan">
          🚀 ShellMan - REST API Client
        </Text>
      </Box>

      {/* Method and URL Row */}
      <Box marginTop={1}>
        <MethodSelector
          value={method}
          onChange={setMethod}
          focused={focusedField === "method"}
        />
        <URLInput
          value={url}
          onChange={setUrl}
          focused={focusedField === "url"}
        />
      </Box>

      {/* Headers and Body */}
      <Box marginTop={1} height={10}>
        <HeadersEditor
          value={headers}
          onChange={setHeaders}
          focused={focusedField === "headers"}
        />
        <BodyEditor
          value={body}
          onChange={setBody}
          focused={focusedField === "body"}
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

      {/* Response Panel */}
      <Box marginTop={1} flexGrow={1}>
        <ResponsePanel
          response={response}
          focused={focusedField === "response"}
        />
      </Box>

      {/* Instructions */}
      <Instructions />

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
