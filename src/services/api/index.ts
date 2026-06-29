import {ENV} from '@shared/config/env';
import {storage} from '@shared/lib/storage';
import {STORAGE_KEYS} from '@shared/lib/storageKeys';
import type {AuthTokens} from '@services/auth/types';

export type {AuthTokens} from '@services/auth/types';

export interface ApiClientConfig {
  baseURL: string;
  defaultHeaders?: Record<string, string>;
  defaultTimeout?: number;
  enableLogging?: boolean;
  getTokens?: () => Promise<AuthTokens | null> | AuthTokens | null;
  onTokensUpdate?: (tokens: AuthTokens) => void | Promise<void>;
}

export interface FetchOptions extends Omit<RequestInit, 'body'> {
  params?: Record<
    string,
    string | number | boolean | string[] | number[] | undefined | null
  >;
  body?: unknown;
  timeout?: number;
  authTokens?: AuthTokens | null;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class ApiClient {
  private config: Required<Omit<ApiClientConfig, 'onTokensUpdate'>> & {
    onTokensUpdate?: (tokens: AuthTokens) => void | Promise<void>;
  };

  constructor(config: ApiClientConfig) {
    this.config = {
      baseURL: config.baseURL,
      defaultHeaders: {Accept: 'application/json', ...config.defaultHeaders},
      defaultTimeout: config.defaultTimeout ?? 100_000,
      enableLogging: config.enableLogging ?? __DEV__,
      getTokens: config.getTokens ?? (() => null),
      onTokensUpdate: config.onTokensUpdate,
    };
  }

  private extractTokensFromResponse(
    response: Response,
    current?: AuthTokens | null,
  ): AuthTokens | null {
    const access =
      response.headers.get('token') ??
      response.headers.get('Token') ??
      current?.access ??
      null;
    const refresh =
      response.headers.get('refresh_token') ??
      response.headers.get('Refresh_token') ??
      current?.refresh ??
      null;

    if (access && refresh) {
      return {access, refresh};
    }
    return null;
  }

  private async injectAuthHeaders(
    headers: Headers,
    authTokens?: AuthTokens | null,
  ): Promise<void> {
    const tokens = authTokens ?? (await this.config.getTokens()) ?? null;
    if (!tokens?.access || !tokens.refresh) return;

    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${tokens.access}`);
    }
    if (!headers.has('RefreshToken')) {
      headers.set('RefreshToken', tokens.refresh);
    }
  }

  private async updateTokensFromResponse(response: Response): Promise<void> {
    const current = (await this.config.getTokens()) ?? null;
    const tokens = this.extractTokensFromResponse(response, current);
    if (tokens && this.config.onTokensUpdate) {
      const hasChanged =
        !current ||
        current.access !== tokens.access ||
        current.refresh !== tokens.refresh;
      if (hasChanged) {
        await this.config.onTokensUpdate(tokens);
      }
    }
  }

  private async parseResponseBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  private buildUrl(endpoint: string, params?: FetchOptions['params']): string {
    const base = this.config.baseURL.replace(/\/$/, '');
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const [pathname, search = ''] = path.split('?');
    const searchParams = new URLSearchParams(search);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      });
    }

    const query = searchParams.toString();
    return `${base}${pathname}${query ? `?${query}` : ''}`;
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<{data: T}> {
    const {
      timeout = this.config.defaultTimeout,
      params,
      authTokens,
      ...restOptions
    } = options;
    const fullUrl = this.buildUrl(endpoint, params);
    const start = this.config.enableLogging ? Date.now() : 0;

    const isFormData = options.body instanceof FormData;
    const headers = new Headers({
      ...this.config.defaultHeaders,
      ...restOptions.headers,
    });

    if (!isFormData && restOptions.body) {
      headers.set('Content-Type', 'application/json');
    }

    await this.injectAuthHeaders(headers, authTokens);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchConfig: RequestInit = {
      ...restOptions,
      headers,
      signal: controller.signal,
      body: isFormData
        ? (options.body as BodyInit_)
        : options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined,
    };

    try {
      const response = await fetch(fullUrl, fetchConfig);
      await this.updateTokensFromResponse(response);

      if (this.config.enableLogging) {
        console.log(`[api] ${endpoint} ${Date.now() - start}ms`);
      }

      const data: unknown = await this.parseResponseBody(response);

      if (!response.ok) {
        const message =
          (data as {message?: string})?.message ??
          `HTTP ${response.status}: ${response.statusText}`;
        throw new ApiError(message, response.status, data);
      }

      return {data: data as T};
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timed out', 408);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, {...options, method: 'GET'});
  }

  async post<T>(endpoint: string, body?: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, {...options, method: 'POST', body});
  }

  async put<T>(endpoint: string, body?: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, {...options, method: 'PUT', body});
  }

  async patch<T>(endpoint: string, body?: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, {...options, method: 'PATCH', body});
  }

  async delete<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, {...options, method: 'DELETE'});
  }

  async postWithTokens<T>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions,
  ): Promise<{data: T; tokens: AuthTokens | null}> {
    const {timeout = this.config.defaultTimeout, params, ...restOptions} =
      options ?? {};
    const fullUrl = this.buildUrl(endpoint, params);
    const start = this.config.enableLogging ? Date.now() : 0;

    const headers = new Headers({
      ...this.config.defaultHeaders,
      ...restOptions.headers,
    });
    headers.set('Content-Type', 'application/json');

    await this.injectAuthHeaders(headers);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchConfig: RequestInit = {
      ...restOptions,
      method: 'POST',
      headers,
      signal: controller.signal,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(fullUrl, fetchConfig);

      if (this.config.enableLogging) {
        console.log(`[api] ${endpoint} ${Date.now() - start}ms`);
      }

      let data: unknown;
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }

      if (!response.ok) {
        const message =
          (data as {message?: string})?.message ??
          `HTTP ${response.status}: ${response.statusText}`;
        throw new ApiError(message, response.status, data);
      }

      const tokens = this.extractTokensFromResponse(response);
      if (tokens && this.config.onTokensUpdate) {
        await this.config.onTokensUpdate(tokens);
      }

      return {data: data as T, tokens};
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timed out', 408);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const api = new ApiClient({
  baseURL: ENV.API_URL,
  defaultTimeout: 100_000,
  enableLogging: __DEV__,
  getTokens: () => storage.getItem<AuthTokens>(STORAGE_KEYS.TOKENS),
  onTokensUpdate: (tokens) => storage.setItem(STORAGE_KEYS.TOKENS, tokens),
});
