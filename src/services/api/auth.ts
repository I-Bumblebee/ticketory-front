import httpClient from '@/plugins/axios';
import {
  LoginUserPayload,
  RegisterUserPayload,
  UserResource,
} from '@/types/user';
import { ApiResponse } from '@/types/common';

function getCsrf(): Promise<ApiResponse> {
  return httpClient.get('/sanctum/csrf-cookie');
}

function register(
  payload: RegisterUserPayload
): Promise<ApiResponse<UserResource>> {
  return httpClient.post('/api/register', payload);
}

function login(payload: LoginUserPayload): Promise<ApiResponse<UserResource>> {
  return httpClient.post('/api/login', payload);
}

function getAuthenticatedUser(): Promise<ApiResponse<UserResource>> {
  return httpClient.get('/api/user');
}

export { getCsrf, register, login, getAuthenticatedUser };
