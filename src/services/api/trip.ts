import httpClient from '@/plugins/axios';
import { ApiResponse } from '@/types/common';
import { TripResource } from '@/types/trip';
import { VehicleSeatClassEnum } from '@/types/vehicle/emuns';

function getTrip(tripId: number): Promise<ApiResponse<TripResource>> {
  return httpClient.get(`/api/trips/${tripId}`);
}

function buyTickets(
  tripId: number,
  payload: {
    seat_class: VehicleSeatClassEnum;
    ticket_count: number;
  }
): Promise<ApiResponse> {
  return httpClient.post(`/api/trips/${tripId}/tickets/`, payload);
}

export { getTrip, buyTickets };
