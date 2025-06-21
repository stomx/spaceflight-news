import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../api-client';
import { getPaginatedList } from '../getPaginatedList';

// api-client 모킹
vi.mock('../api-client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('getPaginatedList', () => {
  const mockedApiClient = vi.mocked(apiClient);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('올바른 파라미터로 API를 호출해야 한다', async () => {
    const mockResponse = {
      count: 100,
      results: [{ id: 1, title: '테스트' }],
    };

    mockedApiClient.get.mockResolvedValue(mockResponse);

    const result = await getPaginatedList('articles', {
      limit: 10,
      offset: 0,
    });

    expect(mockedApiClient.get).toHaveBeenCalledWith('/articles/', {
      limit: 10,
      offset: 0,
    });
    expect(result).toEqual(mockResponse);
  });

  it('API 에러를 올바르게 전파해야 한다', async () => {
    const mockError = new Error('API 에러');
    mockedApiClient.get.mockRejectedValue(mockError);

    await expect(
      getPaginatedList('articles', {
        limit: 10,
        offset: 0,
      }),
    ).rejects.toThrow('API 에러');
  });
});
