import { useEffect, useState, useCallback } from 'react';
import { useTerminalDimensions } from '@opentui/react';

export interface FieldsetProps {
  title: string;
  children: React.ReactNode;
  borderColor?: string;
  titleColor?: string;
  focused?: boolean;
  editMode?: boolean;
  flexGrow?: number;
  height?: number | string;
  width?: number | string;
  paddingX?: number;
  paddingY?: number;
  borderStyle?: 'round' | 'single' | 'double';
}

// Border character sets for different styles
const borderChars = {
  round: {
    topLeft: '╭',
    horizontal: '─',
    topRight: '╮',
    vertical: '│',
    bottomLeft: '╰',
    bottomRight: '╯',
  },
  single: {
    topLeft: '┌',
    horizontal: '─',
    topRight: '┐',
    vertical: '│',
    bottomLeft: '└',
    bottomRight: '┘',
  },
  double: {
    topLeft: '╔',
    horizontal: '═',
    topRight: '╗',
    vertical: '║',
    bottomLeft: '╚',
    bottomRight: '╝',
  },
};

type BorderFragment = {
  isTitle: boolean;
  content: string;
};

export function Fieldset({
  title,
  children,
  borderColor = '#888888',
  titleColor,
  focused = false,
  editMode = false,
  flexGrow,
  height,
  width,
  paddingX = 1,
  paddingY = 0,
  borderStyle = 'round',
}: FieldsetProps) {
  const [fragments, setFragments] = useState<BorderFragment[]>([]);
  const { width: terminalWidth } = useTerminalDimensions();

  // Determine colors based on state
  const actualBorderColor = focused ? '#FF00FF' : editMode ? '#00FF00' : borderColor;
  const actualTitleColor = titleColor || (focused ? '#FF00FF' : '#888888');

  // Get border characters for the selected style
  const chars = borderChars[borderStyle];

  // Format the title
  const paddedTitle = ` ${title} `;

  // Calculate visual width accounting for emoji/wide characters
  const getVisualWidth = (str: string): number => {
    let width = 0;
    for (const char of str) {
      const code = char.codePointAt(0);
      // Emoji and wide characters typically take 2 columns
      if (code && (code > 0x1f300 || code === 0x26a1 || code === 0x270e || code === 0x2195)) {
        width += 2;
      } else {
        width += 1;
      }
    }
    return width;
  };

  const recalculateFragments = useCallback(() => {
    // Use provided width or default to a reasonable size based on terminal width
    const availableWidth = typeof width === 'number' ? width - 2 : Math.min(terminalWidth - 4, 80);

    if (availableWidth <= 0) {
      setFragments([]);
      return;
    }

    // Build the top border with title embedded
    const titleLength = getVisualWidth(paddedTitle);
    const titlePosition = 1; // Start position after left corner

    // Build fragments array
    const newFragments: BorderFragment[] = [];

    // Left corner
    newFragments.push({ isTitle: false, content: chars.topLeft });

    // Before title
    if (titlePosition > 0) {
      newFragments.push({
        isTitle: false,
        content: chars.horizontal.repeat(titlePosition),
      });
    }

    // Title
    newFragments.push({ isTitle: true, content: paddedTitle });

    // After title to end
    const remainingLength = availableWidth - titlePosition - titleLength;
    if (remainingLength > 0) {
      newFragments.push({
        isTitle: false,
        content: chars.horizontal.repeat(remainingLength),
      });
    }

    // Right corner
    newFragments.push({ isTitle: false, content: chars.topRight });

    setFragments(newFragments);
  }, [title, chars, paddedTitle, width, terminalWidth, borderStyle]);

  useEffect(() => {
    recalculateFragments();
  }, [recalculateFragments]);

  // Calculate padding
  const leftPadding = ' '.repeat(paddingX);
  const rightPadding = ' '.repeat(paddingX);
  const verticalPadding = paddingY > 0 ? <box height={paddingY} /> : null;

  return (
    <box flexDirection="column" flexGrow={flexGrow} height={height} width={width} minWidth={20}>
      {/* Top border with embedded title */}
      <text fg={actualBorderColor}>
        {fragments.map((fragment, i) =>
          fragment.isTitle ? (
            <span key={i} bold fg={actualTitleColor}>
              {fragment.content}
            </span>
          ) : (
            <span key={i}>{fragment.content}</span>
          ),
        )}
      </text>

      {/* Content area with side borders */}
      <box flexDirection="column" flexGrow={1}>
        {verticalPadding}
        <box flexDirection="row">
          <text fg={actualBorderColor}>{chars.vertical}</text>
          <text>{leftPadding}</text>
          <box flexDirection="column" flexGrow={1}>
            {children}
          </box>
          <text>{rightPadding}</text>
          <text fg={actualBorderColor}>{chars.vertical}</text>
        </box>
        {verticalPadding}
      </box>

      {/* Bottom border */}
      <text fg={actualBorderColor}>
        {chars.bottomLeft}
        {chars.horizontal.repeat(
          (typeof width === 'number' ? width : Math.min(terminalWidth - 4, 80)) - 2,
        )}
        {chars.bottomRight}
      </text>
    </box>
  );
}
