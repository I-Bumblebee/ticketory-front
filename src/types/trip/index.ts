import { RouteResource } from '@/types/route';
import { VehicleResource } from '@/types/vehicle';
import { VehicleSeatClassEnum } from '@/types/vehicle/emuns';

export type TripResource = {
  id: number;
  route_id: number;
  route?: RouteResource;
  vehicle_id: number;
  vehicle?: VehicleResource;
  departure_time: string;
  arrival_time: string;
  trip_duration_minutes: number;
  seat_pricing: SeatPricing;
};

export type SeatPricing = {
  [key in VehicleSeatClassEnum]?: number | null;
};

export type TripTicketsAvailability = {
  [key in VehicleSeatClassEnum]?: number;
};
