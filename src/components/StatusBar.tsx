import React from "react";
import { Box, Text } from "ink";
import { Response } from "../http-client";

interface StatusBarProps {
  loading: boolean;
  response: Response | null;
  error: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  loading,
  response,
  error,
}) => {
  const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) return "green";
    if (status >= 400) return "red";
    return "yellow";
  };

  return (
    <Box
      borderStyle="round"
      borderColor="green"
      paddingX={1}
      width="100%"
    >
      {loading ? (
        <Text color="yellow">⏳ Sending request...</Text>
      ) : error ? (
        <Text color="red">❌ Error: {error}</Text>
      ) : response ? (
        <>
          <Text color={getStatusColor(response.status)}>
            {response.status} {response.statusText}
          </Text>
          <Text dimColor> | </Text>
          <Text>Time: {response.time}ms</Text>
        </>
      ) : (
        <Text dimColor>Press Ctrl+Enter to send request</Text>
      )}
    </Box>
  );
};
