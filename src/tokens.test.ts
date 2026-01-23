import { describe, expect, test } from 'bun:test';
import { colors, getBorderColor, getTextColor } from './tokens';

describe('tokens', () => {
  describe('colors', () => {
    test('should export primary color', () => {
      expect(colors.primary).toBe('#CC8844');
    });

    test('should export secondary color', () => {
      expect(colors.secondary).toBe('#BB7733');
    });

    test('should export text colors', () => {
      expect(colors.textActive).toBe('#FFFFFF');
      expect(colors.textMuted).toBe('#999999');
      expect(colors.textPlaceholder).toBe('#666666');
    });

    test('should export border colors', () => {
      expect(colors.borderDefault).toBe('#555555');
      expect(colors.borderFocused).toBe('#CC8844');
      expect(colors.borderEdit).toBe('#BB7733');
    });

    test('should export background colors', () => {
      expect(colors.backgroundDefault).toBe('#1a1a1a');
    });

    test('should be a readonly object', () => {
      // This test verifies the 'as const' type assertion
      // @ts-expect-error - colors should be readonly
      colors.primary = '#000000';
    });
  });

  describe('getBorderColor', () => {
    test('should return focused border color when focused is true', () => {
      expect(getBorderColor(true, false)).toBe(colors.borderFocused);
    });

    test('should return focused border color when both focused and editMode are true', () => {
      expect(getBorderColor(true, true)).toBe(colors.borderFocused);
    });

    test('should return edit border color when editMode is true and focused is false', () => {
      expect(getBorderColor(false, true)).toBe(colors.borderEdit);
    });

    test('should return default border color when both focused and editMode are false', () => {
      expect(getBorderColor(false, false)).toBe(colors.borderDefault);
    });
  });

  describe('getTextColor', () => {
    test('should return active text color when editMode is true and hasValue is true', () => {
      expect(getTextColor(true, true)).toBe(colors.textActive);
    });

    test('should return active text color when editMode is true and hasValue is false', () => {
      expect(getTextColor(true, false)).toBe(colors.textActive);
    });

    test('should return muted text color when editMode is false and hasValue is true', () => {
      expect(getTextColor(false, true)).toBe(colors.textMuted);
    });

    test('should return placeholder text color when editMode is false and hasValue is false', () => {
      expect(getTextColor(false, false)).toBe(colors.textPlaceholder);
    });
  });
});
