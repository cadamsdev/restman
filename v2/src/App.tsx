import { useCallback, useState } from 'react';
import { useKeyboard, useTerminalDimensions } from '@opentui/react';
import { Fieldset } from './components/Fieldset';

export function App() {
  const [counter, setCounter] = useState(0);
  const [message, setMessage] = useState('Press UP to increment, DOWN to decrement, Q to quit');
  const [focusedPanel, setFocusedPanel] = useState<'counter' | 'controls'>('counter');
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
      case 'tab':
        setFocusedPanel((prev) => (prev === 'counter' ? 'controls' : 'counter'));
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

      <Fieldset
        title="Counter ⚡"
        focused={focusedPanel === 'counter'}
        borderStyle="round"
        paddingX={2}
        paddingY={1}
        width={50}
      >
        <box flexDirection="column" alignItems="center" gap={1}>
          <text fg="#FFFF00" fontSize={2}>
            Current Value: {counter}
          </text>
          <text fg="#FFFFFF">{message}</text>
        </box>
      </Fieldset>

      <box height={1} />

      <Fieldset
        title="Controls ⌨️"
        focused={focusedPanel === 'controls'}
        borderStyle="single"
        paddingX={2}
        paddingY={1}
        width={50}
      >
        <box flexDirection="column" gap={0}>
          <text fg="#00AAFF">Keyboard Shortcuts:</text>
          <text fg="#CCCCCC">  ↑/k   - Increment counter</text>
          <text fg="#CCCCCC">  ↓/j   - Decrement counter</text>
          <text fg="#CCCCCC">  Tab   - Switch focus</text>
          <text fg="#CCCCCC">  q     - Quit application</text>
        </box>
      </Fieldset>

      <box height={1} />

      <text fg="#888888" fontSize={0.8}>
        Terminal size: {width}x{height}
      </text>
    </box>
  );
}
