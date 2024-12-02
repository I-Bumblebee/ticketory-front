import { ApiResponse } from '@/types/common';
import { LocationResource } from '@/types/location';
import httpClient from '@/plugins/axios';
import { RouteResource } from '@/types/route';

function getLocations(): Promise<ApiResponse<LocationResource[]>> {
  return httpClient.get('/api/locations');
}

function getLocationRoutes(
  locationId: number
): Promise<ApiResponse<RouteResource[]>> {
  return httpClient.get(`/api/locations/${locationId}/routes`);
}

export { getLocations, getLocationRoutes };
