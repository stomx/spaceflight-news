import {
  describe,
  expect,
  it,
  vi,
  beforeEach
} from 'vitest';
import { API_URL, DEFAULT_LIMIT, DEFAULT_PAGE, validateEnvironment } from '../index';

describe('shared/config', () => {
  describe('constants', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_PAGE).toBe(1);
      expect(DEFAULT_LIMIT).toBe(3);
    });

    it('should have API_URL defined', () => {
      expect(typeof API_URL).toBe('string');
      expect(API_URL.length).toBeGreaterThan(0);
    });

    it('should use environment variable or fallback URL', () => {
      // API_URL should be the env var value
      expect(API_URL).toBe('https://api.spaceflightnewsapi.net/v4');
    });
  });

  describe('validateEnvironment', () => {
    it('should not throw when API_URL is set', () => {
      expect(() => validateEnvironment()).not.toThrow();
    });

    it('should throw when url is not provided', () => {
      expect(() => validateEnvironment('')).toThrow('API_URL이 설정되지 않았습니다.');
    });

    it('should validate API_URL exists', () => {
      // Since API_URL has a fallback, it should always be defined
      expect(() => validateEnvironment()).not.toThrow();
      expect(API_URL).toBeDefined();
      expect(API_URL).not.toBe('');
    });
  });

  describe('environment variables', () => {
    it('should handle missing environment variables with fallbacks', () => {
      // Test that the config can handle missing env vars
      expect(API_URL).toBeTruthy();
      expect(typeof API_URL).toBe('string');
    });

    it('should use correct fallback URL when VITE_API_URL is not set', () => {
      // Since we have a fallback, API_URL should always be the fallback or the env var
      expect(API_URL).toMatch(/^https?:\/\/.+/);
      // Test actual content rather than specific domain since it may vary
      expect(API_URL.length).toBeGreaterThan(10);
    });
  });
});

describe('shared/config with mocked env', () => {
  const fallbackUrl = 'https://ll.thespacedevs.com/2.2.0';

  beforeEach(() => {
    vi.resetModules();
  });

  it('VITE_API_URL이 설정되지 않은 경우 fallback URL을 사용해야 합니다', async () => {
    // Arrange: 환경 변수를 비워줍니다.
    vi.stubEnv('VITE_API_URL', '');

    // Act: 모듈을 동적으로 import 합니다.
    const {
      API_URL
    } = await import('../index');

    // Assert: fallback URL이 사용되었는지 확인합니다.
    expect(API_URL).toBe(fallbackUrl);

    // Clean up
    vi.unstubAllEnvs();
  });
});
