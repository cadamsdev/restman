import React from "react";
import { Box, Text } from "ink";

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
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
      <Box
        position="absolute"
        width="100%"
        height="100%"
      />
      
      {/* Modal content */}
      <Box
        borderStyle="double"
        borderColor="magenta"
        paddingX={3}
        paddingY={1}
        flexDirection="column"
        width={75}
        backgroundColor="black"
      >
        <Box justifyContent="center">
          <Text bold color="magenta">
            ⌨️  RestMan Keyboard Shortcuts
          </Text>
        </Box>
        
        <Box marginTop={1} flexDirection="column">
          <Text bold color="cyan">▸ Navigation:</Text>
          <Text>  <Text color="yellow">0</Text> - Jump to Environment</Text>
          <Text>  <Text color="yellow">m</Text> / <Text color="yellow">1</Text> - Jump to Method</Text>
          <Text>  <Text color="yellow">u</Text> / <Text color="yellow">2</Text> - Jump to URL</Text>
          <Text>  <Text color="yellow">r</Text> / <Text color="yellow">3</Text> - Jump to Request</Text>
          <Text>  <Text color="yellow">p</Text> / <Text color="yellow">4</Text> - Jump to Response</Text>
          <Text>  <Text color="yellow">i</Text> / <Text color="yellow">5</Text> - View Request History</Text>
          <Text>  <Text color="yellow">l</Text> / <Text color="yellow">6</Text> - View Saved Requests</Text>
          <Text>  <Text color="yellow">v</Text> / <Text color="yellow">7</Text> - View Environments</Text>
          <Text>  <Text color="yellow">Tab</Text> / <Text color="yellow">Shift+Tab</Text> - Next/Previous section</Text>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text bold color="cyan">▸ Actions:</Text>
          <Text>  <Text color="yellow">e</Text> - Enter edit mode for focused section</Text>
          <Text>  <Text color="yellow">s</Text> - Save current request</Text>
          <Text>  <Text color="green">Enter</Text> - Send request (readonly mode)</Text>
          <Text>  <Text color="green">Ctrl+S</Text> - Send request (any mode)</Text>
          <Text>  <Text color="yellow">↑↓</Text> - Change method/environment</Text>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text bold color="cyan">▸ Other:</Text>
          <Text>  <Text color="yellow">ESC</Text> - Exit edit mode / View / Confirm quit</Text>
          <Text>  <Text color="yellow">q</Text> - Show exit confirmation</Text>
          <Text>  <Text color="magenta">/</Text> - Toggle this help</Text>
          <Text>  <Text color="red">Ctrl+C</Text> - Force quit (no confirmation)</Text>
        </Box>

        <Box marginTop={1} justifyContent="center" borderStyle="single" borderColor="gray" paddingX={1}>
          <Text dimColor italic>
            Press <Text color="magenta" bold>/</Text> or <Text color="yellow" bold>ESC</Text> to close
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
