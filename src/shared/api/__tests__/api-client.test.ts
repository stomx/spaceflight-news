import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiClient, apiClient as singletonApiClient } from '../api-client';
import { server } from '@/test/mocks/server';
import { API_URL } from '@/shared/config';

// localStorage 모킹
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('ApiClient', () => {
  let testClient: ApiClient;

  beforeEach(() => {
    testClient = new ApiClient(API_URL);
    mockLocalStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Request Interceptor', () => {
    it('localStorage에 accessToken이 있으면 Authorization 헤더를 추가해야 합니다', async () => {
      const token = 'test-token';
      mockLocalStorage.setItem('accessToken', token);

      server.use(
        http.get(`${API_URL}/test-auth`, ({ request }) => {
          return HttpResponse.json({ authHeader: request.headers.get('Authorization') });
        }),
      );

      const response = await testClient.get<{ authHeader: string }>('/test-auth');
      expect(response.authHeader).toBe(`Bearer ${token}`);
    });

    it('localStorage에 accessToken이 없으면 Authorization 헤더를 추가하지 않아야 합니다', async () => {
      server.use(
        http.get(`${API_URL}/test-no-auth`, ({ request }) => {
          return HttpResponse.json({ authHeader: request.headers.get('Authorization') });
        }),
      );

      const response = await testClient.get<{ authHeader: string }>('/test-no-auth');
      expect(response.authHeader).toBeNull();
    });

    it('request config에 headers가 없는 경우에도 Authorization 헤더를 올바르게 추가해야 합니다', async () => {
      const token = 'test-token-no-headers';
      mockLocalStorage.setItem('accessToken', token);

      // 인터셉터의 fulfilled 핸들러를 직접 테스트
      // @ts-expect-error - private 멤버 테스트를 위해 의도적으로 접근
      const interceptor = testClient.instance.interceptors.request.handlers[0].fulfilled;
      const config = { headers: undefined };

      const newConfig = await interceptor(config);

      expect(newConfig.headers).toBeDefined();
      expect(newConfig.headers.Authorization).toBe(`Bearer ${token}`);
    });

    it('SSR 환경에서는 window가 없어도 오류 없이 동작한다', async () => {
      // window 제거
      const globalWithWindow = globalThis as { window?: Window };
      const originalWindow = globalWithWindow.window;
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete globalWithWindow.window;

      // @ts-expect-error - private 멤버 테스트를 위해 의도적으로 접근
      const interceptor = testClient.instance.interceptors.request.handlers[0].fulfilled;
      const config = { headers: undefined };

      const newConfig = await interceptor(config);

      expect(newConfig.headers?.Authorization).toBeUndefined();

      globalWithWindow.window = originalWindow;
    });
  });

  describe('Response Interceptor', () => {
    it('401 응답을 받으면 localStorage의 accessToken을 제거하고 에러를 던져야 합니다', async () => {
      mockLocalStorage.setItem('accessToken', 'test-token');
      // 401 에러를 axios 에러 형태로 모킹합니다.
      server.use(
        http.get(`${API_URL}/unauthorized`, () => {
          return new HttpResponse(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }),
      );

      await expect(testClient.get('/unauthorized')).rejects.toThrow('인증이 만료되었습니다. 다시 로그인해주세요.');
      expect(mockLocalStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('HTTP Methods', () => {
    const mockData = { id: 1, title: 'Test Article' };
    const endpoint = '/articles';

    it('GET 요청을 성공적으로 처리해야 합니다', async () => {
      server.use(http.get(`${API_URL}${endpoint}`, () => HttpResponse.json([mockData])));
      const result = await testClient.get<typeof mockData[]>(endpoint);
      expect(result).toEqual([mockData]);
    });

    it('POST 요청을 성공적으로 처리해야 합니다', async () => {
      const newData = { title: 'New Article' };
      server.use(
        http.post(`${API_URL}${endpoint}`, async ({ request }) => {
          const body = (await request.json()) as typeof newData;
          return HttpResponse.json({ ...mockData, ...body });
        }),
      );
      const result = await testClient.post(endpoint, newData);
      expect(result).toEqual({ ...mockData, ...newData });
    });

    it('PUT 요청을 성공적으로 처리해야 합니다', async () => {
      const updatedData = { title: 'Updated Article' };
      const url = `${endpoint}/1`;
      server.use(
        http.put(`${API_URL}${url}`, async ({ request }) => {
          const body = (await request.json()) as typeof updatedData;
          return HttpResponse.json({ ...mockData, ...body });
        }),
      );
      const result = await testClient.put(url, updatedData);
      expect(result).toEqual({ ...mockData, ...updatedData });
    });

    it('DELETE 요청을 성공적으로 처리해야 합니다', async () => {
      const url = `${endpoint}/1`;
      server.use(http.delete(`${API_URL}${url}`, () => new HttpResponse(null, { status: 204 })));
      const result = await testClient.delete(url);
      expect(result).toBeUndefined();
    });

    it('DELETE 요청이 데이터를 반환하는 경우 해당 데이터를 반환해야 합니다', async () => {
      const url = `${endpoint}/2`;
      const mockResponseData = { message: 'Deleted with response' };
      server.use(http.delete(`${API_URL}${url}`, () => HttpResponse.json(mockResponseData)));
      const result = await testClient.delete(url);
      expect(result).toEqual(mockResponseData);
    });

    it('DELETE 요청이 빈 문자열을 반환하면 undefined를 반환해야 합니다', async () => {
      const url = `${endpoint}/3`;
      server.use(
        http.delete(`${API_URL}${url}`, () => new HttpResponse('', { status: 200 })),
      );
      const result = await testClient.delete(url);
      expect(result).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('axios 에러가 발생하면 커스텀 메시지를 포함한 에러를 던져야 합니다', async () => {
      const errorMessage = 'Not Found';
      server.use(
        http.get(`${API_URL}/not-found`, () => {
          return HttpResponse.json({ message: errorMessage }, { status: 404 });
        }),
      );
      await expect(testClient.get('/not-found')).rejects.toThrow(errorMessage);
    });

    it('네트워크 에러가 발생하면 "알 수 없는 네트워크 오류" 메시지를 던져야 합니다', async () => {
      server.use(http.get(`${API_URL}/network-error`, () => HttpResponse.error()));
      await expect(testClient.get('/network-error')).rejects.toThrow('알 수 없는 네트워크 오류가 발생했습니다.');
    });

    it('POST 요청 실패 시 에러를 던져야 합니다', async () => {
      const endpoint = '/articles';
      const errorMessage = 'Internal Server Error';
      server.use(
        http.post(
          `${API_URL}${endpoint}`,
          () => new HttpResponse(JSON.stringify({ message: errorMessage }), { status: 500 }),
        ),
      );
      await expect(testClient.post(endpoint, {})).rejects.toThrow(errorMessage);
    });

    it('PUT 요청 실패 시 에러를 던져야 합니다', async () => {
      const endpoint = '/articles/1';
      const errorMessage = 'Update Failed';
      server.use(
        http.put(
          `${API_URL}${endpoint}`,
          () => new HttpResponse(JSON.stringify({ message: errorMessage }), { status: 400 }),
        ),
      );
      await expect(testClient.put(endpoint, {})).rejects.toThrow(errorMessage);
    });

    it('DELETE 요청 실패 시 에러를 던져야 합니다', async () => {
      const endpoint = '/articles/1';
      const errorMessage = 'Deletion Failed';
      server.use(
        http.delete(
          `${API_URL}${endpoint}`,
          () => new HttpResponse(JSON.stringify({ message: errorMessage }), { status: 503 }),
        ),
      );
      await expect(testClient.delete(endpoint)).rejects.toThrow(errorMessage);
    });

    it('axios 에러에 메시지가 없는 경우 상태 코드를 포함한 에러를 던져야 합니다', async () => {
      server.use(http.get(`${API_URL}/no-message`, () => new HttpResponse(null, { status: 500 })));
      await expect(testClient.get('/no-message')).rejects.toThrow('Request failed with status code 500');
    });

    it('일반 Error 객체를 그대로 다시 던져야 합니다', async () => {
      const customError = new Error('Custom Error');
      // @ts-expect-error - private 멤버 테스트를 위해 의도적으로 접근
      vi.spyOn(testClient.instance, 'get').mockRejectedValue(customError);
      await expect(testClient.get('/custom-error')).rejects.toThrow('Custom Error');
    });

    it('알 수 없는 타입의 에러가 발생하면 "알 수 없는 오류" 메시지를 던져야 합니다', async () => {
      const unknownError = { an: 'object' };
      // @ts-expect-error - private 멤버 테스트를 위해 의도적으로 접근
      vi.spyOn(testClient.instance, 'get').mockRejectedValue(unknownError);
      await expect(testClient.get('/unknown-error')).rejects.toThrow('알 수 없는 오류가 발생했습니다.');
    });
  });

  describe('Singleton Instance', () => {
    it('export된 apiClient 인스턴스는 ApiClient의 인스턴스여야 합니다', () => {
      expect(singletonApiClient).toBeInstanceOf(ApiClient);
    });
  });
});
