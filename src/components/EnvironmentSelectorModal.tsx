import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { Environment } from '../environment-storage';

interface EnvironmentSelectorModalProps {
  environments: Environment[];
  currentEnvironmentId: number | null;
  onSelect: (id: number) => void;
  onCancel: () => void;
}

export const EnvironmentSelectorModal: React.FC<EnvironmentSelectorModalProps> = ({
  environments,
  currentEnvironmentId,
  onSelect,
  onCancel,
}) => {
  const currentIndex = environments.findIndex((env) => env.id === currentEnvironmentId);
  const [selectedIndex, setSelectedIndex] = useState(currentIndex >= 0 ? currentIndex : 0);

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }

    if (key.return) {
      const selectedEnv = environments[selectedIndex];
      if (selectedEnv) {
        onSelect(selectedEnv.id);
      }
      return;
    }

    if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : environments.length - 1));
      return;
    }

    if (key.downArrow) {
      setSelectedIndex((prev) => (prev < environments.length - 1 ? prev + 1 : 0));
      return;
    }
  });

  if (environments.length === 0) {
    return (
      <Box
        position="absolute"
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box position="absolute" width="100%" height="100%" />

        <Box
          borderStyle="double"
          borderColor="yellow"
          paddingX={3}
          paddingY={1}
          flexDirection="column"
          width={50}
          backgroundColor="black"
        >
          <Box justifyContent="center">
            <Text bold color="yellow">
              🌍 No Environments Available
            </Text>
          </Box>

          <Box marginTop={1} paddingX={2}>
            <Text dimColor>
              No environments found. Press{' '}
              <Text color="cyan" bold>
                v
              </Text>{' '}
              to manage environments.
            </Text>
          </Box>

          <Box
            marginTop={1}
            justifyContent="center"
            borderStyle="single"
            borderColor="gray"
            paddingX={1}
          >
            <Text dimColor>
              <Text color="yellow" bold>
                ESC
              </Text>{' '}
              Close
            </Text>
          </Box>
        </Box>
      </Box>
    );
  }

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
        paddingX={3}
        paddingY={1}
        flexDirection="column"
        width={50}
        backgroundColor="black"
      >
        <Box justifyContent="center">
          <Text bold color="cyan">
            🌍 Select Environment
          </Text>
        </Box>

        <Box marginTop={1} flexDirection="column" paddingX={2}>
          {environments.map((env, index) => (
            <Box key={env.id}>
              <Text
                color={index === selectedIndex ? 'cyan' : 'gray'}
                bold={index === selectedIndex}
                dimColor={index !== selectedIndex}
              >
                {index === selectedIndex ? `▸ ${env.name}` : `  ${env.name}`}
              </Text>
            </Box>
          ))}
        </Box>

        <Box
          marginTop={1}
          justifyContent="center"
          borderStyle="single"
          borderColor="gray"
          paddingX={1}
        >
          <Text dimColor>
            <Text color="cyan" bold>
              ↕
            </Text>{' '}
            Navigate │{' '}
            <Text color="green" bold>
              Enter
            </Text>{' '}
            Select │{' '}
            <Text color="yellow" bold>
              ESC
            </Text>{' '}
            Cancel
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
