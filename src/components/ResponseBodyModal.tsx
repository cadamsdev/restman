import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

interface ResponseBodyModalProps {
  body: string;
  onClose: () => void;
}

export const ResponseBodyModal: React.FC<ResponseBodyModalProps> = ({ body, onClose }) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const maxVisibleLines = 30; // Much more lines than the regular editor

  useInput((input, key) => {
    // Close modal
    if (key.escape || input === " ") {
      onClose();
      return;
    }

    // Scrolling
    const lines = body.split("\n");
    const totalLines = lines.length;

    if (key.upArrow) {
      setScrollOffset(Math.max(0, scrollOffset - 1));
      return;
    }

    if (key.downArrow) {
      setScrollOffset(Math.min(Math.max(0, totalLines - maxVisibleLines), scrollOffset + 1));
      return;
    }

    if (key.pageUp) {
      setScrollOffset(Math.max(0, scrollOffset - maxVisibleLines));
      return;
    }

    if (key.pageDown) {
      setScrollOffset(Math.min(Math.max(0, totalLines - maxVisibleLines), scrollOffset + maxVisibleLines));
      return;
    }

    if (input === "g") {
      setScrollOffset(0);
      return;
    }

    if (input === "G") {
      setScrollOffset(Math.max(0, totalLines - maxVisibleLines));
      return;
    }
  });

  const lines = body.split("\n");
  const totalLines = lines.length;
  const visibleLines = lines.slice(scrollOffset, scrollOffset + maxVisibleLines);
  const hasMoreAbove = scrollOffset > 0;
  const hasMoreBelow = scrollOffset + maxVisibleLines < totalLines;

  return (
    <Box
      position="absolute"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      {/* Backdrop overlay */}
      <Box position="absolute" width="100%" height="100%" />

      {/* Modal content */}
      <Box
        borderStyle="double"
        borderColor="cyan"
        paddingX={2}
        paddingY={1}
        flexDirection="column"
        width="90%"
        height="90%"
        backgroundColor="black"
      >
        <Box justifyContent="space-between" marginBottom={1}>
          <Text bold color="cyan">
            📄 Response Body
          </Text>
          <Text dimColor>
            Lines {scrollOffset + 1}-{Math.min(scrollOffset + maxVisibleLines, totalLines)} of {totalLines}
          </Text>
        </Box>

        {hasMoreAbove && (
          <Box justifyContent="center">
            <Text color="yellow">▲ More above (↑/PgUp to scroll up, g to go to top)</Text>
          </Box>
        )}

        <Box flexDirection="column" flexGrow={1} paddingX={1}>
          {visibleLines.map((line, index) => (
            <Text key={scrollOffset + index}>
              {line || " "}
            </Text>
          ))}
        </Box>

        {hasMoreBelow && (
          <Box justifyContent="center">
            <Text color="yellow">▼ More below (↓/PgDown to scroll down, G to go to bottom)</Text>
          </Box>
        )}

        <Box marginTop={1} justifyContent="center" borderStyle="single" borderColor="gray" paddingX={1}>
          <Text dimColor italic>
            Press <Text color="yellow" bold>ESC</Text> or <Text color="yellow" bold>Space</Text> to close
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
