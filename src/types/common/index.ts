import { AxiosError, AxiosResponse } from 'axios';

export type ApiResponse<T = undefined> = AxiosResponse<{ data: T }>;
export type ApiPaginatedResponse<T = undefined> = AxiosResponse<{
  data: T;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
    path: string;
  };
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
}>;

export type ApiError = AxiosError<{
  message?: string;
  errors?: Record<string, string[]>;
}>;

export type Option = {
  name?: string;
  value?: string | number;
};
