import { describe, expect, it } from 'vitest';
import { cleanSearchParams, cn } from '../utils';

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional');
  });

  it('should handle objects with boolean values', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });

  it('should handle arrays', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('', null, undefined)).toBe('');
  });

  it('should handle complex scenarios', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('base-class', isActive && 'active', isDisabled && 'disabled', { 'extra-class': true })).toBe(
      'base-class active extra-class',
    );
  });
});

describe('cleanSearchParams', () => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 3;

  it('should remove page when it equals default page', () => {
    const search = { search: 'test' };
    const result = cleanSearchParams(search, DEFAULT_PAGE, 10);

    expect(result).toEqual({
      search: 'test',
      page: undefined,
      limit: 10,
    });
  });

  it('should remove limit when it equals default limit', () => {
    const search = { search: 'test' };
    const result = cleanSearchParams(search, 2, DEFAULT_LIMIT);

    expect(result).toEqual({
      search: 'test',
      page: 2,
      limit: undefined,
    });
  });

  it('should remove both page and limit when they equal defaults', () => {
    const search = { search: 'test' };
    const result = cleanSearchParams(search, DEFAULT_PAGE, DEFAULT_LIMIT);

    expect(result).toEqual({
      search: 'test',
      page: undefined,
      limit: undefined,
    });
  });

  it('should keep page and limit when they differ from defaults', () => {
    const search = { search: 'test' };
    const result = cleanSearchParams(search, 2, 10);

    expect(result).toEqual({
      search: 'test',
      page: 2,
      limit: 10,
    });
  });

  it('should handle empty search params', () => {
    const result = cleanSearchParams({}, DEFAULT_PAGE, DEFAULT_LIMIT);

    expect(result).toEqual({
      page: undefined,
      limit: undefined,
    });
  });

  it('should preserve other search parameters', () => {
    const search = {
      search: 'space',
      category: 'science',
      sort: 'date',
    };
    const result = cleanSearchParams(search, 2, 5);

    expect(result).toEqual({
      search: 'space',
      category: 'science',
      sort: 'date',
      page: 2,
      limit: 5,
    });
  });

  it('should handle overriding existing page and limit in search', () => {
    const search = {
      page: 99,
      limit: 99,
      search: 'test',
    };
    const result = cleanSearchParams(search, DEFAULT_PAGE, DEFAULT_LIMIT);

    expect(result).toEqual({
      search: 'test',
      page: undefined,
      limit: undefined,
    });
  });
});
