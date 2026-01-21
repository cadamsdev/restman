import { useCallback, useState } from 'react';
import { useKeyboard, useTerminalDimensions } from '@opentui/react';

export function App() {
  const [counter, setCounter] = useState(0);
  const [message, setMessage] = useState('Press UP to increment, DOWN to decrement, Q to quit');
  const { width, height } = useTerminalDimensions();

  const handleKeyboard = useCallback((key: { name: string }) => {
    switch (key.name) {
      case 'q':
      case 'escape':
        setMessage('Goodbye! 👋');
        setTimeout(() => process.exit(0), 500);
        break;
      case 'up':
      case 'k':
        setCounter((prev) => prev + 1);
        break;
      case 'down':
      case 'j':
        setCounter((prev) => prev - 1);
        break;
    }
  }, []);

  useKeyboard(handleKeyboard);

  return (
    <box
      width={width}
      height={height}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={1}
    >
      <text fg="#00FF00" bold>
        ╔════════════════════════════════════════╗
      </text>
      <text fg="#00FF00" bold>
        ║     RestMan v2 - OpenTUI Test         ║
      </text>
      <text fg="#00FF00" bold>
        ╚════════════════════════════════════════╝
      </text>

      <box height={2} />

      <text fg="#FFFF00" fontSize={2}>
        Counter: {counter}
      </text>

      <box height={1} />

      <text fg="#FFFFFF">{message}</text>

      <box height={1} />

      <text fg="#888888" fontSize={0.8}>
        Terminal size: {width}x{height}
      </text>

      <box height={1} />

      <box flexDirection="column" gap={0}>
        <text fg="#00AAFF">Controls:</text>
        <text fg="#CCCCCC">  ↑/k - Increment</text>
        <text fg="#CCCCCC">  ↓/j - Decrement</text>
        <text fg="#CCCCCC">  q   - Quit</text>
      </box>
    </box>
  );
}
