import { API_URL } from '@/shared/config';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

/**
 * axios 기반의 공통 API 클라이언트 클래스입니다.
 * 모든 API 요청에 대해 일관된 에러 처리와 응답 파싱을 제공합니다.
 */
export class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    /**
     * 요청 인터셉터: accessToken이 있으면 Authorization 헤더에 자동 추가
     * 추후 인증 방식이 변경될 경우, 아래 부분만 수정하면 됩니다.
     */
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    /**
     * 응답 인터셉터: 401(인증 만료) 등 공통 에러 처리
     * 필요 시 로그아웃, 리다이렉트 등 추가 구현 가능
     */
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // TODO: 로그아웃 처리, 알림 등 추가 가능
          return Promise.reject(new Error('인증이 만료되었습니다. 다시 로그인해주세요.'));
        }
        return Promise.reject(error);
      },
    );
  }

  /**
   * GET 요청
   */
  public async get<T = unknown>(
    url: string,
    params?: Record<string, string | number>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.get(url, {
        params,
        ...config,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * POST 요청
   */
  public async post<T = unknown, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.post(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * PUT 요청
   */
  public async put<T = unknown, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.put(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * DELETE 요청
   */
  public async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.delete(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 에러 핸들링 공통 함수
   */
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('알 수 없는 네트워크 오류가 발생했습니다.');
  }
}

export const apiClient = new ApiClient(API_URL);
