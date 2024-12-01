import { RouteResource } from '@/types/route';
import { VehicleResource } from '@/types/vehicle';

export type TripResource = {
  id: number;
  route_id: number;
  route?: RouteResource;
  vehicle_id: number;
  vehicle?: VehicleResource;
  departure_time: string;
  arrival_time: string;
  trip_duration_minutes: number;
  seat_pricing: object;
};
