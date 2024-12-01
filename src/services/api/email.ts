import httpClient from '@/plugins/axios';
import { ApiResponse } from '@/types/common';

const verifyEmail = async (
  user: string,
  hash: string,
  expires: string,
  signature: string
): Promise<ApiResponse> => {
  return httpClient.get(
    `/api/verify/${user}/${hash}?expires=${expires}&signature=${signature}`
  );
};

export { verifyEmail };
