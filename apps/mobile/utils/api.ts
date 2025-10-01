import axios, { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

import { ACCESS_KEY, API_BASE, REFRESH_KEY } from './constants';

async function getAccess() {
  return await SecureStore.getItemAsync(ACCESS_KEY);
}

async function getRefresh() {
  return await SecureStore.getItemAsync(REFRESH_KEY);
}

export async function apiFetch(input: string, config: AxiosRequestConfig = {}) {
  const access = await getAccess();
  const headers: Record<string, string> = {
    ...(config.headers as Record<string, string>),
    'Content-Type': 'application/json',
  };
  if (access) headers['Authorization'] = `Bearer ${access}`;

  let response = await axios.request({
    url: `${API_BASE}${input}`,
    method: config.method ?? 'GET',
    ...config,
    headers,
  });

  if (response.status === 401) {
    const refresh = await getRefresh();
    if (!refresh) return response;

    const refreshResponse = await axios.post<{ accessToken: string; refreshToken?: string }>(
      `${API_BASE}/auth/refresh`,
      { token: refresh },
    );

    const data = refreshResponse.data;
    if (data.accessToken) {
      await SecureStore.setItemAsync(ACCESS_KEY, data.accessToken);
      if (data.refreshToken) await SecureStore.setItemAsync(REFRESH_KEY, data.refreshToken);
      headers['Authorization'] = `Bearer ${data.accessToken}`;

      response = await axios.request({
        url: `${API_BASE}${input}`,
        method: config.method ?? 'GET',
        ...config,
        headers,
      });
    }
  }

  return response;
}
