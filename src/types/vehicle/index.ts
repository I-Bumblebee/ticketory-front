import { VehicleSeatClassEnum, VehicleTypeEnum } from '@/types/vehicle/emuns';

export type VehicleResource = {
  id: number;
  vehicle_number: string;
  type: VehicleTypeEnum;
  total_seats: number;
  seats?: SeatResource[];
};

export type SeatResource = {
  id: number;
  seat_identifier: string;
  class: VehicleSeatClassEnum;
};
