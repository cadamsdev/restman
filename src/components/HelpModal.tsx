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
        backgroundColor="black"
      />
      
      {/* Modal content */}
      <Box
        borderStyle="double"
        borderColor="cyan"
        paddingX={2}
        paddingY={1}
        flexDirection="column"
        width={70}
        backgroundColor="black"
      >
        <Text bold color="cyan">
          ⌨️  ShellMan Keyboard Shortcuts
        </Text>
        
        <Box marginTop={1} flexDirection="column">
          <Text bold color="yellow">Navigation:</Text>
          <Text>  <Text color="cyan">m</Text> - Jump to Method section</Text>
          <Text>  <Text color="cyan">u</Text> - Jump to URL section</Text>
          <Text>  <Text color="cyan">h</Text> - Jump to Headers section</Text>
          <Text>  <Text color="cyan">b</Text> - Jump to Body section</Text>
          <Text>  <Text color="cyan">r</Text> - Jump to Response section</Text>
          <Text>  <Text color="cyan">Tab</Text> - Next section</Text>
          <Text>  <Text color="cyan">Shift+Tab</Text> - Previous section</Text>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text bold color="yellow">Actions:</Text>
          <Text>  <Text color="cyan">e</Text> - Enter edit mode for focused section</Text>
          <Text>  <Text color="cyan">Enter</Text> - Send request (in readonly mode)</Text>
          <Text>  <Text color="cyan">Ctrl+S</Text> - Send request (any mode)</Text>
          <Text>  <Text color="cyan">↑↓</Text> - Change HTTP method (when on method)</Text>
        </Box>

        <Box marginTop={1} flexDirection="column">
          <Text bold color="yellow">Other:</Text>
          <Text>  <Text color="cyan">ESC</Text> - Exit edit mode / Show exit confirmation</Text>
          <Text>  <Text color="cyan">q</Text> - Show exit confirmation</Text>
          <Text>  <Text color="cyan">/</Text> - Show this help</Text>
          <Text>  <Text color="cyan">Ctrl+C</Text> - Force quit (no confirmation)</Text>
        </Box>

        <Box marginTop={1} justifyContent="center">
          <Text dimColor italic>
            Press <Text color="cyan">/</Text> or <Text color="cyan">ESC</Text> to close
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
