import httpClient from '@/plugins/axios';
import { TicketResource } from '@/types/ticket';
import { ApiResponse } from '@/types/common';
import { UserResource } from '@/types/user';

function getUserTickets(
  userId: number
): Promise<ApiResponse<TicketResource[]>> {
  return httpClient.get(`/api/users/${userId}/tickets`);
}

function getTickets(): Promise<
  ApiResponse<{ user: UserResource; tickets: TicketResource[] }[]>
> {
  return httpClient.get('/api/tickets');
}

export { getUserTickets, getTickets };
