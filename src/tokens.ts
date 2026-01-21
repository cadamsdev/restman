/**
 * Design tokens for the RestMan application
 */

export const colors = {
  // Primary colors
  primary: '#CC8844',
  secondary: '#BB7733',
  
  // Text colors
  textActive: '#FFFFFF',
  textMuted: '#999999',
  textPlaceholder: '#666666',
  
  // Border colors
  borderDefault: '#555555',
  borderFocused: '#CC8844',
  borderEdit: '#BB7733',
  
  // Background colors
  backgroundDefault: '#1a1a1a',
} as const;

/**
 * Get the border color based on focus and edit mode states
 */
export function getBorderColor(focused: boolean, editMode: boolean): string {
  if (focused) return colors.borderFocused;
  if (editMode) return colors.borderEdit;
  return colors.borderDefault;
}

/**
 * Get the text color based on edit mode and whether content exists
 * @param editMode - Whether the field is in edit mode
 * @param hasValue - Whether the field has a value
 */
export function getTextColor(editMode: boolean, hasValue: boolean): string {
  if (editMode) return colors.textActive;
  return hasValue ? colors.textMuted : colors.textPlaceholder;
}
