import React from 'react';
import { Box, Text } from 'ink';
import type { Response } from '../http-client';

interface StatusBarProps {
  loading: boolean;
  response: Response | null;
  error: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ loading, response, error }) => {
  const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) return 'green';
    if (status >= 300 && status < 400) return 'cyan';
    if (status >= 400 && status < 500) return 'yellow';
    if (status >= 500) return 'red';
    return 'white';
  };

  const getStatusIcon = (status: number): string => {
    if (status >= 200 && status < 300) return '✓';
    if (status >= 300 && status < 400) return '↪';
    if (status >= 400 && status < 500) return '⚠';
    if (status >= 500) return '✗';
    return '●';
  };

  return (
    <Box
      borderStyle="round"
      borderColor={loading ? 'yellow' : error ? 'red' : response ? 'green' : 'gray'}
      paddingX={2}
      paddingY={0}
      width="100%"
      justifyContent="space-between"
    >
      <Box>
        {loading ? (
          <Text>
            <Text color="yellow">⏳</Text>
            <Text> Sending request</Text>
            <Text color="yellow">...</Text>
          </Text>
        ) : error ? (
          <Text>
            <Text color="red" bold>
              ✗ Error:
            </Text>
            <Text> {error}</Text>
          </Text>
        ) : response ? (
          <Text>
            <Text color={getStatusColor(response.status)} bold>
              {getStatusIcon(response.status)} {response.status}
            </Text>
            <Text color={getStatusColor(response.status)}> {response.statusText}</Text>
          </Text>
        ) : (
          <Text dimColor italic>
            Ready to send request
          </Text>
        )}
      </Box>
      {response && (
        <Text>
          <Text dimColor>⏱ </Text>
          <Text color={response.time < 200 ? 'green' : response.time < 1000 ? 'yellow' : 'red'}>
            {response.time}ms
          </Text>
        </Text>
      )}
    </Box>
  );
};
