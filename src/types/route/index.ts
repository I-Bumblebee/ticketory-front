import { LocationResource } from '@/types/location';

export type RouteResource = {
  id: number;
  start_location_id: number;
  start_location?: LocationResource;
  end_location_id: number;
  end_location?: LocationResource;
};
