import React from "react";
import { Box, Text } from "ink";
import { Response } from "../http-client";

interface ResponsePanelProps {
  response: Response | null;
  focused: boolean;
}

export const ResponsePanel: React.FC<ResponsePanelProps> = ({
  response,
  focused,
}) => {
  return (
    <Box
      borderStyle="round"
      borderColor={focused ? "yellow" : "green"}
      flexDirection="column"
      paddingX={1}
      width="100%"
      height="100%"
    >
      <Text bold dimColor={!focused}>Response</Text>
      {response ? (
        <Box flexDirection="column" marginTop={1}>
          <Text bold>Headers:</Text>
          {Object.entries(response.headers).slice(0, 5).map(([key, value]) => (
            <Text key={key} dimColor>
              {key}: {value}
            </Text>
          ))}
          {Object.keys(response.headers).length > 5 && (
            <Text dimColor italic>
              ... and {Object.keys(response.headers).length - 5} more
            </Text>
          )}
          
          <Text bold marginTop={1}>Body:</Text>
          <Box flexDirection="column" marginTop={1}>
            {response.body.split("\n").slice(0, 15).map((line, idx) => (
              <Text key={idx}>{line}</Text>
            ))}
            {response.body.split("\n").length > 15 && (
              <Text dimColor italic>
                ... ({response.body.split("\n").length - 15} more lines)
              </Text>
            )}
          </Box>
        </Box>
      ) : (
        <Text dimColor italic marginTop={1}>
          No response yet. Send a request to see results.
        </Text>
      )}
    </Box>
  );
};
