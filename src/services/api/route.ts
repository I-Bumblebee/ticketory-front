import { TripResource } from '@/types/trip';
import { ApiResponse, QueryOptions } from '@/types/common';
import httpClient from '@/plugins/axios';

function getRouteTrips(
  routeId: number,
  options?: QueryOptions
): Promise<ApiResponse<TripResource[]>> {
  const queryString = options?.filters
    .map((q) => `filter[${q.name}]=${q.value}`)
    .join('&');

  return httpClient.get(
    `/api/routes/${routeId}/trips?include=vehicle&${queryString}`
  );
}

export { getRouteTrips };
