import { describe, expect, it } from 'vitest';
import { cn } from '../utils';

describe('lib/utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
    });

    it('should handle conditional classes', () => {
      expect(cn('btn', true && 'active')).toBe('btn active');
      expect(cn('btn', false && 'active')).toBe('btn');
    });

    it('should merge tailwind classes and remove duplicates', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });

    it('should handle arrays of classes', () => {
      expect(cn(['btn', 'btn-primary'], 'active')).toBe('btn btn-primary active');
    });

    it('should handle empty inputs', () => {
      expect(cn()).toBe('');
      expect(cn('')).toBe('');
      expect(cn(null, undefined)).toBe('');
    });

    it('should handle objects with conditional properties', () => {
      expect(
        cn({
          btn: true,
          active: true,
          disabled: false,
        }),
      ).toBe('btn active');
    });

    it('should handle complex tailwind merge scenarios', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
      expect(cn('text-sm', 'text-lg')).toBe('text-lg');
      expect(cn('p-2', 'px-4')).toBe('p-2 px-4'); // p-2 keeps both py-2 and px-2, px-4 overrides px-2
    });
  });
});
