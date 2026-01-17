import React, { useRef, useEffect, useState } from "react";
import { Box, Text, measureElement, type DOMElement } from "ink";

export interface PanelProps {
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
  borderStyle?: "round" | "single" | "double";
}

// Border character sets for different styles
const borderChars = {
  round: {
    topLeft: "╭",
    horizontal: "─",
    topRight: "╮",
  },
  single: {
    topLeft: "┌",
    horizontal: "─",
    topRight: "┐",
  },
  double: {
    topLeft: "╔",
    horizontal: "═",
    topRight: "╗",
  },
};

type BorderFragment = {
  isTitle: boolean;
  content: string;
};

export const Panel: React.FC<PanelProps> = ({
  title,
  children,
  borderColor = "gray",
  titleColor,
  focused = false,
  editMode = false,
  flexGrow,
  height,
  width,
  paddingX = 1,
  paddingY = 0,
  borderStyle = "round",
}) => {
  const boxRef = useRef<DOMElement>(null);
  const [fragments, setFragments] = useState<BorderFragment[]>([]);
  
  // Determine colors based on state
  const actualBorderColor = focused ? "magenta" : editMode ? "green" : borderColor;
  const actualTitleColor = titleColor || (focused ? "magenta" : "gray");
  
  // Get border characters for the selected style
  const chars = borderChars[borderStyle];
  
  // Format the title with edit mode indicator
  const formattedTitle = editMode ? `${title} [✎]` : title;
  const paddedTitle = ` ${formattedTitle} `;

  // Calculate visual width accounting for emoji/wide characters
  const getVisualWidth = (str: string): number => {
    let width = 0;
    for (const char of str) {
      const code = char.codePointAt(0);
      // Emoji and wide characters typically take 2 columns
      if (code && (code > 0x1F300 || code === 0x26A1 || code === 0x270E || code === 0x2195)) {
        width += 2;
      } else {
        width += 1;
      }
    }
    return width;
  };

  useEffect(() => {
    if (!boxRef.current) return;
    
    const dimensions = measureElement(boxRef.current);
    const availableWidth = dimensions.width - 2; // Subtract left and right corners
    
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
        content: chars.horizontal.repeat(titlePosition) 
      });
    }
    
    // Title
    newFragments.push({ isTitle: true, content: paddedTitle });
    
    // After title to end
    const remainingLength = availableWidth - titlePosition - titleLength;
    if (remainingLength > 0) {
      newFragments.push({ 
        isTitle: false, 
        content: chars.horizontal.repeat(remainingLength) 
      });
    }
    
    // Right corner
    newFragments.push({ isTitle: false, content: chars.topRight });
    
    setFragments(newFragments);
  }, [boxRef.current, formattedTitle, chars, borderStyle]);

  return (
    <Box
      ref={boxRef}
      flexDirection="column"
      flexGrow={flexGrow}
      height={height}
      width={width}
    >
      {/* Top border with embedded title */}
      <Text color={actualBorderColor}>
        {fragments.map((fragment, i) => 
          fragment.isTitle ? (
            <Text key={i} bold color={actualTitleColor}>
              {fragment.content}
            </Text>
          ) : (
            <Text key={i}>{fragment.content}</Text>
          )
        )}
      </Text>
      
      {/* Box with left, right, and bottom borders */}
      <Box
        borderStyle={borderStyle}
        borderColor={actualBorderColor}
        borderTop={false}
        paddingX={paddingX}
        paddingY={paddingY}
        flexDirection="column"
        flexGrow={1}
      >
        {children}
      </Box>
    </Box>
  );
};
